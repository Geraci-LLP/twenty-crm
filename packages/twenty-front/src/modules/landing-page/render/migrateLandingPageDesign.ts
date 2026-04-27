import {
  buildDefaultLandingPageModule,
  buildDefaultLandingPageSection,
  EMPTY_LANDING_PAGE_DESIGN,
  generateLandingPageId,
} from '@/landing-page/constants/LandingPageBuilderDefaults';
import {
  type ButtonModule,
  type FormEmbedModule,
  type HeroModule,
  type ImageModule,
  type LandingPageDesign,
  type LandingPageSection,
  type TextModule,
} from '@/landing-page/types/LandingPageDesign';

// Read shape from server's sectionsConfig JSON column. Two formats are
// supported:
//   - Legacy: Array<{ id, type: 'HERO'|'TEXT'|'FORM_EMBED'|'CTA'|'IMAGE',
//             config: object }> — flat, single-column, no settings
//   - New v1: LandingPageDesign — { version, settings, sections: [...] }
//
// migrateLandingPageDesign normalizes both into a v1 LandingPageDesign so
// the builder can render either source.

type LegacySectionType = 'HERO' | 'TEXT' | 'FORM_EMBED' | 'CTA' | 'IMAGE';

type LegacySection = {
  id: string;
  type: LegacySectionType;
  config: Record<string, unknown>;
};

const isLegacy = (raw: unknown): raw is LegacySection[] => {
  if (!Array.isArray(raw)) return false;
  if (raw.length === 0) return true;
  const first = raw[0] as Record<string, unknown> | null;
  return (
    first !== null &&
    typeof first === 'object' &&
    'type' in first &&
    typeof first.type === 'string' &&
    ['HERO', 'TEXT', 'FORM_EMBED', 'CTA', 'IMAGE'].includes(first.type)
  );
};

const isV1Design = (raw: unknown): raw is LandingPageDesign => {
  if (raw === null || typeof raw !== 'object') return false;
  const obj = raw as Record<string, unknown>;
  return (
    obj.version === 1 &&
    typeof obj.settings === 'object' &&
    Array.isArray(obj.sections)
  );
};

const convertLegacySection = (legacy: LegacySection): LandingPageSection => {
  const section = buildDefaultLandingPageSection('1');
  const cfg = legacy.config;
  const get = (k: string) =>
    typeof cfg[k] === 'string' ? (cfg[k] as string) : '';

  switch (legacy.type) {
    case 'HERO': {
      const hero = buildDefaultLandingPageModule('hero') as HeroModule;
      section.columns[0].modules.push({
        ...hero,
        heading: get('heading') !== '' ? get('heading') : hero.heading,
        subheading:
          get('subheading') !== '' ? get('subheading') : hero.subheading,
        ctaLabel: get('buttonText') !== '' ? get('buttonText') : hero.ctaLabel,
        ctaHref: get('buttonUrl') !== '' ? get('buttonUrl') : hero.ctaHref,
      });
      break;
    }
    case 'TEXT': {
      const text = buildDefaultLandingPageModule('text') as TextModule;
      section.columns[0].modules.push({
        ...text,
        html: get('content') !== '' ? get('content') : text.html,
      });
      break;
    }
    case 'CTA': {
      const heading = buildDefaultLandingPageModule('heading');
      const button = buildDefaultLandingPageModule('button') as ButtonModule;
      const headingText = get('heading');
      if (headingText !== '' && heading.type === 'heading') {
        section.columns[0].modules.push({
          ...heading,
          text: headingText,
          alignment: 'center',
        });
      }
      section.columns[0].modules.push({
        ...button,
        label: get('buttonText') !== '' ? get('buttonText') : button.label,
        href: get('buttonUrl') !== '' ? get('buttonUrl') : button.href,
        alignment: 'center',
      });
      break;
    }
    case 'IMAGE': {
      const image = buildDefaultLandingPageModule('image') as ImageModule;
      section.columns[0].modules.push({
        ...image,
        src: get('src'),
        alt: get('alt'),
      });
      break;
    }
    case 'FORM_EMBED': {
      const form = buildDefaultLandingPageModule(
        'formEmbed',
      ) as FormEmbedModule;
      section.columns[0].modules.push({
        ...form,
        formId: get('formId'),
      });
      break;
    }
  }
  return { ...section, id: legacy.id ?? generateLandingPageId('sec') };
};

export const migrateLandingPageDesign = (raw: unknown): LandingPageDesign => {
  if (raw === null || raw === undefined) {
    return { ...EMPTY_LANDING_PAGE_DESIGN, sections: [] };
  }
  if (isV1Design(raw)) return raw;
  if (isLegacy(raw)) {
    const sections = raw.map(convertLegacySection);
    return { ...EMPTY_LANDING_PAGE_DESIGN, sections };
  }
  // Unknown shape — start fresh rather than throw.
  return { ...EMPTY_LANDING_PAGE_DESIGN, sections: [] };
};
