import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { FormPublicController } from 'src/modules/form/controllers/form-public.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  controllers: [FormPublicController],
  providers: [],
  exports: [],
})
export class FormModule {}
