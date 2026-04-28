'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { WidgetConfigPanel } from '../../../../components/builder/WidgetConfigPanel';
import { WidgetGrid } from '../../../../components/builder/WidgetGrid';
import { WidgetPalette } from '../../../../components/builder/WidgetPalette';
import {
  PALETTE_TO_BACKEND_TYPE,
  PALETTE_TO_CONFIG_TYPE,
} from '../../../../lib/types';
import {
  CREATE_PAGE_LAYOUT_TAB,
  CREATE_PAGE_LAYOUT_WIDGET,
  FIND_DASHBOARD_BY_ID,
  FIND_WIDGETS_BY_TAB,
  GET_PAGE_LAYOUT_TABS,
  UPDATE_PAGE_LAYOUT_WIDGET,
} from '../../../../lib/queries';
import { PageLayoutWidget, WidgetType } from '../../../../lib/types';

type DashboardQueryResult = {
  dashboard: {
    id: string;
    title: string | null;
    pageLayoutId: string | null;
  } | null;
};

type WidgetsByTabResult = {
  getPageLayoutWidgets: PageLayoutWidget[];
};

type GetPageLayoutTabsResult = {
  getPageLayoutTabs: Array<{
    id: string;
    title: string;
    position: number;
    pageLayoutId: string;
  }>;
};

type CreatePageLayoutTabResult = {
  createPageLayoutTab: {
    id: string;
    title: string;
    position: number;
    pageLayoutId: string;
  };
};

const DEFAULT_GRID_POSITION = { column: 0, row: 0, columnSpan: 4, rowSpan: 2 };

const DashboardEditPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading } = useQuery<DashboardQueryResult>(
    FIND_DASHBOARD_BY_ID,
    { variables: { id: params.id }, skip: !params.id },
  );

  const pageLayoutId = data?.dashboard?.pageLayoutId ?? null;

  const { data: tabsData, loading: tabsLoading } =
    useQuery<GetPageLayoutTabsResult>(GET_PAGE_LAYOUT_TABS, {
      variables: { pageLayoutId: pageLayoutId ?? '' },
      skip: !pageLayoutId,
    });

  const [createPageLayoutTab, { loading: creatingTab }] =
    useMutation<CreatePageLayoutTabResult>(CREATE_PAGE_LAYOUT_TAB);

  const [widgets, setWidgets] = useState<PageLayoutWidget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // The tab id all widgets on this dashboard belong to. Resolved lazily
  // from the dashboard's pageLayoutId: use the first existing tab, or mint
  // a default one on demand.
  const [resolvedTabId, setResolvedTabId] = useState<string | null>(null);
  const [tabResolutionError, setTabResolutionError] = useState<string | null>(
    null,
  );

  // Pick an existing tab if one exists on the dashboard's page layout.
  // We don't create one eagerly — only when the user tries to save a new
  // widget — to avoid writing to the CRM just because someone opened the
  // edit page.
  useEffect(() => {
    if (!tabsData) {
      return;
    }
    const existing = tabsData.getPageLayoutTabs[0];
    if (existing) {
      setResolvedTabId(existing.id);
    }
  }, [tabsData]);

  // Fetch persisted widgets from the resolved tab. Twenty's `dashboard`
  // standard object doesn't expose widgets as a nested relation; widgets
  // belong to pageLayoutTab and are read via the metadata API.
  const { data: widgetsData } = useQuery<WidgetsByTabResult>(
    FIND_WIDGETS_BY_TAB,
    {
      variables: { pageLayoutTabId: resolvedTabId ?? '' },
      skip: !resolvedTabId,
    },
  );

  useEffect(() => {
    if (!widgetsData) return;
    setWidgets(widgetsData.getPageLayoutWidgets ?? []);
  }, [widgetsData]);

  const [createWidget] = useMutation(CREATE_PAGE_LAYOUT_WIDGET);
  const [updateWidget] = useMutation(UPDATE_PAGE_LAYOUT_WIDGET);

  const selectedWidget =
    widgets.find((widget) => widget.id === selectedWidgetId) ?? null;

  const ensureTabId = async (): Promise<string | null> => {
    if (resolvedTabId) {
      return resolvedTabId;
    }
    if (!pageLayoutId) {
      setTabResolutionError(
        'This dashboard has no page layout — widgets cannot be saved until one is attached server-side.',
      );
      return null;
    }

    const result = await createPageLayoutTab({
      variables: {
        input: {
          pageLayoutId,
          title: 'Main',
          position: 0,
        },
      },
    });
    const newTabId = result.data?.createPageLayoutTab.id ?? null;
    if (newTabId) {
      setResolvedTabId(newTabId);
    }
    return newTabId;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    // Dropping a new widget from the palette into the grid
    if (
      result.source.droppableId === 'palette' &&
      result.destination.droppableId === 'grid'
    ) {
      const widgetType = result.draggableId.replace(
        'palette-',
        '',
      ) as WidgetType;
      const tempId = `new-${Date.now()}`;
      // Seed sensible defaults so the widget is savable without forcing the
      // user to first interact with every form field. These defaults match
      // what the right-side panel renders as the visual default — without
      // them, the form shows "Count" but the underlying configuration object
      // is empty and the API rejects it.
      const isRichText = widgetType === 'RICH_TEXT';
      const defaultConfiguration: Record<string, unknown> = isRichText
        ? {}
        : { aggregateOperation: 'COUNT' };

      const newWidget: PageLayoutWidget = {
        id: tempId,
        title: widgetType.replace('_', ' '),
        type: widgetType,
        // Tab id is filled in at save time via ensureTabId().
        pageLayoutTabId: resolvedTabId ?? '',
        gridPosition: { ...DEFAULT_GRID_POSITION, row: widgets.length },
        configuration: defaultConfiguration,
      };
      setWidgets((prev) => [...prev, newWidget]);
      setSelectedWidgetId(tempId);
      return;
    }

    // Reordering within the grid
    if (
      result.source.droppableId === 'grid' &&
      result.destination.droppableId === 'grid'
    ) {
      const reordered = Array.from(widgets);
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);
      setWidgets(reordered);
    }
  };

  const handleWidgetChange = (patch: Partial<PageLayoutWidget>) => {
    if (!selectedWidgetId) {
      return;
    }
    setWidgets((prev) =>
      prev.map((widget) =>
        widget.id === selectedWidgetId ? { ...widget, ...patch } : widget,
      ),
    );
  };

  const handleWidgetDelete = (id: string) => {
    // The CRM API doesn't expose a deletePageLayoutWidget mutation yet, so
    // for now this only removes from local state. Persisted widgets will
    // reappear after a page reload until the server-side delete is added.
    setWidgets((prev) => prev.filter((widget) => widget.id !== id));
    setSelectedWidgetId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setTabResolutionError(null);
    try {
      const hasNewWidgets = widgets.some((widget) =>
        widget.id.startsWith('new-'),
      );
      let tabIdForNewWidgets: string | null = resolvedTabId;
      if (hasNewWidgets) {
        tabIdForNewWidgets = await ensureTabId();
        if (!tabIdForNewWidgets) {
          // ensureTabId already set an error message; bail out cleanly.
          return;
        }
      }

      for (const widget of widgets) {
        // Translate the palette-level type (BAR_CHART, LINE_CHART, etc.) into
        // the backend's WidgetType enum (GRAPH or STANDALONE_RICH_TEXT). The
        // backend's `configuration` is a tagged union keyed on
        // `configurationType` — set that so the API knows which member of the
        // union to validate against.
        const backendType = PALETTE_TO_BACKEND_TYPE[widget.type];
        const configurationType = PALETTE_TO_CONFIG_TYPE[widget.type];
        const isRichText = widget.type === 'RICH_TEXT';
        const baseConfiguration: Record<string, unknown> = {
          ...(widget.configuration ?? {}),
          configurationType,
        };
        // All chart/aggregate config types REQUIRE aggregateOperation, even
        // when the user never opens the dropdown. Inject the visual default
        // ("COUNT") so we don't 400 on save just because the user dragged a
        // widget and clicked Save without touching the form.
        if (!isRichText && !baseConfiguration.aggregateOperation) {
          baseConfiguration.aggregateOperation = 'COUNT';
        }
        const persistedConfiguration = baseConfiguration;

        if (widget.id.startsWith('new-')) {
          await createWidget({
            variables: {
              input: {
                title: widget.title,
                type: backendType,
                objectMetadataId: widget.objectMetadataId,
                gridPosition: widget.gridPosition,
                configuration: persistedConfiguration,
                pageLayoutTabId: tabIdForNewWidgets,
              },
            },
          });
        } else {
          await updateWidget({
            variables: {
              id: widget.id,
              input: {
                title: widget.title,
                gridPosition: widget.gridPosition,
                configuration: persistedConfiguration,
              },
            },
          });
        }
      }
      router.push(`/dashboard/${params.id}`);
    } finally {
      setSaving(false);
    }
  };

  const isLoading = loading || tabsLoading;
  const saveDisabled = useMemo(
    () => saving || isLoading || creatingTab,
    [saving, isLoading, creatingTab],
  );

  if (isLoading) {
    return <main style={{ padding: 32 }}>Loading builder...</main>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <WidgetPalette />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 24px',
              background: '#fff',
              borderBottom: '1px solid #e5e5e5',
            }}
          >
            <div>
              <Link
                href={`/dashboard/${params.id}`}
                style={{ color: '#666', fontSize: 14 }}
              >
                &larr; Cancel
              </Link>
              <h2 style={{ margin: '4px 0 0', fontSize: 16 }}>
                {data?.dashboard?.title ?? 'Dashboard'}
              </h2>
              {tabResolutionError ? (
                <p
                  style={{
                    margin: '4px 0 0',
                    color: '#b00020',
                    fontSize: 12,
                  }}
                >
                  {tabResolutionError}
                </p>
              ) : null}
            </div>
            <button
              onClick={handleSave}
              disabled={saveDisabled}
              style={{
                padding: '8px 16px',
                background: saveDisabled ? '#888' : '#1a1a1a',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: saveDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </header>
          <WidgetGrid
            widgets={widgets}
            selectedWidgetId={selectedWidgetId}
            onSelectWidget={setSelectedWidgetId}
          />
        </div>
        <WidgetConfigPanel
          widget={selectedWidget}
          onChange={handleWidgetChange}
          onDelete={handleWidgetDelete}
        />
      </DragDropContext>
    </div>
  );
};

export default DashboardEditPage;
