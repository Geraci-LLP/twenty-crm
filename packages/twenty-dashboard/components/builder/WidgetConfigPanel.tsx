'use client';

import { PageLayoutWidget } from '../../lib/types';

export type WidgetConfigPanelProps = {
  widget: PageLayoutWidget | null;
  onChange: (patch: Partial<PageLayoutWidget>) => void;
  onDelete: (id: string) => void;
};

const AGGREGATE_OPTIONS = [
  { value: 'COUNT', label: 'Count' },
  { value: 'SUM', label: 'Sum' },
  { value: 'AVG', label: 'Average' },
  { value: 'MIN', label: 'Min' },
  { value: 'MAX', label: 'Max' },
];

export const WidgetConfigPanel = ({
  widget,
  onChange,
  onDelete,
}: WidgetConfigPanelProps) => {
  if (!widget) {
    return (
      <aside
        style={{
          width: 280,
          padding: 16,
          background: '#fff',
          borderLeft: '1px solid #e5e5e5',
          height: '100vh',
          color: '#666',
          fontSize: 14,
        }}
      >
        Select a widget to configure it.
      </aside>
    );
  }

  const configuration = widget.configuration ?? {};

  const handleConfigChange = (key: string, value: unknown) => {
    onChange({ configuration: { ...configuration, [key]: value } });
  };

  return (
    <aside
      style={{
        width: 280,
        padding: 16,
        background: '#fff',
        borderLeft: '1px solid #e5e5e5',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: 14 }}>Widget settings</h3>

      <label style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
        Title
        <input
          type="text"
          value={widget.title}
          onChange={(e) => onChange({ title: e.target.value })}
          style={{
            width: '100%',
            padding: 6,
            marginTop: 4,
            border: '1px solid #d0d0d0',
            borderRadius: 4,
          }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
        Object metadata ID
        <input
          type="text"
          value={widget.objectMetadataId ?? ''}
          onChange={(e) => onChange({ objectMetadataId: e.target.value })}
          placeholder="UUID of the object"
          style={{
            width: '100%',
            padding: 6,
            marginTop: 4,
            border: '1px solid #d0d0d0',
            borderRadius: 4,
          }}
        />
      </label>

      {(widget.type === 'BAR_CHART' ||
        widget.type === 'LINE_CHART' ||
        widget.type === 'PIE_CHART') && (
        <label style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
          Group by field ID
          <input
            type="text"
            value={(configuration.groupByFieldMetadataId as string) ?? ''}
            onChange={(e) =>
              handleConfigChange('groupByFieldMetadataId', e.target.value)
            }
            style={{
              width: '100%',
              padding: 6,
              marginTop: 4,
              border: '1px solid #d0d0d0',
              borderRadius: 4,
            }}
          />
        </label>
      )}

      {widget.type !== 'RICH_TEXT' && (
        <>
          <label style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
            Aggregate field ID
            <input
              type="text"
              value={(configuration.aggregateFieldMetadataId as string) ?? ''}
              onChange={(e) =>
                handleConfigChange('aggregateFieldMetadataId', e.target.value)
              }
              style={{
                width: '100%',
                padding: 6,
                marginTop: 4,
                border: '1px solid #d0d0d0',
                borderRadius: 4,
              }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
            Aggregate operation
            <select
              value={(configuration.aggregateOperation as string) ?? 'COUNT'}
              onChange={(e) =>
                handleConfigChange('aggregateOperation', e.target.value)
              }
              style={{
                width: '100%',
                padding: 6,
                marginTop: 4,
                border: '1px solid #d0d0d0',
                borderRadius: 4,
              }}
            >
              {AGGREGATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {widget.type === 'RICH_TEXT' && (
        <label style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
          HTML body
          <textarea
            value={(configuration.html as string) ?? ''}
            onChange={(e) => handleConfigChange('html', e.target.value)}
            rows={6}
            style={{
              width: '100%',
              padding: 6,
              marginTop: 4,
              border: '1px solid #d0d0d0',
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: 12,
            }}
          />
        </label>
      )}

      <button
        onClick={() => onDelete(widget.id)}
        style={{
          marginTop: 16,
          padding: '8px 12px',
          background: '#fff',
          color: '#c0392b',
          border: '1px solid #c0392b',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 12,
        }}
      >
        Delete widget
      </button>
    </aside>
  );
};
