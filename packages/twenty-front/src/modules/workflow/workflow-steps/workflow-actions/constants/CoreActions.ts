import { type WorkflowActionType } from '@/workflow/types/Workflow';
import { CODE_ACTION } from '@/workflow/workflow-steps/workflow-actions/constants/actions/CodeAction';
import { DRAFT_EMAIL_ACTION } from '@/workflow/workflow-steps/workflow-actions/constants/actions/DraftEmailAction';
import { HTTP_REQUEST_ACTION } from '@/workflow/workflow-steps/workflow-actions/constants/actions/HttpRequestAction';
import { SEND_CAMPAIGN_EMAIL_ACTION } from '@/workflow/workflow-steps/workflow-actions/constants/actions/SendCampaignEmailAction';
import { SEND_EMAIL_ACTION } from '@/workflow/workflow-steps/workflow-actions/constants/actions/SendEmailAction';

export const CORE_ACTIONS: Array<{
  defaultLabel: string;
  type: Extract<
    WorkflowActionType,
    | 'CODE'
    | 'SEND_EMAIL'
    | 'SEND_CAMPAIGN_EMAIL'
    | 'DRAFT_EMAIL'
    | 'HTTP_REQUEST'
  >;
  icon: string;
}> = [
  SEND_EMAIL_ACTION,
  SEND_CAMPAIGN_EMAIL_ACTION,
  DRAFT_EMAIL_ACTION,
  CODE_ACTION,
  HTTP_REQUEST_ACTION,
];
