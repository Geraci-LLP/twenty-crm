import { styled } from '@linaria/react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';

// Contextual second-column sidebar for marketing routes. Mirrors the
// design mock's ToolSidebar: shows a section title + a list of saved
// views / filter shortcuts so the user can flip between "All / Active /
// Drafts / etc." in one click instead of opening the filter pill.
//
// The sidebar self-detects the current route via useLocation and
// returns null for non-marketing routes — DefaultLayout can render
// it unconditionally and pay nothing on routes that don't need it.

type SidebarItem = {
  id: string;
  label: string;
  search?: string;
  count?: string;
};

type SidebarConfig = {
  title: string;
  subtitle: string;
  items: SidebarItem[];
};

// Match the section by URL prefix. Anything matching maps to a config;
// anything else returns null and the sidebar doesn't render.
const getConfigForPath = (
  pathname: string,
): { route: string; config: SidebarConfig } | null => {
  if (pathname.startsWith('/objects/campaigns')) {
    return {
      route: '/objects/campaigns',
      config: {
        title: 'Email Campaigns',
        subtitle: 'One-off and scheduled marketing emails',
        items: [
          { id: 'all', label: 'All campaigns' },
          { id: 'draft', label: 'Drafts', search: 'status=DRAFT' },
          { id: 'scheduled', label: 'Scheduled', search: 'status=SCHEDULED' },
          { id: 'sending', label: 'Sending', search: 'status=SENDING' },
          { id: 'sent', label: 'Sent', search: 'status=SENT' },
          { id: 'paused', label: 'Paused', search: 'status=PAUSED' },
        ],
      },
    };
  }
  if (pathname.startsWith('/objects/marketingCampaigns')) {
    return {
      route: '/objects/marketingCampaigns',
      config: {
        title: 'Marketing Campaigns',
        subtitle: 'Campaign-level groupings',
        items: [
          { id: 'all', label: 'All marketing campaigns' },
          { id: 'active', label: 'Active', search: 'status=ACTIVE' },
          { id: 'draft', label: 'Drafts', search: 'status=DRAFT' },
          { id: 'completed', label: 'Completed', search: 'status=COMPLETED' },
          { id: 'archived', label: 'Archived', search: 'status=ARCHIVED' },
        ],
      },
    };
  }
  if (pathname.startsWith('/objects/sequences')) {
    return {
      route: '/objects/sequences',
      config: {
        title: 'Sequences',
        subtitle: 'Multi-step automated cadences',
        items: [
          { id: 'all', label: 'All sequences' },
          { id: 'active', label: 'Active', search: 'status=ACTIVE' },
          { id: 'paused', label: 'Paused', search: 'status=PAUSED' },
          { id: 'archived', label: 'Archived', search: 'status=ARCHIVED' },
        ],
      },
    };
  }
  if (pathname.startsWith('/objects/forms')) {
    return {
      route: '/objects/forms',
      config: {
        title: 'Forms',
        subtitle: 'Lead-capture forms and embeds',
        items: [
          { id: 'all', label: 'All forms' },
          { id: 'published', label: 'Published', search: 'status=PUBLISHED' },
          { id: 'draft', label: 'Drafts', search: 'status=DRAFT' },
          { id: 'archived', label: 'Archived', search: 'status=ARCHIVED' },
        ],
      },
    };
  }
  if (pathname.startsWith('/marketing/analytics')) {
    return {
      route: '/marketing/analytics',
      config: {
        title: 'Analytics',
        subtitle: 'Marketing performance',
        items: [
          { id: 'overview', label: 'Workspace overview' },
          { id: 'by-campaign', label: 'By marketing campaign' },
        ],
      },
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

const StyledItem = styled.button<{ active: boolean }>`
  align-items: center;
  background: ${(p) =>
    p.active
      ? themeCssVariables.background.transparent.lighter
      : 'transparent'};
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${(p) =>
    p.active
      ? themeCssVariables.color.orange
      : themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  font-weight: ${(p) =>
    p.active
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  gap: 10px;
  padding: 7px 10px;
  text-align: left;
  width: 100%;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

export const MarketingToolSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const match = getConfigForPath(location.pathname);
  if (!match) return null;
  const { route, config } = match;

  // Active item is the one whose `search` matches the current URL's
  // query string. The "all" item is active when there's no filter.
  const currentSearch = searchParams.toString();
  const activeId =
    config.items.find((it) => (it.search ?? '') === currentSearch)?.id ??
    (currentSearch === '' ? 'all' : null);

  const handleClick = (item: SidebarItem) => {
    const target = item.search ? `${route}?${item.search}` : route;
    navigate(target);
  };

  return (
    <StyledSidebar>
      <StyledHeader>
        <StyledTitle>{config.title}</StyledTitle>
        <StyledSubtitle>{config.subtitle}</StyledSubtitle>
      </StyledHeader>
      <StyledSection>
        <StyledSectionLabel>Views</StyledSectionLabel>
        {config.items.map((item) => (
          <StyledItem
            key={item.id}
            active={activeId === item.id}
            onClick={() => handleClick(item)}
            type="button"
          >
            {item.label}
          </StyledItem>
        ))}
      </StyledSection>
    </StyledSidebar>
  );
};
