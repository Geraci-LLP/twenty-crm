import crypto from 'crypto';

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Logger,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { type Response } from 'express';

import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CampaignSuppressionService } from 'src/modules/campaign/services/campaign-suppression.service';
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

const UNSUBSCRIBE_HMAC_SECRET =
  process.env.CAMPAIGN_UNSUBSCRIBE_HMAC_SECRET ?? 'default-hmac-secret';
const SENDGRID_WEBHOOK_VERIFICATION_KEY =
  process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY ?? '';

@Controller('campaign-webhooks')
@UseGuards(PublicEndpointGuard, NoPermissionGuard)
export class CampaignWebhookController {
  private readonly logger = new Logger(CampaignWebhookController.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly campaignSuppressionService: CampaignSuppressionService,
  ) {}

  @Post('sendgrid')
  async handleSendGridWebhook(
    @Body() events: SendGridWebhookEvent[],
    @Headers('x-twilio-email-event-webhook-signature') signature?: string,
    @Headers('x-twilio-email-event-webhook-timestamp') timestamp?: string,
  ): Promise<{ received: boolean }> {
    // Verify SendGrid webhook signature if verification key is configured
    if (SENDGRID_WEBHOOK_VERIFICATION_KEY) {
      if (!signature || !timestamp) {
        this.logger.warn(
          'SendGrid webhook missing signature or timestamp headers',
        );
        throw new ForbiddenException('Missing webhook signature');
      }

      const isValid = this.verifySendGridSignature(
        SENDGRID_WEBHOOK_VERIFICATION_KEY,
        JSON.stringify(events),
        signature,
        timestamp,
      );

      if (!isValid) {
        this.logger.warn('SendGrid webhook signature verification failed');
        throw new ForbiddenException('Invalid webhook signature');
      }
    }

    for (const event of events) {
      try {
        await this.processEvent(event);
      } catch (error) {
        this.logger.error(`Failed to process SendGrid event: ${error}`);
      }
    }

    return { received: true };
  }

  @Get('unsubscribe')
  async handleUnsubscribe(
    @Query('rid') recipientId: string,
    @Query('wid') workspaceId: string,
    @Query('sig') sig: string,
    @Res() res: Response,
  ): Promise<void> {
    // Validate HMAC signature
    const expectedSig = this.generateUnsubscribeHmac(recipientId, workspaceId);

    if (sig !== expectedSig) {
      this.logger.warn(`Invalid unsubscribe HMAC for recipient ${recipientId}`);
      res.status(403).send('Invalid unsubscribe link');

      return;
    }

    const recipientRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignRecipientWorkspaceEntity>(
        workspaceId,
        'campaignRecipient',
        { shouldBypassPermissionChecks: true },
      );

    const recipient = await recipientRepository.findOne({
      where: { id: recipientId },
      relations: { person: true },
    });

    if (!recipient) {
      res.status(404).send('Recipient not found');

      return;
    }

    const now = new Date().toISOString();

    // Mark recipient as unsubscribed
    await recipientRepository.update(
      { id: recipientId },
      { status: CampaignRecipientStatus.UNSUBSCRIBED, unsubscribedAt: now },
    );

    // Increment unsubscribe count atomically
    const campaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
        workspaceId,
        'campaign',
        { shouldBypassPermissionChecks: true },
      );

    await campaignRepository.increment(
      { id: recipient.campaignId },
      'unsubscribeCount',
      1,
    );

    // Add to suppression list
    const email = recipient.person?.emails?.primaryEmail;

    if (email) {
      await this.campaignSuppressionService.addSuppression(
        email,
        'UNSUBSCRIBE',
        recipient.campaignId,
        workspaceId,
      );
    }

    // Render confirmation page
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Unsubscribed</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 60px;">
          <h1>You have been unsubscribed</h1>
          <p>You will no longer receive marketing emails from us.</p>
          <p>If this was a mistake, please contact us directly.</p>
        </body>
      </html>
    `);
  }

  static generateUnsubscribeUrl(
    recipientId: string,
    workspaceId: string,
    baseUrl: string,
  ): string {
    const sig = crypto
      .createHmac('sha256', UNSUBSCRIBE_HMAC_SECRET)
      .update(`${recipientId}:${workspaceId}`)
      .digest('hex');

    return `${baseUrl}/campaign-webhooks/unsubscribe?rid=${recipientId}&wid=${workspaceId}&sig=${sig}`;
  }

  private generateUnsubscribeHmac(
    recipientId: string,
    workspaceId: string,
  ): string {
    return crypto
      .createHmac('sha256', UNSUBSCRIBE_HMAC_SECRET)
      .update(`${recipientId}:${workspaceId}`)
      .digest('hex');
  }

  private verifySendGridSignature(
    publicKey: string,
    payload: string,
    signature: string,
    timestamp: string,
  ): boolean {
    try {
      const timestampPayload = timestamp + payload;
      const decodedSignature = Buffer.from(signature, 'base64');

      const verifier = crypto.createVerify('SHA256');

      verifier.update(timestampPayload);

      return verifier.verify(
        {
          key: publicKey,
          format: 'pem',
          type: 'spki',
        },
        decodedSignature,
      );
    } catch (error) {
      this.logger.error(`Signature verification error: ${error}`);

      return false;
    }
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
          { status: CampaignRecipientStatus.BOUNCED, bouncedAt: now },
        );
        await this.incrementCampaignStat(
          event.workspaceId,
          event.campaignRecipientId,
          'bounceCount',
        );
        // Auto-add to suppression list
        await this.addToSuppressionFromEvent(
          event,
          'BOUNCE',
          recipientRepository,
        );
        break;

      case 'unsubscribe':
        await recipientRepository.update(
          { id: event.campaignRecipientId },
          { status: CampaignRecipientStatus.UNSUBSCRIBED, unsubscribedAt: now },
        );
        await this.incrementCampaignStat(
          event.workspaceId,
          event.campaignRecipientId,
          'unsubscribeCount',
        );
        // Auto-add to suppression list
        await this.addToSuppressionFromEvent(
          event,
          'UNSUBSCRIBE',
          recipientRepository,
        );
        break;

      default:
        this.logger.warn(`Unhandled SendGrid event type: ${event.event}`);
    }
  }

  private async addToSuppressionFromEvent(
    event: SendGridWebhookEvent,
    reason: 'BOUNCE' | 'UNSUBSCRIBE',
    recipientRepository: Awaited<
      ReturnType<
        typeof this.globalWorkspaceOrmManager.getRepository<CampaignRecipientWorkspaceEntity>
      >
    >,
  ): Promise<void> {
    if (!event.workspaceId || !event.campaignRecipientId) {
      return;
    }

    const recipient = await recipientRepository.findOne({
      where: { id: event.campaignRecipientId },
    });

    if (!recipient || !event.email) {
      return;
    }

    await this.campaignSuppressionService.addSuppression(
      event.email,
      reason,
      recipient.campaignId,
      event.workspaceId,
    );
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

    // Use atomic increment to avoid race conditions when multiple webhooks
    // arrive simultaneously for the same campaign
    const campaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
        workspaceId,
        'campaign',
        { shouldBypassPermissionChecks: true },
      );

    await campaignRepository.increment(
      { id: recipient.campaignId },
      statField,
      1,
    );
  }
}
