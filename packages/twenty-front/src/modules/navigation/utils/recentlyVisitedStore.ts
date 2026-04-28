// Browser-history-style "last visited" tracker for record show pages.
// Backed by localStorage so it persists across sessions and is shared
// between tabs of the same workspace. Capped at 20 entries to keep
// reads cheap and avoid stale entries piling up forever.

const STORAGE_KEY = 'twenty.lastVisited';
const MAX_ENTRIES = 20;
// Visits older than this never appear in the list. Anything stale by
// 30 days is dropped on the next read, so the sidebar's "Last visited"
// section never shows a record the user genuinely forgot about.
const MAX_VISIT_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export type Visit = {
  objectNameSingular: string;
  id: string;
  name: string | null;
  visitedAt: number;
  // Optional cumulative visit count. Older entries written before this
  // field was introduced may omit it; readers should default to 1.
  visitCount?: number;
};

export const readVisits = (): Visit[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null || raw === '') return [];
    const parsed = JSON.parse(raw) as Visit[];
    if (!Array.isArray(parsed)) return [];
    // Auto-prune entries older than the cutoff. The pruned array isn't
    // written back unless something actually changed — avoids writing
    // on every read.
    const cutoff = Date.now() - MAX_VISIT_AGE_MS;
    const pruned = parsed.filter((v) => v.visitedAt >= cutoff);
    if (pruned.length !== parsed.length) {
      writeVisits(pruned);
    }
    return pruned;
  } catch {
    return [];
  }
};

export const writeVisits = (visits: Visit[]): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch {
    // ignore quota / disabled storage
  }
};

export const logVisit = (
  visit: Omit<Visit, 'visitedAt' | 'visitCount'>,
): void => {
  const existing = readVisits();
  // Carry over the previous visit's count so re-visits accumulate.
  const prior = existing.find(
    (v) =>
      v.objectNameSingular === visit.objectNameSingular && v.id === visit.id,
  );
  // Drop any prior entry for the same record so the new one moves to
  // the front; uniqueness key is (objectNameSingular, id).
  const filtered = existing.filter(
    (v) =>
      !(v.objectNameSingular === visit.objectNameSingular && v.id === visit.id),
  );
  const visitCount = (prior?.visitCount ?? 0) + 1;
  const next: Visit[] = [
    { ...visit, visitedAt: Date.now(), visitCount },
    ...filtered,
  ].slice(0, MAX_ENTRIES);
  writeVisits(next);
};

export const clearVisits = (): void => {
  writeVisits([]);
};
