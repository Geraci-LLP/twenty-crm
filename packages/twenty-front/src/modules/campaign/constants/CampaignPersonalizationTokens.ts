import { type CampaignPersonalizationToken } from '@/campaign/types/CampaignTypes';

export const CAMPAIGN_PERSONALIZATION_TOKENS: CampaignPersonalizationToken[] = [
  { label: 'First Name', value: '{{ contact.firstName }}' },
  { label: 'Last Name', value: '{{ contact.lastName }}' },
  { label: 'Full Name', value: '{{ contact.fullName }}' },
  { label: 'Email', value: '{{ contact.email }}' },
  { label: 'Company Name', value: '{{ contact.companyName }}' },
  { label: 'City', value: '{{ contact.city }}' },
  { label: 'Job Title', value: '{{ contact.jobTitle }}' },
];
