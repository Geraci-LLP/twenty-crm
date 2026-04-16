import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardChatWidgetViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'chatWidget'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    // allChatWidgets view fields
    allChatWidgetsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatWidget',
      context: {
        viewName: 'allChatWidgets',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allChatWidgetsStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatWidget',
      context: {
        viewName: 'allChatWidgets',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allChatWidgetsGreetingMessage: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatWidget',
      context: {
        viewName: 'allChatWidgets',
        viewFieldName: 'greetingMessage',
        fieldName: 'greetingMessage',
        position: 2,
        isVisible: true,
        size: 200,
      },
    }),
    allChatWidgetsAutoResponseEnabled: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatWidget',
      context: {
        viewName: 'allChatWidgets',
        viewFieldName: 'autoResponseEnabled',
        fieldName: 'autoResponseEnabled',
        position: 3,
        isVisible: true,
        size: 120,
      },
    }),
    allChatWidgetsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'chatWidget',
      context: {
        viewName: 'allChatWidgets',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
