import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LessThanOrEqual, Repository } from 'typeorm';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';

import { SentryCronMonitor } from 'src/engine/core-modules/cron/sentry-cron-monitor.decorator';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import {
  CampaignSendJob,
  type CampaignSendJobData,
} from 'src/modules/campaign/jobs/campaign-send.job';
import {
  CampaignStatus,
  type CampaignWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign.workspace-entity';

export const CAMPAIGN_SCHEDULE_SEND_CRON_PATTERN = '*/5 * * * *';

const WORKSPACE_BATCH_SIZE = 10;

@Processor(MessageQueue.cronQueue)
export class CampaignScheduleSendCronJob {
  private readonly logger = new Logger(CampaignScheduleSendCronJob.name);

  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectMessageQueue(MessageQueue.emailQueue)
    private readonly messageQueueService: MessageQueueService,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly exceptionHandlerService: ExceptionHandlerService,
  ) {}

  @Process(CampaignScheduleSendCronJob.name)
  @SentryCronMonitor(
    CampaignScheduleSendCronJob.name,
    CAMPAIGN_SCHEDULE_SEND_CRON_PATTERN,
  )
  async handle() {
    this.logger.log('Starting CampaignScheduleSendCronJob');

    const activeWorkspaces = await this.workspaceRepository.find({
      where: {
        activationStatus: WorkspaceActivationStatus.ACTIVE,
      },
      select: ['id'],
    });

    let enqueuedCount = 0;

    for (
      let workspaceIndex = 0;
      workspaceIndex < activeWorkspaces.length;
      workspaceIndex += WORKSPACE_BATCH_SIZE
    ) {
      const batch = activeWorkspaces.slice(
        workspaceIndex,
        workspaceIndex + WORKSPACE_BATCH_SIZE,
      );

      const results = await Promise.allSettled(
        batch.map((workspace) => this.processScheduledCampaigns(workspace.id)),
      );

      for (const [index, result] of results.entries()) {
        if (result.status === 'fulfilled') {
          enqueuedCount += result.value;
        }

        if (result.status === 'rejected') {
          this.exceptionHandlerService.captureExceptions([result.reason], {
            workspace: { id: batch[index].id },
          });
        }
      }
    }

    this.logger.log(
      `Completed CampaignScheduleSendCronJob, enqueued ${enqueuedCount} campaign sends`,
    );
  }

  private async processScheduledCampaigns(
    workspaceId: string,
  ): Promise<number> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const campaignRepository =
          await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
            workspaceId,
            'campaign',
            { shouldBypassPermissionChecks: true },
          );

        const now = new Date().toISOString();

        const scheduledCampaigns = await campaignRepository.find({
          where: {
            status: CampaignStatus.SCHEDULED,
            scheduledDate: LessThanOrEqual(now),
          },
          select: ['id'],
        });

        for (const campaign of scheduledCampaigns) {
          await this.messageQueueService.add<CampaignSendJobData>(
            CampaignSendJob.name,
            {
              campaignId: campaign.id,
              workspaceId,
            },
          );

          await campaignRepository.update(
            { id: campaign.id },
            { status: CampaignStatus.SENDING },
          );
        }

        if (scheduledCampaigns.length > 0) {
          this.logger.log(
            `Enqueued ${scheduledCampaigns.length} scheduled campaigns for workspace ${workspaceId}`,
          );
        }

        return scheduledCampaigns.length;
      },
      authContext,
      { lite: true },
    );
  }
}
