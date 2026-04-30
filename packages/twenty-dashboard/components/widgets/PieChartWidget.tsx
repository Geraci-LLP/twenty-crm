'use client';

import { useQuery } from '@apollo/client/react';
import { ResponsivePie } from '@nivo/pie';
import { useMemo } from 'react';
import { ChartPlaceholder } from './ChartPlaceholder';
import {
  capDataPoints,
  dedupeById,
  isFiniteNumber,
} from '../../lib/chart-safety';
import { PIE_CHART_DATA } from '../../lib/queries';

export type PieChartWidgetProps = {
  configuration: Record<string, unknown>;
  objectMetadataId?: string | null;
  // Optional pre-fetched data — kept for backward compatibility with the
  // Phase A "in-memory new widget" path that hasn't been saved yet (no
  // objectMetadataId in the DB to query).
  data?: { id: string; label?: string; value: number }[];
};

type PieChartDataResponse = {
  pieChartData: {
    data: { id: string; value: number }[];
    showLegend: boolean;
    showDataLabels: boolean;
    showCenterMetric: boolean;
    hasTooManyGroups: boolean;
  } | null;
};

export const PieChartWidget = ({
  configuration,
  objectMetadataId,
  data: prefetchedData,
}: PieChartWidgetProps) => {
  // Skip the query when the widget hasn't been saved yet (no
  // objectMetadataId) or when the configuration is incomplete (no
  // groupBy/aggregate fields). The placeholder handles both cases so the
  // user sees "configure to see data" instead of an error.
  const canQuery =
    Boolean(objectMetadataId) &&
    Boolean(configuration?.groupByFieldMetadataId) &&
    Boolean(configuration?.aggregateOperation);

  const { data: queryData, loading, error } = useQuery<PieChartDataResponse>(
    PIE_CHART_DATA,
    {
      variables: {
        input: {
          objectMetadataId,
          configuration,
        },
      },
      skip: !canQuery,
    },
  );

  if (loading) {
    return <ChartPlaceholder chartLabel="Pie chart — loading..." />;
  }
  if (error) {
    return <ChartPlaceholder chartLabel={`Pie chart — error: ${error.message}`} />;
  }

  // Resolved data: prefer fresh server data, fall back to prefetched (for
  // optimistic in-memory widgets that haven't been saved yet). All filtering /
  // dedupe / cap happens inside useMemo so an upstream re-render that produces
  // a structurally-equal payload doesn't recreate the array reference and
  // re-render Nivo unnecessarily.
  const { nivoData, truncated, originalLength } = useMemo(() => {
    const rawItems = queryData?.pieChartData?.data ?? prefetchedData ?? [];

    // Map first (server returns { id, value }; Nivo wants { id, label, value }),
    // then strip non-finite values, dedupe by id, and cap.
    const mapped = rawItems
      .map((item) => {
        const itemLabel =
          'label' in item && typeof item.label === 'string' && item.label
            ? item.label
            : item.id;
        return {
          id: item.id,
          label: itemLabel,
          value: item.value,
        };
      })
      .filter((item) => isFiniteNumber(item.value));

    const deduped = dedupeById(mapped);
    const capped = capDataPoints(deduped);

    return {
      nivoData: capped.data,
      truncated: capped.truncated,
      originalLength: capped.originalLength,
    };
  }, [queryData, prefetchedData]);

  if (nivoData.length === 0) {
    return <ChartPlaceholder chartLabel="Pie chart" />;
  }

  return (
    <div style={{ height: '100%', minHeight: 240, position: 'relative' }}>
      <ResponsivePie
        data={nivoData}
        margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
        innerRadius={0.5}
        colors={{ scheme: 'nivo' }}
        enableArcLabels={
          queryData?.pieChartData?.showDataLabels ?? false
        }
      />
      {truncated ? (
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            right: 8,
            fontSize: 11,
            color: '#94a3b8',
            fontStyle: 'italic',
          }}
        >
          Showing top {nivoData.length} of {originalLength}
        </div>
      ) : null}
    </div>
  );
};

export default PieChartWidget;
