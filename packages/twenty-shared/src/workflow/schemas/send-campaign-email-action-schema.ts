import { z } from 'zod';
import { baseWorkflowActionSchema } from './base-workflow-action-schema';
import { workflowSendCampaignEmailActionSettingsSchema } from './send-campaign-email-action-settings-schema';

export const workflowSendCampaignEmailActionSchema =
  baseWorkflowActionSchema.extend({
    type: z.literal('SEND_CAMPAIGN_EMAIL'),
    settings: workflowSendCampaignEmailActionSettingsSchema,
  });
