import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isDefined } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type ChatWidgetWorkspaceEntity } from 'src/modules/live-chat/standard-objects/chat-widget.workspace-entity';
import { type ChatConversationWorkspaceEntity } from 'src/modules/live-chat/standard-objects/chat-conversation.workspace-entity';
import { type ChatMessageWorkspaceEntity } from 'src/modules/live-chat/standard-objects/chat-message.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { ChatConversationService } from 'src/modules/live-chat/services/chat-conversation.service';
import { ChatMessageService } from 'src/modules/live-chat/services/chat-message.service';

type StartConversationBody = {
  visitorName?: string;
  visitorEmail?: string;
  visitorSessionId: string;
};

type SendMessageBody = {
  conversationId: string;
  body: string;
  senderType: 'VISITOR' | 'AGENT';
  senderName?: string;
};

@Controller('chat')
export class LiveChatPublicController {
  private readonly logger = new Logger(LiveChatPublicController.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly chatConversationService: ChatConversationService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  @Get(':workspaceId/:widgetId/config')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getWidgetConfig(
    @Param('workspaceId') workspaceId: string,
    @Param('widgetId') widgetId: string,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const chatWidget =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const chatWidgetRepository =
            await this.globalWorkspaceOrmManager.getRepository<ChatWidgetWorkspaceEntity>(
              workspaceId,
              'chatWidget',
              { shouldBypassPermissionChecks: true },
            );

          return chatWidgetRepository.findOne({
            where: { id: widgetId },
          });
        },
        authContext,
      );

    if (!isDefined(chatWidget)) {
      throw new HttpException('Chat widget not found', HttpStatus.NOT_FOUND);
    }

    if (chatWidget.status !== 'ACTIVE') {
      throw new HttpException(
        'Chat widget is not active',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      name: chatWidget.name,
      greetingMessage: chatWidget.greetingMessage,
      offlineMessage: chatWidget.offlineMessage,
      accentColor: chatWidget.accentColor,
      widgetPosition: chatWidget.widgetPosition,
      autoResponseEnabled: chatWidget.autoResponseEnabled,
      autoResponseDelay: chatWidget.autoResponseDelay,
      autoResponseMessage: chatWidget.autoResponseMessage,
    };
  }

  @Post(':workspaceId/:widgetId/start')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async startConversation(
    @Param('workspaceId') workspaceId: string,
    @Param('widgetId') widgetId: string,
    @Body() body: StartConversationBody,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const chatWidgetRepository =
            await this.globalWorkspaceOrmManager.getRepository<ChatWidgetWorkspaceEntity>(
              workspaceId,
              'chatWidget',
              { shouldBypassPermissionChecks: true },
            );

          const chatWidget = await chatWidgetRepository.findOne({
            where: { id: widgetId },
          });

          if (!isDefined(chatWidget)) {
            throw new HttpException(
              'Chat widget not found',
              HttpStatus.NOT_FOUND,
            );
          }

          if (chatWidget.status !== 'ACTIVE') {
            throw new HttpException(
              'Chat widget is not active',
              HttpStatus.NOT_FOUND,
            );
          }

          const chatConversationRepository =
            await this.globalWorkspaceOrmManager.getRepository<ChatConversationWorkspaceEntity>(
              workspaceId,
              'chatConversation',
              { shouldBypassPermissionChecks: true },
            );

          // Auto-link person by email if provided
          let personId: string | null = null;

          if (isDefined(body.visitorEmail)) {
            const personRepository =
              await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
                workspaceId,
                'person',
                { shouldBypassPermissionChecks: true },
              );

            const person = await personRepository.findOne({
              where: {
                emails: { primaryEmail: body.visitorEmail },
              },
            });

            if (isDefined(person)) {
              personId = person.id;
            }
          }

          const chatConversation = await chatConversationRepository.save({
            visitorName: body.visitorName ?? null,
            visitorEmail: body.visitorEmail ?? null,
            visitorSessionId: body.visitorSessionId,
            status: 'OPEN',
            messageCount: 0,
            chatWidgetId: widgetId,
            personId,
          });

