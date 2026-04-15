import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardDocumentViewViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'documentView'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allDocumentViewsViewerEmail: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentView',
      context: {
        viewName: 'allDocumentViews',
        viewFieldName: 'viewerEmail',
        fieldName: 'viewerEmail',
        position: 0,
        isVisible: true,
        size: 200,
      },
    }),
    allDocumentViewsViewerName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentView',
      context: {
        viewName: 'allDocumentViews',
        viewFieldName: 'viewerName',
        fieldName: 'viewerName',
        position: 1,
        isVisible: true,
        size: 180,
      },
    }),
    allDocumentViewsViewedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentView',
      context: {
        viewName: 'allDocumentViews',
        viewFieldName: 'viewedAt',
        fieldName: 'viewedAt',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allDocumentViewsDurationSeconds: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentView',
      context: {
        viewName: 'allDocumentViews',
        viewFieldName: 'durationSeconds',
        fieldName: 'durationSeconds',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allDocumentViewsCompletionPercent: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentView',
      context: {
        viewName: 'allDocumentViews',
        viewFieldName: 'completionPercent',
        fieldName: 'completionPercent',
        position: 4,
        isVisible: true,
        size: 120,
      },
    }),
  };
};
