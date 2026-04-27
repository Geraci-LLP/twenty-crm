// Block-tree representation of a landing page. Stored on
// LandingPage.sectionsConfig (JSON column). Mirrors the email builder's
// CampaignDesign shape so the same mental model applies — sections,
// columns, modules — but with page-appropriate module kinds.
//
// Versioning: designVersion bumps when the schema changes in a way
// that requires migration. migrateLandingPageDesign() handles older
// versions on read.
//
// v1 (this PR): Section { layout, columns: LandingPageColumn[] }

export type LandingPageDesignVersion = 1;

export type LandingPageDesign = {
  version: LandingPageDesignVersion;
  settings: LandingPageSettings;
  sections: LandingPageSection[];
};

export type LandingPageSettings = {
  bodyBgColor: string;
  contentBgColor: string;
  contentWidth: number;
  fontFamily: string;
  defaultTextColor: string;
};

export type LandingPageColumnLayout = '1' | '2' | '3' | '4' | '1-2' | '2-1';

export const LANDING_PAGE_COLUMN_WIDTHS: Record<
  LandingPageColumnLayout,
  ReadonlyArray<number>
> = {
  '1': [100],
  '2': [50, 50],
  '3': [33.33, 33.33, 33.33],
  '4': [25, 25, 25, 25],
  '1-2': [33.33, 66.66],
  '2-1': [66.66, 33.33],
};

export type LandingPageSection = {
  id: string;
  layout: LandingPageColumnLayout;
  alignment: 'top' | 'center' | 'bottom';
  bgColor: string;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  fullWidth: boolean;
  columns: LandingPageColumn[];
};

export type LandingPageColumn = {
  id: string;
  modules: LandingPageModule[];
};

export type LandingPageModule =
  | HeadingModule
  | TextModule
  | ButtonModule
  | ImageModule
  | DividerModule
  | SpacerModule
  | HtmlModule
  | HeroModule
  | FeatureListModule
  | FormEmbedModule
  | NavModule
  | SocialModule;

type ModuleBase = {
  id: string;
  paddingTop: number;
  paddingBottom: number;
};

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export type HeadingModule = ModuleBase & {
  type: 'heading';
  text: string;
  level: HeadingLevel;
  alignment: 'left' | 'center' | 'right';
  textColor: string;
  fontWeight: number;
};

export type TextModule = ModuleBase & {
  type: 'text';
  html: string;
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  textColor: string;
};

export type ButtonModule = ModuleBase & {
  type: 'button';
  label: string;
  href: string;
  bgColor: string;
  textColor: string;
  borderRadius: number;
  alignment: 'left' | 'center' | 'right';
  paddingX: number;
  paddingY: number;
  // Landing-page buttons can be primary CTA-style (bigger, stronger
  // shadow). Email buttons don't need this.
  variant: 'primary' | 'secondary' | 'ghost';
};

export type ImageModule = ModuleBase & {
  type: 'image';
  src: string;
  alt: string;
  widthPercent: number;
  alignment: 'left' | 'center' | 'right';
  href?: string;
};

export type DividerModule = ModuleBase & {
  type: 'divider';
  color: string;
  thickness: number;
  style: 'solid' | 'dashed' | 'dotted';
  widthPercent: number;
};

export type SpacerModule = ModuleBase & {
  type: 'spacer';
  height: number;
};

export type HtmlModule = ModuleBase & {
  type: 'html';
  rawHtml: string;
};

// Hero — full-width banner with heading, subheading, optional CTA and
// background image. The "above the fold" landing page module.
export type HeroModule = ModuleBase & {
  type: 'hero';
  heading: string;
  subheading: string;
  bgImageUrl: string;
  bgColor: string;
  textColor: string;
  alignment: 'left' | 'center' | 'right';
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: 'primary' | 'secondary' | 'ghost';
  minHeight: number;
};

export type FeatureListItem = {
  id: string;
  icon: string;
  title: string;
  body: string;
};

export type FeatureListModule = ModuleBase & {
  type: 'featureList';
  layout: 'grid-2' | 'grid-3' | 'list';
  items: FeatureListItem[];
  itemBgColor: string;
  iconColor: string;
};

export type FormEmbedModule = ModuleBase & {
  type: 'formEmbed';
  formId: string;
  // Optional override for the form's heading + button label so a single
  // form can be reused across multiple landing pages with different copy.
  headingOverride: string;
  ctaLabelOverride: string;
};

// Navigation / header — the page-level top bar. Renders the workspace
// brand on the left and a horizontal menu on the right.
export type NavLink = {
  id: string;
  label: string;
  href: string;
};

export type NavModule = ModuleBase & {
  type: 'nav';
  brandText: string;
  brandLogoUrl: string;
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
  bgColor: string;
  textColor: string;
};

export type SocialPlatform =
  | 'twitter'
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'tiktok';

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
};

export type SocialModule = ModuleBase & {
  type: 'social';
  links: SocialLink[];
  iconSize: number;
  spacing: number;
  alignment: 'left' | 'center' | 'right';
};

export type LandingPageModuleType = LandingPageModule['type'];
