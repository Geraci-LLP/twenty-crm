// Block-based form schema, mirroring HubSpot's form builder shape.
// Stored as JSON in Form.fieldsConfig (replaces the previous flat
// WorkflowFormActionField[] shape; legacy data is auto-migrated by
// migrateToFormContents on read).
//
// Structure:
//   FormContents
//     ├─ Step[]                         (Step 1, Step 2, ...)
//     │   └─ FormBlock[]                (heading, paragraph, field, submit, image, captcha)
//     └─ OnSubmit                       (single panel shown after submission)
//         └─ FormBlock[]                (typically a heading + paragraph)
//
// Each block carries enough config to render its preview on the
// canvas + the same render in the public form. Adding a new block
// type = add a kind to the union + render branch in two places.

import { type FieldMetadataType } from 'twenty-shared/types';

export type FormContents = {
  version: 1;
  steps: FormStep[];
  onSubmit: FormOnSubmit;
};

export type FormStep = {
  id: string;
  label: string; // shown in the contents tree, e.g. "Step 1"
  blocks: FormBlock[];
};

export type FormOnSubmit = {
  id: string;
  label: string; // "On submit"
  blocks: FormBlock[];
};

export type FormBlock =
  | FieldBlock
  | SubmitBlock
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | RecaptchaBlock
  | DataPrivacyBlock;

type BlockBase = {
  id: string;
};

// ─── Field block ──────────────────────────────────────────────────
// Wraps a Twenty form field. Mirrors WorkflowFormActionField but
// pinned into the block-based shape so the canvas can render it.

export type FieldBlock = BlockBase & {
  kind: 'field';
  fieldType: FormFieldKind;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  // For SELECT / MULTI_SELECT / RADIO / CHECKBOXES:
  options?: { id: string; label: string; value: string }[];
  // For RECORD picker:
  recordObjectName?: string;
  // Legacy passthrough — the public form / submission service still
  // reads `placeholder` etc. from the flat shape, so we keep the
  // same field surface.
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    patternMessage?: string;
  };
};

// HubSpot's field-card vocabulary, mapped to Twenty FieldMetadataType.
// Using a string union (not the FieldMetadataType enum directly) so
// the visual builder can represent things Twenty doesn't have a
// dedicated type for (e.g. RADIO, MULTIPLE_CHECKBOXES).
export type FormFieldKind =
  | 'EMAIL'
  | 'SINGLE_LINE_TEXT'
  | 'NUMBER'
  | 'SINGLE_CHECKBOX'
  | 'MULTIPLE_CHECKBOXES'
  | 'MULTI_LINE_TEXT'
  | 'RADIO'
  | 'FILE'
  | 'DROPDOWN'
  | 'DATE'
  | 'PHONE'
  | 'RECORD';

// Map a FormFieldKind to the underlying FieldMetadataType the server
// already knows how to validate / store. Used at submit time.
export const formFieldKindToMetadataType = (
  kind: FormFieldKind,
): FieldMetadataType | 'RECORD' => {
  switch (kind) {
    case 'EMAIL':
      return 'EMAILS' as FieldMetadataType;
    case 'SINGLE_LINE_TEXT':
      return 'TEXT' as FieldMetadataType;
    case 'NUMBER':
      return 'NUMBER' as FieldMetadataType;
    case 'SINGLE_CHECKBOX':
      return 'BOOLEAN' as FieldMetadataType;
    case 'MULTIPLE_CHECKBOXES':
      return 'MULTI_SELECT' as FieldMetadataType;
    case 'MULTI_LINE_TEXT':
      return 'RICH_TEXT' as FieldMetadataType;
    case 'RADIO':
      return 'SELECT' as FieldMetadataType;
    case 'FILE':
      return 'FILES' as FieldMetadataType;
    case 'DROPDOWN':
      return 'SELECT' as FieldMetadataType;
    case 'DATE':
      return 'DATE' as FieldMetadataType;
    case 'PHONE':
      return 'PHONES' as FieldMetadataType;
    case 'RECORD':
      return 'RECORD';
  }
};

