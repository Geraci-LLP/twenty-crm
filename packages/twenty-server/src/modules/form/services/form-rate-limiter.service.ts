import { Injectable, Logger } from '@nestjs/common';

// In-memory per-(formId,IP) submission counter with a rolling 60s
// window. No Redis dependency — appropriate for single-instance
// Railway deploys. Multi-instance deploys would want Redis or
// Cloudflare WAF instead, but we already note that in the manual.
//
// The window is implemented as a queue of submission timestamps per
// key. On each check we drop entries older than 60s, count the rest,
// and decide. A periodic sweeper trims keys that haven't been hit in
// >5 minutes so the map doesn't grow unboundedly.

const WINDOW_MS = 60_000;
const STALE_KEY_MS = 5 * 60_000;
const SWEEP_INTERVAL_MS = 60_000;

@Injectable()
export class FormRateLimiterService {
  private readonly logger = new Logger(FormRateLimiterService.name);
  private readonly buckets = new Map<string, number[]>();
  private sweeper: NodeJS.Timeout | null = null;

  constructor() {
    // Periodic GC. Runs forever; if the test runtime cares, the
    // sweeper holds a `unref()` so it doesn't block shutdown.
    this.sweeper = setInterval(() => this.sweep(), SWEEP_INTERVAL_MS);
    if (typeof this.sweeper.unref === 'function') this.sweeper.unref();
  }

  // Returns true if the request is allowed; false if the limit is
  // already met. Records the current timestamp on allow (i.e. the
  // call counts toward the limit). limit <= 0 disables.
  check(formId: string, ip: string, limit: number): boolean {
    if (typeof limit !== 'number' || limit <= 0) return true;
    const key = `${formId}|${ip}`;
    const now = Date.now();
    const cutoff = now - WINDOW_MS;
    const queue = this.buckets.get(key) ?? [];
    // Drop expired entries
    let i = 0;
    while (i < queue.length && queue[i] < cutoff) i++;
    const fresh = i === 0 ? queue : queue.slice(i);
    if (fresh.length >= limit) {
      this.buckets.set(key, fresh);
      return false;
    }
    fresh.push(now);
    this.buckets.set(key, fresh);
    return true;
  }

  private sweep(): void {
    const cutoff = Date.now() - STALE_KEY_MS;
    let removed = 0;
    for (const [key, queue] of this.buckets.entries()) {
      if (queue.length === 0 || queue[queue.length - 1] < cutoff) {
        this.buckets.delete(key);
        removed++;
      }
    }
    if (removed > 0) {
      this.logger.debug(`FormRateLimiter swept ${removed} stale keys.`);
    }
  }
}
