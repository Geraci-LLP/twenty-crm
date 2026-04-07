import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { type ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { type WorkspaceCommandRunner } from 'src/database/commands/command-runners/workspace.command-runner';
import { getRegisteredWorkspaceCommandMetadata } from 'src/database/commands/decorators/registered-workspace-command.decorator';
import {
  UPGRADE_COMMAND_SUPPORTED_VERSIONS,
  type UpgradeCommandVersion,
} from 'src/engine/constants/upgrade-command-supported-versions.constant';

type WorkspaceCommand =
  | WorkspaceCommandRunner
  | ActiveOrSuspendedWorkspaceCommandRunner;

type TimestampedCommand = {
  command: WorkspaceCommand;
  timestamp: number;
};

@Injectable()
export class RegisteredWorkspaceCommandService implements OnModuleInit {
  private readonly logger = new Logger(
    RegisteredWorkspaceCommandService.name,
  );

  private readonly commandsByVersion = new Map<
    UpgradeCommandVersion,
    TimestampedCommand[]
  >();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit(): void {
    for (const version of UPGRADE_COMMAND_SUPPORTED_VERSIONS) {
      this.commandsByVersion.set(version, []);
    }

    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance, metatype } = wrapper;

      if (!instance || !metatype) {
        continue;
      }

      const metadata = getRegisteredWorkspaceCommandMetadata(metatype);

      if (metadata === undefined) {
        continue;
      }

      const bucket = this.commandsByVersion.get(metadata.version);

      if (!bucket) {
        continue;
      }

      bucket.push({
        command: instance as WorkspaceCommand,
        timestamp: metadata.timestamp,
      });
    }

    for (const [, bucket] of this.commandsByVersion) {
      bucket.sort((entryA, entryB) => entryA.timestamp - entryB.timestamp);
    }

    for (const [version, bucket] of this.commandsByVersion) {
      if (bucket.length > 0) {
        this.logger.log(
          `Registered ${bucket.length} workspace command(s) for ${version}: ${bucket.map((entry) => entry.command.constructor.name).join(', ')}`,
        );
      }
    }
  }

  getWorkspaceCommandsForVersion(
    version: UpgradeCommandVersion,
  ): WorkspaceCommand[] {
    return (this.commandsByVersion.get(version) ?? []).map(
      (entry) => entry.command,
    );
  }
}
