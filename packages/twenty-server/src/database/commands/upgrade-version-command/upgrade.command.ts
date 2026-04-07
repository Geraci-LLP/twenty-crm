import { InjectDataSource } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { DataSource } from 'typeorm';

import { UpgradeCommandRunner } from 'src/database/commands/command-runners/upgrade.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { CoreEngineVersionService } from 'src/engine/core-engine-version/services/core-engine-version.service';
import { InstanceUpgradeService } from 'src/engine/core-modules/upgrade/services/instance-upgrade.service';
import { UpgradeCommandRegistryService } from 'src/engine/core-modules/upgrade/services/upgrade-command-registry.service';
import { WorkspaceUpgradeService } from 'src/engine/core-modules/upgrade/services/workspace-upgrade.service';
import { WorkspaceVersionService } from 'src/engine/workspace-manager/workspace-version/services/workspace-version.service';

@Command({
  name: 'upgrade',
  description: 'Upgrade workspaces to the latest version',
})
export class UpgradeCommand extends UpgradeCommandRunner {
  constructor(
    protected readonly coreEngineVersionService: CoreEngineVersionService,
    protected readonly workspaceVersionService: WorkspaceVersionService,
    protected readonly upgradeCommandRegistryService: UpgradeCommandRegistryService,
    protected readonly instanceUpgradeService: InstanceUpgradeService,
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    protected readonly workspaceUpgradeService: WorkspaceUpgradeService,
    @InjectDataSource()
    protected readonly dataSource: DataSource,
  ) {
    super(
      coreEngineVersionService,
      workspaceVersionService,
      upgradeCommandRegistryService,
      instanceUpgradeService,
      workspaceIteratorService,
      workspaceUpgradeService,
      dataSource,
    );
  }
}
