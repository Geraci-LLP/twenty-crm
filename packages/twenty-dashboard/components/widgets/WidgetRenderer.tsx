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

export type WidgetRendererProps = {
  widget: PageLayoutWidget;
  // `data` is fetched by the parent (see page.tsx). Shape varies by widget type.
  data?: unknown;
};

export const WidgetRenderer = ({ widget, data }: WidgetRendererProps) => {
  const configuration = widget.configuration ?? {};

  switch (widget.type) {
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
      return <div>Unsupported widget type: {widget.type}</div>;
  }
};
