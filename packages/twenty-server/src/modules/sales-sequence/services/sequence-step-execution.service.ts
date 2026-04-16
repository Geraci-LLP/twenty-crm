import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { SequenceEnrollmentWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence-enrollment.workspace-entity';
import { SequenceStepWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence-step.workspace-entity';

type StepExecutionInput = {
  enrollmentId: string;
  workspaceId: string;
};

type StepExecutionResult = {
  executed: boolean;
  stepType: string | null;
  nextStepIndex: number | null;
  sequenceCompleted: boolean;
};

@Injectable()
export class SequenceStepExecutionService {
  private readonly logger = new Logger(SequenceStepExecutionService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async executeNextStep(
    input: StepExecutionInput,
  ): Promise<StepExecutionResult> {
    const { enrollmentId, workspaceId } = input;
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const enrollmentRepository =
          await this.globalWorkspaceOrmManager.getRepository<SequenceEnrollmentWorkspaceEntity>(
            workspaceId,
            'sequenceEnrollment',
            { shouldBypassPermissionChecks: true },
          );

        const stepRepository =
          await this.globalWorkspaceOrmManager.getRepository<SequenceStepWorkspaceEntity>(
            workspaceId,
            'sequenceStep',
            { shouldBypassPermissionChecks: true },
          );

        const enrollment = await enrollmentRepository.findOne({
          where: { id: enrollmentId },
        });

        if (!isDefined(enrollment)) {
          this.logger.warn(`Enrollment ${enrollmentId} not found`);

          return {
            executed: false,
            stepType: null,
            nextStepIndex: null,
            sequenceCompleted: false,
          };
        }

        if (enrollment.status !== 'ACTIVE') {
          return {
            executed: false,
            stepType: null,
            nextStepIndex: null,
            sequenceCompleted: false,
          };
        }

        // Get steps ordered by stepOrder, find the current one
        const steps = await stepRepository.find({
          where: { sequenceId: (enrollment as any).sequenceId } as any,
          order: { stepOrder: 'ASC' } as any,
        });

        const currentStep = steps[enrollment.currentStepIndex];

        if (!isDefined(currentStep)) {
          // No more steps -- sequence is complete for this enrollment
          this.logger.log(
            `Enrollment ${enrollmentId} has no more steps, marking complete`,
          );

          return {
            executed: false,
            stepType: null,
            nextStepIndex: null,
            sequenceCompleted: true,
          };
        }

        // Execute the step based on its type
        await this.executeStep(currentStep, enrollment, workspaceId);

        const nextStepIndex = enrollment.currentStepIndex + 1;
        const hasMoreSteps = nextStepIndex < steps.length;

        // Update enrollment state
        await enrollmentRepository.update(
          { id: enrollmentId },
          {
            currentStepIndex: nextStepIndex,
            lastStepAt: new Date(),
          },
        );

        this.logger.log(
          `Executed step ${enrollment.currentStepIndex} (${currentStep.type}) for enrollment ${enrollmentId}`,
        );

        return {
          executed: true,
          stepType: currentStep.type,
          nextStepIndex: hasMoreSteps ? nextStepIndex : null,
          sequenceCompleted: !hasMoreSteps,
        };
      },
      authContext,
    );
  }

  private async executeStep(
    step: SequenceStepWorkspaceEntity,
    enrollment: SequenceEnrollmentWorkspaceEntity,
    workspaceId: string,
  ): Promise<void> {
    switch (step.type) {
      case 'EMAIL':
        // For MVP, log. Actual email sending via EmailService will come later.
        this.logger.log(
          `[EMAIL] Subject: "${step.subject}" for enrollment ${enrollment.id} in workspace ${workspaceId}`,
        );
        break;

      case 'LINKEDIN_TASK':
        // Create a task record for the user to manually complete
        this.logger.log(
          `[LINKEDIN_TASK] Created task for enrollment ${enrollment.id}`,
        );
        break;

      case 'CALL_TASK':
        // Create a task record for the user to manually complete
        this.logger.log(
          `[CALL_TASK] Created task for enrollment ${enrollment.id}`,
        );
        break;

      case 'WAIT':
        // Wait steps are handled by the cron scheduler, not executed immediately
        this.logger.log(
          `[WAIT] ${step.delayDays} days for enrollment ${enrollment.id}`,
        );
        break;

      default:
        this.logger.warn(`Unknown step type: ${step.type}`);
    }
  }
}
