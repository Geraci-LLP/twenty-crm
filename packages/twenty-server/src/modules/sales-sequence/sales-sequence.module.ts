import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { CampaignModule } from 'src/modules/campaign/campaign.module';
import { SequenceAdvanceCronCommand } from 'src/modules/sales-sequence/crons/commands/sequence-advance.cron.command';
import { SequenceAdvanceCronJob } from 'src/modules/sales-sequence/crons/jobs/sequence-advance.cron.job';
import { SequenceStepExecutionJob } from 'src/modules/sales-sequence/jobs/sequence-step-execution.job';
import { SequenceEnrollmentService } from 'src/modules/sales-sequence/services/sequence-enrollment.service';
import { SequenceStepExecutionService } from 'src/modules/sales-sequence/services/sequence-step-execution.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity]), CampaignModule],
  controllers: [],
  providers: [
    SequenceEnrollmentService,
    SequenceStepExecutionService,
    SequenceStepExecutionJob,
    SequenceAdvanceCronJob,
    SequenceAdvanceCronCommand,
  ],
  exports: [
    SequenceEnrollmentService,
    SequenceStepExecutionService,
    SequenceAdvanceCronCommand,
  ],
})
export class SalesSequenceModule {}
