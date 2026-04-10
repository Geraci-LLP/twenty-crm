import { z } from 'zod';
import { baseWorkflowActionSettingsSchema } from './base-workflow-action-settings-schema';

export const workflowSendCampaignEmailActionSettingsSchema =
  baseWorkflowActionSettingsSchema.extend({
    input: z.object({
      recipientEmail: z
        .string()
        .describe('The email address to send to. Can use variables.'),
      subject: z
        .string()
        .describe(
          'The email subject line. Can include personalization tokens.',
        ),
      bodyHtml: z
        .string()
        .describe(
          'The HTML body content. Can include personalization tokens like {{contact.firstName}}.',
        ),
      fromEmail: z.string().describe('The sender email address.'),
      fromName: z.string().describe('The sender display name.'),
      personalizationData: z
        .record(z.string(), z.string())
        .optional()
        .describe(
          'Key-value pairs for personalization token substitution in subject and body.',
        ),
    }),
  });
