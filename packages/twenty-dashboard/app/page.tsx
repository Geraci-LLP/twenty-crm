'use client';

import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_DASHBOARD, FIND_DASHBOARDS } from '../lib/queries';
import { Dashboard } from '../lib/types';

type DashboardsQueryResult = {
  dashboards: {
    edges: { node: Dashboard }[];
  };
};

const HomePage = () => {
  const router = useRouter();
  const { data, loading, error } =
    useQuery<DashboardsQueryResult>(FIND_DASHBOARDS);
  const [createDashboard, { loading: creating }] = useMutation<{
    createDashboard: Dashboard;
  }>(CREATE_DASHBOARD);

  const handleCreate = async () => {
    const result = await createDashboard({
      variables: {
        data: { name: 'Untitled Dashboard' },
      },
    });
    const created = result.data?.createDashboard;
    if (created) {
      router.push(`/dashboard/${created.id}/edit`);
    }
  };

  if (loading) {
    return <main style={{ padding: 32 }}>Loading dashboards...</main>;
  }

  if (error) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Failed to load dashboards</h1>
        <pre>{error.message}</pre>
      </main>
    );
  }

  const dashboards = data?.dashboards.edges.map((edge) => edge.node) ?? [];

  return (
    <main style={{ padding: 32, maxWidth: 1080, margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>Dashboards</h1>
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{
            padding: '8px 16px',
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {creating ? 'Creating...' : '+ New Dashboard'}
        </button>
      </header>

      {dashboards.length === 0 ? (
        <p style={{ color: '#666' }}>
          No dashboards yet. Click &quot;+ New Dashboard&quot; to create one.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {dashboards.map((dashboard) => (
            <li
              key={dashboard.id}
              style={{
                padding: 16,
                marginBottom: 8,
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: 6,
                cursor: 'pointer',
              }}
              onClick={() => router.push(`/dashboard/${dashboard.id}`)}
            >
              <strong>{dashboard.name}</strong>
              {dashboard.description ? (
                <p style={{ margin: '4px 0 0', color: '#666' }}>
                  {dashboard.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default HomePage;
