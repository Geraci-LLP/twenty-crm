'use client';

import dynamic from 'next/dynamic';
import { PageLayoutWidget } from '../../lib/types';

// Code-split Nivo bundles — each chart is its own chunk
const BarChartWidget = dynamic(() => import('./BarChartWidget'), {
  ssr: false,
});
const LineChartWidget = dynamic(() => import('./LineChartWidget'), {
  ssr: false,
});
const PieChartWidget = dynamic(() => import('./PieChartWidget'), {
  ssr: false,
});
const GaugeChartWidget = dynamic(() => import('./GaugeChartWidget'), {
  ssr: false,
});
const MetricWidget = dynamic(() => import('./MetricWidget'), { ssr: false });
const RichTextWidget = dynamic(() => import('./RichTextWidget'), {
  ssr: false,
});
const IframeWidget = dynamic(() => import('./IframeWidget'), { ssr: false });

export type WidgetRendererProps = {
  widget: PageLayoutWidget;
  // `data` is fetched by the parent (see page.tsx). Shape varies by widget type.
  data?: unknown;
};

// Twenty's `widget.type` is the high-level enum — `GRAPH` covers BAR/LINE/PIE/
// GAUGE/AGGREGATE/METRIC, `STANDALONE_RICH_TEXT` is the rich text widget,
// `IFRAME` is the iframe widget, etc. The actual chart subtype is on the
// `configuration` union, exposed via either `__typename` or `configurationType`.
//
// Older code in this file dispatched on `widget.type` against the palette key
// (BAR_CHART, etc.) — which never matched the backend type, hence the
// "Unsupported widget type: GRAPH" fallback users were seeing for everything.

const Unsupported = ({ reason }: { reason: string }) => (
  <div
    style={{
      padding: 12,
      color: '#6b7280',
      fontSize: 13,
      fontStyle: 'italic',
    }}
  >
    {reason}
  </div>
);

export const WidgetRenderer = ({ widget, data }: WidgetRendererProps) => {
  const configuration = (widget.configuration ?? {}) as Record<string, unknown>;
  // Prefer __typename (returned automatically by the union), fall back to the
  // configurationType discriminator field which we explicitly query in the
  // fragment. This makes the renderer resilient to either being present.
  const configType =
    (configuration.__typename as string | undefined) ??
    (configuration.configurationType as string | undefined);

  // Branch first on the high-level widget.type, then drill into the
  // configuration union for GRAPH widgets (which cover all chart subtypes).
  switch (widget.type) {
    case 'GRAPH':
      switch (configType) {
        case 'BarChartConfiguration':
        case 'BAR_CHART':
          return (
            <BarChartWidget
              configuration={configuration}
              data={(data as { key: string; value: number }[]) ?? []}
            />
          );
        case 'LineChartConfiguration':
        case 'LINE_CHART':
          return (
            <LineChartWidget
              configuration={configuration}
              data={
                (data as {
                  id: string;
                  data: { x: string | number; y: number }[];
                }[]) ?? []
              }
            />
          );
        case 'PieChartConfiguration':
        case 'PIE_CHART':
          return (
            <PieChartWidget
              configuration={configuration}
              data={
                (data as { id: string; label: string; value: number }[]) ?? []
              }
            />
          );
        case 'GaugeChartConfiguration':
        case 'GAUGE_CHART':
          return (
            <GaugeChartWidget
              configuration={configuration}
              data={
                (data as { id: string; data: { x: string; y: number }[] }[]) ??
                []
              }
            />
          );
        case 'AggregateChartConfiguration':
        case 'AGGREGATE_CHART':
          return (
            <MetricWidget
              configuration={configuration}
              data={
                (data as { value: number | string; label?: string }) ?? {
                  value: 0,
                }
              }
            />
          );
        default:
          return (
            <Unsupported
              reason={`Chart subtype not supported in dashboard yet: ${
                configType ?? 'unknown'
              }`}
            />
          );
      }
    case 'STANDALONE_RICH_TEXT':
      return <RichTextWidget configuration={configuration} data={data} />;
    case 'IFRAME':
      return <IframeWidget configuration={configuration} />;
    // Palette keys, kept as fallbacks for newly-dragged widgets that are still
    // in memory (id starts with 'new-') and haven't been saved yet — those
    // hold the palette key directly.
    case 'BAR_CHART':
      return (
        <BarChartWidget
          configuration={configuration}
          data={(data as { key: string; value: number }[]) ?? []}
        />
      );
    case 'LINE_CHART':
      return (
        <LineChartWidget
          configuration={configuration}
          data={
            (data as {
              id: string;
              data: { x: string | number; y: number }[];
            }[]) ?? []
          }
        />
      );
    case 'PIE_CHART':
      return (
        <PieChartWidget
          configuration={configuration}
          data={(data as { id: string; label: string; value: number }[]) ?? []}
        />
      );
    case 'GAUGE_CHART':
      return (
        <GaugeChartWidget
          configuration={configuration}
          data={
            (data as { id: string; data: { x: string; y: number }[] }[]) ?? []
          }
        />
      );
    case 'METRIC':
    case 'AGGREGATE_CHART':
      return (
        <MetricWidget
          configuration={configuration}
          data={
            (data as { value: number | string; label?: string }) ?? {
              value: 0,
            }
          }
        />
      );
    case 'RICH_TEXT':
      return <RichTextWidget configuration={configuration} data={data} />;
    default:
      return (
        <Unsupported
          reason={`Widget type "${widget.type}" is not yet supported in this dashboard. (CRM-only widgets like CAMPAIGN_EDITOR, FORM_BUILDER, EMAILS aren't rendered here.)`}
        />
      );
  }
};
