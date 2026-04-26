// Block-tree representation of a marketing email. Stored on Campaign.designJson
// and rendered to Campaign.bodyHtml at save time. Server reads bodyHtml only.
//
// Versioning: designVersion bumps when the schema changes in a way that
// requires migration. migrateDesign() handles older versions on read.
//
// v1 (PR 1): Section { modules: EmailModule[] } — single implicit column
// v2 (PR 2a): Section { columns: EmailColumn[]; layout; alignment; ... }

export type EmailDesignVersion = 1 | 2;

export type EmailDesign = {
  version: EmailDesignVersion;
  settings: EmailSettings;
  sections: EmailSection[];
};

export type EmailSettings = {
  bodyBgColor: string;       // outer page background
  contentBgColor: string;    // content area background
  contentWidth: number;      // px, typical 600-720
  fontFamily: string;        // CSS font-stack
  defaultTextColor: string;
};

export type ColumnLayout = '1' | '2' | '3' | '4' | '1-2' | '2-1';

// Number of columns and their relative widths, in % of content width (after gutter).
export const COLUMN_WIDTHS: Record<ColumnLayout, ReadonlyArray<number>> = {
  '1':   [100],
  '2':   [50, 50],
  '3':   [33.33, 33.33, 33.33],
  '4':   [25, 25, 25, 25],
  '1-2': [33.33, 66.66],
  '2-1': [66.66, 33.33],
};

export type EmailSection = {
  id: string;
  layout: ColumnLayout;
  alignment: 'top' | 'center' | 'bottom';   // vertical alignment within columns
  bgColor: string;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  // PR 1 legacy field — readers should consult `columns` first via the
  // migration. Kept here for backward compatibility on disk during reads.
  modules?: EmailModule[];
  columns: EmailColumn[];
};

export type EmailColumn = {
  id: string;
  modules: EmailModule[];
};

export type EmailModule =
  | TextModule
  | ButtonModule
  | ImageModule
  | DividerModule
  | SpacerModule
  | HtmlModule
  | SocialModule
  | FooterModule;

type ModuleBase = {
  id: string;
  paddingTop: number;
  paddingBottom: number;
};

export type TextModule = ModuleBase & {
  type: 'text';
  // Stored as HTML directly with tokens as literal {{contact.X}} strings. The
  // server-side executor's substitute() expects literal token strings.
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
};

export type ImageModule = ModuleBase & {
  type: 'image';
  src: string;
  alt: string;
  width: number;       // px
  alignment: 'left' | 'center' | 'right';
  href?: string;       // optional click-through link
};

export type DividerModule = ModuleBase & {
  type: 'divider';
  color: string;
  thickness: number;       // px, typically 1-4
  style: 'solid' | 'dashed' | 'dotted';
  widthPercent: number;    // 1-100, divider's portion of the column
};

export type SpacerModule = ModuleBase & {
  type: 'spacer';
  height: number;          // px
};

export type HtmlModule = ModuleBase & {
  type: 'html';
  rawHtml: string;
};

export type SocialPlatform = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube';

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
};

export type SocialModule = ModuleBase & {
  type: 'social';
  links: SocialLink[];
  iconSize: number;        // px
  spacing: number;         // px between icons
  alignment: 'left' | 'center' | 'right';
};

export type FooterModule = ModuleBase & {
  type: 'footer';
  address: string;
  fontSize: number;
  textColor: string;
  alignment: 'left' | 'center' | 'right';
  unsubscribeLabel: string;
  preferencesLabel: string;
  // Always renders {{unsubscribe_link}} so the server-side executor's
  // suppression-list contract works; do not strip the token from output.
};

export type EmailModuleType = EmailModule['type'];
