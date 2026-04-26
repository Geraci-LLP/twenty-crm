import { styled } from '@linaria/react';
import { useMemo } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { CampaignStats } from '@/campaign/components/CampaignStats';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

// Aggregates stats across every Email (campaign) record that belongs to a
// MarketingCampaign and renders them via the existing CampaignStats UI.
// Pure additive — uses the same Campaign fields (sentCount, openCount,
// clickCount, etc.) that the per-campaign stats card does, just summed.

type CampaignWithStats = ObjectRecord & {
  sentCount: number | null;
  openCount: number | null;
  clickCount: number | null;
  bounceCount: number | null;
  unsubscribeCount: number | null;
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledHint = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

type MarketingCampaignStatsProps = {
  marketingCampaignId: string;
};

export const MarketingCampaignStats = ({
  marketingCampaignId,
}: MarketingCampaignStatsProps) => {
  const { records, loading } = useFindManyRecords<CampaignWithStats>({
    objectNameSingular: 'campaign',
    filter: { marketingCampaignId: { eq: marketingCampaignId } },
    recordGqlFields: {
      id: true,
      sentCount: true,
      openCount: true,
      clickCount: true,
      bounceCount: true,
      unsubscribeCount: true,
    },
  });

  const aggregated = useMemo(() => {
    let sent = 0;
    let opened = 0;
    let clicked = 0;
    let bounced = 0;
    let unsubscribed = 0;
    for (const c of records) {
      sent += c.sentCount ?? 0;
      opened += c.openCount ?? 0;
      clicked += c.clickCount ?? 0;
      bounced += c.bounceCount ?? 0;
      unsubscribed += c.unsubscribeCount ?? 0;
    }
    return {
      sent,
      delivered: sent - bounced,
      opened,
      clicked,
      bounced,
      unsubscribed,
    };
  }, [records]);

  if (loading && records.length === 0) {
    return (
      <StyledContainer>
        <StyledHint>Loading campaigns…</StyledHint>
      </StyledContainer>
    );
  }

  if (records.length === 0) {
    return (
      <StyledContainer>
        <StyledHint>
          No campaigns linked to this marketing campaign yet. Create an Email
          and assign it to this MarketingCampaign to see rolled-up stats here.
        </StyledHint>
      </StyledContainer>
    );
  }

  return <CampaignStats stats={aggregated} />;
};
