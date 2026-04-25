import { Command, CommandRunner } from 'nest-commander';

import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import {
  SEQUENCE_ADVANCE_CRON_PATTERN,
  SequenceAdvanceCronJob,
} from 'src/modules/sales-sequence/crons/jobs/sequence-advance.cron.job';

@Command({
  name: 'cron:sequence:advance',
  description:
    'Polls active sequence enrollments and enqueues those whose next step is due',
})
export class SequenceAdvanceCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.cronQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron({
      jobName: SequenceAdvanceCronJob.name,
      data: undefined,
      options: {
        repeat: { pattern: SEQUENCE_ADVANCE_CRON_PATTERN },
      },
    });
  }
}
