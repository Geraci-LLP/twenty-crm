import { v4 } from 'uuid';

import {
  type FieldBlock,
  type FormBlock,
  type FormContents,
  type FormFieldKind,
  type FormStep,
} from '@/form/components/v2/types';

const lcFirst = (s: string): string =>
  s.length === 0 ? s : s[0].toLowerCase() + s.slice(1);

// Generate a stable, lowerCamelCase field name from a label so the
// JSON key in the submission body stays predictable.
export const labelToFieldName = (label: string): string => {
  const cleaned = label.replace(/[^A-Za-z0-9 ]+/g, '').trim();
  if (cleaned === '') return 'field';
  const parts = cleaned.split(/\s+/);
  return lcFirst(
    parts
      .map((p, i) =>
        i === 0
          ? p.toLowerCase()
          : p[0].toUpperCase() + p.slice(1).toLowerCase(),
      )
      .join(''),
  );
};

export const buildField = (kind: FormFieldKind): FieldBlock => {
  const labelByKind: Record<FormFieldKind, string> = {
    EMAIL: 'Email',
    SINGLE_LINE_TEXT: 'Text',
    NUMBER: 'Number',
    SINGLE_CHECKBOX: 'Checkbox',
    MULTIPLE_CHECKBOXES: 'Checkboxes',
    MULTI_LINE_TEXT: 'Long text',
    RADIO: 'Choice',
    FILE: 'Attachment',
    DROPDOWN: 'Dropdown',
    DATE: 'Date',
    PHONE: 'Phone number',
    RECORD: 'Linked record',
  };
  const placeholderByKind: Record<FormFieldKind, string> = {
    EMAIL: 'name@example.com',
    SINGLE_LINE_TEXT: 'Enter text',
    NUMBER: '0',
    SINGLE_CHECKBOX: '',
    MULTIPLE_CHECKBOXES: '',
    MULTI_LINE_TEXT: 'Enter your message',
    RADIO: '',
    FILE: '',
    DROPDOWN: 'Choose…',
    DATE: 'mm/dd/yyyy',
    PHONE: '+1 555 555 5555',
    RECORD: 'Select…',
  };
  const label = labelByKind[kind];
  const baseOptions = [
    { id: v4(), label: 'Option 1', value: 'option_1' },
    { id: v4(), label: 'Option 2', value: 'option_2' },
  ];
  const needsOptions =
    kind === 'DROPDOWN' || kind === 'RADIO' || kind === 'MULTIPLE_CHECKBOXES';
  return {
    id: v4(),
    kind: 'field',
    fieldType: kind,
    name: labelToFieldName(label),
    label,
    placeholder: placeholderByKind[kind],
    required: kind === 'EMAIL',
    description: '',
    options: needsOptions ? baseOptions : undefined,
  };
};

export const buildBlock = (kind: FormBlock['kind']): FormBlock => {
  switch (kind) {
    case 'submit':
      return { id: v4(), kind: 'submit', label: 'Submit' };
    case 'heading':
      return {
        id: v4(),
        kind: 'heading',
        text: 'Heading',
        level: 'h2',
        alignment: 'left',
      };
    case 'paragraph':
      return {
        id: v4(),
        kind: 'paragraph',
        html: "We'd love to hear from you! Please fill out the form and we'll get back to you as soon as possible.",
      };
    case 'image':
      return {
        id: v4(),
        kind: 'image',
        src: '',
        alt: '',
        widthPercent: 100,
        alignment: 'center',
      };
    case 'recaptcha':
      return { id: v4(), kind: 'recaptcha' };
    case 'dataPrivacy':
      return {
        id: v4(),
        kind: 'dataPrivacy',
        consentText:
          'By submitting, you agree to receive communications from us. See our privacy policy for details.',
        consentLabel: 'I agree to the terms',
        required: true,
      };
    case 'field':
      // Caller should use buildField() instead — this branch only
      // exists so the union is exhaustive.
      return buildField('SINGLE_LINE_TEXT');
  }
};

