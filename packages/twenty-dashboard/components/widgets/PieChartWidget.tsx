'use client';

import { useQuery } from '@apollo/client/react';
import { ResponsivePie } from '@nivo/pie';
import { ChartPlaceholder } from './ChartPlaceholder';
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
  // optimistic in-memory widgets that haven't been saved yet).
  const items = queryData?.pieChartData?.data ?? prefetchedData ?? [];

  if (items.length === 0) {
    return <ChartPlaceholder chartLabel="Pie chart" />;
  }

  // Nivo expects { id, label, value }; the server returns { id, value } so
  // we synthesize a label from the id (it's already a human-readable string
  // for SELECT fields and dates).
  const nivoData = items.map((item) => {
    const itemLabel =
      'label' in item && typeof item.label === 'string' && item.label
        ? item.label
        : item.id;
    return {
      id: item.id,
      label: itemLabel,
      value: item.value,
    };
  });

  return (
    <div style={{ height: '100%', minHeight: 240 }}>
      <ResponsivePie
        data={nivoData}
        margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
        innerRadius={0.5}
        colors={{ scheme: 'nivo' }}
        enableArcLabels={
          queryData?.pieChartData?.showDataLabels ?? false
        }
      />
    </div>
  );
};

export default PieChartWidget;
