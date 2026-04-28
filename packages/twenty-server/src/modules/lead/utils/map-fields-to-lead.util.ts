import { type LeadInput } from 'src/modules/lead/types/lead-input.type';

// Maps a flat record of submitted values (form fields, webhook payload, etc.) to a
// LeadInput by matching field names against known conventions. Match is case-insensitive
// and ignores spaces/underscores/hyphens, so "First Name", "first_name", "firstname"
// all resolve to firstName.
const FIELD_NAME_PATTERNS: Record<keyof LeadInput, RegExp[]> = {
  email: [/^email$/, /^emailaddress$/, /^primaryemail$/, /^workemail$/],
  firstName: [/^firstname$/, /^givenname$/, /^fname$/],
  lastName: [/^lastname$/, /^surname$/, /^familyname$/, /^lname$/],
  phone: [
    /^phone$/,
    /^phonenumber$/,
    /^primaryphone$/,
    /^mobile$/,
    /^mobilephone$/,
    /^cellphone$/,
  ],
  jobTitle: [/^jobtitle$/, /^title$/, /^role$/, /^position$/],
  city: [/^city$/, /^town$/],
  linkedinUrl: [
    /^linkedin$/,
    /^linkedinurl$/,
    /^linkedinlink$/,
    /^linkedinprofile$/,
  ],
  twitterHandle: [
    /^twitter$/,
    /^twitterhandle$/,
    /^twitterusername$/,
    /^xhandle$/,
    /^xusername$/,
  ],
  source: [/^source$/, /^leadsource$/, /^utmsource$/],
};

const normalizeKey = (key: string): string =>
  key.toLowerCase().replace(/[\s_\-./]+/g, '');

export const mapFieldsToLeadInput = (
  values: Record<string, unknown>,
): LeadInput | null => {
  const result: Partial<LeadInput> = {};

  for (const [rawKey, rawValue] of Object.entries(values)) {
    if (rawValue === null || rawValue === undefined || rawValue === '')
      continue;
    const value = String(rawValue).trim();
    if (value === '') continue;
    const normalized = normalizeKey(rawKey);

    for (const [target, patterns] of Object.entries(FIELD_NAME_PATTERNS)) {
      if (patterns.some((re) => re.test(normalized))) {
        const key = target as keyof LeadInput;
        // First match wins — don't overwrite a previously-mapped value
        if (result[key] === undefined) result[key] = value;
        break;
      }
    }
  }

  if (!result.email) return null;
  return result as LeadInput;
};

// Twenty's PHONES validates as E.164. Coerce common US formats; return null if we can't
// make sense of the value (caller should drop the phone rather than reject the lead).
export const normalizePhoneToE164 = (raw: string): string | null => {
  let s = raw
    .trim()
    .replace(/^tel:/i, '')
    .replace(/\s*x\d+$/i, '');
  const hasPlus = s.startsWith('+');
  const digits = s.replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
  if (hasPlus && digits.length >= 7 && digits.length <= 15) return '+' + digits;
  if (digits.length >= 10 && digits.length <= 12) return '+' + digits;
  return null;
};
