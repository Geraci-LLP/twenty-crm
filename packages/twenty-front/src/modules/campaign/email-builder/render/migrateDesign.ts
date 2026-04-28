/* oxlint-disable twenty/no-hardcoded-colors */
// Migration fallbacks use literal hex colors to match historical email
// templates rendered for external mail clients without theme variables.

import {
  type EmailDesign,
  type EmailSection,
} from '@/campaign/email-builder/types/CampaignDesign';

const generateId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// v1 → v2: Section.modules (single implicit column) becomes
// Section.columns = [{ modules: ... }] with layout='1'. Adds the new fields
// with sane defaults. Idempotent — safe to run on any version.
const migrateSection = (s: EmailSection): EmailSection => {
  const hasColumns = Array.isArray(s.columns) && s.columns.length > 0;
  const legacyModules = Array.isArray(s.modules) ? s.modules : [];

  const columns = hasColumns
    ? s.columns
    : [{ id: generateId('col'), modules: legacyModules }];

  return {
    id: s.id,
    layout: s.layout ?? '1',
    alignment: s.alignment ?? 'top',
    bgColor: s.bgColor ?? '#ffffff',
    paddingTop: s.paddingTop ?? 24,
    paddingBottom: s.paddingBottom ?? 24,
    paddingLeft: s.paddingLeft ?? 16,
    paddingRight: s.paddingRight ?? 16,
    columns,
    // intentionally drop the legacy `modules` field on output
  };
};

export const migrateDesign = (design: EmailDesign): EmailDesign => {
  // No work needed — but normalize sections so optional fields all have
  // values, regardless of input version.
  const migrated: EmailDesign = {
    version: 2,
    settings: design.settings,
    sections: design.sections.map(migrateSection),
  };
  return migrated;
};
