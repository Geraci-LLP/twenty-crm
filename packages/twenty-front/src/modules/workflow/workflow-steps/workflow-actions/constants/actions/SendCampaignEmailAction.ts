import { type WorkflowActionType } from '@/workflow/types/Workflow';

export const SEND_CAMPAIGN_EMAIL_ACTION: {
  defaultLabel: string;
  type: Extract<WorkflowActionType, 'SEND_CAMPAIGN_EMAIL'>;
  icon: string;
} = {
  defaultLabel: 'Send Campaign Email',
  type: 'SEND_CAMPAIGN_EMAIL',
  icon: 'IconMail',
};
