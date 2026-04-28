import { CoreObjectNameSingular, FieldMetadataType } from 'twenty-shared/types';
import { type WorkflowFormFieldType } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormFieldType';
import { assertUnreachable } from 'twenty-shared/utils';
import { v4 } from 'uuid';

export const getDefaultFormFieldSettings = (type: WorkflowFormFieldType) => {
  switch (type) {
    case FieldMetadataType.TEXT:
      return {
        id: v4(),
        name: 'text',
        label: 'Text',
        placeholder: 'Enter your text',
      };
    case FieldMetadataType.NUMBER:
      return {
        id: v4(),
        name: 'number',
        label: 'Number',
        placeholder: '1000',
      };
    case FieldMetadataType.DATE:
      return {
        id: v4(),
        name: 'date',
        label: 'Date',
        placeholder: 'mm/dd/yyyy',
      };
    case FieldMetadataType.DATE_TIME:
      return {
        id: v4(),
        name: 'dateTime',
        label: 'Date & time',
        placeholder: 'mm/dd/yyyy hh:mm',
      };
    case 'RECORD':
      return {
        id: v4(),
        name: 'record',
        label: 'Record',
        placeholder: `Select a Company`,
        settings: {
          objectName: CoreObjectNameSingular.Company,
        },
      };
    case FieldMetadataType.SELECT:
      return {
        id: v4(),
        name: 'select',
        label: 'Select',
        placeholder: 'Choose a value',
        settings: {
          selectType: 'EXISTING_FIELD',
          selectedFieldId: undefined,
        },
      };
    case FieldMetadataType.MULTI_SELECT:
      return {
        id: v4(),
        name: 'multiSelect',
        label: 'Multi-Select',
        placeholder: 'Choose values',
        settings: {
          selectType: 'EXISTING_FIELD',
          selectedFieldId: undefined,
        },
      };
    case FieldMetadataType.BOOLEAN:
      return {
        id: v4(),
        name: 'checkbox',
        label: 'Checkbox',
        placeholder: '',
      };
    case FieldMetadataType.EMAILS:
      return {
        id: v4(),
        name: 'email',
        label: 'Email',
        placeholder: 'name@example.com',
      };
    case FieldMetadataType.PHONES:
      return {
        id: v4(),
        name: 'phone',
        label: 'Phone',
        placeholder: '+1 555 555 5555',
      };
    case FieldMetadataType.LINKS:
      return {
        id: v4(),
        name: 'url',
        label: 'URL',
        placeholder: 'https://',
      };
    case FieldMetadataType.ADDRESS:
      return {
        id: v4(),
        name: 'address',
        label: 'Address',
        placeholder: 'Street, city, country',
      };
    case FieldMetadataType.FULL_NAME:
      return {
        id: v4(),
        name: 'fullName',
        label: 'Full name',
        placeholder: 'First and last name',
      };
    case FieldMetadataType.FILES:
      return {
        id: v4(),
        name: 'files',
        label: 'File upload',
        placeholder: '',
      };
    case FieldMetadataType.RATING:
      return {
        id: v4(),
        name: 'rating',
        label: 'Rating',
        placeholder: '',
      };
    case FieldMetadataType.RICH_TEXT:
      return {
        id: v4(),
        name: 'longText',
        label: 'Long text',
        placeholder: 'Enter your message',
      };
    default:
      assertUnreachable(type);
  }
};
