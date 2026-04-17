'use client';

import { ResponsiveRadialBar } from '@nivo/radial-bar';

export type GaugeChartWidgetProps = {
  configuration: Record<string, unknown>;
  data: { id: string; data: { x: string; y: number }[] }[];
};

export const GaugeChartWidget = ({ data }: GaugeChartWidgetProps) => {
  return (
    <div style={{ height: '100%', minHeight: 240 }}>
      <ResponsiveRadialBar
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        colors={{ scheme: 'nivo' }}
        padding={0.3}
      />
    </div>
  );
};

export default GaugeChartWidget;
