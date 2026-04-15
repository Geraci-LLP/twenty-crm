import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardFormSubmissionViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'formSubmission'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allFormSubmissionsSubmitterEmail: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'formSubmission',
      context: {
        viewName: 'allFormSubmissions',
        viewFieldName: 'submitterEmail',
        fieldName: 'submitterEmail',
        position: 0,
        isVisible: true,
        size: 200,
      },
    }),
    allFormSubmissionsSubmitterName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'formSubmission',
      context: {
        viewName: 'allFormSubmissions',
        viewFieldName: 'submitterName',
        fieldName: 'submitterName',
        position: 1,
        isVisible: true,
        size: 180,
      },
    }),
    allFormSubmissionsSource: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'formSubmission',
      context: {
        viewName: 'allFormSubmissions',
        viewFieldName: 'source',
        fieldName: 'source',
        position: 2,
        isVisible: true,
        size: 120,
      },
    }),
    allFormSubmissionsForm: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'formSubmission',
      context: {
        viewName: 'allFormSubmissions',
        viewFieldName: 'form',
        fieldName: 'form',
        position: 3,
        isVisible: true,
        size: 180,
      },
    }),
    allFormSubmissionsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'formSubmission',
      context: {
        viewName: 'allFormSubmissions',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
