import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ChatMessageService {
  private readonly logger = new Logger(ChatMessageService.name);

  async scheduleAutoResponse(
    conversationId: string,
    autoResponseMessage: string,
    delaySeconds: number,
  ): Promise<void> {
    // For MVP, log. Auto-response via BullMQ delayed job will come later.
    this.logger.log(
      `Auto-response scheduled for conversation ${conversationId} in ${delaySeconds}s: "${autoResponseMessage.substring(0, 50)}..."`,
    );
  }
}