          // Notify agents of new conversation (async, non-blocking)
          this.chatConversationService
            .notifyAgentOfNewConversation(
              chatWidget.name,
              body.visitorName ?? null,
              body.visitorEmail ?? null,
              chatConversation.id,
            )
            .catch(() => {});

          return {
            conversationId: chatConversation.id,
          };
        },
        authContext,
      );

    this.logger.log(
      `New chat conversation started on widget ${widgetId} in workspace ${workspaceId}`,
    );

    return result;
  }

  @Post(':workspaceId/:widgetId/message')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async sendMessage(
    @Param('workspaceId') workspaceId: string,
    @Param('widgetId') widgetId: string,
    @Body() body: SendMessageBody,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const chatWidgetRepository =
            await this.globalWorkspaceOrmManager.getRepository<ChatWidgetWorkspaceEntity>(
              workspaceId,
              'chatWidget',
              { shouldBypassPermissionChecks: true },
            );

          const chatWidget = await chatWidgetRepository.findOne({
            where: { id: widgetId },
          });

          if (!isDefined(chatWidget)) {
            throw new HttpException(
              'Chat widget not found',
              HttpStatus.NOT_FOUND,
            );
          }

          const chatMessageRepository =
            await this.globalWorkspaceOrmManager.getRepository<ChatMessageWorkspaceEntity>(
              workspaceId,
              'chatMessage',
              { shouldBypassPermissionChecks: true },
            );

          const chatMessage = await chatMessageRepository.save({
            body: body.body,
            senderType: body.senderType,
            senderName: body.senderName ?? null,
            chatConversationId: body.conversationId,
          });

          // Update conversation messageCount and lastMessageAt (async, non-blocking)
          const chatConversationRepository =
            await this.globalWorkspaceOrmManager.getRepository<ChatConversationWorkspaceEntity>(
              workspaceId,
              'chatConversation',
              { shouldBypassPermissionChecks: true },
            );

          chatConversationRepository
            .update(body.conversationId, {
              lastMessageAt: new Date(),
            })
            .catch(() => {});

          chatConversationRepository
            .increment({ id: body.conversationId }, 'messageCount', 1)
            .catch(() => {});

          // Schedule auto-response if visitor message and auto-response enabled
          if (
            body.senderType === 'VISITOR' &&
            chatWidget.autoResponseEnabled &&
            isDefined(chatWidget.autoResponseMessage)
          ) {
            this.chatMessageService
              .scheduleAutoResponse(
                body.conversationId,
                chatWidget.autoResponseMessage,
                chatWidget.autoResponseDelay,
              )
              .catch(() => {});
          }

          return {
            messageId: chatMessage.id,
            createdAt: chatMessage.createdAt,
          };
        },
        authContext,
      );

    return result;
  }

  @Get(':workspaceId/:widgetId/messages/:conversationId')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getMessages(
    @Param('workspaceId') workspaceId: string,
    @Param('widgetId') widgetId: string,
    @Param('conversationId') conversationId: string,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const messages =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const chatMessageRepository =
            await this.globalWorkspaceOrmManager.getRepository<ChatMessageWorkspaceEntity>(
              workspaceId,
              'chatMessage',
              { shouldBypassPermissionChecks: true },
            );

          return chatMessageRepository.find({
            where: {
              chatConversationId: conversationId,
            } as any,
            order: { createdAt: 'ASC' },
          });
        },
        authContext,
      );

    return {
      messages: messages.map((message) => ({
        id: message.id,
        body: message.body,
        senderType: message.senderType,
        senderName: message.senderName,
        createdAt: message.createdAt,
      })),
    };
  }

  private async validateWorkspace(workspaceId: string): Promise<void> {
    const workspaceExists = await this.workspaceRepository.existsBy({
      id: workspaceId,
    });

    if (!workspaceExists) {
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
    }
  }
}
