import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { DocumentPublicController } from 'src/modules/document-tracking/controllers/document-public.controller';
import { DocumentViewService } from 'src/modules/document-tracking/services/document-view.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  controllers: [DocumentPublicController],
  providers: [DocumentViewService],
  exports: [],
})
export class DocumentTrackingModule {}
