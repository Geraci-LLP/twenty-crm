import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { type Request } from 'express';

import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { LeadCreationService } from 'src/modules/lead/services/lead-creation.service';
import { mapFieldsToLeadInput } from 'src/modules/lead/utils/map-fields-to-lead.util';
import { type LeadInput } from 'src/modules/lead/types/lead-input.type';

type InboundLeadBody = LeadInput | Record<string, unknown>;

const isStructuredLead = (body: InboundLeadBody): body is LeadInput =>
  typeof (body as LeadInput).email === 'string' &&
  (body as LeadInput).email.trim().length > 0;

@Controller('inbound')
export class InboundLeadController {
  private readonly logger = new Logger(InboundLeadController.name);

  constructor(private readonly leadCreationService: LeadCreationService) {}

  // POST /inbound/leads
  // Auth: Bearer <workspace API key>
  // Body: either { email, firstName?, lastName?, phone?, jobTitle?, city?, linkedinUrl?,
  //   twitterHandle?, source? } or a flat record (Wufoo/Typeform-style) with arbitrary
  //   key names — we'll best-effort map keys like "Email", "first_name", etc.
  @Post('leads')
  @UseGuards(JwtAuthGuard, WorkspaceAuthGuard, NoPermissionGuard)
  async createInboundLead(
    @Req() request: Request & { workspaceId?: string },
    @Body() body: InboundLeadBody,
  ) {
    const workspaceId = request.workspaceId;
    if (!workspaceId) {
      throw new HttpException('Workspace context missing', HttpStatus.UNAUTHORIZED);
    }

    const leadInput: LeadInput | null = isStructuredLead(body)
      ? body
      : mapFieldsToLeadInput(body);

    if (!leadInput) {
      throw new HttpException(
        'Could not extract a lead — payload must include an email field',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.leadCreationService.findOrCreatePerson(
      workspaceId,
      leadInput,
    );

    return {
      success: true,
      ...result,
    };
  }
}
