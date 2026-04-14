import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { EmailService } from 'src/engine/core-modules/email/email.service';
import { type FormWorkspaceEntity } from 'src/modules/form/standard-objects/form.workspace-entity';

type FormField = {
  id: string;
  name: string;
  label: string;
  type: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    patternMessage?: string;
  };
};

@Injectable()
export class FormSubmissionService {
  private readonly logger = new Logger(FormSubmissionService.name);

  constructor(private readonly emailService: EmailService) {}

  validateFields(fields: unknown[], values: Record<string, unknown>): string[] {
    const errors: string[] = [];

    for (const rawField of fields) {
      const field = rawField as FormField;
      if (field.type === 'RECORD') {
        continue;
      }

      const validation = field.validation;

      if (!isDefined(validation)) {
        continue;
      }

      const value = values[field.name];
      const stringValue = typeof value === 'string' ? value : '';
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (typeof value === 'string' && value.trim() === '');

      if (validation.required && isEmpty) {
        errors.push(`${field.label} is required`);
        continue;
      }

      if (isEmpty) {
        continue;
      }

      if (
        isDefined(validation.minLength) &&
        stringValue.length < validation.minLength
      ) {
        errors.push(
          `${field.label} must be at least ${validation.minLength} characters`,
        );
      }

      if (
        isDefined(validation.maxLength) &&
        stringValue.length > validation.maxLength
      ) {
        errors.push(
          `${field.label} must be at most ${validation.maxLength} characters`,
        );
      }

      if (isDefined(validation.min)) {
        const numValue = Number(value);

        if (!isNaN(numValue) && numValue < validation.min) {
          errors.push(`${field.label} must be at least ${validation.min}`);
        }
      }

      if (isDefined(validation.max)) {
        const numValue = Number(value);

        if (!isNaN(numValue) && numValue > validation.max) {
          errors.push(`${field.label} must be at most ${validation.max}`);
        }
      }

      if (isDefined(validation.pattern)) {
        try {
          const regex = new RegExp(validation.pattern);

          if (!regex.test(stringValue)) {
            errors.push(
              validation.patternMessage ??
                `${field.label} has an invalid format`,
            );
          }
        } catch {
          // Invalid regex — skip
        }
      }
    }

    return errors;
  }

  async sendNotificationEmail(
    form: FormWorkspaceEntity,
    submissionData: Record<string, unknown>,
  ): Promise<void> {
    if (!form.notifyOnSubmission || !isDefined(form.notificationEmail)) {
      return;
    }

    try {
      const fieldSummary = Object.entries(submissionData)
        .map(
          ([key, value]) =>
            `<tr><td style="padding:4px 8px;font-weight:bold;">${this.escapeHtml(key)}</td><td style="padding:4px 8px;">${this.escapeHtml(String(value ?? ''))}</td></tr>`,
        )
        .join('');

      await this.emailService.send({
        to: form.notificationEmail,
        subject: `New form submission: ${form.name ?? 'Untitled Form'}`,
        html: `
          <h2>New Form Submission</h2>
          <p>A new submission was received for <strong>${this.escapeHtml(form.name ?? 'Untitled Form')}</strong>.</p>
          <table style="border-collapse:collapse;border:1px solid #ddd;">
            <thead><tr><th style="padding:4px 8px;text-align:left;">Field</th><th style="padding:4px 8px;text-align:left;">Value</th></tr></thead>
            <tbody>${fieldSummary}</tbody>
          </table>
        `,
      });

      this.logger.log(
        `Notification email sent to ${form.notificationEmail} for form ${form.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send notification email for form ${form.id}`,
        error,
      );
    }
  }

  async sendConfirmationEmail(
    form: FormWorkspaceEntity,
    submitterEmail: string,
  ): Promise<void> {
    if (
      !form.sendConfirmationEmail ||
      !isDefined(form.confirmationEmailSubject)
    ) {
      return;
    }

    try {
      const subject = form.confirmationEmailSubject;
      const body =
        form.confirmationEmailBody ??
        `<p>Thank you for your submission to <strong>${this.escapeHtml(form.name ?? 'our form')}</strong>. We have received your response and will be in touch shortly.</p>`;

      await this.emailService.send({
        to: submitterEmail,
        subject,
        html: body,
      });

      this.logger.log(
        `Confirmation email sent to ${submitterEmail} for form ${form.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send confirmation email for form ${form.id}`,
        error,
      );
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
