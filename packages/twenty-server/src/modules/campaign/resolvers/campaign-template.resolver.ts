import { Logger, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { AuthGraphqlApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-graphql-api-exception.filter';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { MetadataResolver } from 'src/engine/metadata-modules/metadata-resolver.decorator';
import { ResolverValidationPipe } from 'src/engine/metadata-modules/resolver-validation.pipe';
import { type WorkspaceEntity } from 'src/engine/twenty-orm/workspace.entity';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { CampaignActionOutputDTO } from 'src/modules/campaign/dtos/campaign-action-output.dto';
import { LoadTemplateInput } from 'src/modules/campaign/dtos/load-template.input';
import { SaveAsTemplateInput } from 'src/modules/campaign/dtos/save-as-template.input';
import { CampaignTemplateService } from 'src/modules/campaign/services/campaign-template.service';

@MetadataResolver()
@UsePipes(ResolverValidationPipe)
@UseFilters(AuthGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard, NoPermissionGuard)
export class CampaignTemplateResolver {
  private readonly logger = new Logger(CampaignTemplateResolver.name);

  constructor(
    private readonly campaignTemplateService: CampaignTemplateService,
  ) {}

  @Mutation(() => CampaignActionOutputDTO)
  async saveAsTemplate(
    @Args('input') input: SaveAsTemplateInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CampaignActionOutputDTO> {
    try {
      await this.campaignTemplateService.saveAsTemplate(
        workspace.id,
        input.campaignId,
        input.templateName,
        input.category,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to save as template: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to save as template',
      };
    }
  }

  @Mutation(() => CampaignActionOutputDTO)
  async loadTemplate(
    @Args('input') input: LoadTemplateInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CampaignActionOutputDTO> {
    try {
      await this.campaignTemplateService.loadTemplate(
        workspace.id,
        input.templateId,
        input.campaignId,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to load template: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to load template',
      };
    }
  }
}
