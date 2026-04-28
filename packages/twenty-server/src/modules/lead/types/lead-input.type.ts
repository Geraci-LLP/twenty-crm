export type LeadInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  city?: string | null;
  linkedinUrl?: string | null;
  twitterHandle?: string | null;
  source?: string | null;
};

export type LeadCreationResult = {
  personId: string;
  created: boolean;
};
