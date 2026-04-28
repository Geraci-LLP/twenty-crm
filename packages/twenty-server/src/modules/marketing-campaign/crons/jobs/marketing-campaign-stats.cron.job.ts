import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';

import { SentryCronMonitor } from 'src/engine/core-modules/cron/sentry-cron-monitor.decorator';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { MarketingCampaignStatsService } from 'src/modules/marketing-campaign/services/marketing-campaign-stats.service';

export const MARKETING_CAMPAIGN_STATS_CRON_PATTERN = '*/10 * * * *';

const WORKSPACE_BATCH_SIZE = 5;

@Processor(MessageQueue.cronQueue)
export class MarketingCampaignStatsCronJob {
  private readonly logger = new Logger(MarketingCampaignStatsCronJob.name);

  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly marketingCampaignStatsService: MarketingCampaignStatsService,
    private readonly exceptionHandlerService: ExceptionHandlerService,
  ) {}

  @Process(MarketingCampaignStatsCronJob.name)
  @SentryCronMonitor(
    MarketingCampaignStatsCronJob.name,
    MARKETING_CAMPAIGN_STATS_CRON_PATTERN,
  )
  async handle() {
    this.logger.log('Starting MarketingCampaignStatsCronJob');

    const activeWorkspaces = await this.workspaceRepository.find({
      where: { activationStatus: WorkspaceActivationStatus.ACTIVE },
      select: ['id'],
    });

    let total = 0;
    for (let i = 0; i < activeWorkspaces.length; i += WORKSPACE_BATCH_SIZE) {
      const batch = activeWorkspaces.slice(i, i + WORKSPACE_BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((w) =>
          this.marketingCampaignStatsService.recomputeWorkspace(w.id),
        ),
      );

      for (const [idx, result] of results.entries()) {
        if (result.status === 'fulfilled') {
          total += result.value;
        } else {
          this.exceptionHandlerService.captureExceptions([result.reason], {
            workspace: { id: batch[idx].id },
          });
        }
      }
    }

    this.logger.log(
      `Completed MarketingCampaignStatsCronJob, recomputed ${total} campaigns`,
    );
  }
}
