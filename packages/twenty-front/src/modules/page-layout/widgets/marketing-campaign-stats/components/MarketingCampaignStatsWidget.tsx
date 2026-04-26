import { MarketingCampaignStats } from '@/campaign/components/MarketingCampaignStats';
import { useTargetRecord } from '@/ui/layout/contexts/useTargetRecord';

// Page-layout widget wrapper that pulls the current MarketingCampaign id
// from the target-record context (same pattern as CampaignEditorWidget /
// SequenceCadenceWidget). Surfaces aggregated stats across every Email
// (campaign) record linked via marketingCampaignId.
export const MarketingCampaignStatsWidget = () => {
  const targetRecord = useTargetRecord();
  return <MarketingCampaignStats marketingCampaignId={targetRecord.id} />;
};
