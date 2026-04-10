import { Injectable } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  CampaignRecipientStatus,
  type CampaignRecipientWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign-recipient.workspace-entity';
import { type CampaignWorkspaceEntity } from 'src/modules/campaign/standard-objects/campaign.workspace-entity';

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

@Injectable()
export class CampaignValidationService {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async validateBeforeSend(
    campaignId: string,
    workspaceId: string,
  ): Promise<ValidationResult> {
    const errors: string[] = [];

    const campaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
        workspaceId,
        'campaign',
        { shouldBypassPermissionChecks: true },
      );

    const campaign = await campaignRepository.findOne({
      where: { id: campaignId },
    });

    if (!campaign) {
      return { valid: false, errors: ['Campaign not found'] };
    }

    if (!isDefined(campaign.subject) || campaign.subject.trim().length === 0) {
      errors.push('Subject is required');
    }

    if (
      !isDefined(campaign.bodyHtml) ||
      campaign.bodyHtml.trim().length === 0
    ) {
      errors.push('Email body is required');
    }

    if (
      !isDefined(campaign.fromEmail) ||
      campaign.fromEmail.trim().length === 0
    ) {
      errors.push('From email address is required');
    } else if (!this.isValidEmail(campaign.fromEmail)) {
      errors.push('From email address is not valid');
    }

    if (
      !isDefined(campaign.fromName) ||
      campaign.fromName.trim().length === 0
    ) {
      errors.push('From name is required');
    }

    // Check for at least one pending recipient
    const recipientRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignRecipientWorkspaceEntity>(
        workspaceId,
        'campaignRecipient',
        { shouldBypassPermissionChecks: true },
      );

    const pendingCount = await recipientRepository.count({
      where: {
        campaignId,
        status: CampaignRecipientStatus.PENDING,
      },
    });

    if (pendingCount === 0) {
      errors.push('At least one recipient is required');
    }

    return { valid: errors.length === 0, errors };
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
