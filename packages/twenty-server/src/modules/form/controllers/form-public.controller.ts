import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isDefined } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type FormWorkspaceEntity } from 'src/modules/form/standard-objects/form.workspace-entity';
import { type FormSubmissionWorkspaceEntity } from 'src/modules/form/standard-objects/form-submission.workspace-entity';
import { FormSubmissionService } from 'src/modules/form/services/form-submission.service';
import { LeadCreationService } from 'src/modules/lead/services/lead-creation.service';
import { mapFieldsToLeadInput } from 'src/modules/lead/utils/map-fields-to-lead.util';

type SubmitFormBody = {
  fields: Record<string, unknown>;
  submitterEmail?: string;
  submitterName?: string;
};

@Controller('forms')
export class FormPublicController {
  private readonly logger = new Logger(FormPublicController.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly formSubmissionService: FormSubmissionService,
    private readonly leadCreationService: LeadCreationService,
  ) {}

  @Get(':workspaceId/:formId/schema')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getFormSchema(
    @Param('workspaceId') workspaceId: string,
    @Param('formId') formId: string,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const form = await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const formRepository =
          await this.globalWorkspaceOrmManager.getRepository<FormWorkspaceEntity>(
            workspaceId,
            'form',
            { shouldBypassPermissionChecks: true },
          );

        return formRepository.findOne({
          where: { id: formId },
        });
      },
      authContext,
    );

    if (!isDefined(form)) {
      throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
    }

    if (form.status !== 'PUBLISHED') {
      throw new HttpException('Form is not published', HttpStatus.NOT_FOUND);
    }

    return {
      id: form.id,
      name: form.name,
      description: form.description,
      fields: form.fieldsConfig,
      thankYouMessage: form.thankYouMessage,
      redirectUrl: form.redirectUrl,
    };
  }

  @Post(':workspaceId/:formId/submit')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async submitForm(
    @Param('workspaceId') workspaceId: string,
    @Param('formId') formId: string,
    @Body() body: SubmitFormBody,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const formRepository =
            await this.globalWorkspaceOrmManager.getRepository<FormWorkspaceEntity>(
              workspaceId,
              'form',
              { shouldBypassPermissionChecks: true },
            );

          const form = await formRepository.findOne({
            where: { id: formId },
          });

          if (!isDefined(form)) {
            throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
          }

          if (form.status !== 'PUBLISHED') {
            throw new HttpException(
              'Form is not published',
              HttpStatus.NOT_FOUND,
            );
          }

          // Server-side field validation
          const fieldsConfig = Array.isArray(form.fieldsConfig)
            ? form.fieldsConfig
            : [];

          const validationErrors = this.formSubmissionService.validateFields(
            fieldsConfig as unknown[],
            body.fields ?? {},
          );

          if (validationErrors.length > 0) {
            throw new HttpException(
              {
                message: 'Validation failed',
                errors: validationErrors,
              },
              HttpStatus.BAD_REQUEST,
            );
          }

          const submissionRepository =
            await this.globalWorkspaceOrmManager.getRepository<FormSubmissionWorkspaceEntity>(
              workspaceId,
              'formSubmission',
              { shouldBypassPermissionChecks: true },
            );

          const submission = await submissionRepository.save({
            data: body.fields ?? {},
            submitterEmail: body.submitterEmail ?? null,
            submitterName: body.submitterName ?? null,
            source: 'DIRECT',
            formId: form.id,
          });

          await formRepository.increment({ id: formId }, 'submissionCount', 1);

          // Send notification email (async, non-blocking)
          this.formSubmissionService
            .sendNotificationEmail(form, body.fields ?? {})
            .catch(() => {});

          // Send confirmation email to submitter (async, non-blocking)
          if (isDefined(body.submitterEmail)) {
            this.formSubmissionService
              .sendConfirmationEmail(form, body.submitterEmail)
              .catch(() => {});
          }

          // Auto-create Person from submission. Convention-based field mapping —
          // any submitted value whose key looks like an email/name/phone/etc. flows
          // into a LeadInput. No-op if no email field present.
          const submissionValues: Record<string, unknown> = {
            ...(body.fields ?? {}),
            ...(body.submitterEmail ? { email: body.submitterEmail } : {}),
            ...(body.submitterName ? { firstName: body.submitterName } : {}),
          };
          const leadInput = mapFieldsToLeadInput(submissionValues);
          let personId: string | null = null;
          if (leadInput) {
            try {
              const lead = await this.leadCreationService.findOrCreatePerson(
                workspaceId,
                { ...leadInput, source: leadInput.source ?? 'FORM' },
              );
              personId = lead.personId;
            } catch (error) {
              this.logger.error(
                `Form ${formId}: lead auto-create failed — ${(error as Error).message}`,
              );
            }
          }

          return {
            success: true,
            submissionId: submission.id,
            personId,
            thankYouMessage: form.thankYouMessage,
            redirectUrl: form.redirectUrl,
          };
        },
        authContext,
      );

    this.logger.log(
      `Form submission received for form ${formId} in workspace ${workspaceId}`,
    );

    return result;
  }

  private async validateWorkspace(workspaceId: string): Promise<void> {
    const workspaceExists = await this.workspaceRepository.existsBy({
      id: workspaceId,
    });

    if (!workspaceExists) {
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
    }
  }
}
