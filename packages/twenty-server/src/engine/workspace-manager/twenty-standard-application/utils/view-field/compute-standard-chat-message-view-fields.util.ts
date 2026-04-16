import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardChatMessageViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'chatMessage'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allChatMessages view fields
    allChatMessagesSenderName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatMessage',
      context: {
        viewName: 'allChatMessages',
        viewFieldName: 'senderName',
        fieldName: 'senderName',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allChatMessagesSenderType: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatMessage',
      context: {
        viewName: 'allChatMessages',
        viewFieldName: 'senderType',
        fieldName: 'senderType',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allChatMessagesBody: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatMessage',
      context: {
        viewName: 'allChatMessages',
        viewFieldName: 'body',
        fieldName: 'body',
        position: 2,
        isVisible: true,
        size: 300,
      },
    }),
    allChatMessagesCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatMessage',
      context: {
        viewName: 'allChatMessages',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
