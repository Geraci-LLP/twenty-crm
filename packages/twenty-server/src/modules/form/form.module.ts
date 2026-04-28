import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { JwtModule } from 'src/engine/core-modules/jwt/jwt.module';
import { FormPublicController } from 'src/modules/form/controllers/form-public.controller';
import { FormLoadTokenService } from 'src/modules/form/services/form-load-token.service';
import { FormRateLimiterService } from 'src/modules/form/services/form-rate-limiter.service';
import { FormSubmissionService } from 'src/modules/form/services/form-submission.service';
import { TurnstileValidatorService } from 'src/modules/form/services/turnstile-validator.service';
import { LeadModule } from 'src/modules/lead/lead.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity]), LeadModule, JwtModule],
  controllers: [FormPublicController],
  providers: [
    FormSubmissionService,
    TurnstileValidatorService,
    FormLoadTokenService,
    FormRateLimiterService,
  ],
  exports: [],
})
export class FormModule {}
