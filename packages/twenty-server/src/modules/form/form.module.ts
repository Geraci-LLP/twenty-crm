import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { FormPublicController } from 'src/modules/form/controllers/form-public.controller';
import { FormSubmissionService } from 'src/modules/form/services/form-submission.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  controllers: [FormPublicController],
  providers: [FormSubmissionService],
  exports: [],
})
export class FormModule {}
