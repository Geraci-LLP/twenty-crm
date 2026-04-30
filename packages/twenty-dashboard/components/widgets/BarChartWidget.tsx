'use client';

import { useQuery } from '@apollo/client/react';
import { ResponsiveBar } from '@nivo/bar';
import { useMemo } from 'react';
import { ChartPlaceholder } from './ChartPlaceholder';
import { capDataPoints } from '../../lib/chart-safety';
import { BAR_CHART_DATA } from '../../lib/queries';

export type BarChartWidgetProps = {
  configuration: Record<string, unknown>;
  objectMetadataId?: string | null;
  // Optional pre-fetched fallback for unsaved (in-memory) widgets.
  data?: { key: string; value: number }[];
};

type BarChartDataResponse = {
  barChartData: {
    // Nivo bar shape: each row is `{[indexBy]: "X-label", [key]: number, ...}`
    data: Array<Record<string, unknown>>;
    indexBy: string;
    keys: string[];
    series: { key: string; label: string }[];
    xAxisLabel: string;
    yAxisLabel: string;
    showLegend: boolean;
    showDataLabels: boolean;
    hasTooManyGroups: boolean;
  } | null;
};

export const BarChartWidget = ({
  configuration,
  objectMetadataId,
  data: prefetchedData,
}: BarChartWidgetProps) => {
  // BAR_CHART config uses `primaryAxisGroupByFieldMetadataId` — different
  // name from PieChart's `groupByFieldMetadataId`. We require it before
  // making the query so we don't 400 the API on every empty widget.
  const canQuery =
    Boolean(objectMetadataId) &&
    Boolean(configuration?.primaryAxisGroupByFieldMetadataId) &&
    Boolean(configuration?.aggregateOperation);

  const { data: queryData, loading, error } = useQuery<BarChartDataResponse>(
    BAR_CHART_DATA,
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
    return <ChartPlaceholder chartLabel="Bar chart — loading..." />;
  }
  if (error) {
    return <ChartPlaceholder chartLabel={`Bar chart — error: ${error.message}`} />;
  }

  const result = queryData?.barChartData;

  // Cap the bar count before handing to Nivo. SVG layout for hundreds of
  // bars can OOM the renderer (the Aw, Snap! crash class). Memoize so the
  // cap doesn't run on every render.
  const cappedBars = useMemo(() => {
    if (!result || result.data.length === 0) {
      return null;
    }
    return capDataPoints(
      result.data as Record<string, string | number>[],
    );
  }, [result]);

  if (result && cappedBars && cappedBars.data.length > 0) {
    return (
      <div style={{ height: '100%', minHeight: 240, position: 'relative' }}>
        <ResponsiveBar
          data={cappedBars.data}
          keys={result.keys}
          indexBy={result.indexBy}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          axisBottom={{ legend: result.xAxisLabel || '', legendOffset: 36 }}
          axisLeft={{ legend: result.yAxisLabel || '', legendOffset: -40 }}
          enableLabel={result.showDataLabels}
        />
        {cappedBars.truncated ? (
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
            Showing first {cappedBars.data.length} of {cappedBars.originalLength}
          </div>
        ) : null}
      </div>
    );
  }

  // Fallback to the legacy in-memory shape for unsaved widgets.
  if (prefetchedData && prefetchedData.length > 0) {
    return (
      <div style={{ height: '100%', minHeight: 240 }}>
        <ResponsiveBar
          data={prefetchedData}
          keys={['value']}
          indexBy="key"
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
        />
      </div>
    );
  }

  return <ChartPlaceholder chartLabel="Bar chart" />;
};

export default BarChartWidget;
