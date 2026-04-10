import {
  type WorkflowAction,
  WorkflowActionType,
  type WorkflowSendCampaignEmailAction,
} from 'src/modules/workflow/workflow-executor/workflow-actions/types/workflow-action.type';

export const isWorkflowSendCampaignEmailAction = (
  action: WorkflowAction,
): action is WorkflowSendCampaignEmailAction => {
  return action.type === WorkflowActionType.SEND_CAMPAIGN_EMAIL;
};
