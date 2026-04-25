import { Module } from '@nestjs/common';

import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { InboundLeadController } from 'src/modules/lead/controllers/inbound-lead.controller';
import { LeadCreationService } from 'src/modules/lead/services/lead-creation.service';

// AuthModule + WorkspaceCacheStorageModule provide AccessTokenService and
// WorkspaceCacheStorageService — required by JwtAuthGuard + WorkspaceAuthGuard
// applied on the InboundLeadController.
@Module({
  imports: [AuthModule, WorkspaceCacheStorageModule],
  controllers: [InboundLeadController],
  providers: [LeadCreationService],
  exports: [LeadCreationService],
})
export class LeadModule {}
