import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type ChatConversationWorkspaceEntity } from 'src/modules/live-chat/standard-objects/chat-conversation.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_CHAT_WIDGET: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum ChatWidgetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum WidgetPosition {
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
}

export class ChatWidgetWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  name: string;
  status: string;
  greetingMessage: string | null;
  offlineMessage: string | null;
  accentColor: string | null;
  widgetPosition: string;
  businessHoursConfig: object | null;
  autoResponseEnabled: boolean;
  autoResponseDelay: number;
  autoResponseMessage: string | null;
  conversations: EntityRelation<ChatConversationWorkspaceEntity[]>;
  searchVector: string;
}
