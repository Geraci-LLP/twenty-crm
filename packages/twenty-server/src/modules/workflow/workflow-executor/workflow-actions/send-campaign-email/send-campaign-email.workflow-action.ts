import { Injectable, Logger } from '@nestjs/common';

import { resolveInput } from 'twenty-shared/utils';

import { type WorkflowAction } from 'src/modules/workflow/workflow-executor/interfaces/workflow-action.interface';

import {
  WorkflowStepExecutorException,
  WorkflowStepExecutorExceptionCode,
} from 'src/modules/workflow/workflow-executor/exceptions/workflow-step-executor.exception';
import { type WorkflowActionInput } from 'src/modules/workflow/workflow-executor/types/workflow-action-input';
import { type WorkflowActionOutput } from 'src/modules/workflow/workflow-executor/types/workflow-action-output.type';
import { findStepOrThrow } from 'src/modules/workflow/workflow-executor/utils/find-step-or-throw.util';
import { isWorkflowSendCampaignEmailAction } from 'src/modules/workflow/workflow-executor/workflow-actions/send-campaign-email/guards/is-workflow-send-campaign-email-action.guard';
import { type WorkflowSendCampaignEmailActionInput } from 'src/modules/workflow/workflow-executor/workflow-actions/send-campaign-email/types/workflow-send-campaign-email-action-input.type';
import { SendGridDriverService } from 'src/modules/campaign/services/sendgrid-driver.service';

const UNSUBSCRIBE_FOOTER = `
<div style="text-align: center; padding: 20px 0; font-size: 12px; color: #666;">
  <p>If you no longer wish to receive these emails, you can <a href="{{unsubscribe_link}}" style="color: #666;">unsubscribe here</a>.</p>
</div>`;

@Injectable()
export class SendCampaignEmailWorkflowAction implements WorkflowAction {
  private readonly logger = new Logger(SendCampaignEmailWorkflowAction.name);

  constructor(private readonly sendGridDriverService: SendGridDriverService) {}

  async execute({
    currentStepId,
    steps,
    context,
  }: WorkflowActionInput): Promise<WorkflowActionOutput> {
    const step = findStepOrThrow({
      stepId: currentStepId,
      steps,
    });

    if (!isWorkflowSendCampaignEmailAction(step)) {
      throw new WorkflowStepExecutorException(
        'Step is not a send campaign email action',
        WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE,
      );
    }

    const input = resolveInput(
      step.settings.input,
      context,
    ) as WorkflowSendCampaignEmailActionInput;

    if (!input.recipientEmail) {
      throw new WorkflowStepExecutorException(
        'Recipient email is required',
        WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT,
      );
    }

    if (!input.subject || !input.bodyHtml) {
      throw new WorkflowStepExecutorException(
        'Subject and body are required',
        WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT,
      );
    }

    try {
      // Apply personalization token substitutions
      let htmlContent = input.bodyHtml;
      let subject = input.subject;

      if (input.personalizationData) {
        for (const [token, value] of Object.entries(
          input.personalizationData,
        )) {
          const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escaped, 'g');

          htmlContent = htmlContent.replace(regex, value);
          subject = subject.replace(regex, value);
        }
      }

      // Append unsubscribe footer if no unsubscribe link token present
      if (!htmlContent.includes('{{unsubscribe_link}}')) {
        htmlContent += UNSUBSCRIBE_FOOTER;
      }

      // Generate plain text alternative
      const plainTextContent = this.htmlToPlainText(htmlContent);

      await this.sendGridDriverService.sendBatch({
        subject,
        htmlContent,
        plainTextContent,
        from: {
          email: input.fromEmail,
          name: input.fromName,
        },
        personalizations: [
          {
            to: input.recipientEmail,
            customArgs: {},
          },
        ],
        headers: {
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      });

      this.logger.log(
        `Campaign email sent to ${input.recipientEmail} via SendGrid`,
      );

      return {
        result: {
          success: true,
          recipientEmail: input.recipientEmail,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to send campaign email to ${input.recipientEmail}: ${error}`,
      );

      return {
        error: `Failed to send campaign email: ${error}`,
      };
    }
  }

  private htmlToPlainText(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '$2 ($1)')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
