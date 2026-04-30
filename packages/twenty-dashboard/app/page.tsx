'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { LayoutGrid, Plus, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '../components/LoadingScreen';
import { CREATE_DASHBOARD, FIND_DASHBOARDS } from '../lib/queries';
import { theme } from '../lib/theme';
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
        data: { title: 'Untitled Dashboard' },
      },
    });
    const created = result.data?.createDashboard;
    if (created) {
      router.push(`/dashboard/${created.id}/edit`);
    }
  };

  if (loading) {
    return <LoadingScreen label="Loading dashboards" />;
  }

  if (error) {
    return (
      <main
        style={{
          padding: theme.spacing.xxl,
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: theme.spacing.md,
            padding: theme.spacing.lg,
            background: theme.state.dangerBg,
            border: `1px solid ${theme.state.danger}`,
            borderRadius: theme.radius.md,
            color: theme.state.danger,
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div
              style={{
                fontWeight: theme.font.weightSemibold,
                marginBottom: theme.spacing.xs,
              }}
            >
              Failed to load dashboards
            </div>
            <pre
              style={{
                margin: 0,
                fontSize: theme.font.sizeSm,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {error.message}
            </pre>
          </div>
        </div>
      </main>
    );
  }

  const dashboards = data?.dashboards.edges.map((edge) => edge.node) ?? [];

  return (
    <main
      style={{
        padding: theme.spacing.xxl,
        maxWidth: 1080,
        margin: '0 auto',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.xl,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: theme.font.size2xl,
              fontWeight: theme.font.weightBold,
              letterSpacing: -0.4,
              color: theme.text.primary,
            }}
          >
            Dashboards
          </h1>
          <p
            style={{
              margin: `${theme.spacing.xs}px 0 0`,
              color: theme.text.secondary,
              fontSize: theme.font.sizeSm,
            }}
          >
            {dashboards.length === 0
              ? 'Build your first dashboard to start visualizing CRM data.'
              : `${dashboards.length} dashboard${dashboards.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
            background: creating ? theme.text.muted : theme.brand.primary,
            color: theme.text.inverse,
            border: 'none',
            borderRadius: theme.radius.md,
            fontSize: theme.font.sizeSm,
            fontWeight: theme.font.weightSemibold,
            boxShadow: creating ? 'none' : theme.shadow.sm,
            transition: 'background 0.12s ease',
          }}
        >
          <Plus size={16} />
          {creating ? 'Creating...' : 'New Dashboard'}
        </button>
      </header>

      {dashboards.length === 0 ? (
        <div
          style={{
            padding: theme.spacing.xxl * 1.5,
            background: theme.bg.surface,
            border: `1px dashed ${theme.border.default}`,
            borderRadius: theme.radius.lg,
            textAlign: 'center',
            color: theme.text.muted,
            fontSize: theme.font.sizeSm,
          }}
        >
          <LayoutGrid
            size={32}
            style={{ marginBottom: theme.spacing.md, opacity: 0.6 }}
          />
          <div>No dashboards yet.</div>
        </div>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: theme.spacing.md,
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {dashboards.map((dashboard) => (
            <DashboardCard
              key={dashboard.id}
              dashboard={dashboard}
              onClick={() => router.push(`/dashboard/${dashboard.id}`)}
            />
          ))}
        </ul>
      )}
    </main>
  );
};

const DashboardCard = ({
  dashboard,
  onClick,
}: {
  dashboard: Dashboard;
  onClick: () => void;
}) => {
  return (
    <li
      style={{
        padding: theme.spacing.lg,
        background: theme.bg.surface,
        border: `1px solid ${theme.border.default}`,
        borderRadius: theme.radius.md,
        cursor: 'pointer',
        boxShadow: theme.shadow.sm,
        transition: 'border-color 0.12s ease, box-shadow 0.12s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.brand.primary;
        e.currentTarget.style.boxShadow = theme.shadow.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.border.default;
        e.currentTarget.style.boxShadow = theme.shadow.sm;
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
          marginBottom: theme.spacing.sm,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: theme.radius.sm,
            background: theme.brand.primaryFaint,
            color: theme.brand.primary,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <LayoutGrid size={18} />
        </div>
        <strong
          style={{
            fontSize: theme.font.sizeMd,
            fontWeight: theme.font.weightSemibold,
            color: theme.text.primary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {dashboard.title ?? 'Untitled Dashboard'}
        </strong>
      </div>
    </li>
  );
};

export default HomePage;
