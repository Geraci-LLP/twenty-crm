import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { LandingPagePublicController } from 'src/modules/landing-page/controllers/landing-page-public.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  controllers: [LandingPagePublicController],
  providers: [],
  exports: [],
})
export class LandingPageModule {}
