import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import chalk from 'chalk';
import { Command, CommandRunner, Option } from 'nest-commander';
import { Repository } from 'typeorm';

import { WorkspaceActivationStatus } from 'twenty-shared/workspace';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { TwentyStandardApplicationService } from 'src/engine/workspace-manager/twenty-standard-application/services/twenty-standard-application.service';

type SyncWorkspaceStandardMetadataOptions = {
  workspaceId?: string;
};

@Command({
  name: 'workspace:sync-standard-metadata',
  description:
    'Synchronize twenty-standard application metadata for all active workspaces. Creates missing standard objects, fields, views, and navigation menu items.',
})
export class SyncWorkspaceStandardMetadataCommand extends CommandRunner {
  private readonly logger = new Logger(
    SyncWorkspaceStandardMetadataCommand.name,
  );

  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly twentyStandardApplicationService: TwentyStandardApplicationService,
  ) {
    super();
  }

  @Option({
    flags: '-w, --workspace-id [workspace_id]',
    description:
      'Sync a specific workspace. If not provided, syncs all active workspaces.',
    required: false,
  })
  parseWorkspaceId(val: string): string {
    return val;
  }

  async run(
    _passedParams: string[],
    options: SyncWorkspaceStandardMetadataOptions,
  ): Promise<void> {
    const workspaces = options.workspaceId
      ? await this.workspaceRepository.find({
          where: { id: options.workspaceId },
        })
      : await this.workspaceRepository.find({
          where: { activationStatus: WorkspaceActivationStatus.ACTIVE },
        });

    if (workspaces.length === 0) {
      this.logger.warn(chalk.yellow('No workspaces found'));

      return;
    }

    this.logger.log(
      `Syncing standard metadata for ${workspaces.length} workspace(s)...`,
    );

    let succeeded = 0;
    let failed = 0;

    for (const workspace of workspaces) {
      try {
        this.logger.log(
          `Syncing workspace ${workspace.id} (${workspace.displayName})...`,
        );

        await this.twentyStandardApplicationService.synchronizeTwentyStandardApplicationOrThrow(
          { workspaceId: workspace.id },
        );

        this.logger.log(
          chalk.green(`Workspace ${workspace.id} synced successfully`),
        );
        succeeded++;
      } catch (error) {
        this.logger.error(
          chalk.red(
            `Failed to sync workspace ${workspace.id}: ${error.message}`,
          ),
        );
        failed++;
      }
    }

    this.logger.log(`Sync complete: ${succeeded} succeeded, ${failed} failed`);

    if (failed > 0) {
      throw new Error(`Sync completed with ${failed} failure(s)`);
    }
  }
}
