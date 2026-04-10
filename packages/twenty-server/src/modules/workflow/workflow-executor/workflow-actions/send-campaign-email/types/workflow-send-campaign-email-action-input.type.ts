export type WorkflowSendCampaignEmailActionInput = {
  recipientEmail: string;
  subject: string;
  bodyHtml: string;
  fromEmail: string;
  fromName: string;
  personalizationData?: Record<string, string>;
};
