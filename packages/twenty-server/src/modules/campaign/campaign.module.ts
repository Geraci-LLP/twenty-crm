import { Module } from '@nestjs/common';

import { CampaignWebhookController } from 'src/modules/campaign/controllers/campaign-webhook.controller';
import { CampaignSendJob } from 'src/modules/campaign/jobs/campaign-send.job';
import { CampaignActionResolver } from 'src/modules/campaign/resolvers/campaign-action.resolver';
import { CampaignTemplateResolver } from 'src/modules/campaign/resolvers/campaign-template.resolver';
import { CampaignExecutorService } from 'src/modules/campaign/services/campaign-executor.service';
import { CampaignTemplateService } from 'src/modules/campaign/services/campaign-template.service';
import { SendGridDriverService } from 'src/modules/campaign/services/sendgrid-driver.service';

@Module({
  controllers: [CampaignWebhookController],
  providers: [
    CampaignExecutorService,
    CampaignTemplateService,
    SendGridDriverService,
    CampaignActionResolver,
    CampaignTemplateResolver,
    CampaignSendJob,
  ],
  exports: [CampaignExecutorService, SendGridDriverService],
})
export class CampaignModule {}
