import { type EmailModule } from '@/campaign/email-builder/types/CampaignDesign';

// Module clipboard backed by localStorage so copy/paste works across
// campaigns AND across tabs / sessions. Storing JSON keeps it simple —
// no need to wire into Jotai state for a feature that's purely
// user-driven and doesn't need reactivity beyond a re-read on focus.

const CLIPBOARD_KEY = 'twenty.emailBuilder.moduleClipboard';

export const writeModuleToClipboard = (module: EmailModule): void => {
  try {
    window.localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(module));
  } catch {
    // Quota or disabled storage — not worth disrupting the user.
  }
};

export const readModuleFromClipboard = (): EmailModule | null => {
  try {
    const raw = window.localStorage.getItem(CLIPBOARD_KEY);
    if (raw === null || raw === '') return null;
    const parsed = JSON.parse(raw) as EmailModule;
    if (typeof parsed !== 'object' || parsed === null) return null;
    if (typeof (parsed as { type?: unknown }).type !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearModuleClipboard = (): void => {
  try {
    window.localStorage.removeItem(CLIPBOARD_KEY);
  } catch {
    // ignore
  }
};
