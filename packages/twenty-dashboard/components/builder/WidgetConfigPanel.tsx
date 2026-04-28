'use client';

import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { FIND_OBJECTS_WITH_FIELDS } from '../../lib/queries';
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

type ObjectMetadataNode = {
  id: string;
  nameSingular: string;
  labelSingular: string;
  labelPlural: string;
  isSystem: boolean;
  isCustom: boolean;
  fields: { edges: { node: FieldMetadataNode }[] };
};

type FieldMetadataNode = {
  id: string;
  name: string;
  label: string;
  type: string;
};

type ObjectsQueryResult = {
  objects: { edges: { node: ObjectMetadataNode }[] };
};

const SELECT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: 6,
  marginTop: 4,
  border: '1px solid #d0d0d0',
  borderRadius: 4,
  background: '#fff',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  marginBottom: 12,
  fontSize: 12,
};

export const WidgetConfigPanel = ({
  widget,
  onChange,
  onDelete,
}: WidgetConfigPanelProps) => {
  const { data, loading } = useQuery<ObjectsQueryResult>(
    FIND_OBJECTS_WITH_FIELDS,
  );

  const objectOptions = useMemo(() => {
    const all = data?.objects?.edges?.map((e) => e.node) ?? [];
    // Hide system-only objects (favorites, etc.) — they're rarely useful as
    // chart sources and would clutter the dropdown.
    return all
      .filter((o) => !o.isSystem || o.isCustom)
      .sort((a, b) => a.labelSingular.localeCompare(b.labelSingular));
  }, [data]);

  const selectedObject = useMemo(
    () => objectOptions.find((o) => o.id === widget?.objectMetadataId) ?? null,
    [objectOptions, widget?.objectMetadataId],
  );

  const fieldOptions = useMemo(() => {
    const all = selectedObject?.fields.edges.map((e) => e.node) ?? [];
    // Aggregate-friendly fields: numerics + datetimes for SUM/AVG/MIN/MAX,
    // anything for COUNT. Show all and let the user pick — Twenty's API
    // will reject invalid combinations.
    return all.sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedObject]);

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

  const handleObjectChange = (objectId: string) => {
    // Reset the field selection when the object changes — the previously
    // selected field id won't be valid against the new object.
    onChange({
      objectMetadataId: objectId || null,
      configuration: {
        ...configuration,
        aggregateFieldMetadataId: '',
        groupByFieldMetadataId: '',
      },
    });
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

      <label style={LABEL_STYLE}>
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

      {widget.type !== 'RICH_TEXT' && (
        <>
          <label style={LABEL_STYLE}>
            Object
            <select
              value={widget.objectMetadataId ?? ''}
              onChange={(e) => handleObjectChange(e.target.value)}
              disabled={loading}
              style={SELECT_STYLE}
            >
              <option value="">
                {loading ? 'Loading...' : '— Select object —'}
              </option>
              {objectOptions.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.labelSingular}
                </option>
              ))}
            </select>
          </label>

          {(widget.type === 'BAR_CHART' ||
            widget.type === 'LINE_CHART' ||
            widget.type === 'PIE_CHART') && (
            <label style={LABEL_STYLE}>
              Group by field
              <select
                value={(configuration.groupByFieldMetadataId as string) ?? ''}
                onChange={(e) =>
                  handleConfigChange('groupByFieldMetadataId', e.target.value)
                }
                disabled={!selectedObject}
                style={SELECT_STYLE}
              >
                <option value="">— Select field —</option>
                {fieldOptions.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label style={LABEL_STYLE}>
            Aggregate field
            <select
              value={(configuration.aggregateFieldMetadataId as string) ?? ''}
              onChange={(e) =>
                handleConfigChange('aggregateFieldMetadataId', e.target.value)
              }
              disabled={!selectedObject}
              style={SELECT_STYLE}
            >
              <option value="">— Select field —</option>
              {fieldOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          <label style={LABEL_STYLE}>
            Aggregate operation
            <select
              value={(configuration.aggregateOperation as string) ?? 'COUNT'}
              onChange={(e) =>
                handleConfigChange('aggregateOperation', e.target.value)
              }
              style={SELECT_STYLE}
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
        <label style={LABEL_STYLE}>
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
