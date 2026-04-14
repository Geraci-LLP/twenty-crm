import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardDripEnrollmentViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'dripEnrollment'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    dripEnrollmentRecordPageFieldsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'dripEnrollment',
      context: {
        viewName: 'dripEnrollmentRecordPageFields',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 0,
        isVisible: true,
        size: 150,
      },
    }),
    dripEnrollmentRecordPageFieldsDripCampaign:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'dripEnrollment',
        context: {
          viewName: 'dripEnrollmentRecordPageFields',
          viewFieldName: 'dripCampaign',
          fieldName: 'dripCampaign',
          position: 1,
          isVisible: true,
          size: 210,
        },
      }),
    dripEnrollmentRecordPageFieldsEnrolledAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'dripEnrollment',
        context: {
          viewName: 'dripEnrollmentRecordPageFields',
          viewFieldName: 'enrolledAt',
          fieldName: 'enrolledAt',
          position: 2,
          isVisible: true,
          size: 150,
        },
      }),
  };
};
