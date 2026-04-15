import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardTrackedDocumentViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'trackedDocument'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allDocumentsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'trackedDocument',
      context: {
        viewName: 'allDocuments',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allDocumentsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'trackedDocument',
      context: {
        viewName: 'allDocuments',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allDocumentsViewCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'trackedDocument',
      context: {
        viewName: 'allDocuments',
        viewFieldName: 'viewCount',
        fieldName: 'viewCount',
        position: 2,
        isVisible: true,
        size: 120,
      },
    }),
    allDocumentsUniqueViewerCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'trackedDocument',
      context: {
        viewName: 'allDocuments',
        viewFieldName: 'uniqueViewerCount',
        fieldName: 'uniqueViewerCount',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allDocumentsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'trackedDocument',
      context: {
        viewName: 'allDocuments',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
