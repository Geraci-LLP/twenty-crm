import { Module } from '@nestjs/common';

import { CampaignModule } from 'src/modules/campaign/campaign.module';
import { SendCampaignEmailWorkflowAction } from 'src/modules/workflow/workflow-executor/workflow-actions/send-campaign-email/send-campaign-email.workflow-action';

@Module({
  imports: [CampaignModule],
  providers: [SendCampaignEmailWorkflowAction],
  exports: [SendCampaignEmailWorkflowAction],
})
export class SendCampaignEmailActionModule {}
