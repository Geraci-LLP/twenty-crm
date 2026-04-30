'use client';

import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { WidgetErrorBoundary } from '../../../components/WidgetErrorBoundary';
import { WidgetRenderer } from '../../../components/widgets/WidgetRenderer';
import {
  FIND_DASHBOARD_BY_ID,
  FIND_WIDGETS_BY_PAGE_LAYOUT,
  FIND_WIDGETS_BY_TAB,
} from '../../../lib/queries';
import { Dashboard, PageLayoutWidget } from '../../../lib/types';

type DashboardQueryResult = {
  dashboard: Dashboard | null;
};

type TabsQueryResult = {
  getPageLayoutTabs: { id: string; title: string; position: number }[];
};

type WidgetsQueryResult = {
  getPageLayoutWidgets: PageLayoutWidget[];
};

const DashboardViewPage = () => {
  const params = useParams<{ id: string }>();

  const {
    data: dashData,
    loading: dashLoading,
    error: dashError,
  } = useQuery<DashboardQueryResult>(FIND_DASHBOARD_BY_ID, {
    variables: { id: params.id },
    skip: !params.id,
  });

  const dashboard = dashData?.dashboard ?? null;
  const pageLayoutId = dashboard?.pageLayoutId ?? null;

  // Fetch tabs for the dashboard's page layout. Skipped until we have
  // a layout id resolved.
  const { data: tabsData, loading: tabsLoading } = useQuery<TabsQueryResult>(
    FIND_WIDGETS_BY_PAGE_LAYOUT,
    { variables: { pageLayoutId }, skip: !pageLayoutId },
  );

  // Use the first tab. The current dashboard view doesn't render a tabbed
  // UI; widgets get flattened from whichever tab is primary.
  const firstTabId = useMemo(
    () => tabsData?.getPageLayoutTabs?.[0]?.id ?? null,
    [tabsData],
  );

  const { data: widgetsData, loading: widgetsLoading } =
    useQuery<WidgetsQueryResult>(FIND_WIDGETS_BY_TAB, {
      variables: { pageLayoutTabId: firstTabId },
      skip: !firstTabId,
    });

  const widgets = widgetsData?.getPageLayoutWidgets ?? [];

  const isLoading = dashLoading || tabsLoading || widgetsLoading;

  if (isLoading) {
    return (
      <LoadingScreen
        label="Loading dashboard"
        hint="Fetching widgets and the latest CRM data."
      />
    );
  }

  if (dashError || !dashboard) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Dashboard not found</h1>
        {dashError ? <pre>{dashError.message}</pre> : null}
        <Link href="/">Back to dashboards</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 32, maxWidth: 1280, margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <Link href="/" style={{ color: '#666', fontSize: 14 }}>
            &larr; Dashboards
          </Link>
          <h1 style={{ margin: '4px 0 0' }}>
            {dashboard.title ?? 'Untitled Dashboard'}
          </h1>
        </div>
        <Link
          href={`/dashboard/${dashboard.id}/edit`}
          style={{
            padding: '8px 16px',
            background: '#1a1a1a',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Edit
        </Link>
      </header>

      {widgets.length === 0 ? (
        <p style={{ color: '#666' }}>
          This dashboard is empty. Click Edit to add widgets.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 16,
          }}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                gridColumn: `span ${widget.gridPosition?.columnSpan ?? 4}`,
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                padding: 16,
                minHeight: 200,
              }}
            >
              <h3 style={{ margin: '0 0 12px', fontSize: 14 }}>
                {widget.title}
              </h3>
              <WidgetErrorBoundary widgetTitle={widget.title}>
                <WidgetRenderer widget={widget} data={null} />
              </WidgetErrorBoundary>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default DashboardViewPage;
