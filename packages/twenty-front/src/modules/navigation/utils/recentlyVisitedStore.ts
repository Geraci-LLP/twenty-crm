// Browser-history-style "last visited" tracker for record show pages.
// Backed by localStorage so it persists across sessions and is shared
// between tabs of the same workspace. Capped at 20 entries to keep
// reads cheap and avoid stale entries piling up forever.

const STORAGE_KEY = 'twenty.lastVisited';
const MAX_ENTRIES = 20;

export type Visit = {
  objectNameSingular: string;
  id: string;
  name: string | null;
  visitedAt: number;
};

export const readVisits = (): Visit[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null || raw === '') return [];
    const parsed = JSON.parse(raw) as Visit[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
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

export const logVisit = (visit: Omit<Visit, 'visitedAt'>): void => {
  const existing = readVisits();
  // Drop any prior entry for the same record so the new one moves to
  // the front; uniqueness key is (objectNameSingular, id).
  const filtered = existing.filter(
    (v) =>
      !(v.objectNameSingular === visit.objectNameSingular && v.id === visit.id),
  );
  const next: Visit[] = [
    { ...visit, visitedAt: Date.now() },
    ...filtered,
  ].slice(0, MAX_ENTRIES);
  writeVisits(next);
};
