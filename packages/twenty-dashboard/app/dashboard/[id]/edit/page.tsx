'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
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
  type PaletteKey,
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

// Returns null if the widget has all required fields, or a human-readable
// reason otherwise. Twenty's API will reject the mutation with a 400 if any
// of these are missing — surfacing the reason client-side gives the user a
// useful message instead of "Received status code 400".
const validateWidget = (widget: PageLayoutWidget): string | null => {
  if (!widget.title || widget.title.trim() === '') {
    return 'Title is required';
  }
  // Rich text widgets just need a title; html body is optional. Match both
  // the palette key (new widgets) and the backend value (loaded widgets).
  if (
    widget.type === 'RICH_TEXT' ||
    widget.type === 'STANDALONE_RICH_TEXT'
  ) {
    return null;
  }
  // IFRAME widgets only need a URL in their configuration; we don't render
  // CRM-only types so we don't validate them here.
  if (widget.type === 'IFRAME') {
    const url = (widget.configuration as Record<string, unknown> | null)
      ?.url as string | undefined;
    if (!url || url.trim() === '') {
      return 'IFRAME widget needs a URL';
    }
    return null;
  }
  if (!widget.objectMetadataId) {
    return 'Pick an Object before saving';
  }
  const config = (widget.configuration ?? {}) as Record<string, unknown>;
  // Discriminate chart-subtype from either the palette key (new widgets,
  // type === 'BAR_CHART' etc.) or the loaded configuration's
  // configurationType (for existing widgets, type === 'GRAPH').
  const subtype =
    widget.type === 'GRAPH'
      ? (config.configurationType as string | undefined)
      : widget.type;
  const isGroupBased =
    subtype === 'BAR_CHART' ||
    subtype === 'LINE_CHART' ||
    subtype === 'PIE_CHART' ||
    subtype === 'GAUGE_CHART';
  if (isGroupBased) {
    // Bar/Line use `primaryAxisGroupByFieldMetadataId`, Pie uses
    // `groupByFieldMetadataId`, Gauge has no group-by at all (it's a single
    // aggregated value drawn as a radial bar). Accept either name to cover
    // both — the per-config validation on the server will pick up an
    // actually-malformed payload.
    const hasGroupBy =
      config.groupByFieldMetadataId || config.primaryAxisGroupByFieldMetadataId;
    if (subtype !== 'GAUGE_CHART' && !hasGroupBy) {
      return 'Pick a Group by field before saving';
    }
  }
  // For aggregate operations other than COUNT, an aggregate field is required
  // (you can't SUM/AVG/MIN/MAX without telling the API which numeric field to
  // aggregate). COUNT works without one because it counts rows.
  const aggOp = (config.aggregateOperation as string) ?? 'COUNT';
  if (aggOp !== 'COUNT' && !config.aggregateFieldMetadataId) {
    return `Pick an Aggregate field, or change Aggregate operation to Count (currently "${aggOp}")`;
  }
  return null;
};

