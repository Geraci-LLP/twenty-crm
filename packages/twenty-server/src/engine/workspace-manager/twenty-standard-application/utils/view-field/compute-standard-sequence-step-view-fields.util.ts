import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardSequenceStepViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'sequenceStep'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allSequenceSteps view fields
    allSequenceStepsStepOrder: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequenceStep',
      context: {
        viewName: 'allSequenceSteps',
        viewFieldName: 'stepOrder',
        fieldName: 'stepOrder',
        position: 0,
        isVisible: true,
        size: 120,
      },
    }),
    allSequenceStepsType: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequenceStep',
      context: {
        viewName: 'allSequenceSteps',
        viewFieldName: 'type',
        fieldName: 'type',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allSequenceStepsDelayDays: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequenceStep',
      context: {
        viewName: 'allSequenceSteps',
        viewFieldName: 'delayDays',
        fieldName: 'delayDays',
        position: 2,
        isVisible: true,
        size: 120,
      },
    }),
    allSequenceStepsSubject: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequenceStep',
      context: {
        viewName: 'allSequenceSteps',
        viewFieldName: 'subject',
        fieldName: 'subject',
        position: 3,
        isVisible: true,
        size: 210,
      },
    }),
    allSequenceStepsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'sequenceStep',
      context: {
        viewName: 'allSequenceSteps',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
