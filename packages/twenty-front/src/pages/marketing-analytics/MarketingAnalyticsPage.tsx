import { styled } from '@linaria/react';
import { useMemo } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

// Workspace-wide marketing analytics. Surfaces:
//   - Top stats: total emails sent / delivered / opened / clicked across
//     every Email (campaign) record in the workspace.
//   - MarketingCampaign breakdown: per-campaign rolled-up counts so the
//     user can spot the best/worst performers at a glance.
//
// All data comes from existing record fields — no new GraphQL needed.
// We fetch every campaign and group client-side by marketingCampaignId,
// which is fine at the typical workspace scale (hundreds of campaigns,
// not millions). If a workspace needs higher-scale analytics, a server
// aggregation resolver would be a follow-up.

const PAGE_SIZE = 200;

type MarketingCampaignRecord = ObjectRecord & {
  name: string | null;
  status: string | null;
};

type CampaignRecord = ObjectRecord & {
  name: string | null;
  marketingCampaignId: string | null;
  additionalMarketingCampaignIds: string[] | null;
  sentCount: number | null;
  openCount: number | null;
  clickCount: number | null;
  bounceCount: number | null;
  unsubscribeCount: number | null;
};

type MarketingCampaignRow = {
  id: string;
  name: string;
  status: string;
  emailCount: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  openRate: string;
  clickRate: string;
};

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
  padding: ${themeCssVariables.spacing[6]};
  width: 100%;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledTitle = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xxl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledHint = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledSectionTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledTopStatsGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(4, 1fr);
