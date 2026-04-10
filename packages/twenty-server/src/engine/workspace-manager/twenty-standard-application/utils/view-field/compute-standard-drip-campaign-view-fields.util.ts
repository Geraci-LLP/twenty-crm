import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardDripCampaignViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'dripCampaign'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allDripCampaigns view fields
    allDripCampaignsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'dripCampaign',
      context: {
        viewName: 'allDripCampaigns',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allDripCampaignsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'dripCampaign',
      context: {
        viewName: 'allDripCampaigns',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allDripCampaignsEnrollmentCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'dripCampaign',
      context: {
        viewName: 'allDripCampaigns',
        viewFieldName: 'enrollmentCount',
        fieldName: 'enrollmentCount',
        position: 2,
        isVisible: true,
        size: 120,
      },
    }),
    allDripCampaignsActiveEnrollmentCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'dripCampaign',
      context: {
        viewName: 'allDripCampaigns',
        viewFieldName: 'activeEnrollmentCount',
        fieldName: 'activeEnrollmentCount',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allDripCampaignsCompletedCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'dripCampaign',
      context: {
        viewName: 'allDripCampaigns',
        viewFieldName: 'completedCount',
        fieldName: 'completedCount',
        position: 4,
        isVisible: true,
        size: 120,
      },
    }),
    allDripCampaignsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'dripCampaign',
      context: {
        viewName: 'allDripCampaigns',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
