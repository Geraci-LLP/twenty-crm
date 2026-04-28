// TS types for Dashboard + PageLayoutWidget

// Backend `WidgetType` enum — only the values our scaffolded dashboard app
// actually uses. Twenty's full enum is much larger (VIEW / IFRAME / TIMELINE
// / etc.) but we only render charts and rich text for the MVP.
export type BackendWidgetType = 'GRAPH' | 'STANDALONE_RICH_TEXT';

// Internal palette identifier — picks which subtype of GRAPH (bar/line/pie/
// gauge/metric/aggregate) or STANDALONE_RICH_TEXT to render. Stored alongside
// the backend type in `widget.configuration.chartType` so the widget renderer
// knows which Nivo chart to mount.
export type PaletteKey =
  | 'BAR_CHART'
  | 'LINE_CHART'
  | 'PIE_CHART'
  | 'METRIC'
  | 'AGGREGATE_CHART'
  | 'RICH_TEXT'
  | 'GAUGE_CHART';

// Map a palette key to the backend WidgetType the API expects.
export const PALETTE_TO_BACKEND_TYPE: Record<PaletteKey, BackendWidgetType> = {
  BAR_CHART: 'GRAPH',
  LINE_CHART: 'GRAPH',
  PIE_CHART: 'GRAPH',
  METRIC: 'GRAPH',
  AGGREGATE_CHART: 'GRAPH',
  GAUGE_CHART: 'GRAPH',
  RICH_TEXT: 'STANDALONE_RICH_TEXT',
};

// The configuration JSON is a tagged union on the backend — every shape has a
// `configurationType` field that discriminates which fields are valid. Map
// our palette key to the matching enum value the API expects.
//
// Twenty has no first-class METRIC configuration; we reuse AGGREGATE_CHART
// (which is a single-value aggregate) so a "Metric" palette item still saves.
export const PALETTE_TO_CONFIG_TYPE: Record<PaletteKey, string> = {
  BAR_CHART: 'BAR_CHART',
  LINE_CHART: 'LINE_CHART',
  PIE_CHART: 'PIE_CHART',
  METRIC: 'AGGREGATE_CHART',
  AGGREGATE_CHART: 'AGGREGATE_CHART',
  GAUGE_CHART: 'GAUGE_CHART',
  RICH_TEXT: 'STANDALONE_RICH_TEXT',
};

// Old alias used throughout the app — keep it pointing at PaletteKey so we
// don't have to rename props everywhere. Source of truth for "what kind of
// widget is this" remains the palette key; the backend type is derived.
export type WidgetType = PaletteKey;

export type GridPosition = {
  column: number;
  columnSpan: number;
  row: number;
  rowSpan: number;
};

export type PageLayoutWidget = {
  id: string;
  title: string;
  type: WidgetType;
  objectMetadataId?: string | null;
  pageLayoutTabId: string;
  gridPosition: GridPosition;
  configuration: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Dashboard = {
  id: string;
  title: string | null;
  pageLayoutId: string | null;
  createdAt?: string;
  updatedAt?: string;
  pageLayoutWidgets?: PageLayoutWidget[];
};

export type AggregateGroupByRow = {
  groupByDimensions: (string | number | null)[];
  aggregateValues: (number | null)[];
};
