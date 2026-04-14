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

          return {
            success: true,
            submissionId: submission.id,
            thankYouMessage: form.thankYouMessage,
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
