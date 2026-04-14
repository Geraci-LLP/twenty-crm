export type CampaignStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'SENDING'
  | 'PAUSED'
  | 'SENT'
  | 'FAILED';

export type CampaignRecipientSelectionMode =
  | 'savedView'
  | 'tag'
  | 'lifecycleStage'
  | 'manual';

export type CampaignPersonalizationToken = {
  label: string;
  value: string;
};

export type CampaignStatsData = {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
};

export type CampaignEditorData = {
  subject: string;
  body: string;
  fromName: string;
  fromEmail: string;
};

export type CampaignSchedule = {
  scheduledAt: Date | null;
};

export type ResolveRecipientsResult = {
  success: boolean;
  created: number;
  skipped: number;
  total: number;
  error?: string;
};
