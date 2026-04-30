'use client';

// Rendered by chart widgets when no data has been fetched yet (or the widget
// hasn't been configured with the fields needed to query data). Keeps the
// dashboard visually consistent — every chart card shows *something*, even
// before the live-data wiring lands in Phase B.

export type ChartPlaceholderProps = {
  chartLabel: string;
};

export const ChartPlaceholder = ({ chartLabel }: ChartPlaceholderProps) => (
  <div
    style={{
      height: '100%',
      minHeight: 240,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      color: '#94a3b8',
      background:
        'repeating-linear-gradient(45deg, transparent 0 8px, rgba(148,163,184,0.06) 8px 16px)',
      borderRadius: 6,
      padding: 16,
      textAlign: 'center',
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    >
      {chartLabel}
    </div>
    <div style={{ fontSize: 12, fontStyle: 'italic' }}>
      No data yet. Configure object + fields, save, then live data will render
      here.
    </div>
  </div>
);

export default ChartPlaceholder;
