import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { LiveChatPublicController } from 'src/modules/live-chat/controllers/live-chat-public.controller';
import { ChatConversationService } from 'src/modules/live-chat/services/chat-conversation.service';
import { ChatMessageService } from 'src/modules/live-chat/services/chat-message.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  controllers: [LiveChatPublicController],
  providers: [ChatConversationService, ChatMessageService],
  exports: [],
})
export class LiveChatModule {}
