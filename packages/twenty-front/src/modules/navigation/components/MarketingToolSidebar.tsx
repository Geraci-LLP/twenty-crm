import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { viewsByObjectMetadataIdFamilySelector } from '@/views/states/selectors/viewsByObjectMetadataIdFamilySelector';

// Contextual second-column sidebar for marketing routes. Layout:
//   - Title + subtitle
//   - "+ New" button → section's index page (Twenty's existing create
//     UI is on the index page; we don't try to spawn the side panel
//     directly because that integration is heavier than it should be
//     for this PR)
//   - Views: saved views for the section's object, navigates with
//     ?viewId=<uuid> which Twenty's RecordIndexPage already reads
//   - Pinned: localStorage-backed favorites, persists across sessions
//   - Recent: top 5 most-recent records, click to open, star to pin
//
// Self-detects the current route via useLocation. Returns null for
// non-marketing routes — DefaultLayout renders it unconditionally
// but pays nothing on routes that don't need it.

type RecentRecord = ObjectRecord & {
  name?: string | null;
};

type SectionConfig = {
  title: string;
  subtitle: string;
  objectNameSingular: string;
  objectNamePlural: string;
  showPath: string;
};

// All marketing surfaces, indexed by both their list route prefix AND
// their show route prefix. So when the user is viewing a specific
// campaign at /object/campaign/<id>, the sidebar still shows the
// Email Campaigns context (pinned, recent, views) instead of
// disappearing.
const SECTION_CONFIGS: SectionConfig[] = [
  {
    title: 'Email Campaigns',
    subtitle: 'One-off and scheduled marketing emails',
    objectNameSingular: 'campaign',
    objectNamePlural: 'campaigns',
    showPath: '/object/campaign',
  },
  {
    title: 'Marketing Campaigns',
    subtitle: 'Campaign-level groupings',
    objectNameSingular: 'marketingCampaign',
    objectNamePlural: 'marketingCampaigns',
    showPath: '/object/marketingCampaign',
  },
  {
    title: 'Sequences',
    subtitle: 'Multi-step automated cadences',
    objectNameSingular: 'sequence',
    objectNamePlural: 'sequences',
    showPath: '/object/sequence',
  },
  {
    title: 'Forms',
    subtitle: 'Lead-capture forms and embeds',
    objectNameSingular: 'form',
    objectNamePlural: 'forms',
    showPath: '/object/form',
  },
];

const getConfigForPath = (pathname: string): SectionConfig | null => {
  // Record-list routes: /objects/<plural>
  for (const cfg of SECTION_CONFIGS) {
    if (pathname.startsWith(`/objects/${cfg.objectNamePlural}`)) return cfg;
  }
  // Record-show routes: /object/<singular>/<id>
  for (const cfg of SECTION_CONFIGS) {
    if (pathname.startsWith(`${cfg.showPath}/`)) return cfg;
  }
  // Marketing analytics page — uses Email Campaigns as the context so
  // pinned/recent emails are still one click away.
  if (pathname.startsWith('/marketing/analytics')) {
    return {
      title: 'Analytics',
      subtitle: 'Marketing performance',
      objectNameSingular: 'campaign',
      objectNamePlural: 'campaigns',
      showPath: '/object/campaign',
    };
  }
  return null;
};

// Extract the record id from a /object/<singular>/<id>[/<rest>] URL.
// Returns null if the current path isn't a show-page route for the
// given section.
const getCurrentRecordId = (
  pathname: string,
  showPath: string,
): string | null => {
  if (!pathname.startsWith(`${showPath}/`)) return null;
  const after = pathname.slice(showPath.length + 1);
  const id = after.split('/')[0];
  return id !== '' ? id : null;
};

// Pinned records are localStorage-only — no server roundtrip. Keyed by
// objectNameSingular so a user's pinned campaigns don't bleed into their
// pinned sequences.
const PINNED_STORAGE_KEY = 'twenty.marketingSidebar.pinned';

