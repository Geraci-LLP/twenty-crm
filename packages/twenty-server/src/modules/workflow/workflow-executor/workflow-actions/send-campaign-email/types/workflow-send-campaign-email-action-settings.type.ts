import { type WorkflowSendCampaignEmailActionInput } from 'src/modules/workflow/workflow-executor/workflow-actions/send-campaign-email/types/workflow-send-campaign-email-action-input.type';
import { type BaseWorkflowActionSettings } from 'src/modules/workflow/workflow-executor/workflow-actions/types/workflow-action-settings.type';

export type WorkflowSendCampaignEmailActionSettings =
  BaseWorkflowActionSettings & {
    input: WorkflowSendCampaignEmailActionInput;
  };
