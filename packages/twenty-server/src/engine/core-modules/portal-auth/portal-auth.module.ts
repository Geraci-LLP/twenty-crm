import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppTokenEntity } from 'src/engine/core-modules/app-token/app-token.entity';
import { EmailModule } from 'src/engine/core-modules/email/email.module';
import { JwtModule } from 'src/engine/core-modules/jwt/jwt.module';
import { PortalAuthController } from 'src/engine/core-modules/portal-auth/controllers/portal-auth.controller';
import { PortalAuthGuard } from 'src/engine/core-modules/portal-auth/guards/portal-auth.guard';
import { PortalResolver } from 'src/engine/core-modules/portal-auth/resolvers/portal.resolver';
import { MagicLinkService } from 'src/engine/core-modules/portal-auth/services/magic-link.service';
import { PortalJwtAuthStrategy } from 'src/engine/core-modules/portal-auth/strategies/portal-jwt.auth.strategy';
import { PortalUserModule } from 'src/engine/core-modules/portal-user/portal-user.module';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { QuotesModule } from 'src/modules/quotes/quotes.module';

@Module({
  imports: [
    JwtModule,
    EmailModule,
    PortalUserModule,
    QuotesModule,
    TypeOrmModule.forFeature([AppTokenEntity, WorkspaceEntity]),
  ],
  controllers: [PortalAuthController],
  providers: [
    MagicLinkService,
    PortalJwtAuthStrategy,
    PortalAuthGuard,
    PortalResolver,
  ],
  exports: [PortalAuthGuard, MagicLinkService],
})
export class PortalAuthModule {}