export const buildEmptyStep = (label: string = 'Step 1'): FormStep => {
  const firstName = buildField('SINGLE_LINE_TEXT');
  const lastName = buildField('SINGLE_LINE_TEXT');
  const email = buildField('EMAIL');
  return {
    id: v4(),
    label,
    blocks: [
      buildBlock('paragraph'),
      { ...firstName, label: 'First name', name: 'firstName' },
      { ...lastName, label: 'Last name', name: 'lastName' },
      email,
      buildBlock('submit'),
    ],
  };
};

export const EMPTY_FORM_CONTENTS: FormContents = {
  version: 1,
  steps: [buildEmptyStep('Step 1')],
  onSubmit: {
    id: v4(),
    label: 'On submit',
    blocks: [
      {
        id: v4(),
        kind: 'heading',
        text: 'Form submitted',
        level: 'h2',
        alignment: 'left',
      },
      {
        id: v4(),
        kind: 'paragraph',
        html: "Thank you, we'll be in touch soon.",
      },
    ],
  },
};

// ─── Migration from legacy WorkflowFormActionField[] shape ────────
//
// Older forms stored fieldsConfig as a flat array of fields with no
// notion of steps, content blocks, or a configurable submit button.
// On read, we wrap that array into a single Step 1 with each legacy
// field becoming a FieldBlock + an auto-appended Submit block. The
// resulting FormContents persists back into the same column on the
// next save, so the migration is a one-time normalization.

type LegacyField = {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  validation?: FieldBlock['validation'];
  settings?: Record<string, unknown>;
};

const legacyTypeToFieldKind = (type: string): FormFieldKind => {
  switch (type) {
    case 'TEXT':
      return 'SINGLE_LINE_TEXT';
    case 'NUMBER':
      return 'NUMBER';
    case 'DATE':
    case 'DATE_TIME':
      return 'DATE';
    case 'SELECT':
      return 'DROPDOWN';
    case 'MULTI_SELECT':
      return 'MULTIPLE_CHECKBOXES';
    case 'BOOLEAN':
      return 'SINGLE_CHECKBOX';
    case 'EMAILS':
      return 'EMAIL';
    case 'PHONES':
      return 'PHONE';
    case 'LINKS':
    case 'ADDRESS':
    case 'FULL_NAME':
      return 'SINGLE_LINE_TEXT';
    case 'FILES':
      return 'FILE';
    case 'RICH_TEXT':
      return 'MULTI_LINE_TEXT';
    case 'RATING':
      return 'NUMBER';
    case 'RECORD':
      return 'RECORD';
    default:
      return 'SINGLE_LINE_TEXT';
  }
};

export const isFormContents = (raw: unknown): raw is FormContents => {
  if (raw === null || typeof raw !== 'object') return false;
  const obj = raw as Record<string, unknown>;
  return (
    obj.version === 1 &&
    Array.isArray(obj.steps) &&
    obj.onSubmit !== null &&
    typeof obj.onSubmit === 'object'
  );
};

export const migrateToFormContents = (raw: unknown): FormContents => {
  if (raw === null || raw === undefined) return EMPTY_FORM_CONTENTS;
  if (isFormContents(raw)) return raw;
  if (!Array.isArray(raw)) return EMPTY_FORM_CONTENTS;
  // Legacy array → wrap in Step 1
  const fieldBlocks: FormBlock[] = (raw as LegacyField[]).map((f) => {
    const kind = legacyTypeToFieldKind(f.type);
    const block: FieldBlock = {
      id: f.id ?? v4(),
      kind: 'field',
      fieldType: kind,
      name: f.name,
      label: f.label,
      placeholder: f.placeholder,
      validation: f.validation,
      recordObjectName:
        kind === 'RECORD' && typeof f.settings?.objectName === 'string'
          ? (f.settings.objectName as string)
          : undefined,
    };
    return block;
  });
  const submit: FormBlock = { id: v4(), kind: 'submit', label: 'Submit' };
  return {
    version: 1,
    steps: [{ id: v4(), label: 'Step 1', blocks: [...fieldBlocks, submit] }],
    onSubmit: {
      id: v4(),
      label: 'On submit',
      blocks: [
        {
          id: v4(),
          kind: 'heading',
          text: 'Form submitted',
          level: 'h2',
          alignment: 'left',
        },
        {
          id: v4(),
          kind: 'paragraph',
          html: "Thank you, we'll be in touch soon.",
        },
      ],
    },
  };
};
