import { Module } from '@nestjs/common';

import { TokenModule } from 'src/engine/core-modules/auth/token/token.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { InboundLeadController } from 'src/modules/lead/controllers/inbound-lead.controller';
import { LeadCreationService } from 'src/modules/lead/services/lead-creation.service';

// TokenModule provides AccessTokenService (consumed by JwtAuthGuard).
// WorkspaceCacheStorageModule provides WorkspaceCacheStorageService
// (consumed by both JwtAuthGuard and WorkspaceAuthGuard). Importing
// TokenModule directly instead of the higher-level AuthModule because
// the previous AuthModule attempt didn't resolve cleanly in deployed
// context — TokenModule is the smallest module that exports the service.
@Module({
  imports: [TokenModule, WorkspaceCacheStorageModule],
  controllers: [InboundLeadController],
  providers: [LeadCreationService],
  exports: [LeadCreationService],
})
export class LeadModule {}
