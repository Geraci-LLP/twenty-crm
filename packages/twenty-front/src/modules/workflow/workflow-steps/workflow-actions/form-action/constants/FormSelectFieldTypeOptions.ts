import { type WorkflowFormFieldType } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormFieldType';
import { getDefaultFormFieldSettings } from '@/workflow/workflow-steps/workflow-actions/form-action/utils/getDefaultFormFieldSettings';
import { FieldMetadataType } from 'twenty-shared/types';
import {
  IllustrationIconArray,
  IllustrationIconCalendarEvent,
  IllustrationIconCalendarTime,
  IllustrationIconFile,
  IllustrationIconLink,
  IllustrationIconMail,
  IllustrationIconMap,
  IllustrationIconNumbers,
  IllustrationIconOneToMany,
  IllustrationIconPhone,
  IllustrationIconStar,
  IllustrationIconTag,
  IllustrationIconTags,
  IllustrationIconText,
  IllustrationIconToggle,
  IllustrationIconUser,
} from 'twenty-ui/display';
import { type SelectOption } from 'twenty-ui/input';

export const FORM_SELECT_FIELD_TYPE_OPTIONS: SelectOption<WorkflowFormFieldType>[] =
  [
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.TEXT).label,
      value: FieldMetadataType.TEXT,
      Icon: IllustrationIconText,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.RICH_TEXT).label,
      value: FieldMetadataType.RICH_TEXT,
      Icon: IllustrationIconArray,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.NUMBER).label,
      value: FieldMetadataType.NUMBER,
      Icon: IllustrationIconNumbers,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.BOOLEAN).label,
      value: FieldMetadataType.BOOLEAN,
      Icon: IllustrationIconToggle,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.RATING).label,
      value: FieldMetadataType.RATING,
      Icon: IllustrationIconStar,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.DATE).label,
      value: FieldMetadataType.DATE,
      Icon: IllustrationIconCalendarEvent,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.DATE_TIME).label,
      value: FieldMetadataType.DATE_TIME,
      Icon: IllustrationIconCalendarTime,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.EMAILS).label,
      value: FieldMetadataType.EMAILS,
      Icon: IllustrationIconMail,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.PHONES).label,
      value: FieldMetadataType.PHONES,
      Icon: IllustrationIconPhone,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.LINKS).label,
      value: FieldMetadataType.LINKS,
      Icon: IllustrationIconLink,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.ADDRESS).label,
      value: FieldMetadataType.ADDRESS,
      Icon: IllustrationIconMap,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.FULL_NAME).label,
      value: FieldMetadataType.FULL_NAME,
      Icon: IllustrationIconUser,
    },
    {
      label: getDefaultFormFieldSettings(FieldMetadataType.FILES).label,
      value: FieldMetadataType.FILES,
      Icon: IllustrationIconFile,
    },
    {
      label: getDefaultFormFieldSettings('RECORD').label,
      value: 'RECORD',
      Icon: IllustrationIconOneToMany,
    },
    {
      label: 'Select',
      value: FieldMetadataType.SELECT,
      Icon: IllustrationIconTag,
    },
    {
      label: 'Multi-Select',
      value: FieldMetadataType.MULTI_SELECT,
      Icon: IllustrationIconTags,
    },
  ];