type PinnedMap = Record<string, string[]>;

const readPinned = (): PinnedMap => {
  try {
    const raw = window.localStorage.getItem(PINNED_STORAGE_KEY);
    if (raw === null || raw === '') return {};
    const parsed = JSON.parse(raw) as PinnedMap;
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
};

const writePinned = (next: PinnedMap): void => {
  try {
    window.localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / disabled storage
  }
};

const StyledSidebar = styled.aside`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-width: 0;
  overflow-y: auto;
  width: 240px;
`;

const StyledHeader = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px 14px;
`;

const StyledTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 16px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: -0.01em;
`;

const StyledSubtitle = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 12px;
`;

const StyledNewButtonRow = styled.div`
  padding: 12px 12px 4px;
`;

/* oxlint-disable-next-line twenty/no-hardcoded-colors */
const StyledNewButton = styled(Link)`
  align-items: center;
  background: ${themeCssVariables.color.orange};
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: #ffffff;
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: 6px;
  justify-content: center;
  padding: 8px 12px;
  text-decoration: none;
  width: 100%;
  &:hover {
    filter: brightness(0.95);
  }
`;

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 12px 12px 4px;
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 11px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.06em;
  padding: 6px 8px;
  text-transform: uppercase;
`;

const StyledItemRow = styled.div<{ active?: boolean }>`
  align-items: center;
  background: ${(p) =>
    p.active === true
      ? themeCssVariables.background.transparent.lighter
      : 'transparent'};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledItemLink = styled(Link)`
  align-items: center;
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  flex: 1;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  gap: 10px;
  min-width: 0;
  padding: 7px 10px;
  text-align: left;
  text-decoration: none;
`;

const StyledItemLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledPinButton = styled.button<{ pinned: boolean }>`
  background: transparent;
  border: 0;
  color: ${(p) =>
    p.pinned
      ? themeCssVariables.color.orange
      : themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  &:hover {
    color: ${themeCssVariables.color.orange};
  }
`;

const StyledEmpty = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 12px;
  padding: 6px 10px;
`;

export const MarketingToolSidebar = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const config = getConfigForPath(location.pathname);

  // Object metadata — needed to resolve the views family selector. The
  // hook works even when called with a missing/invalid name (it returns
  // a stub), so we always call it, then guard usage.
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular: config?.objectNameSingular ?? 'campaign',
  });

  const viewsByObjectMetadataIdFamily = useAtomFamilySelectorValue(
    viewsByObjectMetadataIdFamilySelector,
    objectMetadataItem.id,
  );
  const views = viewsByObjectMetadataIdFamily;

  // Recent records — top 5 by createdAt desc.
  const { records: recentRecords, loading: recentLoading } =
    useFindManyRecords<RecentRecord>({
      objectNameSingular: config?.objectNameSingular ?? 'campaign',
      limit: 5,
      orderBy: [{ createdAt: 'DescNullsLast' }],
      recordGqlFields: { id: true, name: true },
      skip: !config,
    });

  // Pinned records — fetch by id once we know which ids are pinned for
  // the current section. Pin state is in localStorage; useState mirrors
  // it for re-render on toggle.
  const [pinnedMap, setPinnedMap] = useState<PinnedMap>(() => readPinned());
  const pinnedIds = config ? (pinnedMap[config.objectNameSingular] ?? []) : [];

  const { records: pinnedRecords } = useFindManyRecords<RecentRecord>({
    objectNameSingular: config?.objectNameSingular ?? 'campaign',
    limit: 25,
    filter:
      pinnedIds.length > 0
        ? { id: { in: pinnedIds } }
        : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !config || pinnedIds.length === 0,
  });

  // Re-read pinned map on focus + storage event so toggling in one tab
  // updates other tabs.
  useEffect(() => {
    const refresh = () => setPinnedMap(readPinned());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (!config) return null;

  const indexPath = `/objects/${config.objectNamePlural}`;
  const currentViewId = searchParams.get('viewId');
  const currentRecordId = getCurrentRecordId(
    location.pathname,
    config.showPath,
  );
  const isOnIndex =
    location.pathname.startsWith(`/objects/${config.objectNamePlural}`) &&
    !isDefined(currentViewId);
  const isPinned = (id: string): boolean => pinnedIds.includes(id);

  const togglePin = (id: string) => {
    const next = { ...pinnedMap };
    const list = next[config.objectNameSingular] ?? [];
    next[config.objectNameSingular] = list.includes(id)
      ? list.filter((x) => x !== id)
      : [...list, id];
    setPinnedMap(next);
    writePinned(next);
  };

  return (
    <StyledSidebar>
      <StyledHeader>
        <StyledTitle>{config.title}</StyledTitle>
        <StyledSubtitle>{config.subtitle}</StyledSubtitle>
      </StyledHeader>

      <StyledNewButtonRow>
        <StyledNewButton to={indexPath}>+ New</StyledNewButton>
      </StyledNewButtonRow>

      <StyledSection>
        <StyledSectionLabel>Section</StyledSectionLabel>
        <StyledItemRow active={isOnIndex}>
          <StyledItemLink to={indexPath}>
            <StyledItemLabel>All {config.title.toLowerCase()}</StyledItemLabel>
          </StyledItemLink>
        </StyledItemRow>
      </StyledSection>

      {views.length > 0 && (
        <StyledSection>
          <StyledSectionLabel>Views</StyledSectionLabel>
          {views.map((view) => (
            <StyledItemRow key={view.id} active={currentViewId === view.id}>
              <StyledItemLink to={`${indexPath}?viewId=${view.id}`}>
                <StyledItemLabel>{view.name}</StyledItemLabel>
              </StyledItemLink>
            </StyledItemRow>
          ))}
        </StyledSection>
      )}

      {pinnedIds.length > 0 && (
        <StyledSection>
          <StyledSectionLabel>Pinned</StyledSectionLabel>
          {pinnedRecords.length === 0 ? (
            <StyledEmpty>Loading…</StyledEmpty>
          ) : (
            pinnedRecords.map((record) => (
              <StyledItemRow
                key={record.id}
                active={currentRecordId === record.id}
              >
                <StyledItemLink
                  to={`${config.showPath}/${record.id}`}
                  title={record.name ?? '(unnamed)'}
                >
                  <StyledItemLabel>
                    {record.name ?? '(unnamed)'}
                  </StyledItemLabel>
                </StyledItemLink>
                <StyledPinButton
                  pinned={true}
                  onClick={() => togglePin(record.id)}
                  title="Unpin"
                  type="button"
                >
                  ★
                </StyledPinButton>
              </StyledItemRow>
            ))
          )}
        </StyledSection>
      )}

      <StyledSection>
        <StyledSectionLabel>Recent</StyledSectionLabel>
        {recentLoading && recentRecords.length === 0 ? (
          <StyledEmpty>Loading…</StyledEmpty>
        ) : recentRecords.length === 0 ? (
          <StyledEmpty>No records yet</StyledEmpty>
        ) : (
          recentRecords
            .filter((r) => !isPinned(r.id))
            .map((record) => (
              <StyledItemRow
                key={record.id}
                active={currentRecordId === record.id}
              >
                <StyledItemLink
                  to={`${config.showPath}/${record.id}`}
                  title={record.name ?? '(unnamed)'}
                >
                  <StyledItemLabel>
                    {record.name ?? '(unnamed)'}
                  </StyledItemLabel>
                </StyledItemLink>
                <StyledPinButton
                  pinned={false}
                  onClick={() => togglePin(record.id)}
                  title="Pin"
                  type="button"
                >
                  ☆
                </StyledPinButton>
              </StyledItemRow>
            ))
        )}
      </StyledSection>
    </StyledSidebar>
  );
};
