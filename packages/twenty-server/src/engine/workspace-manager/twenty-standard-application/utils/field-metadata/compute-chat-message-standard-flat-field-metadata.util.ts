import { msg } from '@lingui/core/macro';
import {
  DateDisplayFormat,
  FieldMetadataType,
  RelationOnDeleteAction,
  RelationType,
} from 'twenty-shared/types';

import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectFieldName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-field-name.type';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import {
  type CreateStandardFieldArgs,
  createStandardFieldFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';
import { createStandardRelationFieldFlatMetadata } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-relation-field-flat-metadata.util';
import { getTsVectorColumnExpressionFromFields } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { SEARCH_FIELDS_FOR_CHAT_MESSAGE } from 'src/modules/live-chat/standard-objects/chat-message.workspace-entity';

export const buildChatMessageStandardFlatFieldMetadatas = ({
  now,
  objectName,
  workspaceId,
  standardObjectMetadataRelatedEntityIds,
  dependencyFlatEntityMaps,
  twentyStandardApplicationId,
}: Omit<
  CreateStandardFieldArgs<'chatMessage', FieldMetadataType>,
  'context'
>): Record<AllStandardObjectFieldName<'chatMessage'>, FlatFieldMetadata> => ({
  // Base fields
  id: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'id',
      type: FieldMetadataType.UUID,
      label: i18nLabel(msg`Id`),
      description: i18nLabel(msg`Id`),
      icon: 'Icon123',
      isSystem: true,
      isNullable: false,
      isUIReadOnly: true,
      defaultValue: 'uuid',
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  createdAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'createdAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(msg`Creation date`),
      description: i18nLabel(msg`Creation date`),
      icon: 'IconCalendar',
      isSystem: true,
      isNullable: false,
      isUIReadOnly: true,
      defaultValue: 'now',
      settings: {
        displayFormat: DateDisplayFormat.RELATIVE,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  updatedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'updatedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(msg`Last update`),
      description: i18nLabel(msg`Last time the record was changed`),
      icon: 'IconCalendarClock',
      isSystem: true,
      isNullable: false,
      isUIReadOnly: true,
      defaultValue: 'now',
      settings: {
        displayFormat: DateDisplayFormat.RELATIVE,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  deletedAt: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'deletedAt',
      type: FieldMetadataType.DATE_TIME,
      label: i18nLabel(msg`Deleted at`),
      description: i18nLabel(msg`Date when the record was deleted`),
      icon: 'IconCalendarMinus',
      isSystem: true,
      isNullable: true,
      isUIReadOnly: true,
      settings: {
        displayFormat: DateDisplayFormat.RELATIVE,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  // System fields
  position: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'position',
      type: FieldMetadataType.POSITION,
      label: i18nLabel(msg`Position`),
      description: i18nLabel(msg`Chat message record position`),
      icon: 'IconHierarchy2',
      isSystem: true,
      isNullable: false,
      defaultValue: 0,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  createdBy: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'createdBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(msg`Created by`),
      description: i18nLabel(msg`The creator of the record`),
      icon: 'IconCreativeCommonsSa',
      isSystem: true,
      isUIReadOnly: true,
      isNullable: false,
      defaultValue: {
        source: "'MANUAL'",
        name: "'System'",
        workspaceMemberId: null,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  updatedBy: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'updatedBy',
      type: FieldMetadataType.ACTOR,
      label: i18nLabel(msg`Updated by`),
      description: i18nLabel(
        msg`The workspace member who last updated the record`,
      ),
      icon: 'IconUserCircle',
      isSystem: true,
      isUIReadOnly: true,
      isNullable: false,
      defaultValue: {
        source: "'MANUAL'",
        name: "'System'",
        workspaceMemberId: null,
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  // ChatMessage-specific fields
  body: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'body',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg`Body`),
      description: i18nLabel(msg`The message content`),
      icon: 'IconMessage',
      isNullable: false,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  senderType: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'senderType',
      type: FieldMetadataType.SELECT,
      label: i18nLabel(msg`Sender Type`),
      description: i18nLabel(msg`Who sent this message`),
      icon: 'IconUserCircle',
      isNullable: false,
      options: [
        {
          id: '1b18f49d-d82d-41bb-9d6c-7c20fa536d75',
          value: 'VISITOR',
          label: i18nLabel(msg`Visitor`),
          position: 0,
          color: 'green',
        },
        {
          id: 'adbc5991-afe6-4a9f-88b1-79e21971559c',
          value: 'AGENT',
          label: i18nLabel(msg`Agent`),
          position: 1,
          color: 'blue',
        },
        {
          id: 'b7dad90c-de61-4f84-a3c4-b7f1a7302f8c',
          value: 'BOT',
          label: i18nLabel(msg`Bot`),
          position: 2,
          color: 'purple',
        },
      ],
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
  senderName: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'senderName',
      type: FieldMetadataType.TEXT,
      label: i18nLabel(msg`Sender Name`),
      description: i18nLabel(msg`Display name of the message sender`),
      icon: 'IconUser',
      isNullable: true,
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  searchVector: createStandardFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      fieldName: 'searchVector',
      type: FieldMetadataType.TS_VECTOR,
      label: i18nLabel(msg`Search vector`),
      description: i18nLabel(msg`Field used for full-text search`),
      icon: 'IconUser',
      isSystem: true,
      isNullable: true,
      settings: {
        generatedType: 'STORED',
        asExpression: getTsVectorColumnExpressionFromFields(
          SEARCH_FIELDS_FOR_CHAT_MESSAGE,
        ),
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),

  // Relation fields
  chatConversation: createStandardRelationFieldFlatMetadata({
    objectName,
    workspaceId,
    context: {
      type: FieldMetadataType.RELATION,
      morphId: null,
      fieldName: 'chatConversation',
      label: i18nLabel(msg`Chat Conversation`),
      description: i18nLabel(msg`The conversation this message belongs to`),
      icon: 'IconMessages',
      isNullable: false,
      targetObjectName: 'chatConversation',
      targetFieldName: 'messages',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: RelationOnDeleteAction.CASCADE,
        joinColumnName: 'chatConversationId',
      },
    },
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    twentyStandardApplicationId,
    now,
  }),
});
