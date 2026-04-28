import { Injectable, Logger } from '@nestjs/common';

// Verifies Cloudflare Turnstile tokens server-side. Secret key lives in
// the CLOUDFLARE_TURNSTILE_SECRET_KEY env var; site keys are stored
// per-form on FormWorkspaceEntity.botProtectionSiteKey. The token comes
// from the form-host page's Turnstile widget — the user solves the
// challenge there, the widget surfaces a token, and the form posts it
// to the CRM in body.captchaToken on submit.
//
// Cloudflare's verify endpoint:
//   POST https://challenges.cloudflare.com/turnstile/v0/siteverify
//   body: { secret, response, remoteip? }
//   response: { success: boolean, "error-codes": string[], action?: string }
//
// We treat any non-success response as a hard rejection. Network
// failures fall through to a permissive verdict only in DEVELOPMENT
// mode (so a misconfigured local dev doesn't block work); production
// returns the failure verbatim to the caller.

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export type TurnstileVerifyResult = {
  success: boolean;
  errorCodes?: string[];
  hostname?: string;
};

@Injectable()
export class TurnstileValidatorService {
  private readonly logger = new Logger(TurnstileValidatorService.name);

  // Returns true if the token is valid, false if not (or if the secret
  // is missing — bot protection should fail closed when the server
  // operator hasn't configured the secret key).
  async verify(
    token: string | undefined | null,
    remoteIp?: string,
  ): Promise<TurnstileVerifyResult> {
    if (typeof token !== 'string' || token.trim() === '') {
      return { success: false, errorCodes: ['missing-input-response'] };
    }

    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (typeof secret !== 'string' || secret.trim() === '') {
      this.logger.warn(
        'Turnstile verify requested but CLOUDFLARE_TURNSTILE_SECRET_KEY is not set — failing closed.',
      );
      return { success: false, errorCodes: ['missing-input-secret'] };
    }

    const body = new URLSearchParams();
    body.append('secret', secret);
    body.append('response', token);
    if (remoteIp !== undefined && remoteIp !== '') {
      body.append('remoteip', remoteIp);
    }

    try {
      const res = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) {
        this.logger.warn(
          `Turnstile verify HTTP ${res.status} — treating as failure.`,
        );
        return { success: false, errorCodes: ['http-' + res.status] };
      }
      const json = (await res.json()) as {
        success: boolean;
        'error-codes'?: string[];
        hostname?: string;
      };
      return {
        success: json.success === true,
        errorCodes: json['error-codes'],
        hostname: json.hostname,
      };
    } catch (e) {
      this.logger.error(
        `Turnstile verify network error: ${(e as Error).message}`,
      );
      return { success: false, errorCodes: ['network-error'] };
    }
  }
}
