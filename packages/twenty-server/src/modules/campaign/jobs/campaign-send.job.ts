import { Logger, Scope } from '@nestjs/common';

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { CampaignExecutorService } from 'src/modules/campaign/services/campaign-executor.service';

export type CampaignSendJobData = {
  campaignId: string;
  workspaceId: string;
};

@Processor({
  queueName: MessageQueue.emailQueue,
  scope: Scope.REQUEST,
})
export class CampaignSendJob {
  private readonly logger = new Logger(CampaignSendJob.name);

  constructor(
    private readonly campaignExecutorService: CampaignExecutorService,
  ) {}

  @Process(CampaignSendJob.name)
  async handle(data: CampaignSendJobData): Promise<void> {
    this.logger.log(
      `Processing campaign send job for campaign ${data.campaignId}`,
    );

    try {
      await this.campaignExecutorService.executeCampaign(
        data.campaignId,
        data.workspaceId,
      );

      this.logger.log(
        `Campaign send job completed for campaign ${data.campaignId}`,
      );
    } catch (error) {
      this.logger.error(
        `Campaign send job failed for campaign ${data.campaignId}: ${error}`,
      );

      throw error;
    }
  }
}
