import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { SequenceEnrollmentService } from 'src/modules/sales-sequence/services/sequence-enrollment.service';
import { SequenceStepExecutionService } from 'src/modules/sales-sequence/services/sequence-step-execution.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  controllers: [],
  providers: [SequenceEnrollmentService, SequenceStepExecutionService],
  exports: [SequenceEnrollmentService],
})
export class SalesSequenceModule {}
