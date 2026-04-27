import {
  type ButtonModule,
  type DividerModule,
  type FeatureListModule,
  type FormEmbedModule,
  type HeadingModule,
  type HeroModule,
  type HtmlModule,
  type ImageModule,
  type LandingPageColumn,
  type LandingPageColumnLayout,
  type LandingPageDesign,
  type LandingPageModule,
  type LandingPageModuleType,
  type LandingPageSection,
  type NavModule,
  type SocialModule,
  type SpacerModule,
  type TextModule,
} from '@/landing-page/types/LandingPageDesign';

// All ids generated client-side. Same shape as the email builder so a
// future shared util can replace both. Format: prefix_<base36-time>_<rand>.
export const generateLandingPageId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/* oxlint-disable twenty/max-consts-per-file -- defaults file is
   intentionally a single-file catalog of factories + literals, mirroring
   the email builder's EmailBuilderDefaults.ts pattern. */
/* oxlint-disable twenty/no-hardcoded-colors -- design JSON is stored
   server-side and rendered onto a *public* landing page, so theme
   variables don't apply. Defaults need real hex values. */

const COLUMN_COUNT: Record<LandingPageColumnLayout, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '1-2': 2,
  '2-1': 2,
};

export const buildEmptyLandingPageColumn = (): LandingPageColumn => ({
  id: generateLandingPageId('col'),
  modules: [],
});

export const buildDefaultLandingPageSection = (
  layout: LandingPageColumnLayout = '1',
): LandingPageSection => ({
  id: generateLandingPageId('sec'),
  layout,
  alignment: 'top',
  bgColor: '#ffffff',
  paddingTop: 60,
  paddingBottom: 60,
  paddingLeft: 24,
  paddingRight: 24,
  fullWidth: false,
  columns: Array.from({ length: COLUMN_COUNT[layout] }, () =>
    buildEmptyLandingPageColumn(),
  ),
});

export const EMPTY_LANDING_PAGE_DESIGN: LandingPageDesign = {
  version: 1,
  settings: {
    bodyBgColor: '#f5f8fa',
    contentBgColor: '#ffffff',
    contentWidth: 1200,
    fontFamily:
      "'Geist', 'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
    defaultTextColor: '#1f2937',
  },
  sections: [],
};

export const buildDefaultLandingPageModule = (
  type: LandingPageModuleType,
): LandingPageModule => {
  const base = {
    id: generateLandingPageId('mod'),
    paddingTop: 12,
    paddingBottom: 12,
  };
  switch (type) {
    case 'heading':
      return {
        ...base,
        type: 'heading',
        text: 'Section heading',
        level: 'h2',
        alignment: 'left',
        textColor: '#0f172a',
        fontWeight: 700,
      } satisfies HeadingModule;
    case 'text':
      return {
        ...base,
        type: 'text',
        html: 'Add a description here. Sell the value proposition, not the feature.',
        alignment: 'left',
        fontSize: 16,
        textColor: '#374151',
      } satisfies TextModule;
    case 'button':
      return {
        ...base,
        type: 'button',
        label: 'Get started',
        href: 'https://example.com',
        bgColor: '#ff7a59',
        textColor: '#ffffff',
        borderRadius: 999,
        alignment: 'left',
        paddingX: 28,
        paddingY: 12,
        variant: 'primary',
      } satisfies ButtonModule;
    case 'image':
      return {
        ...base,
        type: 'image',
        src: '',
        alt: '',
        widthPercent: 100,
        alignment: 'center',
      } satisfies ImageModule;
    case 'divider':
      return {
        ...base,
        type: 'divider',
        color: '#e5e7eb',
        thickness: 1,
        style: 'solid',
        widthPercent: 100,
      } satisfies DividerModule;
    case 'spacer':
      return {
        ...base,
        type: 'spacer',
        height: 32,
      } satisfies SpacerModule;
    case 'html':
      return {
        ...base,
        type: 'html',
        rawHtml: '<!-- Custom HTML -->',
      } satisfies HtmlModule;
    case 'hero':
      return {
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
        type: 'hero',
        heading: 'Build your next landing page',
        subheading:
          'Capture leads, drive signups, and tell your story — all from one place.',
        bgImageUrl: '',
        bgColor: '#1b2733',
        textColor: '#ffffff',
        alignment: 'center',
        ctaLabel: 'Get started',
        ctaHref: 'https://example.com',
        ctaVariant: 'primary',
        minHeight: 480,
      } satisfies HeroModule;
    case 'featureList':
      return {
        ...base,
        type: 'featureList',
        layout: 'grid-3',
        itemBgColor: '#ffffff',
        iconColor: '#ff7a59',
        items: [
          {
            id: generateLandingPageId('fl'),
            icon: '★',
            title: 'Fast',
            body: 'Lightning quick setup with zero configuration.',
          },
          {
            id: generateLandingPageId('fl'),
            icon: '✓',
            title: 'Secure',
            body: 'Enterprise-grade security baked in from day one.',
          },
          {
            id: generateLandingPageId('fl'),
            icon: '◎',
            title: 'Scalable',
            body: 'From your first lead to millions, no rebuilds required.',
          },
        ],
      } satisfies FeatureListModule;
    case 'formEmbed':
      return {
        ...base,
        type: 'formEmbed',
        formId: '',
        headingOverride: '',
        ctaLabelOverride: '',
      } satisfies FormEmbedModule;
    case 'nav':
      return {
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
        type: 'nav',
        brandText: 'Geraci LLP',
        brandLogoUrl: '',
        links: [
          {
            id: generateLandingPageId('nl'),
            label: 'Home',
            href: '#',
          },
          {
            id: generateLandingPageId('nl'),
            label: 'Products',
            href: '#products',
          },
          {
            id: generateLandingPageId('nl'),
            label: 'Pricing',
            href: '#pricing',
          },
          {
            id: generateLandingPageId('nl'),
            label: 'Company',
            href: '#company',
          },
        ],
        ctaLabel: 'Get started',
        ctaHref: '#cta',
        bgColor: '#ffffff',
        textColor: '#0f172a',
      } satisfies NavModule;
    case 'social':
      return {
        ...base,
        type: 'social',
        links: [
          { platform: 'linkedin', href: 'https://linkedin.com' },
          { platform: 'twitter', href: 'https://twitter.com' },
        ],
        iconSize: 24,
        spacing: 12,
        alignment: 'center',
      } satisfies SocialModule;
  }
};

