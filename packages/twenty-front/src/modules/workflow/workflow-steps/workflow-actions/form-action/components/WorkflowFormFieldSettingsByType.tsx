import { WorkflowFormFieldSettingsDate } from '@/workflow/workflow-steps/workflow-actions/form-action/components/WorkflowFormFieldSettingsDate';
import { WorkflowFormFieldSettingsRecordPicker } from '@/workflow/workflow-steps/workflow-actions/form-action/components/WorkflowFormFieldSettingsRecordPicker';
import { WorkflowFormFieldSettingsSelect } from '@/workflow/workflow-steps/workflow-actions/form-action/components/WorkflowFormFieldSettingsSelect';
import { type WorkflowFormActionField } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormActionField';
import { FieldMetadataType } from 'twenty-shared/types';
import { assertUnreachable } from 'twenty-shared/utils';
import { WorkflowFormFieldSettingsNumber } from './WorkflowFormFieldSettingsNumber';
import { WorkflowFormFieldSettingsText } from './WorkflowFormFieldSettingsText';

export const WorkflowFormFieldSettingsByType = ({
  field,
  onChange,
}: {
  field: WorkflowFormActionField;
  onChange: (updatedField: WorkflowFormActionField) => void;
}) => {
  switch (field.type) {
    case FieldMetadataType.TEXT:
    case FieldMetadataType.RICH_TEXT:
      return (
        <WorkflowFormFieldSettingsText field={field} onChange={onChange} />
      );
    case FieldMetadataType.NUMBER:
    case FieldMetadataType.RATING:
      return (
        <WorkflowFormFieldSettingsNumber field={field} onChange={onChange} />
      );
    case FieldMetadataType.DATE:
    case FieldMetadataType.DATE_TIME:
      return (
        <WorkflowFormFieldSettingsDate field={field} onChange={onChange} />
      );
    case FieldMetadataType.SELECT:
    case FieldMetadataType.MULTI_SELECT:
      return (
        <WorkflowFormFieldSettingsSelect field={field} onChange={onChange} />
      );
    case 'RECORD':
      return (
        <WorkflowFormFieldSettingsRecordPicker
          field={field}
          onChange={onChange}
        />
      );
    // Types that have no extra type-specific settings beyond label,
    // placeholder, and required (handled in the parent settings panel).
    // Boolean / Emails / Phones / Links / Address / Full name / Files
    // each render a specialized input on the public form via the
    // existing FormFieldInput dispatcher — no per-type config needed.
    case FieldMetadataType.BOOLEAN:
    case FieldMetadataType.EMAILS:
    case FieldMetadataType.PHONES:
    case FieldMetadataType.LINKS:
    case FieldMetadataType.ADDRESS:
    case FieldMetadataType.FULL_NAME:
    case FieldMetadataType.FILES:
      return null;
    default:
      return assertUnreachable(field.type, 'Unknown form field type');
  }
};
