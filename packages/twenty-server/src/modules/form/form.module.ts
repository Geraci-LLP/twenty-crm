import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { FormPublicController } from 'src/modules/form/controllers/form-public.controller';
import { FormSubmissionService } from 'src/modules/form/services/form-submission.service';
import { LeadModule } from 'src/modules/lead/lead.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity]), LeadModule],
  controllers: [FormPublicController],
  providers: [FormSubmissionService],
  exports: [],
})
export class FormModule {}
