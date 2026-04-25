import { Module } from '@nestjs/common';

import { LeadCreationService } from 'src/modules/lead/services/lead-creation.service';

// InboundLeadController temporarily disabled — JwtAuthGuard's AccessTokenService
// dep wasn't resolving cleanly in deployed context. Form→Person path still works
// because form-public.controller.ts uses LeadCreationService directly. Re-enable
// the controller once auth-module wiring is verified locally with `nx serve`.
@Module({
  providers: [LeadCreationService],
  exports: [LeadCreationService],
})
export class LeadModule {}
