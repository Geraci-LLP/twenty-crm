import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardFormViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'form'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allFormsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'form',
      context: {
        viewName: 'allForms',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allFormsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'form',
      context: {
        viewName: 'allForms',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allFormsDescription: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'form',
      context: {
        viewName: 'allForms',
        viewFieldName: 'description',
        fieldName: 'description',
        position: 2,
        isVisible: true,
        size: 200,
      },
    }),
    allFormsSubmissionCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'form',
      context: {
        viewName: 'allForms',
        viewFieldName: 'submissionCount',
        fieldName: 'submissionCount',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allFormsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'form',
      context: {
        viewName: 'allForms',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
