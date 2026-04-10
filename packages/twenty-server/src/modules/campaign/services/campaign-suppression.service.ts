import { Injectable, Logger } from '@nestjs/common';

import { In } from 'typeorm';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  CampaignRecipientStatus,
  type CampaignRecipientWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign-recipient.workspace-entity';

export type SuppressionReason = 'BOUNCE' | 'UNSUBSCRIBE' | 'SPAM_COMPLAINT';

// Suppression is derived from CampaignRecipient records.
// Any email that has BOUNCED or UNSUBSCRIBED on any campaign is suppressed.
@Injectable()
export class CampaignSuppressionService {
  private readonly logger = new Logger(CampaignSuppressionService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async checkSuppressed(
    emails: string[],
    workspaceId: string,
  ): Promise<Set<string>> {
    if (emails.length === 0) {
      return new Set();
    }

    try {
      const recipientRepository =
        await this.globalWorkspaceOrmManager.getRepository<CampaignRecipientWorkspaceEntity>(
          workspaceId,
          'campaignRecipient',
          { shouldBypassPermissionChecks: true },
        );

      // Find recipients that bounced or unsubscribed on any campaign
      const suppressedRecipients = await recipientRepository.find({
        where: {
          status: In([
            CampaignRecipientStatus.BOUNCED,
            CampaignRecipientStatus.UNSUBSCRIBED,
          ]),
        },
        relations: { person: true },
      });

      const suppressedEmails = new Set<string>();

      for (const recipient of suppressedRecipients) {
        const email = recipient.person?.emails?.primaryEmail;

        if (email && emails.includes(email)) {
          suppressedEmails.add(email);
        }
      }

      return suppressedEmails;
    } catch (error) {
      this.logger.error(`Failed to check suppression list: ${error}`);

      return new Set();
    }
  }

  // Called from webhook controller when a bounce/unsubscribe event comes in.
  // The actual suppression is stored as the recipient's status (BOUNCED/UNSUBSCRIBED),
  // so this method just logs for auditing purposes.
  async addSuppression(
    email: string,
    reason: SuppressionReason,
    _campaignId: string,
    _workspaceId: string,
  ): Promise<void> {
    this.logger.log(`Suppression recorded: ${email} (${reason})`);
  }
}
