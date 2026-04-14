import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardCampaignViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'campaign'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allCampaigns view fields
    allCampaignsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'campaign',
      context: {
        viewName: 'allCampaigns',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allCampaignsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'campaign',
      context: {
        viewName: 'allCampaigns',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allCampaignsSubject: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'campaign',
      context: {
        viewName: 'allCampaigns',
        viewFieldName: 'subject',
        fieldName: 'subject',
        position: 2,
        isVisible: true,
        size: 200,
      },
    }),
    allCampaignsRecipientCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'campaign',
      context: {
        viewName: 'allCampaigns',
        viewFieldName: 'recipientCount',
        fieldName: 'recipientCount',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allCampaignsSentCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'campaign',
      context: {
        viewName: 'allCampaigns',
        viewFieldName: 'sentCount',
        fieldName: 'sentCount',
        position: 4,
        isVisible: true,
        size: 120,
      },
    }),
    allCampaignsOpenCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'campaign',
      context: {
        viewName: 'allCampaigns',
        viewFieldName: 'openCount',
        fieldName: 'openCount',
        position: 5,
        isVisible: true,
        size: 120,
      },
    }),
    allCampaignsScheduledDate: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'campaign',
      context: {
        viewName: 'allCampaigns',
        viewFieldName: 'scheduledDate',
        fieldName: 'scheduledDate',
        position: 6,
        isVisible: true,
        size: 150,
      },
    }),
    allCampaignsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'campaign',
      context: {
        viewName: 'allCampaigns',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 7,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
