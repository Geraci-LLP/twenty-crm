import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type ChatWidgetWorkspaceEntity } from 'src/modules/live-chat/standard-objects/chat-widget.workspace-entity';
import { type ChatMessageWorkspaceEntity } from 'src/modules/live-chat/standard-objects/chat-message.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export enum ChatConversationStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  CLOSED = 'CLOSED',
}

export class ChatConversationWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  visitorName: string | null;
  visitorEmail: string | null;
  visitorSessionId: string | null;
  status: string;
  messageCount: number;
  lastMessageAt: Date | null;
  chatWidget: EntityRelation<ChatWidgetWorkspaceEntity>;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  messages: EntityRelation<ChatMessageWorkspaceEntity[]>;
}
