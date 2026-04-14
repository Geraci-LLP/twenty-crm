import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { CoreObjectNameSingular } from 'twenty-shared/types';

export type CampaignTemplateRecord = ObjectRecord & {
  name: string | null;
  subject: string | null;
  category: string;
  thumbnailUrl: string | null;
};

export const useFindCampaignTemplates = () => {
  const { records, loading } = useFindManyRecords<CampaignTemplateRecord>({
    objectNameSingular: CoreObjectNameSingular.CampaignTemplate,
    recordGqlFields: {
      id: true,
      name: true,
      subject: true,
      category: true,
      thumbnailUrl: true,
    },
  });

  return { templates: records as CampaignTemplateRecord[], loading };
};