`;

const StyledTopStatCard = styled.div`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledStatLabel = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  text-transform: uppercase;
`;

const StyledStatValue = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xxl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledStatRate = styled.span`
  color: ${themeCssVariables.color.blue};
  font-size: ${themeCssVariables.font.size.xxl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledTable = styled.table`
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-collapse: collapse;
  width: 100%;
`;

const StyledTh = styled.th`
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: left;
  text-transform: uppercase;
`;

const StyledTd = styled.td`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledLink = styled.a`
  color: ${themeCssVariables.color.blue};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledEmpty = styled.div`
  background: ${themeCssVariables.background.secondary};
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  padding: ${themeCssVariables.spacing[6]} ${themeCssVariables.spacing[4]};
  text-align: center;
`;

const computeRate = (numerator: number, denominator: number): string => {
  if (denominator === 0) return '0.0';
  return ((numerator / denominator) * 100).toFixed(1);
};

export const MarketingAnalyticsPage = () => {
  const { records: marketingCampaigns, loading: mcLoading } =
    useFindManyRecords<MarketingCampaignRecord>({
      objectNameSingular: 'marketingCampaign',
      limit: PAGE_SIZE,
      recordGqlFields: { id: true, name: true, status: true },
    });

  const { records: campaigns, loading: campaignsLoading } =
    useFindManyRecords<CampaignRecord>({
      objectNameSingular: 'campaign',
      limit: PAGE_SIZE,
      recordGqlFields: {
        id: true,
        name: true,
        marketingCampaignId: true,
        additionalMarketingCampaignIds: true,
        sentCount: true,
        openCount: true,
        clickCount: true,
        bounceCount: true,
        unsubscribeCount: true,
      },
    });

  const totals = useMemo(() => {
    let sent = 0;
    let opened = 0;
    let clicked = 0;
    let bounced = 0;
    for (const c of campaigns) {
      sent += c.sentCount ?? 0;
      opened += c.openCount ?? 0;
      clicked += c.clickCount ?? 0;
      bounced += c.bounceCount ?? 0;
    }
    const delivered = sent - bounced;
    return {
      sent,
      delivered,
      opened,
      clicked,
      openRate: computeRate(opened, delivered),
      clickRate: computeRate(clicked, delivered),
    };
  }, [campaigns]);

  const rows = useMemo<MarketingCampaignRow[]>(() => {
    // A campaign can belong to MULTIPLE marketing campaigns now (PR 38):
    //   - primary marketingCampaignId FK (single, original m2o)
    //   - additionalMarketingCampaignIds string[] (many)
    // Group the campaign under every MC id it links to. Rolled-up totals
    // can therefore double-count a single email across MCs by design —
    // that's the point of cross-campaign membership.
    const byMcId = new Map<string, CampaignRecord[]>();
    for (const c of campaigns) {
      const allMcIds = new Set<string>();
      if (c.marketingCampaignId !== null) allMcIds.add(c.marketingCampaignId);
      for (const id of c.additionalMarketingCampaignIds ?? []) {
        allMcIds.add(id);
      }
      for (const mcId of allMcIds) {
        const list = byMcId.get(mcId) ?? [];
        list.push(c);
        byMcId.set(mcId, list);
      }
    }
    return marketingCampaigns
      .map<MarketingCampaignRow>((mc) => {
        const list = byMcId.get(mc.id) ?? [];
        let sent = 0;
        let opened = 0;
        let clicked = 0;
        let bounced = 0;
        for (const c of list) {
          sent += c.sentCount ?? 0;
          opened += c.openCount ?? 0;
          clicked += c.clickCount ?? 0;
          bounced += c.bounceCount ?? 0;
        }
        const delivered = sent - bounced;
        return {
          id: mc.id,
          name: mc.name ?? '(untitled)',
          status: mc.status ?? 'DRAFT',
          emailCount: list.length,
          sent,
          delivered,
          opened,
          clicked,
          openRate: computeRate(opened, delivered),
          clickRate: computeRate(clicked, delivered),
        };
      })
      .sort((a, b) => b.sent - a.sent);
  }, [campaigns, marketingCampaigns]);

  const isLoading = mcLoading || campaignsLoading;

  return (
    <StyledPage>
      <StyledHeader>
        <StyledTitle>Marketing analytics</StyledTitle>
        <StyledHint>
          Workspace-wide rollups across every marketing campaign and email.
        </StyledHint>
      </StyledHeader>

      <StyledSection>
        <StyledSectionTitle>Workspace totals</StyledSectionTitle>
        <StyledTopStatsGrid>
          <StyledTopStatCard>
            <StyledStatLabel>Sent</StyledStatLabel>
            <StyledStatValue>{totals.sent.toLocaleString()}</StyledStatValue>
          </StyledTopStatCard>
          <StyledTopStatCard>
            <StyledStatLabel>Delivered</StyledStatLabel>
            <StyledStatValue>
              {totals.delivered.toLocaleString()}
            </StyledStatValue>
          </StyledTopStatCard>
          <StyledTopStatCard>
            <StyledStatLabel>Open rate</StyledStatLabel>
            <StyledStatRate>{totals.openRate}%</StyledStatRate>
          </StyledTopStatCard>
          <StyledTopStatCard>
            <StyledStatLabel>Click rate</StyledStatLabel>
            <StyledStatRate>{totals.clickRate}%</StyledStatRate>
          </StyledTopStatCard>
        </StyledTopStatsGrid>
      </StyledSection>

      <StyledSection>
        <StyledSectionTitle>By marketing campaign</StyledSectionTitle>
        {isLoading && rows.length === 0 ? (
          <StyledEmpty>Loading…</StyledEmpty>
        ) : rows.length === 0 ? (
          <StyledEmpty>
            No marketing campaigns yet. Create one and link your emails to see
            rollups here.
          </StyledEmpty>
        ) : (
          <StyledTable>
            <thead>
              <tr>
                <StyledTh>Name</StyledTh>
                <StyledTh>Status</StyledTh>
                <StyledTh>Emails</StyledTh>
                <StyledTh>Sent</StyledTh>
                <StyledTh>Delivered</StyledTh>
                <StyledTh>Opened</StyledTh>
                <StyledTh>Clicked</StyledTh>
                <StyledTh>Open rate</StyledTh>
                <StyledTh>Click rate</StyledTh>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <StyledTd>
                    <StyledLink
                      href={`/object/marketingCampaign/${row.id}`}
                      title="Open marketing campaign"
                    >
                      {row.name}
                    </StyledLink>
                  </StyledTd>
                  <StyledTd>{row.status}</StyledTd>
                  <StyledTd>{row.emailCount}</StyledTd>
                  <StyledTd>{row.sent.toLocaleString()}</StyledTd>
                  <StyledTd>{row.delivered.toLocaleString()}</StyledTd>
                  <StyledTd>{row.opened.toLocaleString()}</StyledTd>
                  <StyledTd>{row.clicked.toLocaleString()}</StyledTd>
                  <StyledTd>{row.openRate}%</StyledTd>
                  <StyledTd>{row.clickRate}%</StyledTd>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        )}
      </StyledSection>
    </StyledPage>
  );
};
