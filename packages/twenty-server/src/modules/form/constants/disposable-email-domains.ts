// Curated short list of common disposable email providers. Not
// exhaustive — there are 30,000+ in the wild — but covers the vast
// majority of real-world spam attempts. Purposefully not pulled in
// as a dependency: that buys constant maintenance noise for marginal
// benefit. Add to this list when you spot a new one in submissions.
//
// Usage: lowercase compare the domain part of the submitted email
// against this Set. Hit → reject.

export const DISPOSABLE_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  // Mailinator family
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'mailinater.com',
  // Temp-Mail family
  'tempmail.com',
  'tempmail.net',
  'temp-mail.org',
  'temp-mail.io',
  'tempmailo.com',
  'temp-mail.com',
  // 10minutemail family
  '10minutemail.com',
  '10minutemail.net',
  '10minemail.com',
  // Guerrilla Mail family
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamail.de',
  'guerrillamail.info',
  'guerrillamail.biz',
  'sharklasers.com',
  'grr.la',
  // Yopmail
  'yopmail.com',
  'yopmail.net',
  'yopmail.fr',
  // Throwaway
  'throwaway.email',
  'throwawaymail.com',
  'getairmail.com',
  'maildrop.cc',
  // Disposable / nada / fakeinbox
  'fakeinbox.com',
  'fakemail.net',
  'getnada.com',
  'nada.email',
  'mohmal.com',
  // 33mail
  '33mail.com',
  // Discard / dispostable
  'discard.email',
  'dispostable.com',
  'spamgourmet.com',
  // mvrht / inboxbear / etc.
  'mvrht.com',
  'inboxbear.com',
  'mailcatch.com',
  'spambox.us',
  'spambog.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.de',
  'trbvm.com',
  // mintemail / mt2014 / spamex / etc.
  'mintemail.com',
  'mt2015.com',
  'spamex.com',
  // anonymouse
  'anonymouse.org',
  // emailondeck
  'emailondeck.com',
  // jetable
  'jetable.org',
  'spambox.org',
]);

export const isDisposableEmail = (
  email: string | null | undefined,
): boolean => {
  if (typeof email !== 'string' || email.trim() === '') return false;
  const at = email.lastIndexOf('@');
  if (at === -1) return false;
  const domain = email
    .slice(at + 1)
    .trim()
    .toLowerCase();
  if (domain === '') return false;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
};
