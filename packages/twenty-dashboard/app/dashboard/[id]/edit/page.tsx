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
  CREATE_PAGE_LAYOUT_TAB,
  CREATE_PAGE_LAYOUT_WIDGET,
  DELETE_PAGE_LAYOUT_WIDGET,
  FIND_DASHBOARD_BY_ID,
  GET_PAGE_LAYOUT_TABS,
  UPDATE_PAGE_LAYOUT_WIDGET,
} from '../../../../lib/queries';
import { PageLayoutWidget, WidgetType } from '../../../../lib/types';

type DashboardQueryResult = {
  dashboard: {
    id: string;
    name: string;
    pageLayoutId: string | null;
    pageLayoutWidgets: { edges: { node: PageLayoutWidget }[] };
  } | null;
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

  useEffect(() => {
    // pageLayoutWidgets can be null for a freshly-created dashboard with no
    // widgets yet — guard every step of the chain.
    const fetched =
      data?.dashboard?.pageLayoutWidgets?.edges?.map((edge) => edge.node) ?? [];
    setWidgets(fetched);
  }, [data]);

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

  const [createWidget] = useMutation(CREATE_PAGE_LAYOUT_WIDGET);
  const [updateWidget] = useMutation(UPDATE_PAGE_LAYOUT_WIDGET);
  const [deleteWidget] = useMutation(DELETE_PAGE_LAYOUT_WIDGET);

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
      const newWidget: PageLayoutWidget = {
        id: tempId,
        title: widgetType.replace('_', ' '),
        type: widgetType,
        // Tab id is filled in at save time via ensureTabId().
        pageLayoutTabId: resolvedTabId ?? '',
        gridPosition: { ...DEFAULT_GRID_POSITION, row: widgets.length },
        configuration: {},
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

  const handleWidgetDelete = async (id: string) => {
    // If it's a server-persisted widget (no `new-` prefix), call mutation
    if (!id.startsWith('new-')) {
      await deleteWidget({ variables: { id } });
    }
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
        if (widget.id.startsWith('new-')) {
          await createWidget({
            variables: {
              data: {
                title: widget.title,
                type: widget.type,
                objectMetadataId: widget.objectMetadataId,
                gridPosition: widget.gridPosition,
                configuration: widget.configuration,
                pageLayoutTabId: tabIdForNewWidgets,
              },
            },
          });
        } else {
          await updateWidget({
            variables: {
              id: widget.id,
              data: {
                title: widget.title,
                gridPosition: widget.gridPosition,
                configuration: widget.configuration,
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
                {data?.dashboard?.name ?? 'Dashboard'}
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
