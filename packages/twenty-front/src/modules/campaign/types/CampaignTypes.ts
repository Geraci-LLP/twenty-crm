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
  // Visual builder fields. designJson is the source of truth when designVersion
  // is set; body holds the rendered HTML the server sends. Legacy emails have
  // designJson === null and edit body directly.
  designJson: unknown | null;
  designVersion: number | null;
  previewText: string;
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
