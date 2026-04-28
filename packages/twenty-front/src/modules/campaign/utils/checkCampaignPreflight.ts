import { type EmailDesign } from '@/campaign/email-builder/types/CampaignDesign';
import { CAMPAIGN_PERSONALIZATION_TOKENS } from '@/campaign/constants/CampaignPersonalizationTokens';
import { type CampaignEditorData } from '@/campaign/types/CampaignTypes';

// Preflight checks run on every edit and surface as a banner in
// CampaignEditor. They don't block save (you can still draft an
// incomplete email) but errors are flagged as send-blockers and
// warnings as advisory. The actual gate happens server-side at send
// time — this is just early feedback so the user notices issues
// before clicking Send.

export type PreflightSeverity = 'error' | 'warning';

export type PreflightIssue = {
  id: string;
  severity: PreflightSeverity;
  message: string;
};

const KNOWN_TOKEN_VALUES = new Set(
  CAMPAIGN_PERSONALIZATION_TOKENS.map((t) =>
    // Strip whitespace inside braces so both `{{contact.x}}` and
    // `{{ contact.x }}` count as known.
    t.value.replace(/\s+/g, ''),
  ),
);

const designHasFooter = (design: EmailDesign): boolean =>
  design.sections.some((s) =>
    s.columns?.some((c) => c.modules.some((m) => m.type === 'footer')),
  );

const designHasAnyContent = (design: EmailDesign): boolean =>
  design.sections.some((s) =>
    s.columns?.some((c) =>
      c.modules.some(
        (m) =>
          m.type !== 'spacer' && m.type !== 'divider' && m.type !== 'footer',
      ),
    ),
  );

// Find any {{...}} token in the body that doesn't match our known set
// (after whitespace normalization). Helps catch typos like
// {{contact.firstname}} vs {{contact.firstName}} early.
const findUnknownTokens = (text: string): string[] => {
  const matches = text.match(/\{\{[^}]+\}\}/g) ?? [];
  const unique = new Set<string>();
  for (const raw of matches) {
    const normalized = raw.replace(/\s+/g, '');
    if (!KNOWN_TOKEN_VALUES.has(normalized)) {
      unique.add(raw);
    }
  }
  return Array.from(unique);
};

const designToText = (design: EmailDesign): string => {
  const parts: string[] = [];
  for (const section of design.sections) {
    for (const column of section.columns ?? []) {
      for (const module of column.modules) {
        if (module.type === 'text') parts.push(module.html);
        if (module.type === 'heading') parts.push(module.text);
        if (module.type === 'button')
          parts.push(`${module.label} ${module.href}`);
        if (module.type === 'html') parts.push(module.rawHtml);
        if (module.type === 'footer') parts.push(module.address);
      }
    }
  }
  return parts.join('\n');
};

export const checkCampaignPreflight = (
  data: CampaignEditorData,
  design: EmailDesign | null,
): PreflightIssue[] => {
  const issues: PreflightIssue[] = [];

  if (data.subject.trim() === '') {
    issues.push({
      id: 'subject-empty',
      severity: 'error',
      message: 'Subject line is empty.',
    });
  }
  if (data.fromEmail.trim() === '') {
    issues.push({
      id: 'from-email-empty',
      severity: 'error',
      message: 'From email is empty.',
    });
  }
  if (data.fromName.trim() === '') {
    issues.push({
      id: 'from-name-empty',
      severity: 'warning',
      message: 'From name is empty — emails will show only the address.',
    });
  }

  // Body content: in design mode we look at the design; otherwise body html.
  if (design) {
    if (!designHasAnyContent(design)) {
      issues.push({
        id: 'design-empty',
        severity: 'error',
        message:
          'Email body has no content modules — add Text, Heading, Button, or Image.',
      });
    }
    if (!designHasFooter(design)) {
      issues.push({
        id: 'design-no-footer',
        severity: 'warning',
        message:
          'No Footer module — CAN-SPAM requires a physical address and unsubscribe link.',
      });
    }
    const unknown = findUnknownTokens(designToText(design));
    if (unknown.length > 0) {
      issues.push({
        id: 'unknown-tokens',
        severity: 'warning',
        message: `Unknown token(s) ${unknown.join(', ')} — they won't be substituted on send.`,
      });
    }
  } else {
    if (data.body.trim() === '') {
      issues.push({
        id: 'body-empty',
        severity: 'error',
        message: 'Email body is empty.',
      });
    }
    const unknown = findUnknownTokens(data.body);
    if (unknown.length > 0) {
      issues.push({
        id: 'unknown-tokens',
        severity: 'warning',
        message: `Unknown token(s) ${unknown.join(', ')} — they won't be substituted on send.`,
      });
    }
  }

  return issues;
};
