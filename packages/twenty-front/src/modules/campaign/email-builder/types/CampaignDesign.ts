// Block-tree representation of a marketing email. Stored on Campaign.designJson
// and rendered to Campaign.bodyHtml at save time. Server reads bodyHtml only.
//
// Versioning: designVersion is incremented when the schema changes in a way that
// requires migration. renderDesignToHtml dispatches by version.

export type EmailDesignVersion = 1;

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

// PR1: a Section is just a single column. Multi-column comes in PR 2a.
export type EmailSection = {
  id: string;
  bgColor: string;
  paddingTop: number;
  paddingBottom: number;
  modules: EmailModule[];
};

export type EmailModule =
  | TextModule
  | ButtonModule
  | ImageModule;

type ModuleBase = {
  id: string;
  paddingTop: number;
  paddingBottom: number;
};

export type TextModule = ModuleBase & {
  type: 'text';
  // For PR1 we store HTML directly (with line breaks rendered as <br/>) and
  // tokens as literal {{contact.X}} strings. PR 2 swaps in TipTap with a
  // tokenChip extension and ProseMirror JSON content.
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

export type EmailModuleType = EmailModule['type'];
