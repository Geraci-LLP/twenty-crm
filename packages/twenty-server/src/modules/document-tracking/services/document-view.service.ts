import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DocumentViewService {
  private readonly logger = new Logger(DocumentViewService.name);

  async sendViewNotificationEmail(
    documentName: string,
    viewerEmail: string,
    viewerName: string | null,
    notificationEmail: string,
  ): Promise<void> {
    // Email integration will be added in a future iteration
    this.logger.log(
      `Document "${documentName}" viewed by ${viewerEmail}${viewerName ? ` (${viewerName})` : ''} — notification to ${notificationEmail}`,
    );
  }
}
