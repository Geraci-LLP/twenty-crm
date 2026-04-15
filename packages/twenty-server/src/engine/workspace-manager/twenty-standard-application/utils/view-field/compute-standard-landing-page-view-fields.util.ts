import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardLandingPageViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'landingPage'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allLandingPagesTitle: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'landingPage',
      context: {
        viewName: 'allLandingPages',
        viewFieldName: 'title',
        fieldName: 'title',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allLandingPagesSlug: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'landingPage',
      context: {
        viewName: 'allLandingPages',
        viewFieldName: 'slug',
        fieldName: 'slug',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allLandingPagesStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'landingPage',
      context: {
        viewName: 'allLandingPages',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allLandingPagesViewCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'landingPage',
      context: {
        viewName: 'allLandingPages',
        viewFieldName: 'viewCount',
        fieldName: 'viewCount',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allLandingPagesCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'landingPage',
      context: {
        viewName: 'allLandingPages',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
