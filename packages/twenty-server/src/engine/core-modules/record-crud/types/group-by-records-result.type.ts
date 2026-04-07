export type GroupByRecordsResult = {
  groups: Array<{ dimensions: string[]; value: string }>;
  dimensionLabels: string[];
  aggregation: string;
  groupCount: number;
};
