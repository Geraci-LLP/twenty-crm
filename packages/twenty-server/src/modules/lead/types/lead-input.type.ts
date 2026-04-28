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
  // Tags merged into the Person's `tags` array on create. If the
  // Person already exists (dedup by email), tags are merged into the
  // existing record's tags too.
  tags?: string[] | null;
};

export type LeadCreationResult = {
  personId: string;
  created: boolean;
};
