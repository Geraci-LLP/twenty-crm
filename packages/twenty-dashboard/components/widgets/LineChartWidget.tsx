'use client';

import { useQuery } from '@apollo/client/react';
import { ResponsiveLine } from '@nivo/line';
import { useMemo } from 'react';
import { ChartPlaceholder } from './ChartPlaceholder';
import {
  capDataPoints,
  isFiniteNumber,
} from '../../lib/chart-safety';
import { LINE_CHART_DATA } from '../../lib/queries';

export type LineChartWidgetProps = {
  configuration: Record<string, unknown>;
  objectMetadataId?: string | null;
  // Optional pre-fetched fallback for unsaved (in-memory) widgets.
  data?: { id: string; data: { x: string | number; y: number }[] }[];
};

type LineChartDataResponse = {
  lineChartData: {
    series: {
      id: string;
      label: string;
      data: { x: string; y: number }[];
    }[];
    xAxisLabel: string;
    yAxisLabel: string;
    showLegend: boolean;
    showDataLabels: boolean;
    hasTooManyGroups: boolean;
  } | null;
};

export const LineChartWidget = ({
  configuration,
  objectMetadataId,
  data: prefetchedData,
}: LineChartWidgetProps) => {
  // LINE_CHART config uses `primaryAxisGroupByFieldMetadataId`, like Bar.
  const canQuery =
    Boolean(objectMetadataId) &&
    Boolean(configuration?.primaryAxisGroupByFieldMetadataId) &&
    Boolean(configuration?.aggregateOperation);

  const { data: queryData, loading, error } = useQuery<LineChartDataResponse>(
    LINE_CHART_DATA,
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
    return <ChartPlaceholder chartLabel="Line chart — loading..." />;
  }
  if (error) {
    return (
      <ChartPlaceholder chartLabel={`Line chart — error: ${error.message}`} />
    );
  }

  // Filter non-finite y values per point (Nivo can throw on NaN/Infinity),
  // then cap the point count per series to MAX_DATA_POINTS so a noisy
  // dataset doesn't OOM the renderer mid-layout.
  const safeSeries = useMemo(() => {
    const raw = queryData?.lineChartData?.series ?? prefetchedData ?? [];
    return raw
      .map((s) => ({
        ...s,
        data: capDataPoints(
          (s.data ?? []).filter((point) => isFiniteNumber(point.y)),
        ).data,
      }))
      .filter((s) => s.data.length > 0);
  }, [queryData, prefetchedData]);

  if (safeSeries.length === 0) {
    return <ChartPlaceholder chartLabel="Line chart" />;
  }

  return (
    <div style={{ height: '100%', minHeight: 240 }}>
      <ResponsiveLine
        data={safeSeries}
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear' }}
        colors={{ scheme: 'nivo' }}
        axisBottom={{
          legend: queryData?.lineChartData?.xAxisLabel || '',
          legendOffset: 36,
        }}
        axisLeft={{
          legend: queryData?.lineChartData?.yAxisLabel || '',
          legendOffset: -40,
        }}
        enablePointLabel={queryData?.lineChartData?.showDataLabels ?? false}
      />
    </div>
  );
};

export default LineChartWidget;