// Apollo Client v4 wraps errors differently depending on whether they came
// from the server (HTTP error), from GraphQL (response with errors[]), or
// from the network. The default `error.message` is often generic
// ("Response not successful: Received status code 400") — extract the
// real reason where we can.
const extractApolloErrorMessage = (error: unknown): string => {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.map((e) => e.message).join('; ');
  }
  if (ServerError.is(error)) {
    // ServerError.bodyText often contains the JSON-encoded GraphQL error
    // payload from the server when status >= 400.
    const body = error.bodyText ?? '';
    const detail = body.length > 0 ? ` — ${body.slice(0, 200)}` : '';
    return `HTTP ${error.statusCode}${detail}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

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
  // Surface save outcomes to the user. The previous version swallowed errors
  // silently — the loading spinner cleared and the user assumed success.
  type SaveResult =
    | { kind: 'success'; savedCount: number }
    | { kind: 'partial'; savedCount: number; failedCount: number; firstError: string }
    | { kind: 'failure'; firstError: string };
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null);

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
    setSaveResult(null);
    try {
      // Validate ALL widgets before sending any mutation. If any one is
      // missing required config, abort the whole save and tell the user
      // exactly which widget needs attention. Without this, the user
      // would see a generic "HTTP 400" from the API.
      const validationFailures: { widget: PageLayoutWidget; reason: string }[] =
        [];
      for (const widget of widgets) {
        const reason = validateWidget(widget);
        if (reason) {
          validationFailures.push({ widget, reason });
        }
      }
      if (validationFailures.length > 0) {
        const first = validationFailures[0];
        const widgetLabel = first.widget.title?.trim()
          ? `"${first.widget.title}"`
          : `(untitled ${first.widget.type.toLowerCase().replace('_', ' ')})`;
        const extra =
          validationFailures.length > 1
            ? ` (and ${validationFailures.length - 1} more widget(s) need configuration)`
            : '';
        setSaveResult({
          kind: 'failure',
          firstError: `Widget ${widgetLabel}: ${first.reason}${extra}`,
        });
        // Auto-select the first invalid widget so its config panel is
        // already open for the user to fix.
        setSelectedWidgetId(first.widget.id);
        return;
      }

      const hasNewWidgets = widgets.some((widget) =>
        widget.id.startsWith('new-'),
      );
      let tabIdForNewWidgets: string | null = resolvedTabId;
      if (hasNewWidgets) {
        tabIdForNewWidgets = await ensureTabId();
        if (!tabIdForNewWidgets) {
          // ensureTabId already set tabResolutionError; show a save banner
          // too so the user has one place to look for failure feedback.
          setSaveResult({
            kind: 'failure',
            firstError:
              'Could not resolve or create a tab for new widgets. See banner above.',
          });
          return;
        }
      }

      let savedCount = 0;
      let failedCount = 0;
      let firstError: string | null = null;

      for (const widget of widgets) {
        // For NEW widgets (dragged from the palette, id starts with 'new-')
        // widget.type is a palette key like 'BAR_CHART' — translate to the
        // backend WidgetType (GRAPH / STANDALONE_RICH_TEXT) and write the
        // matching configurationType so the API validates against the right
        // tagged-union member.
        // For EXISTING widgets, widget.type is already a backend value
        // (GRAPH / STANDALONE_RICH_TEXT / IFRAME / ...) and we don't pass it
        // back to the update mutation, so no translation is needed.
        const isNew = widget.id.startsWith('new-');
        const isPaletteKey = isNew && widget.type in PALETTE_TO_BACKEND_TYPE;
        const backendType = isPaletteKey
          ? PALETTE_TO_BACKEND_TYPE[widget.type as PaletteKey]
          : null;
        const configurationType = isPaletteKey
          ? PALETTE_TO_CONFIG_TYPE[widget.type as PaletteKey]
          : ((widget.configuration as Record<string, unknown> | null)
              ?.configurationType as string | undefined);
        const isRichText =
          widget.type === 'RICH_TEXT' ||
          widget.type === 'STANDALONE_RICH_TEXT' ||
          configurationType === 'STANDALONE_RICH_TEXT';
        const baseConfiguration: Record<string, unknown> = {
          ...(widget.configuration ?? {}),
          ...(configurationType ? { configurationType } : {}),
        };
        // All chart/aggregate config types REQUIRE aggregateOperation, even
        // when the user never opens the dropdown. Inject the visual default
        // ("COUNT") so we don't 400 on save just because the user dragged a
        // widget and clicked Save without touching the form.
        if (!isRichText && !baseConfiguration.aggregateOperation) {
          baseConfiguration.aggregateOperation = 'COUNT';
        }
        const persistedConfiguration = baseConfiguration;

        // Per-widget try/catch so one bad widget doesn't silently abort the
        // rest. We log full details for diagnosis but only surface the first
        // human-readable message in the banner.
        try {
          if (isNew) {
            if (!backendType) {
              // Shouldn't happen — UI only allows palette keys for new
              // widgets — but bail with a clear message rather than sending
              // a malformed mutation.
              throw new Error(
                `Cannot create widget of unsupported type "${widget.type}"`,
              );
            }
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
          savedCount += 1;
        } catch (mutationError) {
          failedCount += 1;
          // oxlint-disable-next-line no-console
          console.error(
            `Failed to save widget "${widget.title || widget.id}":`,
            mutationError,
          );
          if (!firstError) {
            firstError = extractApolloErrorMessage(mutationError);
          }
        }
      }

      if (failedCount === 0) {
        setSaveResult({ kind: 'success', savedCount });
        // Only navigate away on full success. On any failure, stay on the
        // edit page so the user can see what went wrong and retry.
        router.push(`/dashboard/${params.id}`);
      } else if (savedCount > 0) {
        setSaveResult({
          kind: 'partial',
          savedCount,
          failedCount,
          firstError: firstError ?? 'Unknown error',
        });
      } else {
        setSaveResult({
          kind: 'failure',
          firstError: firstError ?? 'Unknown error',
        });
      }
    } catch (unexpectedError) {
      // Catches anything outside the per-widget loop (e.g., ensureTabId
      // throws unexpectedly). Without this, the previous version showed
      // nothing to the user.
      // oxlint-disable-next-line no-console
      console.error('Unexpected save error:', unexpectedError);
      setSaveResult({
        kind: 'failure',
        firstError: extractApolloErrorMessage(unexpectedError),
      });
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
              {saveResult?.kind === 'failure' ? (
                <p
                  style={{
                    margin: '4px 0 0',
                    color: '#b00020',
                    fontSize: 12,
                  }}
                >
                  Save failed: {saveResult.firstError}
                </p>
              ) : null}
              {saveResult?.kind === 'partial' ? (
                <p
                  style={{
                    margin: '4px 0 0',
                    color: '#b08000',
                    fontSize: 12,
                  }}
                >
                  Saved {saveResult.savedCount} widget(s),{' '}
                  {saveResult.failedCount} failed: {saveResult.firstError}
                </p>
              ) : null}
              {saveResult?.kind === 'success' && saveResult.savedCount > 0 ? (
                <p
                  style={{
                    margin: '4px 0 0',
                    color: '#0a7a0a',
                    fontSize: 12,
                  }}
                >
                  Saved {saveResult.savedCount} widget(s).
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
