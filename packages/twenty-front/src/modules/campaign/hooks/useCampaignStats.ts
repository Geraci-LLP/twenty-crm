import { useMemo } from 'react';

import { type CampaignStatsData } from '@/campaign/types/CampaignTypes';

type CampaignRecord = {
  sentCount?: number;
  recipientCount?: number;
  openCount?: number;
  clickCount?: number;
  bounceCount?: number;
  unsubscribeCount?: number;
};

export const useCampaignStats = (
  campaign: CampaignRecord | null | undefined,
): CampaignStatsData | null => {
  return useMemo(() => {
    if (!campaign) {
      return null;
    }

    return {
      sent: campaign.sentCount ?? 0,
      delivered: (campaign.sentCount ?? 0) - (campaign.bounceCount ?? 0),
      opened: campaign.openCount ?? 0,
      clicked: campaign.clickCount ?? 0,
      bounced: campaign.bounceCount ?? 0,
      unsubscribed: campaign.unsubscribeCount ?? 0,
    };
  }, [campaign]);
};
