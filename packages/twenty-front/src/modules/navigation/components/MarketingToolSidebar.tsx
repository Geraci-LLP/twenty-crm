import { styled } from '@linaria/react';
import { Link, useLocation } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

// Contextual second-column sidebar for marketing routes. Mirrors the
// design mock's ToolSidebar but drops the "filter views" idea (Twenty's
// RecordIndexPage doesn't read query-string filters; wiring through
// view-state would be a separate piece of work). Instead the sidebar
// surfaces a live list of the 5 most-recent records in the current
// section so the user can jump back to whatever they were last working
// on without scrolling through the full index.
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
  showPath: string;
};

const getConfigForPath = (pathname: string): SectionConfig | null => {
  if (pathname.startsWith('/objects/campaigns')) {
    return {
      title: 'Email Campaigns',
      subtitle: 'One-off and scheduled marketing emails',
      objectNameSingular: 'campaign',
      showPath: '/object/campaign',
    };
  }
  if (pathname.startsWith('/objects/marketingCampaigns')) {
    return {
      title: 'Marketing Campaigns',
      subtitle: 'Campaign-level groupings',
      objectNameSingular: 'marketingCampaign',
      showPath: '/object/marketingCampaign',
    };
  }
  if (pathname.startsWith('/objects/sequences')) {
    return {
      title: 'Sequences',
      subtitle: 'Multi-step automated cadences',
      objectNameSingular: 'sequence',
      showPath: '/object/sequence',
    };
  }
  if (pathname.startsWith('/objects/forms')) {
    return {
      title: 'Forms',
      subtitle: 'Lead-capture forms and embeds',
      objectNameSingular: 'form',
      showPath: '/object/form',
    };
  }
  if (pathname.startsWith('/marketing/analytics')) {
    return {
      title: 'Analytics',
      subtitle: 'Marketing performance',
      objectNameSingular: 'campaign',
      showPath: '/object/campaign',
    };
  }
  return null;
};

const StyledSidebar = styled.aside`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-width: 0;
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

const StyledItem = styled(Link)`
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  gap: 10px;
  padding: 7px 10px;
  text-align: left;
  text-decoration: none;
  width: 100%;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledItemLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledEmpty = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 12px;
  padding: 6px 10px;
`;

export const MarketingToolSidebar = () => {
  const location = useLocation();

  const config = getConfigForPath(location.pathname);

  // Always call the hook (rules of hooks) but skip the network when
  // there's no config to drive it.
  const { records, loading } = useFindManyRecords<RecentRecord>({
    objectNameSingular: config?.objectNameSingular ?? 'campaign',
    limit: 5,
    orderBy: [{ createdAt: 'DescNullsLast' }],
    recordGqlFields: { id: true, name: true },
    skip: !config,
  });

  if (!config) return null;

  // Twenty's record list path is /objects/<plural> — the Form/Sequence/
  // Campaign route names are pluralized as +s. MarketingCampaigns uses
  // the same simple +s rule. If a section ever needs an irregular
  // plural we'd extend the SectionConfig with an explicit indexPath.
  const indexPath = `/objects/${config.objectNameSingular}s`;

  return (
    <StyledSidebar>
      <StyledHeader>
        <StyledTitle>{config.title}</StyledTitle>
        <StyledSubtitle>{config.subtitle}</StyledSubtitle>
      </StyledHeader>
      <StyledSection>
        <StyledSectionLabel>Section</StyledSectionLabel>
        <StyledItem to={indexPath}>
          <StyledItemLabel>All {config.title.toLowerCase()}</StyledItemLabel>
        </StyledItem>
      </StyledSection>
      <StyledSection>
        <StyledSectionLabel>Recent</StyledSectionLabel>
        {loading && records.length === 0 ? (
          <StyledEmpty>Loading…</StyledEmpty>
        ) : records.length === 0 ? (
          <StyledEmpty>No records yet</StyledEmpty>
        ) : (
          records.map((record) => (
            <StyledItem
              key={record.id}
              to={`${config.showPath}/${record.id}`}
              title={record.name ?? '(unnamed)'}
            >
              <StyledItemLabel>{record.name ?? '(unnamed)'}</StyledItemLabel>
            </StyledItem>
          ))
        )}
      </StyledSection>
    </StyledSidebar>
  );
};
