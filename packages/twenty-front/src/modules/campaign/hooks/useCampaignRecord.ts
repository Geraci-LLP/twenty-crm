import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { type CampaignEditorData } from '@/campaign/types/CampaignTypes';
import { useCallback } from 'react';
import { CoreObjectNameSingular } from 'twenty-shared/types';

type CampaignRecord = ObjectRecord & {
  name: string | null;
  status: string;
  subject: string | null;
  body: string | null;
  fromName: string | null;
  fromEmail: string | null;
};

export const useCampaignRecord = ({ campaignId }: { campaignId: string }) => {
  const { record, loading } = useFindOneRecord<CampaignRecord>({
    objectNameSingular: CoreObjectNameSingular.Campaign,
    objectRecordId: campaignId,
    recordGqlFields: {
      id: true,
      name: true,
      status: true,
      subject: true,
      body: true,
      fromName: true,
      fromEmail: true,
    },
  });

  const { updateOneRecord } = useUpdateOneRecord();

  const updateCampaignEditorData = useCallback(
    async (data: CampaignEditorData) => {
      await updateOneRecord({
        objectNameSingular: CoreObjectNameSingular.Campaign,
        idToUpdate: campaignId,
        updateOneRecordInput: {
          subject: data.subject,
          body: data.body,
          fromName: data.fromName,
          fromEmail: data.fromEmail,
        },
      });
    },
    [campaignId, updateOneRecord],
  );

  const editorData: CampaignEditorData | undefined = record
    ? {
        subject: record.subject ?? '',
        body: record.body ?? '',
        fromName: record.fromName ?? '',
        fromEmail: record.fromEmail ?? '',
      }
    : undefined;

  return {
    campaignRecord: record as CampaignRecord | undefined,
    editorData,
    loading,
    updateCampaignEditorData,
  };
};
