'use client';

import { ResponsiveBar } from '@nivo/bar';

export type BarChartWidgetProps = {
  configuration: Record<string, unknown>;
  data: { key: string; value: number }[];
};

export const BarChartWidget = ({ data }: BarChartWidgetProps) => {
  return (
    <div style={{ height: '100%', minHeight: 240 }}>
      <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="key"
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
      />
    </div>
  );
};

export default BarChartWidget;
