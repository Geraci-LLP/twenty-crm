import { Logger, Scope } from '@nestjs/common';

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { SequenceStepExecutionService } from 'src/modules/sales-sequence/services/sequence-step-execution.service';

export type SequenceStepExecutionJobData = {
  enrollmentId: string;
  workspaceId: string;
};

@Processor({ queueName: MessageQueue.emailQueue, scope: Scope.REQUEST })
export class SequenceStepExecutionJob {
  private readonly logger = new Logger(SequenceStepExecutionJob.name);

  constructor(
    private readonly sequenceStepExecutionService: SequenceStepExecutionService,
  ) {}

  @Process(SequenceStepExecutionJob.name)
  async handle(data: SequenceStepExecutionJobData): Promise<void> {
    this.logger.log(
      `Processing sequence step for enrollment ${data.enrollmentId}`,
    );

    try {
      const result = await this.sequenceStepExecutionService.executeNextStep({
        enrollmentId: data.enrollmentId,
        workspaceId: data.workspaceId,
      });
      this.logger.log(
        `Sequence step result for enrollment ${data.enrollmentId}: ${JSON.stringify(result)}`,
      );
    } catch (error) {
      this.logger.error(
        `Sequence step job failed for enrollment ${data.enrollmentId}: ${error}`,
      );
      throw error;
    }
  }
}
