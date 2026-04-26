import {
  type ButtonModule,
  type EmailDesign,
  type EmailModule,
  type EmailModuleType,
  type ImageModule,
  type TextModule,
} from '@/campaign/email-builder/types/CampaignDesign';

const generateId = (): string =>
  `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const EMPTY_EMAIL_DESIGN: EmailDesign = {
  version: 1,
  settings: {
    bodyBgColor: '#f4f5f7',
    contentBgColor: '#ffffff',
    contentWidth: 640,
    fontFamily: 'Arial, sans-serif',
    defaultTextColor: '#1f2937',
  },
  sections: [
    {
      id: generateId(),
      bgColor: '#ffffff',
      paddingTop: 24,
      paddingBottom: 24,
      modules: [],
    },
  ],
};

export const buildDefaultModule = (type: EmailModuleType): EmailModule => {
  const base = { id: generateId(), paddingTop: 12, paddingBottom: 12 };
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
];
