import { CampaignEditor } from '@/campaign/components/CampaignEditor';
import { useCampaignRecord } from '@/campaign/hooks/useCampaignRecord';
import { useTargetRecord } from '@/ui/layout/contexts/useTargetRecord';
import { isDefined } from 'twenty-shared/utils';

export const CampaignEditorWidget = () => {
  const targetRecord = useTargetRecord();

  const { campaignRecord, editorData, loading, updateCampaignEditorData } =
    useCampaignRecord({
      campaignId: targetRecord.id,
    });

  if (loading || !isDefined(editorData) || !isDefined(campaignRecord)) {
    return null;
  }

  // Allow editing only while the campaign is in draft state
  const isReadOnly = campaignRecord.status !== 'DRAFT';

  return (
    <CampaignEditor
      campaignId={targetRecord.id}
      value={editorData}
      onChange={updateCampaignEditorData}
      readOnly={isReadOnly}
    />
  );
};
