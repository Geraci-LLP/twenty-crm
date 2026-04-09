import { Command, CommandRunner } from 'nest-commander';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import {
  CAMPAIGN_SCHEDULE_SEND_CRON_PATTERN,
  CampaignScheduleSendCronJob,
} from 'src/modules/campaign/crons/jobs/campaign-schedule-send.cron.job';

@Command({
  name: 'cron:campaign:schedule-send',
  description:
    'Polls for scheduled campaigns whose scheduledDate has passed and enqueues them for sending',
})
export class CampaignScheduleSendCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.cronQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron({
      jobName: CampaignScheduleSendCronJob.name,
      data: undefined,
      options: {
        repeat: {
          pattern: CAMPAIGN_SCHEDULE_SEND_CRON_PATTERN,
        },
      },
    });
  }
}
