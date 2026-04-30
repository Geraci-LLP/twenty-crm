// TS types for Dashboard + PageLayoutWidget

// Subset of the backend `WidgetType` enum that our writes use — when we
// CREATE a widget from this dashboard's palette, we always pick GRAPH (for
// any chart subtype) or STANDALONE_RICH_TEXT. Reads can return any value.
export type WriteableBackendWidgetType = 'GRAPH' | 'STANDALONE_RICH_TEXT';

// Full Twenty WidgetType enum, kept here so `widget.type` round-trips
// safely even for widgets created via the CRM page-builder (IFRAME,
// CALENDAR, EMAILS, etc.) — the dashboard renders a subset and treats the
// rest as "unsupported" rather than crashing.
export type BackendWidgetType =
  | 'GRAPH'
  | 'STANDALONE_RICH_TEXT'
  | 'IFRAME'
  | 'VIEW'
  | 'CALENDAR'
  | 'EMAILS'
  | 'EMAIL_THREAD'
  | 'CAMPAIGN_EDITOR'
  | 'FIELD'
  | 'FIELD_RICH_TEXT'
  | 'FIELDS'
  | 'FILES'
  | 'FORM_BUILDER'
  | 'LANDING_PAGE_BUILDER'
  | 'NOTES'
  | 'RECORD_TABLE'
  | 'TASKS'
  | 'TIMELINE'
  | 'WORKFLOW'
  | 'WORKFLOW_RUN'
  | 'WORKFLOW_VERSION'
  | 'FRONT_COMPONENT';

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

// Map a palette key to the backend WidgetType the API accepts when creating
// a new widget. Only GRAPH and STANDALONE_RICH_TEXT are valid here — those
// are the two that our palette can construct.
export const PALETTE_TO_BACKEND_TYPE: Record<
  PaletteKey,
  WriteableBackendWidgetType
> = {
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

// `widget.type` can be either a backend WidgetType (when loaded from the
// API) OR a palette key (when freshly dragged onto the canvas, before save).
// The renderer/save logic both have to handle both cases — this union lets
// TypeScript catch missed branches.
export type WidgetType = PaletteKey | BackendWidgetType;

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
