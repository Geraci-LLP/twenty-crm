import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { type MigrationInterface } from 'typeorm';

import { type ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { type WorkspaceCommandRunner } from 'src/database/commands/command-runners/workspace.command-runner';
import { getRegisteredWorkspaceCommandMetadata } from 'src/database/commands/decorators/registered-workspace-command.decorator';
import { getRegisteredInstanceMigrationMetadata } from 'src/database/typeorm/core/decorators/registered-instance-migration.decorator';
import {
  UPGRADE_COMMAND_SUPPORTED_VERSIONS,
  type UpgradeCommandVersion,
} from 'src/engine/constants/upgrade-command-supported-versions.constant';

type WorkspaceCommand =
  | WorkspaceCommandRunner
  | ActiveOrSuspendedWorkspaceCommandRunner;

type TimestampedInstanceCommand = {
  command: MigrationInterface;
  timestamp: number;
};

type TimestampedWorkspaceCommand = {
  command: WorkspaceCommand;
  timestamp: number;
};

type VersionBucket = {
  instanceCommands: TimestampedInstanceCommand[];
  workspaceCommands: TimestampedWorkspaceCommand[];
};

@Injectable()
export class UpgradeCommandRegistryService implements OnModuleInit {
  private readonly logger = new Logger(UpgradeCommandRegistryService.name);

  private readonly bucketsByVersion = new Map<
    UpgradeCommandVersion,
    VersionBucket
  >();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit(): void {
    for (const version of UPGRADE_COMMAND_SUPPORTED_VERSIONS) {
      this.bucketsByVersion.set(version, {
        instanceCommands: [],
        workspaceCommands: [],
      });
    }

    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance, metatype } = wrapper;

      if (!instance || !metatype) {
        continue;
      }

      const instanceMigrationMetadata =
        getRegisteredInstanceMigrationMetadata(metatype);

      if (instanceMigrationMetadata !== undefined) {
        const bucket = this.bucketsByVersion.get(
          instanceMigrationMetadata.version,
        );

        if (bucket) {
          bucket.instanceCommands.push({
            command: instance as MigrationInterface,
            timestamp: instanceMigrationMetadata.timestamp,
          });
        }

        continue;
      }

      const workspaceCommandMetadata =
        getRegisteredWorkspaceCommandMetadata(metatype);

      if (workspaceCommandMetadata !== undefined) {
        const bucket = this.bucketsByVersion.get(
          workspaceCommandMetadata.version,
        );

        if (bucket) {
          bucket.workspaceCommands.push({
            command: instance as WorkspaceCommand,
            timestamp: workspaceCommandMetadata.timestamp,
          });
        }
      }
    }

    for (const [, bucket] of this.bucketsByVersion) {
      bucket.instanceCommands.sort(
        (entryA, entryB) => entryA.timestamp - entryB.timestamp,
      );
      bucket.workspaceCommands.sort(
        (entryA, entryB) => entryA.timestamp - entryB.timestamp,
      );
    }

    this.validateNoClassnameAndTimestampDuplicates();

    for (const [version, bucket] of this.bucketsByVersion) {
      const totalCount =
        bucket.instanceCommands.length + bucket.workspaceCommands.length;

      if (totalCount > 0) {
        this.logger.log(
          `Registered ${bucket.instanceCommands.length} instance command(s) and ${bucket.workspaceCommands.length} workspace command(s) for ${version}`,
        );
      }
    }
  }

  getInstanceCommandsForVersion(
    version: UpgradeCommandVersion,
  ): MigrationInterface[] {
    return (
      this.bucketsByVersion
        .get(version)
        ?.instanceCommands.map((entry) => entry.command) ?? []
    );
  }

  getWorkspaceCommandsForVersion(
    version: UpgradeCommandVersion,
  ): WorkspaceCommand[] {
    return (
      this.bucketsByVersion
        .get(version)
        ?.workspaceCommands.map((entry) => entry.command) ?? []
    );
  }

  getAllInstanceCommands(): {
    version: UpgradeCommandVersion;
    migration: MigrationInterface;
  }[] {
    const result: {
      version: UpgradeCommandVersion;
      migration: MigrationInterface;
    }[] = [];

    for (const version of UPGRADE_COMMAND_SUPPORTED_VERSIONS) {
      for (const command of this.getInstanceCommandsForVersion(version)) {
        result.push({ version, migration: command });
      }
    }

    return result;
  }

  private validateNoClassnameAndTimestampDuplicates(): void {
    for (const [version, bucket] of this.bucketsByVersion) {
      this.validateNoTimestampDuplicatesWithinKind(
        version,
        'instance',
        bucket.instanceCommands,
      );
      this.validateNoTimestampDuplicatesWithinKind(
        version,
        'workspace',
        bucket.workspaceCommands,
      );

      const seenClassNames = new Set<string>();

      const allClassNames = [
        ...bucket.instanceCommands.map(
          (entry) => entry.command.constructor.name,
        ),
        ...bucket.workspaceCommands.map(
          (entry) => entry.command.constructor.name,
        ),
      ];

      for (const className of allClassNames) {
        if (seenClassNames.has(className)) {
          throw new Error(
            `Duplicate upgrade command class name "${className}" in version ${version}`,
          );
        }

        seenClassNames.add(className);
      }
    }
  }

  private validateNoTimestampDuplicatesWithinKind(
    version: UpgradeCommandVersion,
    kind: 'instance' | 'workspace',
    entries: {
      command: { constructor: { name: string } };
      timestamp: number;
    }[],
  ): void {
    const seenTimestamps = new Set<number>();

    for (const entry of entries) {
      if (seenTimestamps.has(entry.timestamp)) {
        throw new Error(
          `Duplicate ${kind} command timestamp ${entry.timestamp} in version ${version} (class: ${entry.command.constructor.name})`,
        );
      }

      seenTimestamps.add(entry.timestamp);
    }
  }
}
