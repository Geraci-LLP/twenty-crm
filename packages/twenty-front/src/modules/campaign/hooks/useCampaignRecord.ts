import { useCallback } from 'react';

import { CoreObjectNameSingular } from 'twenty-shared/types';

import { type CampaignEditorData } from '@/campaign/types/CampaignTypes';
import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

type CampaignRecord = ObjectRecord & {
  name: string | null;
  status: string;
  subject: string | null;
  bodyHtml: string | null;
  fromName: string | null;
  fromEmail: string | null;
  designJson: unknown | null;
  designVersion: number | null;
  previewText: string | null;
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
      bodyHtml: true,
      fromName: true,
      fromEmail: true,
      designJson: true,
      designVersion: true,
      previewText: true,
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
          bodyHtml: data.body,
          fromName: data.fromName,
          fromEmail: data.fromEmail,
          designJson: data.designJson,
          designVersion: data.designVersion,
          previewText: data.previewText,
        },
      });
    },
    [campaignId, updateOneRecord],
  );

  const editorData: CampaignEditorData | undefined = record
    ? {
        subject: record.subject ?? '',
        body: record.bodyHtml ?? '',
        fromName: record.fromName ?? '',
        fromEmail: record.fromEmail ?? '',
        designJson: record.designJson ?? null,
        designVersion: record.designVersion ?? null,
        previewText: record.previewText ?? '',
      }
    : undefined;

  return {
    campaignRecord: record as CampaignRecord | undefined,
    editorData,
    loading,
    updateCampaignEditorData,
  };
};
