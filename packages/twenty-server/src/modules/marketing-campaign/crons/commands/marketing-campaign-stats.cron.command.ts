import { Command, CommandRunner } from 'nest-commander';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import {
  MARKETING_CAMPAIGN_STATS_CRON_PATTERN,
  MarketingCampaignStatsCronJob,
} from 'src/modules/marketing-campaign/crons/jobs/marketing-campaign-stats.cron.job';

@Command({
  name: 'cron:marketing-campaign:stats',
  description:
    'Periodically recomputes MarketingCampaign aggregate counts (emails sent/opened/clicked/etc.) from related Email/Form/Sequence records',
})
export class MarketingCampaignStatsCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.cronQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron({
      jobName: MarketingCampaignStatsCronJob.name,
      data: undefined,
      options: {
        repeat: { pattern: MARKETING_CAMPAIGN_STATS_CRON_PATTERN },
      },
    });
  }
}
