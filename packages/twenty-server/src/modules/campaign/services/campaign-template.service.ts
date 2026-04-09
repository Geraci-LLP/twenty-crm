import { Injectable, Logger } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type CampaignTemplateWorkspaceEntity } from 'src/modules/campaign/standard-objects/campaign-template.workspace-entity';
import { type CampaignWorkspaceEntity } from 'src/modules/campaign/standard-objects/campaign.workspace-entity';

@Injectable()
export class CampaignTemplateService {
  private readonly logger = new Logger(CampaignTemplateService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async saveAsTemplate(
    workspaceId: string,
    campaignId: string,
    templateName: string,
    category?: string,
  ): Promise<CampaignTemplateWorkspaceEntity> {
    const campaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
        workspaceId,
        'campaign',
        { shouldBypassPermissionChecks: true },
      );

    const templateRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignTemplateWorkspaceEntity>(
        workspaceId,
        'campaignTemplate',
        { shouldBypassPermissionChecks: true },
      );

    const campaign = await campaignRepository.findOneOrFail({
      where: { id: campaignId },
    });

    const template = await templateRepository.save({
      name: templateName,
      subject: campaign.subject,
      bodyHtml: campaign.bodyHtml,
      category: category ?? 'CUSTOM',
    });

    this.logger.log(
      `Created template "${templateName}" from campaign "${campaign.name}"`,
    );

    return template;
  }

  async loadTemplate(
    workspaceId: string,
    templateId: string,
    campaignId: string,
  ): Promise<void> {
    const campaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
        workspaceId,
        'campaign',
        { shouldBypassPermissionChecks: true },
      );

    const templateRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignTemplateWorkspaceEntity>(
        workspaceId,
        'campaignTemplate',
        { shouldBypassPermissionChecks: true },
      );

    const template = await templateRepository.findOneOrFail({
      where: { id: templateId },
    });

    await campaignRepository.update(
      { id: campaignId },
      {
        subject: template.subject,
        bodyHtml: template.bodyHtml,
      },
    );

    this.logger.log(
      `Loaded template "${template.name}" into campaign ${campaignId}`,
    );
  }
}
