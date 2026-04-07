import { Injectable, Logger } from '@nestjs/common';

import { In } from 'typeorm';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  CampaignRecipientStatus,
  type CampaignRecipientWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign-recipient.workspace-entity';
import {
  CampaignStatus,
  type CampaignWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign.workspace-entity';
import { SendGridDriverService } from 'src/modules/campaign/services/sendgrid-driver.service';

const BATCH_SIZE = 100;

@Injectable()
export class CampaignExecutorService {
  private readonly logger = new Logger(CampaignExecutorService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly sendGridDriverService: SendGridDriverService,
    @InjectMessageQueue(MessageQueue.emailQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  async executeCampaign(
    campaignId: string,
    workspaceId: string,
  ): Promise<void> {
    const campaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
        workspaceId,
        'campaign',
        { shouldBypassPermissionChecks: true },
      );

    const recipientRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignRecipientWorkspaceEntity>(
        workspaceId,
        'campaignRecipient',
        { shouldBypassPermissionChecks: true },
      );

    const campaign = await campaignRepository.findOneOrFail({
      where: { id: campaignId },
    });

    // Mark campaign as sending
    await campaignRepository.update(
      { id: campaignId },
      { status: CampaignStatus.SENDING },
    );

    const pendingRecipients = await recipientRepository.find({
      where: {
        campaignId,
        status: In([CampaignRecipientStatus.PENDING]),
      },
    });

    this.logger.log(
      `Executing campaign "${campaign.name}" with ${pendingRecipients.length} recipients`,
    );

    let sentCount = 0;

    // Process recipients in batches
    for (let i = 0; i < pendingRecipients.length; i += BATCH_SIZE) {
      const batch = pendingRecipients.slice(i, i + BATCH_SIZE);

      try {
        await this.sendGridDriverService.sendBatch({
          subject: campaign.subject ?? '',
          htmlContent: campaign.bodyHtml ?? '',
          from: {
            email: campaign.fromEmail ?? '',
            name: campaign.fromName ?? '',
          },
          recipientIds: batch.map((recipient) => recipient.id),
        });

        const now = new Date().toISOString();

        await recipientRepository.update(
          { id: In(batch.map((recipient) => recipient.id)) },
          { status: CampaignRecipientStatus.SENT, sentAt: now },
        );

        sentCount += batch.length;
      } catch (error) {
        this.logger.error(
          `Failed to send batch starting at index ${i}: ${error}`,
        );
      }
    }

    // Update campaign stats
    await campaignRepository.update(
      { id: campaignId },
      {
        status: CampaignStatus.SENT,
        sentCount,
      },
    );

    this.logger.log(
      `Campaign "${campaign.name}" completed: ${sentCount}/${pendingRecipients.length} sent`,
    );
  }
}
