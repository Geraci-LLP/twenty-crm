import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardSequenceEnrollmentViews = (
  args: Omit<CreateStandardViewArgs<'sequenceEnrollment'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allSequenceEnrollments: createStandardViewFlatMetadata({
      ...args,
      objectName: 'sequenceEnrollment',
      context: {
        viewName: 'allSequenceEnrollments',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
