import { Injectable, Logger } from '@nestjs/common';

import { In } from 'typeorm';

import { isDefined } from 'twenty-shared/utils';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CampaignWebhookController } from 'src/modules/campaign/controllers/campaign-webhook.controller';
import { CampaignSuppressionService } from 'src/modules/campaign/services/campaign-suppression.service';
import {
  SendGridDriverService,
  type SendGridPersonalization,
} from 'src/modules/campaign/services/sendgrid-driver.service';
import {
  CampaignRecipientStatus,
  type CampaignRecipientWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign-recipient.workspace-entity';
import {
  CampaignStatus,
  type CampaignWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign.workspace-entity';

const BATCH_SIZE = 100;
const BASE_URL = process.env.SERVER_URL ?? 'http://localhost:3000';

const UNSUBSCRIBE_FOOTER = `
<div style="text-align: center; padding: 20px 0; font-size: 12px; color: #666;">
  <p>If you no longer wish to receive these emails, you can <a href="{{unsubscribe_link}}" style="color: #666;">unsubscribe here</a>.</p>
</div>`;

// Front-end token dropdown historically emitted spaced tokens like
// `{{ contact.firstName }}`, while SendGrid substitutions key on the
// unspaced form `{{contact.firstName}}` (literal string match). Normalize
// any whitespace-padded variants in the body to the canonical no-space
// form before handing to SendGrid so the substitutions block matches.
// Pattern targets any of our known token names plus `unsubscribe_link`.
const KNOWN_TOKEN_INNER =
  '(?:contact\\.(?:firstName|lastName|fullName|email|jobTitle|city|companyName)|unsubscribe_link)';
const TOKEN_NORMALIZE_RE = new RegExp(
  `\\{\\{\\s*(${KNOWN_TOKEN_INNER})\\s*\\}\\}`,
  'g',
);

const normalizeTokensInHtml = (html: string): string =>
  html.replace(TOKEN_NORMALIZE_RE, '{{$1}}');

@Injectable()
export class CampaignExecutorService {
  private readonly logger = new Logger(CampaignExecutorService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly sendGridDriverService: SendGridDriverService,
    private readonly campaignSuppressionService: CampaignSuppressionService,
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

    // Resolve sender via inheritance chain: campaign-level overrides first,
    // then fall back to the parent MarketingCampaign's defaults if linked.
    // marketingCampaignId is a custom field added via metadata API, so cast.
    const campaignCustom = campaign as unknown as {
      marketingCampaignId?: string | null;
    };
    let mcDefaultFromEmail: string | null = null;
    let mcDefaultFromName: string | null = null;
    if (campaignCustom.marketingCampaignId) {
      try {
        const mcRepository =
          await this.globalWorkspaceOrmManager.getRepository<{
            id: string;
            defaultFromEmail: string | null;
            defaultFromName: string | null;
          }>(workspaceId, 'marketingCampaign', {
            shouldBypassPermissionChecks: true,
          });
        const mc = await mcRepository.findOne({
          where: { id: campaignCustom.marketingCampaignId },
        });
        mcDefaultFromEmail = mc?.defaultFromEmail ?? null;
        mcDefaultFromName = mc?.defaultFromName ?? null;
      } catch (error) {
        this.logger.warn(
          `Could not load MarketingCampaign for campaign ${campaignId}: ${(error as Error).message}`,
        );
      }
    }
    const resolvedFromEmail = campaign.fromEmail || mcDefaultFromEmail || '';
    const resolvedFromName = campaign.fromName || mcDefaultFromName || '';

    // Idempotency: skip if campaign already completed
    if (campaign.status === CampaignStatus.SENT) {
      this.logger.warn(
        `Campaign "${campaign.name}" already sent, skipping (possible job retry)`,
      );

      return;
    }

    // Fetch pending recipients with their person relation to get email addresses
    const pendingRecipients = await recipientRepository.find({
      where: {
        campaignId,
        status: In([CampaignRecipientStatus.PENDING]),
      },
      relations: { person: { company: true } },
    });

    // Collect all emails to check suppression list
    const allEmails = pendingRecipients
      .map((r) => r.person?.emails?.primaryEmail)
      .filter((email): email is string => isDefined(email));

    const suppressedEmails =
      await this.campaignSuppressionService.checkSuppressed(
        allEmails,
        workspaceId,
      );

    this.logger.log(
      `Executing campaign "${campaign.name}" with ${pendingRecipients.length} recipients (${suppressedEmails.size} suppressed)`,
    );

    let sentCount = 0;
    let skippedCount = 0;

    // Process recipients in batches
    for (let i = 0; i < pendingRecipients.length; i += BATCH_SIZE) {
      // Check if campaign was paused between batches
      const freshCampaign = await campaignRepository.findOne({
        where: { id: campaignId },
        select: ['status'],
      });

      if (freshCampaign?.status === CampaignStatus.PAUSED) {
        this.logger.log(
          `Campaign "${campaign.name}" paused after ${sentCount} sent`,
        );
        break;
      }

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

        // Filter out suppressed emails
        if (suppressedEmails.has(primaryEmail)) {
          this.logger.log(
            `Skipping suppressed email ${primaryEmail} for recipient ${recipient.id}`,
          );
          skippedCount++;
          continue;
        }

        const firstName = person.name?.firstName ?? '';
        const lastName = person.name?.lastName ?? '';

        // Generate per-recipient unsubscribe link
        const unsubscribeLink =
          CampaignWebhookController.generateUnsubscribeUrl(
            recipient.id,
            workspaceId,
            BASE_URL,
          );

        personalizations.push({
          to: primaryEmail,
          substitutions: {
            '{{contact.firstName}}': firstName,
            '{{contact.lastName}}': lastName,
            '{{contact.fullName}}': `${firstName} ${lastName}`.trim(),
            '{{contact.email}}': primaryEmail,
            '{{contact.jobTitle}}': person.jobTitle ?? '',
            '{{contact.city}}': person.city ?? '',
            '{{contact.companyName}}': person.company?.name ?? '',
            '{{unsubscribe_link}}': unsubscribeLink,
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
        // Prepare email content with unsubscribe footer
        let htmlContent = normalizeTokensInHtml(campaign.bodyHtml ?? '');

        // Append unsubscribe footer if not already present (any whitespace
        // variant) — check both forms before normalization would have
        // collapsed them so we don't double-append on legacy bodies.
        if (
          !htmlContent.includes('{{unsubscribe_link}}') &&
          !/\{\{\s*unsubscribe_link\s*\}\}/.test(campaign.bodyHtml ?? '')
        ) {
          htmlContent += UNSUBSCRIBE_FOOTER;
        }

        // Generate plain text alternative by stripping HTML tags
        const plainTextContent = this.htmlToPlainText(htmlContent);

        // Build List-Unsubscribe header (uses first recipient's link as fallback)
        const firstUnsubscribeLink =
          personalizations[0]?.substitutions?.['{{unsubscribe_link}}'] ?? '';

        await this.sendGridDriverService.sendBatch({
          subject: campaign.subject ?? '',
          htmlContent,
          plainTextContent,
          from: {
            email: resolvedFromEmail,
            name: resolvedFromName,
          },
          personalizations,
          headers: {
            'List-Unsubscribe': `<${firstUnsubscribeLink}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
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

    // Re-check status before marking complete (may have been paused)
    const finalCampaign = await campaignRepository.findOne({
      where: { id: campaignId },
      select: ['status'],
    });

    const finalStatus =
      finalCampaign?.status === CampaignStatus.PAUSED
        ? CampaignStatus.PAUSED
        : CampaignStatus.SENT;

    await campaignRepository.update(
      { id: campaignId },
      {
        status: finalStatus,
        sentCount,
        recipientCount: pendingRecipients.length,
      },
    );

    this.logger.log(
      `Campaign "${campaign.name}" ${finalStatus === CampaignStatus.PAUSED ? 'paused' : 'completed'}: ${sentCount} sent, ${skippedCount} skipped`,
    );
  }

  private htmlToPlainText(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '$2 ($1)')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
