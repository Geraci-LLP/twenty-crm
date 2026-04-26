// TS types for Dashboard + PageLayoutWidget

export type WidgetType =
  | 'BAR_CHART'
  | 'LINE_CHART'
  | 'PIE_CHART'
  | 'METRIC'
  | 'AGGREGATE_CHART'
  | 'RICH_TEXT'
  | 'GAUGE_CHART';

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
