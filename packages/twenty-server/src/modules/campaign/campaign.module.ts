import { Module } from '@nestjs/common';

import { CampaignWebhookController } from 'src/modules/campaign/controllers/campaign-webhook.controller';
import { CampaignExecutorService } from 'src/modules/campaign/services/campaign-executor.service';
import { SendGridDriverService } from 'src/modules/campaign/services/sendgrid-driver.service';

@Module({
  controllers: [CampaignWebhookController],
  providers: [CampaignExecutorService, SendGridDriverService],
  exports: [CampaignExecutorService, SendGridDriverService],
})
export class CampaignModule {}
