'use client';

import { ResponsivePie } from '@nivo/pie';
import { ChartPlaceholder } from './ChartPlaceholder';

export type PieChartWidgetProps = {
  configuration: Record<string, unknown>;
  data: { id: string; label: string; value: number }[];
};

export const PieChartWidget = ({ data }: PieChartWidgetProps) => {
  if (!data || data.length === 0) {
    return <ChartPlaceholder chartLabel="Pie chart" />;
  }
  return (
    <div style={{ height: '100%', minHeight: 240 }}>
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
        innerRadius={0.5}
        colors={{ scheme: 'nivo' }}
      />
    </div>
  );
};

export default PieChartWidget;
