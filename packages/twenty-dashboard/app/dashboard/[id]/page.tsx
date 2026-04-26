'use client';

import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WidgetRenderer } from '../../../components/widgets/WidgetRenderer';
import { FIND_DASHBOARD_BY_ID } from '../../../lib/queries';
import { Dashboard, PageLayoutWidget } from '../../../lib/types';

type DashboardQueryResult = {
  dashboard:
    | (Dashboard & {
        pageLayoutWidgets: { edges: { node: PageLayoutWidget }[] };
      })
    | null;
};

const DashboardViewPage = () => {
  const params = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<DashboardQueryResult>(
    FIND_DASHBOARD_BY_ID,
    { variables: { id: params.id }, skip: !params.id },
  );

  if (loading) {
    return <main style={{ padding: 32 }}>Loading dashboard...</main>;
  }

  if (error || !data?.dashboard) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Dashboard not found</h1>
        {error ? <pre>{error.message}</pre> : null}
        <Link href="/">Back to dashboards</Link>
      </main>
    );
  }

  const dashboard = data.dashboard;
  const widgets =
    dashboard.pageLayoutWidgets?.edges?.map((edge) => edge.node) ?? [];

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
          {widgets.map((widget) => {
            const columnSpan = widget.gridPosition?.columnSpan ?? 4;
            const rowSpan = widget.gridPosition?.rowSpan ?? 1;
            return (
              <div
                key={widget.id}
                style={{
                  gridColumn: `span ${columnSpan}`,
                  gridRow: `span ${rowSpan}`,
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: 6,
                  padding: 16,
                  minHeight: 240,
                }}
              >
                <h3 style={{ margin: '0 0 12px', fontSize: 14 }}>
                  {widget.title}
                </h3>
                <WidgetRenderer widget={widget} />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default DashboardViewPage;
