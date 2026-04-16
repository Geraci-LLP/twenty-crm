import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardSequenceEnrollmentViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'sequenceEnrollment'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allSequenceEnrollments view fields
    allSequenceEnrollmentsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequenceEnrollment',
      context: {
        viewName: 'allSequenceEnrollments',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 0,
        isVisible: true,
        size: 150,
      },
    }),
    allSequenceEnrollmentsCurrentStepIndex: createStandardViewFieldFlatMetadata(
      {
        ...args,
        objectName: 'sequenceEnrollment',
        context: {
          viewName: 'allSequenceEnrollments',
          viewFieldName: 'currentStepIndex',
          fieldName: 'currentStepIndex',
          position: 1,
          isVisible: true,
          size: 120,
        },
      },
    ),
    allSequenceEnrollmentsEnrolledAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequenceEnrollment',
      context: {
        viewName: 'allSequenceEnrollments',
        viewFieldName: 'enrolledAt',
        fieldName: 'enrolledAt',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allSequenceEnrollmentsCompletedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequenceEnrollment',
      context: {
        viewName: 'allSequenceEnrollments',
        viewFieldName: 'completedAt',
        fieldName: 'completedAt',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
    allSequenceEnrollmentsSequence: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequenceEnrollment',
      context: {
        viewName: 'allSequenceEnrollments',
        viewFieldName: 'sequence',
        fieldName: 'sequence',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
