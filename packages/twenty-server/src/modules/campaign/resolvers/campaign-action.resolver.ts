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
import { ResolveRecipientsOutputDTO } from 'src/modules/campaign/dtos/resolve-recipients-output.dto';
import {
  RecipientSelectionMode,
  ResolveRecipientsInput,
} from 'src/modules/campaign/dtos/resolve-recipients.input';
import { ResumeCampaignInput } from 'src/modules/campaign/dtos/resume-campaign.input';
import { ScheduleCampaignInput } from 'src/modules/campaign/dtos/schedule-campaign.input';
import { SendCampaignInput } from 'src/modules/campaign/dtos/send-campaign.input';
import { SendTestEmailInput } from 'src/modules/campaign/dtos/send-test-email.input';
import {
  CampaignSendJob,
  type CampaignSendJobData,
} from 'src/modules/campaign/jobs/campaign-send.job';
import { CampaignRecipientService } from 'src/modules/campaign/services/campaign-recipient.service';
import { CampaignValidationService } from 'src/modules/campaign/services/campaign-validation.service';
import { SendGridDriverService } from 'src/modules/campaign/services/sendgrid-driver.service';
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
    private readonly campaignRecipientService: CampaignRecipientService,
    private readonly campaignValidationService: CampaignValidationService,
    private readonly sendGridDriverService: SendGridDriverService,
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

      // Validate campaign content and recipients
      const validation =
        await this.campaignValidationService.validateBeforeSend(
          input.campaignId,
          workspace.id,
        );

      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join('; '),
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

      // Validate campaign content and recipients
      const validation =
        await this.campaignValidationService.validateBeforeSend(
          input.campaignId,
          workspace.id,
        );

      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join('; '),
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

  @Mutation(() => CampaignActionOutputDTO)
  async resumeCampaign(
    @Args('input') input: ResumeCampaignInput,
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

      if (campaign.status !== CampaignStatus.PAUSED) {
        return {
          success: false,
          error: `Campaign must be in PAUSED status to resume. Current status: ${campaign.status}`,
        };
      }

      await campaignRepository.update(
        { id: input.campaignId },
        { status: CampaignStatus.SENDING },
      );

      // Re-enqueue the send job — executor skips already-sent recipients
      await this.messageQueueService.add<CampaignSendJobData>(
        CampaignSendJob.name,
        {
          campaignId: input.campaignId,
          workspaceId: workspace.id,
        },
      );

      this.logger.log(`Campaign ${input.campaignId} resumed`);

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to resume campaign: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to resume campaign',
      };
    }
  }

  @Mutation(() => CampaignActionOutputDTO)
  async sendTestEmail(
    @Args('input') input: SendTestEmailInput,
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

      // Replace personalization tokens with sample data
      const sampleBody = (campaign.bodyHtml ?? '')
        .replace(/\{\{contact\.firstName\}\}/g, 'Test')
        .replace(/\{\{contact\.lastName\}\}/g, 'User')
        .replace(/\{\{contact\.fullName\}\}/g, 'Test User')
        .replace(/\{\{contact\.email\}\}/g, input.testEmailAddress)
        .replace(/\{\{contact\.jobTitle\}\}/g, 'Tester')
        .replace(/\{\{contact\.city\}\}/g, 'Test City')
        .replace(/\{\{contact\.companyName\}\}/g, 'ACME Corp');

      await this.sendGridDriverService.send({
        to: input.testEmailAddress,
        from: {
          address: campaign.fromEmail ?? '',
          name: campaign.fromName ?? '',
        },
        subject: `[TEST] ${campaign.subject ?? ''}`,
        html: sampleBody,
      });

      this.logger.log(
        `Test email sent for campaign ${input.campaignId} to ${input.testEmailAddress}`,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send test email: ${error}`);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to send test email',
      };
    }
  }

  @Mutation(() => ResolveRecipientsOutputDTO)
  async resolveRecipients(
    @Args('input') input: ResolveRecipientsInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<ResolveRecipientsOutputDTO> {
    try {
      let result: { created: number; skipped: number; total: number };

      if (input.mode === RecipientSelectionMode.SAVED_VIEW) {
        if (!input.viewId) {
          return {
            success: false,
            created: 0,
            skipped: 0,
            total: 0,
            error: 'viewId is required for SAVED_VIEW mode',
          };
        }

        result = await this.campaignRecipientService.resolveFromSavedView(
          input.viewId,
          input.campaignId,
          workspace.id,
        );
      } else {
        if (!input.personIds || input.personIds.length === 0) {
          return {
            success: false,
            created: 0,
            skipped: 0,
            total: 0,
            error: 'personIds is required for MANUAL mode',
          };
        }

        result = await this.campaignRecipientService.resolveFromManual(
          input.personIds,
          input.campaignId,
          workspace.id,
        );
      }

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      this.logger.error(`Failed to resolve recipients: ${error}`);

      return {
        success: false,
        created: 0,
        skipped: 0,
        total: 0,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to resolve recipients',
      };
    }
  }
}
