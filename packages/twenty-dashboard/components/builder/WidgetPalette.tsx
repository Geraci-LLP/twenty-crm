'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import {
  BarChart3,
  CircleDot,
  Gauge,
  Hash,
  LineChart,
  PieChart,
  Sigma,
  Type,
  type LucideIcon,
} from 'lucide-react';
import { theme } from '../../lib/theme';
import { WidgetType } from '../../lib/types';

const WIDGET_TYPES: { type: WidgetType; label: string; icon: LucideIcon }[] = [
  { type: 'BAR_CHART', label: 'Bar chart', icon: BarChart3 },
  { type: 'LINE_CHART', label: 'Line chart', icon: LineChart },
  { type: 'PIE_CHART', label: 'Pie chart', icon: PieChart },
  { type: 'METRIC', label: 'Metric', icon: Hash },
  { type: 'AGGREGATE_CHART', label: 'Aggregate', icon: Sigma },
  { type: 'RICH_TEXT', label: 'Rich text', icon: Type },
  { type: 'GAUGE_CHART', label: 'Gauge', icon: Gauge },
];

// Fallback icon for any future palette key not yet mapped above.
const DefaultIcon = CircleDot;

export const WidgetPalette = () => {
  return (
    <aside
      style={{
        width: 220,
        padding: theme.spacing.lg,
        background: theme.bg.surface,
        borderRight: `1px solid ${theme.border.default}`,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <h3
        style={{
          margin: `0 0 ${theme.spacing.md}px`,
          fontSize: theme.font.sizeXs,
          fontWeight: theme.font.weightSemibold,
          color: theme.text.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
        Widgets
      </h3>
      <Droppable droppableId="palette" isDropDisabled>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xs,
            }}
          >
            {WIDGET_TYPES.map((item, index) => {
              const Icon = item.icon ?? DefaultIcon;
              return (
                <Draggable
                  key={item.type}
                  draggableId={`palette-${item.type}`}
                  index={index}
                >
                  {(dragProvided, snapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.md,
                        padding: `${theme.spacing.sm + 2}px ${theme.spacing.md}px`,
                        background: snapshot.isDragging
                          ? theme.brand.primaryFaint
                          : theme.bg.surfaceMuted,
                        border: `1px solid ${
                          snapshot.isDragging
                            ? theme.brand.primary
                            : 'transparent'
                        }`,
                        borderRadius: theme.radius.md,
                        cursor: 'grab',
                        fontSize: theme.font.sizeSm,
                        fontWeight: theme.font.weightMedium,
                        color: theme.text.primary,
                        transition: 'background 0.12s ease',
                        boxShadow: snapshot.isDragging ? theme.shadow.md : 'none',
                        ...dragProvided.draggableProps.style,
                      }}
                    >
                      <Icon
                        size={16}
                        style={{
                          color: theme.brand.primary,
                          flexShrink: 0,
                        }}
                      />
                      <span>{item.label}</span>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </aside>
  );
};
