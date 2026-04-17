import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PortalUserEntity } from 'src/engine/core-modules/portal-user/portal-user.entity';
import { PortalUserService } from 'src/engine/core-modules/portal-user/services/portal-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([PortalUserEntity])],
  providers: [PortalUserService],
  exports: [PortalUserService, TypeOrmModule],
})
export class PortalUserModule {}
