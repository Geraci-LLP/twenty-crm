import { Module } from '@nestjs/common';

import { InboundLeadController } from 'src/modules/lead/controllers/inbound-lead.controller';
import { LeadCreationService } from 'src/modules/lead/services/lead-creation.service';

@Module({
  imports: [],
  controllers: [InboundLeadController],
  providers: [LeadCreationService],
  exports: [LeadCreationService],
})
export class LeadModule {}
