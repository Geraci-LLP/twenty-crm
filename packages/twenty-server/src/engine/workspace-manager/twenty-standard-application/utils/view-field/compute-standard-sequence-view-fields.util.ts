import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardSequenceViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'sequence'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allSequences view fields
    allSequencesName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequence',
      context: {
        viewName: 'allSequences',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allSequencesStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequence',
      context: {
        viewName: 'allSequences',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allSequencesStepCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequence',
      context: {
        viewName: 'allSequences',
        viewFieldName: 'stepCount',
        fieldName: 'stepCount',
        position: 2,
        isVisible: true,
        size: 120,
      },
    }),
    allSequencesEnrollmentCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequence',
      context: {
        viewName: 'allSequences',
        viewFieldName: 'enrollmentCount',
        fieldName: 'enrollmentCount',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allSequencesReplyRate: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequence',
      context: {
        viewName: 'allSequences',
        viewFieldName: 'replyRate',
        fieldName: 'replyRate',
        position: 4,
        isVisible: true,
        size: 120,
      },
    }),
    allSequencesCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequence',
      context: {
        viewName: 'allSequences',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
