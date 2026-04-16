import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardChatMessageViews = (
  args: Omit<CreateStandardViewArgs<'chatMessage'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allChatMessages: createStandardViewFlatMetadata({
      ...args,
      objectName: 'chatMessage',
      context: {
        viewName: 'allChatMessages',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
