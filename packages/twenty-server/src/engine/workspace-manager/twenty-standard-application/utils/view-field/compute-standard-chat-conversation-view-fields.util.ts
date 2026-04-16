import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardChatConversationViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'chatConversation'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allChatConversations view fields
    allChatConversationsVisitorName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatConversation',
      context: {
        viewName: 'allChatConversations',
        viewFieldName: 'visitorName',
        fieldName: 'visitorName',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allChatConversationsVisitorEmail: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatConversation',
      context: {
        viewName: 'allChatConversations',
        viewFieldName: 'visitorEmail',
        fieldName: 'visitorEmail',
        position: 1,
        isVisible: true,
        size: 200,
      },
    }),
    allChatConversationsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatConversation',
      context: {
        viewName: 'allChatConversations',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 2,
        isVisible: true,
        size: 150,
      },
    }),
    allChatConversationsMessageCount: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatConversation',
      context: {
        viewName: 'allChatConversations',
        viewFieldName: 'messageCount',
        fieldName: 'messageCount',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allChatConversationsLastMessageAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatConversation',
      context: {
        viewName: 'allChatConversations',
        viewFieldName: 'lastMessageAt',
        fieldName: 'lastMessageAt',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