// ─── Submit block ─────────────────────────────────────────────────
// The submit button is a first-class block now (not auto-rendered).
// Sits in a step's blocks array, can be dragged, edited, deleted.

export type SubmitBlock = BlockBase & {
  kind: 'submit';
  label: string; // button text — "Submit", "Get Audit Now", etc.
};

// ─── Content blocks ───────────────────────────────────────────────

export type HeadingBlock = BlockBase & {
  kind: 'heading';
  text: string;
  level: 'h1' | 'h2' | 'h3';
  alignment: 'left' | 'center' | 'right';
};

export type ParagraphBlock = BlockBase & {
  kind: 'paragraph';
  html: string; // rendered as innerHTML; rich text editor in v2
};

export type ImageBlock = BlockBase & {
  kind: 'image';
  src: string;
  alt: string;
  widthPercent: number;
  alignment: 'left' | 'center' | 'right';
};

// ─── Security & Privacy widgets ──────────────────────────────────

export type RecaptchaBlock = BlockBase & {
  kind: 'recaptcha';
  // Maps to the existing botProtectionEnabled / botProtectionSiteKey
  // fields on the Form workspace entity. The block itself just
  // surfaces "this form is protected" in the canvas — actual
  // validation runs server-side per the form settings.
};

export type DataPrivacyBlock = BlockBase & {
  kind: 'dataPrivacy';
  consentText: string; // shown above checkbox
  consentLabel: string; // checkbox label
  required: boolean;
};

// ─── Library entries (for the "Add to form" panel) ───────────────

export type FormLibraryEntry = {
  kind: FormBlock['kind'] | FormFieldKind;
  label: string;
  glyph: string;
  category: 'fields' | 'other-text' | 'other-security';
};

export const FORM_LIBRARY: FormLibraryEntry[] = [
  // Fields tab — order matches HubSpot's screenshot 1
  { kind: 'EMAIL', label: 'Email', glyph: '✉', category: 'fields' },
  {
    kind: 'SINGLE_LINE_TEXT',
    label: 'Single-line text',
    glyph: 'Abc',
    category: 'fields',
  },
  { kind: 'NUMBER', label: 'Number', glyph: '123', category: 'fields' },
  {
    kind: 'SINGLE_CHECKBOX',
    label: 'Single checkbox',
    glyph: '☑',
    category: 'fields',
  },
  {
    kind: 'MULTIPLE_CHECKBOXES',
    label: 'Multiple checkboxes',
    glyph: '☑☑',
    category: 'fields',
  },
  {
    kind: 'MULTI_LINE_TEXT',
    label: 'Multi-line text',
    glyph: '¶',
    category: 'fields',
  },
  { kind: 'RADIO', label: 'Radio', glyph: '◉', category: 'fields' },
  { kind: 'FILE', label: 'File', glyph: '⎙', category: 'fields' },
  { kind: 'DROPDOWN', label: 'Dropdown', glyph: '▾', category: 'fields' },
  { kind: 'DATE', label: 'Date', glyph: '📅', category: 'fields' },
  { kind: 'PHONE', label: 'Phone number', glyph: '☎', category: 'fields' },
  // Other tab — Text & Media
  { kind: 'image', label: 'Image', glyph: '🖼', category: 'other-text' },
  { kind: 'heading', label: 'Heading', glyph: 'H', category: 'other-text' },
  {
    kind: 'paragraph',
    label: 'Paragraph (Rich Text)',
    glyph: '¶',
    category: 'other-text',
  },
  // Other tab — Security & Privacy
  {
    kind: 'recaptcha',
    label: 'reCAPTCHA',
    glyph: '🛡',
    category: 'other-security',
  },
  {
    kind: 'dataPrivacy',
    label: 'Data Privacy',
    glyph: '🔒',
    category: 'other-security',
  },
];
