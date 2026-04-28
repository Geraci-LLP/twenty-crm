import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type SequenceWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence.workspace-entity';
import {
  SequenceEnrollmentStatus,
  type SequenceEnrollmentWorkspaceEntity,
} from 'src/modules/sales-sequence/standard-objects/sequence-enrollment.workspace-entity';
import { type SequenceStepWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence-step.workspace-entity';
import { CampaignWebhookController } from 'src/modules/campaign/controllers/campaign-webhook.controller';
import { SendGridDriverService } from 'src/modules/campaign/services/sendgrid-driver.service';

const SEQUENCE_UNSUBSCRIBE_FOOTER_TEMPLATE = `
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e5e5;font-size:12px;color:#888;font-family:sans-serif;">
  Don't want these emails?
  <a href="{{unsubscribe_link}}" style="color:#888;text-decoration:underline;">Unsubscribe</a>
</div>`;

type StepExecutionInput = {
  enrollmentId: string;
  workspaceId: string;
};

type StepExecutionResult = {
  executed: boolean;
  stepType: string | null;
  nextStepIndex: number | null;
  sequenceCompleted: boolean;
  skipReason?: string;
};

@Injectable()
export class SequenceStepExecutionService {
  private readonly logger = new Logger(SequenceStepExecutionService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly sendGridDriverService: SendGridDriverService,
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

        const sequenceRepository =
          await this.globalWorkspaceOrmManager.getRepository<SequenceWorkspaceEntity>(
            workspaceId,
            'sequence',
            { shouldBypassPermissionChecks: true },
          );

        const personRepository =
          await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
            workspaceId,
            'person',
            { shouldBypassPermissionChecks: true },
          );

        const enrollment = await enrollmentRepository.findOne({
          where: { id: enrollmentId },
        });

        if (!isDefined(enrollment)) {
          this.logger.warn(`Enrollment ${enrollmentId} not found`);
          return this.empty();
        }

        if (enrollment.status !== SequenceEnrollmentStatus.ACTIVE) {
          return this.empty('enrollment-not-active');
        }

        const sequenceId = (enrollment as { sequenceId?: string }).sequenceId;
        const personId = (enrollment as { personId?: string }).personId;

        if (!sequenceId) {
          this.logger.warn(
            `Enrollment ${enrollmentId} has no sequenceId — marking PAUSED`,
          );
          await enrollmentRepository.update(
            { id: enrollmentId },
            { status: SequenceEnrollmentStatus.PAUSED },
          );
          return this.empty('no-sequence-id');
        }

        const sequence = await sequenceRepository.findOne({
          where: { id: sequenceId },
        });

        if (!isDefined(sequence) || sequence.status !== 'ACTIVE') {
          return this.empty('sequence-inactive');
        }

        // Resolve sender via inheritance chain: sequence override → MarketingCampaign
        // default → SEQUENCE_FROM_EMAIL/NAME env var. Fields are custom (added via
        // metadata API) so we cast through unknown to read them.
        const sequenceCustom = sequence as unknown as {
          fromEmail?: string | null;
          fromName?: string | null;
          marketingCampaignId?: string | null;
        };
        let mcDefaultFromEmail: string | null = null;
        let mcDefaultFromName: string | null = null;
        if (sequenceCustom.marketingCampaignId) {
          try {
            const mcRepository =
              await this.globalWorkspaceOrmManager.getRepository<{
                id: string;
                defaultFromEmail: string | null;
                defaultFromName: string | null;
              }>(workspaceId, 'marketingCampaign', {
                shouldBypassPermissionChecks: true,
              });
            const mc = await mcRepository.findOne({
              where: { id: sequenceCustom.marketingCampaignId },
            });
            mcDefaultFromEmail = mc?.defaultFromEmail ?? null;
            mcDefaultFromName = mc?.defaultFromName ?? null;
          } catch (error) {
            this.logger.warn(
              `Could not load MarketingCampaign for sequence ${sequenceId}: ${(error as Error).message}`,
            );
          }
        }
        const resolvedFromEmail =
          sequenceCustom.fromEmail ||
          mcDefaultFromEmail ||
          process.env.SEQUENCE_FROM_EMAIL ||
          'noreply@example.com';
        const resolvedFromName =
          sequenceCustom.fromName ||
          mcDefaultFromName ||
          process.env.SEQUENCE_FROM_NAME ||
          sequence.name ||
          'Sales';

        const steps = await stepRepository.find({
          where: { sequenceId } as object,
          order: { stepOrder: 'ASC' } as object,
        });

        const currentStep = steps[enrollment.currentStepIndex];

        if (!isDefined(currentStep)) {
          // Sequence complete
          await enrollmentRepository.update(
            { id: enrollmentId },
            {
              status: SequenceEnrollmentStatus.COMPLETED,
              completedAt: new Date(),
            },
          );
          return {
            executed: false,
            stepType: null,
            nextStepIndex: null,
            sequenceCompleted: true,
          };
        }

        // Execute the step. Look up person inline if needed for EMAIL.
        let person: PersonWorkspaceEntity | null = null;
        if (currentStep.type === 'EMAIL' && personId) {
          person = await personRepository.findOne({
            where: { id: personId },
            relations: ['company'],
          });
        }

        const sendResult = await this.executeStep({
          step: currentStep,
          enrollment,
          sequence,
          person,
          workspaceId,
          fromEmail: resolvedFromEmail,
          fromName: resolvedFromName,
        });

        if (sendResult.skipped) {
          // Mark enrollment failed-out — usually no email or no person
          await enrollmentRepository.update(
            { id: enrollmentId },
            { status: SequenceEnrollmentStatus.PAUSED },
          );
          return this.empty(sendResult.reason);
        }

        const nextStepIndex = enrollment.currentStepIndex + 1;
        const hasMoreSteps = nextStepIndex < steps.length;
        const newStatus = hasMoreSteps
          ? SequenceEnrollmentStatus.ACTIVE
          : SequenceEnrollmentStatus.COMPLETED;

        await enrollmentRepository.update(
          { id: enrollmentId },
          {
            currentStepIndex: nextStepIndex,
            lastStepAt: new Date(),
            status: newStatus,
            completedAt: hasMoreSteps ? null : new Date(),
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

  private empty(skipReason?: string): StepExecutionResult {
    return {
      executed: false,
      stepType: null,
      nextStepIndex: null,
      sequenceCompleted: false,
      skipReason,
    };
  }

  private async executeStep(args: {
    step: SequenceStepWorkspaceEntity;
    enrollment: SequenceEnrollmentWorkspaceEntity;
    sequence: SequenceWorkspaceEntity;
    person: PersonWorkspaceEntity | null;
    workspaceId: string;
    fromEmail: string;
    fromName: string;
  }): Promise<{ skipped: boolean; reason?: string }> {
    const { step, enrollment, person, workspaceId, fromEmail, fromName } = args;

    switch (step.type) {
      case 'EMAIL': {
        if (!isDefined(person)) {
          this.logger.warn(
            `Enrollment ${enrollment.id}: EMAIL step skipped — no person`,
          );
          return { skipped: true, reason: 'no-person' };
        }

        const primaryEmail = person.emails?.primaryEmail;
        if (!primaryEmail) {
          this.logger.warn(
            `Enrollment ${enrollment.id}: EMAIL step skipped — no primary email`,
          );
          return { skipped: true, reason: 'no-email' };
        }

        const firstName = person.name?.firstName ?? '';
        const lastName = person.name?.lastName ?? '';
        const company = (person as { company?: CompanyWorkspaceEntity })
          .company;

        const baseUrl = process.env.SERVER_URL ?? '';
        const unsubscribeLink =
          CampaignWebhookController.generateSequenceUnsubscribeUrl(
            enrollment.id,
            workspaceId,
            baseUrl,
          );

        const tokens = {
          firstName,
          lastName,
          email: primaryEmail,
          jobTitle: person.jobTitle ?? '',
          city: person.city ?? '',
          companyName: company?.name ?? '',
          unsubscribeLink,
        };

        const subject = this.substitute(step.subject ?? '', tokens);

        // Append unsubscribe footer if the body doesn't already include the token.
        // CAN-SPAM requires a clear unsubscribe mechanism in every commercial email.
        let bodyTemplate = step.bodyHtml ?? '';
        if (
          !bodyTemplate.includes('{{unsubscribe_link}}') &&
          !bodyTemplate.includes('{{ unsubscribe_link }}')
        ) {
          bodyTemplate += SEQUENCE_UNSUBSCRIBE_FOOTER_TEMPLATE;
        }
        const htmlContent = this.substitute(bodyTemplate, tokens);

        try {
          await this.sendGridDriverService.sendBatch({
            subject,
            htmlContent,
            plainTextContent: this.htmlToPlainText(htmlContent),
            from: {
              email: fromEmail,
              name: fromName,
            },
            personalizations: [
              {
                to: primaryEmail,
                customArgs: {
                  sequenceEnrollmentId: enrollment.id,
                  workspaceId,
                },
              },
            ],
            // RFC 8058 one-click unsubscribe headers — required by Gmail/Yahoo
            // bulk-sender rules and recommended by CAN-SPAM compliance reviews.
            headers: {
              'List-Unsubscribe': `<${unsubscribeLink}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          });
          this.logger.log(
            `Sent EMAIL step ${step.stepOrder} to ${primaryEmail} for enrollment ${enrollment.id}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to send EMAIL for enrollment ${enrollment.id}: ${(error as Error).message}`,
          );
          return { skipped: true, reason: 'send-failed' };
        }
        return { skipped: false };
      }

      case 'WAIT':
        // Wait steps are no-ops on execution; the delayDays before the NEXT step
        // is what enforces the wait. We just advance.
        this.logger.log(
          `WAIT step (${step.delayDays}d) advanced for enrollment ${enrollment.id}`,
        );
        return { skipped: false };

      case 'LINKEDIN_TASK':
      case 'CALL_TASK':
        // Manual task creation — not auto-implemented in phase 1.
        this.logger.log(
          `${step.type} step logged for enrollment ${enrollment.id} (manual task creation pending)`,
        );
        return { skipped: false };

      default:
        this.logger.warn(`Unknown step type: ${step.type}`);
        return { skipped: true, reason: 'unknown-step-type' };
    }
  }

  // Replaces {{contact.X}} and {{unsubscribe_link}} tokens. Same shape as campaigns.
  private substitute(template: string, vars: Record<string, string>): string {
    let out = template;
    out = out.replace(/\{\{\s*contact\.firstName\s*\}\}/g, vars.firstName);
    out = out.replace(/\{\{\s*contact\.lastName\s*\}\}/g, vars.lastName);
    out = out.replace(
      /\{\{\s*contact\.fullName\s*\}\}/g,
      `${vars.firstName} ${vars.lastName}`.trim(),
    );
    out = out.replace(/\{\{\s*contact\.email\s*\}\}/g, vars.email);
    out = out.replace(/\{\{\s*contact\.jobTitle\s*\}\}/g, vars.jobTitle);
    out = out.replace(/\{\{\s*contact\.city\s*\}\}/g, vars.city);
    out = out.replace(/\{\{\s*contact\.companyName\s*\}\}/g, vars.companyName);
    out = out.replace(
      /\{\{\s*unsubscribe_link\s*\}\}/g,
      vars.unsubscribeLink ?? '',
    );
    return out;
  }

  private htmlToPlainText(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<\/(p|div|br|h\d|li|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+\n/g, '\n')
      .trim();
  }
}
