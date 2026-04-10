import { Logger, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { AuthGraphqlApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-graphql-api-exception.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import {
  ActivateDripCampaignInput,
  CreateDripCampaignInput,
  EnrollContactsInput,
  PauseDripCampaignInput,
  UnenrollContactInput,
} from 'src/modules/campaign/dtos/drip-campaign.input';
import {
  CreateDripCampaignOutputDTO,
  DripCampaignActionOutputDTO,
  EnrollContactsOutputDTO,
} from 'src/modules/campaign/dtos/drip-campaign-output.dto';
import { DripCampaignService } from 'src/modules/campaign/services/drip-campaign.service';

@MetadataResolver()
@UsePipes(ResolverValidationPipe)
@UseFilters(AuthGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard, NoPermissionGuard)
export class DripCampaignResolver {
  private readonly logger = new Logger(DripCampaignResolver.name);

  constructor(private readonly dripCampaignService: DripCampaignService) {}

  @Mutation(() => CreateDripCampaignOutputDTO)
  async createDripCampaign(
    @Args('input') input: CreateDripCampaignInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CreateDripCampaignOutputDTO> {
    try {
      const result = await this.dripCampaignService.create(
        input.name,
        workspace.id,
      );

      return {
        success: true,
        dripCampaignId: result.dripCampaignId,
      };
    } catch (error) {
      this.logger.error(`Failed to create drip campaign: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create drip campaign',
      };
    }
  }

  @Mutation(() => DripCampaignActionOutputDTO)
  async activateDripCampaign(
    @Args('input') input: ActivateDripCampaignInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<DripCampaignActionOutputDTO> {
    try {
      await this.dripCampaignService.activate(
        input.dripCampaignId,
        workspace.id,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to activate drip campaign: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to activate drip campaign',
      };
    }
  }

  @Mutation(() => DripCampaignActionOutputDTO)
  async pauseDripCampaign(
    @Args('input') input: PauseDripCampaignInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<DripCampaignActionOutputDTO> {
    try {
      await this.dripCampaignService.pause(input.dripCampaignId, workspace.id);

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to pause drip campaign: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to pause drip campaign',
      };
    }
  }

  @Mutation(() => EnrollContactsOutputDTO)
  async enrollContacts(
    @Args('input') input: EnrollContactsInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<EnrollContactsOutputDTO> {
    try {
      const result = await this.dripCampaignService.enrollContacts(
        input.dripCampaignId,
        input.personIds,
        workspace.id,
      );

      return {
        success: true,
        enrolled: result.enrolled,
        skipped: result.skipped,
      };
    } catch (error) {
      this.logger.error(`Failed to enroll contacts: ${error}`);

      return {
        success: false,
        enrolled: 0,
        skipped: 0,
        error:
          error instanceof Error ? error.message : 'Failed to enroll contacts',
      };
    }
  }

  @Mutation(() => DripCampaignActionOutputDTO)
  async unenrollContact(
    @Args('input') input: UnenrollContactInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<DripCampaignActionOutputDTO> {
    try {
      await this.dripCampaignService.unenroll(input.enrollmentId, workspace.id);

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to unenroll contact: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to unenroll contact',
      };
    }
  }
}
