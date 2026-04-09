import { Injectable, Logger } from '@nestjs/common';

import { In } from 'typeorm';

import { isDefined } from 'twenty-shared/utils';

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
import {
  SendGridDriverService,
  type SendGridPersonalization,
} from 'src/modules/campaign/services/sendgrid-driver.service';

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

    // Fetch pending recipients with their person relation to get email addresses
    const pendingRecipients = await recipientRepository.find({
      where: {
        campaignId,
        status: In([CampaignRecipientStatus.PENDING]),
      },
      relations: { person: true },
    });

    this.logger.log(
      `Executing campaign "${campaign.name}" with ${pendingRecipients.length} recipients`,
    );

    let sentCount = 0;
    let skippedCount = 0;

    // Process recipients in batches
    for (let i = 0; i < pendingRecipients.length; i += BATCH_SIZE) {
      const batch = pendingRecipients.slice(i, i + BATCH_SIZE);

      // Build personalizations from recipient person data
      const personalizations: SendGridPersonalization[] = [];
      const validRecipientIds: string[] = [];

      for (const recipient of batch) {
        const person = recipient.person;
        const primaryEmail = person?.emails?.primaryEmail;

        if (!isDefined(person) || !primaryEmail) {
          this.logger.warn(
            `Skipping recipient ${recipient.id}: no person or email address`,
          );
          skippedCount++;
          continue;
        }

        const firstName = person.name?.firstName ?? '';
        const lastName = person.name?.lastName ?? '';

        personalizations.push({
          to: primaryEmail,
          substitutions: {
            '{{contact.firstName}}': firstName,
            '{{contact.lastName}}': lastName,
            '{{contact.fullName}}': `${firstName} ${lastName}`.trim(),
            '{{contact.email}}': primaryEmail,
            '{{contact.jobTitle}}': person.jobTitle ?? '',
            '{{contact.city}}': person.city ?? '',
          },
          customArgs: {
            campaignRecipientId: recipient.id,
            workspaceId,
          },
        });
        validRecipientIds.push(recipient.id);
      }

      if (personalizations.length === 0) {
        continue;
      }

      try {
        await this.sendGridDriverService.sendBatch({
          subject: campaign.subject ?? '',
          htmlContent: campaign.bodyHtml ?? '',
          from: {
            email: campaign.fromEmail ?? '',
            name: campaign.fromName ?? '',
          },
          personalizations,
        });

        const now = new Date().toISOString();

        await recipientRepository.update(
          { id: In(validRecipientIds) },
          { status: CampaignRecipientStatus.SENT, sentAt: now },
        );

        sentCount += validRecipientIds.length;
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
        recipientCount: pendingRecipients.length,
      },
    );

    this.logger.log(
      `Campaign "${campaign.name}" completed: ${sentCount} sent, ${skippedCount} skipped (no email)`,
    );
  }
}
