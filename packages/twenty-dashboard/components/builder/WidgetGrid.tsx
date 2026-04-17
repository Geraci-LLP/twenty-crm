'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { PageLayoutWidget } from '../../lib/types';
import { WidgetRenderer } from '../widgets/WidgetRenderer';

export type WidgetGridProps = {
  widgets: PageLayoutWidget[];
  selectedWidgetId: string | null;
  onSelectWidget: (id: string) => void;
};

export const WidgetGrid = ({
  widgets,
  selectedWidgetId,
  onSelectWidget,
}: WidgetGridProps) => {
  return (
    <section
      style={{
        flex: 1,
        padding: 24,
        background: '#fafafa',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <Droppable droppableId="grid">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 12,
              minHeight: '80vh',
              background: '#fff',
              border: '1px dashed #d0d0d0',
              borderRadius: 6,
              padding: 16,
            }}
          >
            {widgets.map((widget, index) => {
              const columnSpan = widget.gridPosition?.columnSpan ?? 4;
              const rowSpan = widget.gridPosition?.rowSpan ?? 1;
              const isSelected = widget.id === selectedWidgetId;
              return (
                <Draggable
                  key={widget.id}
                  draggableId={widget.id}
                  index={index}
                >
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      onClick={() => onSelectWidget(widget.id)}
                      style={{
                        gridColumn: `span ${columnSpan}`,
                        gridRow: `span ${rowSpan}`,
                        background: '#fff',
                        border: isSelected
                          ? '2px solid #1a66ff'
                          : '1px solid #e5e5e5',
                        borderRadius: 6,
                        padding: 12,
                        minHeight: 200,
                        cursor: 'pointer',
                        ...dragProvided.draggableProps.style,
                      }}
                    >
                      <h4 style={{ margin: '0 0 8px', fontSize: 13 }}>
                        {widget.title}
                      </h4>
                      <WidgetRenderer widget={widget} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
};
