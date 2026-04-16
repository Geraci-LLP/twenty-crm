import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatConversationService {
  private readonly logger = new Logger(ChatConversationService.name);

  async notifyAgentOfNewConversation(
    widgetName: string,
    visitorName: string | null,
    visitorEmail: string | null,
    conversationId: string,
  ): Promise<void> {
    // For MVP, log. WebSocket push notifications to agents will come later.
    this.logger.log(
      `New chat conversation ${conversationId} on widget "${widgetName}" from ${visitorName ?? 'anonymous'} (${visitorEmail ?? 'no email'})`,
    );
  }
}
