'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { WidgetType } from '../../lib/types';

const WIDGET_TYPES: { type: WidgetType; label: string }[] = [
  { type: 'BAR_CHART', label: 'Bar chart' },
  { type: 'LINE_CHART', label: 'Line chart' },
  { type: 'PIE_CHART', label: 'Pie chart' },
  { type: 'METRIC', label: 'Metric' },
  { type: 'AGGREGATE_CHART', label: 'Aggregate' },
  { type: 'RICH_TEXT', label: 'Rich text' },
  { type: 'GAUGE_CHART', label: 'Gauge' },
];

export const WidgetPalette = () => {
  return (
    <aside
      style={{
        width: 220,
        padding: 16,
        background: '#fff',
        borderRight: '1px solid #e5e5e5',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 12, color: '#666' }}>
        WIDGETS
      </h3>
      <Droppable droppableId="palette" isDropDisabled>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {WIDGET_TYPES.map((item, index) => (
              <Draggable
                key={item.type}
                draggableId={`palette-${item.type}`}
                index={index}
              >
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    style={{
                      padding: '10px 12px',
                      marginBottom: 6,
                      background: '#f5f5f5',
                      borderRadius: 6,
                      cursor: 'grab',
                      fontSize: 14,
                      ...dragProvided.draggableProps.style,
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </aside>
  );
};
