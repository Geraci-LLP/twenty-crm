import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardDocumentSharingLinkViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'documentSharingLink'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allDocumentSharingLinksSlug: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentSharingLink',
      context: {
        viewName: 'allDocumentSharingLinks',
        viewFieldName: 'slug',
        fieldName: 'slug',
        position: 0,
        isVisible: true,
        size: 180,
      },
    }),
    allDocumentSharingLinksIsActive: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentSharingLink',
      context: {
        viewName: 'allDocumentSharingLinks',
        viewFieldName: 'isActive',
        fieldName: 'isActive',
        position: 1,
        isVisible: true,
        size: 100,
      },
    }),
    allDocumentSharingLinksRecipientEmail: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentSharingLink',
      context: {
        viewName: 'allDocumentSharingLinks',
        viewFieldName: 'recipientEmail',
        fieldName: 'recipientEmail',
        position: 2,
        isVisible: true,
        size: 200,
      },
    }),
    allDocumentSharingLinksViewCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentSharingLink',
      context: {
        viewName: 'allDocumentSharingLinks',
        viewFieldName: 'viewCount',
        fieldName: 'viewCount',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allDocumentSharingLinksCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'documentSharingLink',
      context: {
        viewName: 'allDocumentSharingLinks',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
