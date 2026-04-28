import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
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
  SequenceStepExecutionJob,
  type SequenceStepExecutionJobData,
} from 'src/modules/sales-sequence/jobs/sequence-step-execution.job';
import {
  SequenceEnrollmentStatus,
  type SequenceEnrollmentWorkspaceEntity,
} from 'src/modules/sales-sequence/standard-objects/sequence-enrollment.workspace-entity';
import { type SequenceStepWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence-step.workspace-entity';

export const SEQUENCE_ADVANCE_CRON_PATTERN = '*/5 * * * *';

const WORKSPACE_BATCH_SIZE = 10;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Scans active enrollments across active workspaces and enqueues those whose next step
// is due (i.e. delayDays since lastStepAt — or since enrolledAt for step 0 — has elapsed).
@Processor(MessageQueue.cronQueue)
export class SequenceAdvanceCronJob {
  private readonly logger = new Logger(SequenceAdvanceCronJob.name);

  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectMessageQueue(MessageQueue.emailQueue)
    private readonly messageQueueService: MessageQueueService,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly exceptionHandlerService: ExceptionHandlerService,
  ) {}

  @Process(SequenceAdvanceCronJob.name)
  @SentryCronMonitor(SequenceAdvanceCronJob.name, SEQUENCE_ADVANCE_CRON_PATTERN)
  async handle() {
    this.logger.log('Starting SequenceAdvanceCronJob');

    const activeWorkspaces = await this.workspaceRepository.find({
      where: { activationStatus: WorkspaceActivationStatus.ACTIVE },
      select: ['id'],
    });

    let enqueuedCount = 0;

    for (let i = 0; i < activeWorkspaces.length; i += WORKSPACE_BATCH_SIZE) {
      const batch = activeWorkspaces.slice(i, i + WORKSPACE_BATCH_SIZE);

      const results = await Promise.allSettled(
        batch.map((w) => this.processWorkspace(w.id)),
      );

      for (const [idx, result] of results.entries()) {
        if (result.status === 'fulfilled') {
          enqueuedCount += result.value;
        } else {
          this.exceptionHandlerService.captureExceptions([result.reason], {
            workspace: { id: batch[idx].id },
          });
        }
      }
    }

    this.logger.log(
      `Completed SequenceAdvanceCronJob, enqueued ${enqueuedCount} steps`,
    );
  }

  private async processWorkspace(workspaceId: string): Promise<number> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const enrollmentRepository =
          await this.globalWorkspaceOrmManager.getRepository<SequenceEnrollmentWorkspaceEntity>(
            workspaceId,
            'sequenceEnrollment',
            { shouldBypassPermissionChecks: true },
          );

        const stepRepository =
          await this.globalWorkspaceOrmManager.getRepository<SequenceStepWorkspaceEntity>(
            workspaceId,
            'sequenceStep',
            { shouldBypassPermissionChecks: true },
          );

        const activeEnrollments = await enrollmentRepository.find({
          where: { status: SequenceEnrollmentStatus.ACTIVE },
        });

        if (activeEnrollments.length === 0) return 0;

        // Cache steps per sequence to avoid N+1
        const stepsCache = new Map<string, SequenceStepWorkspaceEntity[]>();
        const now = Date.now();
        let enqueued = 0;

        for (const enrollment of activeEnrollments) {
          const sequenceId = (enrollment as { sequenceId?: string }).sequenceId;
          if (!sequenceId) continue;

          let steps = stepsCache.get(sequenceId);
          if (!steps) {
            steps = await stepRepository.find({
              where: { sequenceId } as object,
              order: { stepOrder: 'ASC' } as object,
            });
            stepsCache.set(sequenceId, steps);
          }

          const currentStep = steps[enrollment.currentStepIndex];
          if (!currentStep) continue;

          const referenceTime = enrollment.lastStepAt
            ? new Date(enrollment.lastStepAt).getTime()
            : new Date(enrollment.enrolledAt).getTime();
          const dueAt =
            referenceTime + (currentStep.delayDays ?? 0) * MS_PER_DAY;

          if (dueAt > now) continue;

          await this.messageQueueService.add<SequenceStepExecutionJobData>(
            SequenceStepExecutionJob.name,
            { enrollmentId: enrollment.id, workspaceId },
          );
          enqueued++;
        }

        if (enqueued > 0) {
          this.logger.log(
            `Enqueued ${enqueued} sequence steps for workspace ${workspaceId}`,
          );
        }
        return enqueued;
      },
      authContext,
      { lite: true },
    );
  }
}
