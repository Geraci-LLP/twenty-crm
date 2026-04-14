import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { ViewFilterEntity } from 'src/engine/metadata-modules/view-filter/entities/view-filter.entity';
import { CampaignScheduleSendCronCommand } from 'src/modules/campaign/crons/commands/campaign-schedule-send.cron.command';
import { CampaignScheduleSendCronJob } from 'src/modules/campaign/crons/jobs/campaign-schedule-send.cron.job';
import { CampaignWebhookController } from 'src/modules/campaign/controllers/campaign-webhook.controller';
import { CampaignSendJob } from 'src/modules/campaign/jobs/campaign-send.job';
import { CampaignActionResolver } from 'src/modules/campaign/resolvers/campaign-action.resolver';
import { CampaignTemplateResolver } from 'src/modules/campaign/resolvers/campaign-template.resolver';
import { DripCampaignResolver } from 'src/modules/campaign/resolvers/drip-campaign.resolver';
import { CampaignExecutorService } from 'src/modules/campaign/services/campaign-executor.service';
import { CampaignRecipientService } from 'src/modules/campaign/services/campaign-recipient.service';
import { CampaignSuppressionService } from 'src/modules/campaign/services/campaign-suppression.service';
import { CampaignTemplateService } from 'src/modules/campaign/services/campaign-template.service';
import { CampaignValidationService } from 'src/modules/campaign/services/campaign-validation.service';
import { DripCampaignService } from 'src/modules/campaign/services/drip-campaign.service';
import { SendGridDriverService } from 'src/modules/campaign/services/sendgrid-driver.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceEntity,
      ViewFilterEntity,
      FieldMetadataEntity,
    ]),
  ],
  controllers: [CampaignWebhookController],
  providers: [
    CampaignExecutorService,
    CampaignRecipientService,
    CampaignSuppressionService,
    CampaignTemplateService,
    CampaignValidationService,
    DripCampaignService,
    SendGridDriverService,
    CampaignActionResolver,
    CampaignTemplateResolver,
    DripCampaignResolver,
    CampaignSendJob,
    CampaignScheduleSendCronJob,
    CampaignScheduleSendCronCommand,
  ],
  exports: [CampaignExecutorService, SendGridDriverService],
})
export class CampaignModule {}
