import { type FieldMetadataType } from 'twenty-shared/types';

// Field types exposed in the form builder's "Type" dropdown. Maps 1:1
// onto Twenty's underlying FieldMetadataType so the existing
// FormFieldInput dispatcher (21+ specialized renderers) can render
// each one without further changes. The "RECORD" string-literal
// branch is custom — it doesn't map to a FieldMetadataType, it spawns
// a record picker against another object (Company, Person, etc.).
export type WorkflowFormFieldType =
  | FieldMetadataType.TEXT
  | FieldMetadataType.NUMBER
  | FieldMetadataType.DATE
  | FieldMetadataType.DATE_TIME
  | FieldMetadataType.SELECT
  | FieldMetadataType.MULTI_SELECT
  | FieldMetadataType.BOOLEAN
  | FieldMetadataType.EMAILS
  | FieldMetadataType.PHONES
  | FieldMetadataType.LINKS
  | FieldMetadataType.ADDRESS
  | FieldMetadataType.FULL_NAME
  | FieldMetadataType.FILES
  | FieldMetadataType.RATING
  | FieldMetadataType.RICH_TEXT
  | 'RECORD';
