import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';

import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  CampaignRecipientStatus,
  type CampaignRecipientWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign-recipient.workspace-entity';
import { type CampaignWorkspaceEntity } from 'src/modules/campaign/standard-objects/campaign.workspace-entity';

// SendGrid event types
type SendGridEventType =
  | 'delivered'
  | 'open'
  | 'click'
  | 'bounce'
  | 'unsubscribe';

type SendGridWebhookEvent = {
  event: SendGridEventType;
  email: string;
  timestamp: number;
  // Custom args passed during send
  campaignRecipientId?: string;
  workspaceId?: string;
};

@Controller('campaign-webhooks')
@UseGuards(PublicEndpointGuard, NoPermissionGuard)
export class CampaignWebhookController {
  private readonly logger = new Logger(CampaignWebhookController.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  @Post('sendgrid')
  async handleSendGridWebhook(
    @Body() events: SendGridWebhookEvent[],
  ): Promise<{ received: boolean }> {
    for (const event of events) {
      try {
        await this.processEvent(event);
      } catch (error) {
        this.logger.error(`Failed to process SendGrid event: ${error}`);
      }
    }

    return { received: true };
  }

  private async processEvent(event: SendGridWebhookEvent): Promise<void> {
    if (!event.campaignRecipientId || !event.workspaceId) {
      this.logger.warn(
        'Received SendGrid event without campaignRecipientId or workspaceId',
      );

      return;
    }

    const recipientRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignRecipientWorkspaceEntity>(
        event.workspaceId,
        'campaignRecipient',
        { shouldBypassPermissionChecks: true },
      );

    const now = new Date().toISOString();

    switch (event.event) {
      case 'delivered':
        await recipientRepository.update(
          { id: event.campaignRecipientId },
          { status: CampaignRecipientStatus.DELIVERED },
        );
        break;

      case 'open':
        await recipientRepository.update(
          { id: event.campaignRecipientId },
          { status: CampaignRecipientStatus.OPENED, openedAt: now },
        );
        await this.incrementCampaignStat(
          event.workspaceId,
          event.campaignRecipientId,
          'openCount',
        );
        break;

      case 'click':
        await recipientRepository.update(
          { id: event.campaignRecipientId },
          { status: CampaignRecipientStatus.CLICKED, clickedAt: now },
        );
        await this.incrementCampaignStat(
          event.workspaceId,
          event.campaignRecipientId,
          'clickCount',
        );
        break;

      case 'bounce':
        await recipientRepository.update(
          { id: event.campaignRecipientId },
          { status: CampaignRecipientStatus.BOUNCED },
        );
        await this.incrementCampaignStat(
          event.workspaceId,
          event.campaignRecipientId,
          'bounceCount',
        );
        break;

      case 'unsubscribe':
        await recipientRepository.update(
          { id: event.campaignRecipientId },
          { status: CampaignRecipientStatus.UNSUBSCRIBED },
        );
        await this.incrementCampaignStat(
          event.workspaceId,
          event.campaignRecipientId,
          'unsubscribeCount',
        );
        break;

      default:
        this.logger.warn(`Unhandled SendGrid event type: ${event.event}`);
    }
  }

  private async incrementCampaignStat(
    workspaceId: string,
    campaignRecipientId: string,
    statField: keyof Pick<
      CampaignWorkspaceEntity,
      'openCount' | 'clickCount' | 'bounceCount' | 'unsubscribeCount'
    >,
  ): Promise<void> {
    const recipientRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignRecipientWorkspaceEntity>(
        workspaceId,
        'campaignRecipient',
        { shouldBypassPermissionChecks: true },
      );

    const recipient = await recipientRepository.findOne({
      where: { id: campaignRecipientId },
    });

    if (!recipient) {
      return;
    }

    const campaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
        workspaceId,
        'campaign',
        { shouldBypassPermissionChecks: true },
      );

    const campaign = await campaignRepository.findOne({
      where: { id: recipient.campaignId },
    });

    if (!campaign) {
      return;
    }

    await campaignRepository.update(
      { id: campaign.id },
      { [statField]: (campaign[statField] ?? 0) + 1 },
    );
  }
}
