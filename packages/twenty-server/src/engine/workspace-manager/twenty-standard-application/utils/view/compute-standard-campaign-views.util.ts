import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';

import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardCampaignViews = (
  args: Omit<CreateStandardViewArgs<'campaign'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allCampaigns: createStandardViewFlatMetadata({
      ...args,
      objectName: 'campaign',
      context: {
        viewName: 'allCampaigns',
        name: 'All {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
