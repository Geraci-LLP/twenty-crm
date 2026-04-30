// Defensive guards used by every chart widget before handing data to Nivo.
//
// Why: in production we hit Chrome's "Aw, Snap! STATUS_BREAKPOINT" — that's
// a renderer-process crash, often triggered by V8 stack overflow / OOM
// when one Nivo SVG layout pass blows up on degenerate input. React error
// boundaries CANNOT catch this; the only mitigation is to never give Nivo
// data that could trigger it.

// Hard cap on how many slices/bars/points a single chart will render.
// 100 is plenty for any human-readable visualization (the eye can't
// distinguish more) and well below the threshold where Nivo's layout
// math starts to thrash.
export const MAX_DATA_POINTS = 100;

export type DataCapResult<T> = {
  data: T[];
  truncated: boolean;
  originalLength: number;
};

// Trims an array to MAX_DATA_POINTS and reports whether it had to.
export const capDataPoints = <T>(items: T[] | null | undefined): DataCapResult<T> => {
  const arr = items ?? [];
  if (arr.length <= MAX_DATA_POINTS) {
    return { data: arr, truncated: false, originalLength: arr.length };
  }
  return {
    data: arr.slice(0, MAX_DATA_POINTS),
    truncated: true,
    originalLength: arr.length,
  };
};

// Filters out items whose numeric value is NaN / Infinity / -Infinity.
// Nivo will throw or render nonsense if it gets these.
export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

// De-duplicates items by their `id` field. Nivo Pie/Line require unique ids
// across the dataset; a duplicate can cause its key-tracking to thrash.
export const dedupeById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
};
