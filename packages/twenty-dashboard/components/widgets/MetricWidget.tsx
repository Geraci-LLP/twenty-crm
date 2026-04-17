'use client';

export type MetricWidgetProps = {
  configuration: Record<string, unknown>;
  data: { value: number | string; label?: string };
};

export const MetricWidget = ({ configuration, data }: MetricWidgetProps) => {
  const prefix = (configuration?.prefix as string) ?? '';
  const suffix = (configuration?.suffix as string) ?? '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 120,
        padding: 16,
      }}
    >
      <span style={{ fontSize: 42, fontWeight: 600 }}>
        {prefix}
        {data.value}
        {suffix}
      </span>
      {data.label ? (
        <span style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
          {data.label}
        </span>
      ) : null}
    </div>
  );
};

export default MetricWidget;
