import { InjectRepository } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import {
  AUTO_SELECT_FAST_MODEL_ID,
  AUTO_SELECT_SMART_MODEL_ID,
} from 'twenty-shared/constants';
import { isDefined, isAutoSelectModelId } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AiModelRegistryService } from 'src/engine/metadata-modules/ai/ai-models/services/ai-model-registry.service';

type WorkspaceModelFields = Pick<
  WorkspaceEntity,
  'smartModel' | 'fastModel' | 'enabledAiModelIds'
>;

@Command({
  name: 'upgrade:1-21:fix-stale-ai-model-defaults',
  description:
    'Reset workspace AI model defaults that reference models no longer in the registry',
})
export class FixStaleAiModelDefaultsCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly aiModelRegistryService: AiModelRegistryService,
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });

    if (!isDefined(workspace)) {
      this.logger.warn(`Workspace ${workspaceId} not found, skipping`);

      return;
    }

    const availableModelIds = new Set(
      this.aiModelRegistryService
        .getAvailableModels()
        .map((model) => model.modelId),
    );

    const updates: Partial<WorkspaceModelFields> = {};
    const changes: string[] = [];

    if (
      !isAutoSelectModelId(workspace.smartModel) &&
      !availableModelIds.has(workspace.smartModel)
    ) {
      updates.smartModel = AUTO_SELECT_SMART_MODEL_ID;
      changes.push(
        `smartModel: "${workspace.smartModel}" → "${AUTO_SELECT_SMART_MODEL_ID}"`,
      );
    }

    if (
      !isAutoSelectModelId(workspace.fastModel) &&
      !availableModelIds.has(workspace.fastModel)
    ) {
      updates.fastModel = AUTO_SELECT_FAST_MODEL_ID;
      changes.push(
        `fastModel: "${workspace.fastModel}" → "${AUTO_SELECT_FAST_MODEL_ID}"`,
      );
    }

    const staleEnabledIds = workspace.enabledAiModelIds.filter(
      (id) => !availableModelIds.has(id),
    );

    if (staleEnabledIds.length > 0) {
      updates.enabledAiModelIds = workspace.enabledAiModelIds.filter((id) =>
        availableModelIds.has(id),
      );
      changes.push(
        `enabledAiModelIds: removed ${staleEnabledIds.length} stale ID(s): ${staleEnabledIds.join(', ')}`,
      );
    }

    if (changes.length === 0) {
      return;
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Workspace ${workspaceId}: ${changes.join('; ')}`,
      );

      return;
    }

    await this.workspaceRepository.update(workspaceId, updates);

    this.logger.log(`Workspace ${workspaceId}: ${changes.join('; ')}`);
  }
}
