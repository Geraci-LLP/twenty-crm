// Client-side mirror of the server's literal-string substitution. Used by the
// editor's preview-as-contact feature to show how an email will render for a
// real recipient. The wire format on send is still produced by the server's
// SendGrid substitutions block — this util does NOT change what's actually
// emailed, only what the user sees in the in-app preview.
//
// Tolerates both `{{contact.firstName}}` and `{{ contact.firstName }}` because
// the front-end token dropdown emits the spaced form while the server's
// substitutions block keys on the unspaced form (pre-existing). A unified
// shared util in twenty-shared + a server-side normalize step are tracked as
// a follow-up — for now this util just accepts both.

export type PreviewContactValues = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  city: string;
  companyName: string;
};

const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildPattern = (innerKey: string): RegExp => {
  // Match {{key}} OR {{ key }} (with optional whitespace inside the braces).
  return new RegExp(`\\{\\{\\s*${escapeRegex(innerKey)}\\s*\\}\\}`, 'g');
};

export const substituteCampaignTokens = (
  html: string,
  contact: PreviewContactValues,
): string => {
  const fullName = `${contact.firstName} ${contact.lastName}`.trim();

  const replacements: ReadonlyArray<[string, string]> = [
    ['contact.firstName', contact.firstName],
    ['contact.lastName', contact.lastName],
    ['contact.fullName', fullName],
    ['contact.email', contact.email],
    ['contact.jobTitle', contact.jobTitle],
    ['contact.city', contact.city],
    ['contact.companyName', contact.companyName],
  ];

  let out = html;
  for (const [key, value] of replacements) {
    out = out.replace(buildPattern(key), value);
  }
  // Unsubscribe link is a real signed URL on send; in preview, render a
  // disabled placeholder so the link is visibly distinct from a real one.
  out = out.replace(buildPattern('unsubscribe_link'), '#preview-unsubscribe');
  return out;
};
