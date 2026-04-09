import { ViewType } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardCampaignRecipientViews = (
  args: Omit<CreateStandardViewArgs<'campaignRecipient'>, 'context'>,
): Record<string, FlatView> => {
  return {
    campaignRecipientRecordPageFields: createStandardViewFlatMetadata({
      ...args,
      objectName: 'campaignRecipient',
      context: {
        viewName: 'campaignRecipientRecordPageFields',
        name: 'Campaign Recipient Record Page Fields',
        type: ViewType.FIELDS_WIDGET,
        key: null,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