// Module library — the catalog shown in the left rail. Grouped by
// category to mirror the HubSpot pattern (Hero/Header/Footer at the
// "Layout" group, then granular modules).
export type ModuleLibraryEntry = {
  type: LandingPageModuleType;
  label: string;
  glyph: string;
  category: 'layout' | 'content' | 'media' | 'forms' | 'spacers';
};

export const LANDING_PAGE_MODULE_LIBRARY: ModuleLibraryEntry[] = [
  {
    type: 'nav',
    label: 'Header / Nav',
    glyph: '⬚',
    category: 'layout',
  },
  { type: 'hero', label: 'Hero', glyph: '◐', category: 'layout' },
  {
    type: 'featureList',
    label: 'Feature list',
    glyph: '⊞',
    category: 'layout',
  },
  { type: 'social', label: 'Social', glyph: '⌬', category: 'layout' },
  { type: 'heading', label: 'Heading', glyph: 'H', category: 'content' },
  { type: 'text', label: 'Text', glyph: '¶', category: 'content' },
  { type: 'button', label: 'Button', glyph: '⏵', category: 'content' },
  { type: 'image', label: 'Image', glyph: '⌷', category: 'media' },
  { type: 'html', label: 'HTML', glyph: '<>', category: 'media' },
  { type: 'formEmbed', label: 'Form', glyph: '⊟', category: 'forms' },
  { type: 'divider', label: 'Divider', glyph: '⎯', category: 'spacers' },
  { type: 'spacer', label: 'Spacer', glyph: '⇅', category: 'spacers' },
];

export const LANDING_PAGE_LAYOUT_LIBRARY: {
  layout: LandingPageColumnLayout;
  label: string;
  glyph: string;
}[] = [
  { layout: '1', label: '1 column', glyph: '▭' },
  { layout: '2', label: '2 columns', glyph: '▭▭' },
  { layout: '3', label: '3 columns', glyph: '▭▭▭' },
  { layout: '4', label: '4 columns', glyph: '▭▭▭▭' },
  { layout: '1-2', label: '1 / 2', glyph: '▭ ▭▭' },
  { layout: '2-1', label: '2 / 1', glyph: '▭▭ ▭' },
];
/* oxlint-enable twenty/max-consts-per-file */
/* oxlint-enable twenty/no-hardcoded-colors */
