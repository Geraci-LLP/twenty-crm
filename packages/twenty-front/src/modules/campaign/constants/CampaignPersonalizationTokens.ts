import { type CampaignPersonalizationToken } from '@/campaign/types/CampaignTypes';

// Tokens emit the unspaced canonical form so SendGrid's substitutions block
// matches without server-side normalization. The server still normalizes
// any spaced variants on send (campaign-executor.normalizeTokensInHtml)
// for backward compatibility with bodies authored before this change.
export const CAMPAIGN_PERSONALIZATION_TOKENS: CampaignPersonalizationToken[] = [
  { label: 'First Name', value: '{{contact.firstName}}' },
  { label: 'Last Name', value: '{{contact.lastName}}' },
  { label: 'Full Name', value: '{{contact.fullName}}' },
  { label: 'Email', value: '{{contact.email}}' },
  { label: 'Company Name', value: '{{contact.companyName}}' },
  { label: 'City', value: '{{contact.city}}' },
  { label: 'Job Title', value: '{{contact.jobTitle}}' },
  { label: 'Unsubscribe Link', value: '{{unsubscribe_link}}' },
];
