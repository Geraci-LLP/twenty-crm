import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { SequenceEnrollmentWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence-enrollment.workspace-entity';
import { SequenceWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence.workspace-entity';

type EnrollPersonInput = {
  sequenceId: string;
  personId: string;
  workspaceId: string;
};

type EnrollmentResult = {
  enrollmentId: string;
  status: string;
};

@Injectable()
export class SequenceEnrollmentService {
  private readonly logger = new Logger(SequenceEnrollmentService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async enrollPerson(input: EnrollPersonInput): Promise<EnrollmentResult> {
    const { sequenceId, personId, workspaceId } = input;
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const sequenceRepository =
          await this.globalWorkspaceOrmManager.getRepository<SequenceWorkspaceEntity>(
            workspaceId,
            'sequence',
            { shouldBypassPermissionChecks: true },
          );

        const enrollmentRepository =
          await this.globalWorkspaceOrmManager.getRepository<SequenceEnrollmentWorkspaceEntity>(
            workspaceId,
            'sequenceEnrollment',
            { shouldBypassPermissionChecks: true },
          );

        const sequence = await sequenceRepository.findOne({
          where: { id: sequenceId },
        });

        if (!isDefined(sequence)) {
          throw new Error(`Sequence ${sequenceId} not found`);
        }

        if (sequence.status !== 'ACTIVE') {
          throw new Error(`Sequence ${sequenceId} is not active`);
        }

        // Check if person is already enrolled in this sequence
        const existingEnrollment = await enrollmentRepository.findOne({
          where: {
            sequenceId,
            personId,
            status: 'ACTIVE' as string,
          } as any,
        });

        if (isDefined(existingEnrollment)) {
          throw new Error(
            `Person ${personId} is already enrolled in sequence ${sequenceId}`,
          );
        }

        const enrollment = await enrollmentRepository.save({
          sequenceId,
          personId,
          status: 'ACTIVE',
          currentStepIndex: 0,
          enrolledAt: new Date(),
          completedAt: null,
          lastStepAt: null,
        } as any);

        // Increment enrollment counts on the sequence (non-blocking)
        sequenceRepository
          .increment({ id: sequenceId }, 'enrollmentCount', 1)
          .catch(() => {});
        sequenceRepository
          .increment({ id: sequenceId }, 'activeEnrollmentCount', 1)
          .catch(() => {});

        this.logger.log(
          `Person ${personId} enrolled in sequence ${sequenceId} (workspace ${workspaceId})`,
        );

        return {
          enrollmentId: enrollment.id,
          status: enrollment.status,
        };
      },
      authContext,
    );
  }

  async pauseEnrollment(
    enrollmentId: string,
    workspaceId: string,
  ): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const enrollmentRepository =
        await this.globalWorkspaceOrmManager.getRepository<SequenceEnrollmentWorkspaceEntity>(
          workspaceId,
          'sequenceEnrollment',
          { shouldBypassPermissionChecks: true },
        );

      await enrollmentRepository.update(
        { id: enrollmentId },
        { status: 'PAUSED' },
      );

      this.logger.log(`Enrollment ${enrollmentId} paused`);
    }, authContext);
  }

  async completeEnrollment(
    enrollmentId: string,
    sequenceId: string,
    workspaceId: string,
  ): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const enrollmentRepository =
        await this.globalWorkspaceOrmManager.getRepository<SequenceEnrollmentWorkspaceEntity>(
          workspaceId,
          'sequenceEnrollment',
          { shouldBypassPermissionChecks: true },
        );

      const sequenceRepository =
        await this.globalWorkspaceOrmManager.getRepository<SequenceWorkspaceEntity>(
          workspaceId,
          'sequence',
          { shouldBypassPermissionChecks: true },
        );

      await enrollmentRepository.update(
        { id: enrollmentId },
        {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      );

      // Update sequence counters (non-blocking)
      sequenceRepository
        .increment({ id: sequenceId }, 'completedCount', 1)
        .catch(() => {});
      sequenceRepository
        .decrement({ id: sequenceId }, 'activeEnrollmentCount', 1)
        .catch(() => {});

      this.logger.log(`Enrollment ${enrollmentId} completed`);
    }, authContext);
  }
}
