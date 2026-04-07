import {
  type AggregateOperations,
  type ObjectRecordGroupByDateGranularity,
} from 'twenty-shared/types';

import { type RecordCrudExecutionContext } from './record-crud-execution-context.type';

export type GroupByRecordsParams = RecordCrudExecutionContext & {
  objectName: string;
  groupBy: string[];
  dateGranularity?: ObjectRecordGroupByDateGranularity;
  timeZone?: string;
  aggregateOperation?: keyof typeof AggregateOperations;
  aggregateFieldName?: string;
  limit?: number;
  orderBy?: 'ASC' | 'DESC';
  filter?: Record<string, unknown>;
};
