import { Logger, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { AuthGraphqlApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-graphql-api-exception.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { InjectMessageQueue } from 'src/engine/core-modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/core-modules/message-queue/services/message-queue.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CampaignActionOutputDTO } from 'src/modules/campaign/dtos/campaign-action-output.dto';
import { PauseCampaignInput } from 'src/modules/campaign/dtos/pause-campaign.input';
import { ScheduleCampaignInput } from 'src/modules/campaign/dtos/schedule-campaign.input';
import { SendCampaignInput } from 'src/modules/campaign/dtos/send-campaign.input';
import {
  CampaignSendJob,
  type CampaignSendJobData,
} from 'src/modules/campaign/jobs/campaign-send.job';
import {
  CampaignStatus,
  type CampaignWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign.workspace-entity';

@MetadataResolver()
@UsePipes(ResolverValidationPipe)
@UseFilters(AuthGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard, NoPermissionGuard)
export class CampaignActionResolver {
  private readonly logger = new Logger(CampaignActionResolver.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    @InjectMessageQueue(MessageQueue.emailQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @Mutation(() => CampaignActionOutputDTO)
  async sendCampaign(
    @Args('input') input: SendCampaignInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CampaignActionOutputDTO> {
    try {
      const campaignRepository =
        await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
          workspace.id,
          'campaign',
          { shouldBypassPermissionChecks: true },
        );

      const campaign = await campaignRepository.findOne({
        where: { id: input.campaignId },
      });

      if (!campaign) {
        return { success: false, error: 'Campaign not found' };
      }

      if (campaign.status !== CampaignStatus.DRAFT) {
        return {
          success: false,
          error: `Campaign must be in DRAFT status to send. Current status: ${campaign.status}`,
        };
      }

      // Update status to SENDING
      await campaignRepository.update(
        { id: input.campaignId },
        { status: CampaignStatus.SENDING },
      );

      // Enqueue the send job
      await this.messageQueueService.add<CampaignSendJobData>(
        CampaignSendJob.name,
        {
          campaignId: input.campaignId,
          workspaceId: workspace.id,
        },
      );

      this.logger.log(
        `Campaign ${input.campaignId} send job enqueued for workspace ${workspace.id}`,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send campaign: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to send campaign',
      };
    }
  }

  @Mutation(() => CampaignActionOutputDTO)
  async scheduleCampaign(
    @Args('input') input: ScheduleCampaignInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CampaignActionOutputDTO> {
    try {
      const campaignRepository =
        await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
          workspace.id,
          'campaign',
          { shouldBypassPermissionChecks: true },
        );

      const campaign = await campaignRepository.findOne({
        where: { id: input.campaignId },
      });

      if (!campaign) {
        return { success: false, error: 'Campaign not found' };
      }

      if (
        campaign.status !== CampaignStatus.DRAFT &&
        campaign.status !== CampaignStatus.SCHEDULED
      ) {
        return {
          success: false,
          error: `Campaign must be in DRAFT or SCHEDULED status to schedule. Current status: ${campaign.status}`,
        };
      }

      const scheduledDate = new Date(input.scheduledAt);

      if (scheduledDate <= new Date()) {
        return {
          success: false,
          error: 'Scheduled date must be in the future',
        };
      }

      await campaignRepository.update(
        { id: input.campaignId },
        {
          status: CampaignStatus.SCHEDULED,
          scheduledDate: scheduledDate.toISOString(),
        },
      );

      this.logger.log(
        `Campaign ${input.campaignId} scheduled for ${scheduledDate.toISOString()}`,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to schedule campaign: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to schedule campaign',
      };
    }
  }

  @Mutation(() => CampaignActionOutputDTO)
  async pauseCampaign(
    @Args('input') input: PauseCampaignInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CampaignActionOutputDTO> {
    try {
      const campaignRepository =
        await this.globalWorkspaceOrmManager.getRepository<CampaignWorkspaceEntity>(
          workspace.id,
          'campaign',
          { shouldBypassPermissionChecks: true },
        );

      const campaign = await campaignRepository.findOne({
        where: { id: input.campaignId },
      });

      if (!campaign) {
        return { success: false, error: 'Campaign not found' };
      }

      if (
        campaign.status !== CampaignStatus.SENDING &&
        campaign.status !== CampaignStatus.SCHEDULED
      ) {
        return {
          success: false,
          error: `Campaign must be in SENDING or SCHEDULED status to pause. Current status: ${campaign.status}`,
        };
      }

      await campaignRepository.update(
        { id: input.campaignId },
        { status: CampaignStatus.PAUSED },
      );

      this.logger.log(`Campaign ${input.campaignId} paused`);

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to pause campaign: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to pause campaign',
      };
    }
  }
}
