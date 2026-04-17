'use client';

import { ResponsiveLine } from '@nivo/line';

export type LineChartWidgetProps = {
  configuration: Record<string, unknown>;
  data: { id: string; data: { x: string | number; y: number }[] }[];
};

export const LineChartWidget = ({ data }: LineChartWidgetProps) => {
  return (
    <div style={{ height: '100%', minHeight: 240 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear' }}
        colors={{ scheme: 'nivo' }}
      />
    </div>
  );
};

export default LineChartWidget;
