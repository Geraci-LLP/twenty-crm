import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type ChatConversationWorkspaceEntity } from 'src/modules/live-chat/standard-objects/chat-conversation.workspace-entity';

export enum SenderType {
  VISITOR = 'VISITOR',
  AGENT = 'AGENT',
  BOT = 'BOT',
}

export class ChatMessageWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  body: string;
  senderType: string;
  senderName: string | null;
  chatConversation: EntityRelation<ChatConversationWorkspaceEntity>;
}
