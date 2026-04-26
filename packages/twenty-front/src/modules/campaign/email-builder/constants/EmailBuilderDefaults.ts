import {
  type ButtonModule,
  type ColumnLayout,
  type DividerModule,
  type EmailColumn,
  type EmailDesign,
  type EmailModule,
  type EmailModuleType,
  type EmailSection,
  type FooterModule,
  type HtmlModule,
  type ImageModule,
  type SocialModule,
  type SpacerModule,
  type TextModule,
} from '@/campaign/email-builder/types/CampaignDesign';

const generateId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const COLUMN_COUNT: Record<ColumnLayout, number> = {
  '1': 1, '2': 2, '3': 3, '4': 4, '1-2': 2, '2-1': 2,
};

export const buildEmptyColumn = (): EmailColumn => ({
  id: generateId('col'),
  modules: [],
});

export const buildDefaultSection = (layout: ColumnLayout = '1'): EmailSection => ({
  id: generateId('sec'),
  layout,
  alignment: 'top',
  bgColor: '#ffffff',
  paddingTop: 24,
  paddingBottom: 24,
  paddingLeft: 16,
  paddingRight: 16,
  columns: Array.from({ length: COLUMN_COUNT[layout] }, () => buildEmptyColumn()),
});

export const EMPTY_EMAIL_DESIGN: EmailDesign = {
  version: 2,
  settings: {
    bodyBgColor: '#f4f5f7',
    contentBgColor: '#ffffff',
    contentWidth: 640,
    fontFamily: 'Arial, sans-serif',
    defaultTextColor: '#1f2937',
  },
  sections: [buildDefaultSection('1')],
};

export const buildDefaultModule = (type: EmailModuleType): EmailModule => {
  const base = { id: generateId('mod'), paddingTop: 12, paddingBottom: 12 };
  switch (type) {
    case 'text':
      return {
        ...base,
        type: 'text',
        html: 'Hi {{contact.firstName}},<br/><br/>Write your message here.',
        alignment: 'left',
        fontSize: 16,
        textColor: '#1f2937',
      } satisfies TextModule;
    case 'button':
      return {
        ...base,
        type: 'button',
        label: 'Click here',
        href: 'https://example.com',
        bgColor: '#2563eb',
        textColor: '#ffffff',
        borderRadius: 6,
        alignment: 'center',
        paddingX: 24,
        paddingY: 12,
      } satisfies ButtonModule;
    case 'image':
      return {
        ...base,
        type: 'image',
        src: 'https://via.placeholder.com/600x200?text=Your+image',
        alt: '',
        width: 600,
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
        height: 24,
        paddingTop: 0,
        paddingBottom: 0,
      } satisfies SpacerModule;
    case 'html':
      return {
        ...base,
        type: 'html',
        rawHtml: '<!-- Custom HTML — may render inconsistently across email clients -->\n<p>Edit this raw HTML.</p>',
      } satisfies HtmlModule;
    case 'social':
      return {
        ...base,
        type: 'social',
        links: [
          { platform: 'twitter', href: 'https://x.com/' },
          { platform: 'linkedin', href: 'https://linkedin.com/' },
          { platform: 'facebook', href: 'https://facebook.com/' },
        ],
        iconSize: 28,
        spacing: 12,
        alignment: 'center',
      } satisfies SocialModule;
    case 'footer':
      return {
        ...base,
        type: 'footer',
        address: 'Geraci LLP, 90 Discovery, Irvine, California 92618, United States, (949) 403-3488',
        fontSize: 12,
        textColor: '#8a8a85',
        alignment: 'center',
        unsubscribeLabel: 'Unsubscribe',
        preferencesLabel: 'Manage preferences',
      } satisfies FooterModule;
  }
};

export const MODULE_LIBRARY: ReadonlyArray<{
  type: EmailModuleType;
  label: string;
  icon: string;
}> = [
  { type: 'text', label: 'Text', icon: 'T' },
  { type: 'button', label: 'Button', icon: '◼' },
  { type: 'image', label: 'Image', icon: '🖼' },
  { type: 'divider', label: 'Divider', icon: '─' },
  { type: 'spacer', label: 'Spacer', icon: '↕' },
  { type: 'social', label: 'Social', icon: '◉' },
  { type: 'footer', label: 'Footer', icon: 'F' },
  { type: 'html', label: 'HTML', icon: '<>' },
];

export const SECTION_LAYOUT_LIBRARY: ReadonlyArray<{
  layout: ColumnLayout;
  label: string;
  preview: string;
}> = [
  { layout: '1',   label: '1 column',     preview: '▭' },
  { layout: '2',   label: '2 columns',    preview: '▭▭' },
  { layout: '3',   label: '3 columns',    preview: '▭▭▭' },
  { layout: '4',   label: '4 columns',    preview: '▭▭▭▭' },
  { layout: '1-2', label: '1/3 + 2/3',    preview: '▭▭▭' },
  { layout: '2-1', label: '2/3 + 1/3',    preview: '▭▭▭' },
];
