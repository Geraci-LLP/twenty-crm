import { type WorkflowFormActionField } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormActionField';
import { isDefined } from 'twenty-shared/utils';

export const validateFormField = (
  field: WorkflowFormActionField,
  value: unknown,
): string | null => {
  const validation = field.validation;

  if (!isDefined(validation)) {
    return null;
  }

  const stringValue = typeof value === 'string' ? value : '';
  const isEmpty =
    value === undefined ||
    value === null ||
    value === '' ||
    (typeof value === 'string' && value.trim() === '');

  if (validation.required && isEmpty) {
    return `${field.label} is required`;
  }

  if (isEmpty) {
    return null;
  }

  if (
    isDefined(validation.minLength) &&
    stringValue.length < validation.minLength
  ) {
    return `${field.label} must be at least ${validation.minLength} characters`;
  }

  if (
    isDefined(validation.maxLength) &&
    stringValue.length > validation.maxLength
  ) {
    return `${field.label} must be at most ${validation.maxLength} characters`;
  }

  if (isDefined(validation.min)) {
    const numValue = Number(value);

    if (!isNaN(numValue) && numValue < validation.min) {
      return `${field.label} must be at least ${validation.min}`;
    }
  }

  if (isDefined(validation.max)) {
    const numValue = Number(value);

    if (!isNaN(numValue) && numValue > validation.max) {
      return `${field.label} must be at most ${validation.max}`;
    }
  }

  if (isDefined(validation.pattern)) {
    try {
      const regex = new RegExp(validation.pattern);

      if (!regex.test(stringValue)) {
        return (
          validation.patternMessage ?? `${field.label} has an invalid format`
        );
      }
    } catch {
      // Invalid regex pattern — skip validation
    }
  }

  return null;
};

export const validateAllFormFields = (
  fields: WorkflowFormActionField[],
  values: Record<string, unknown>,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    if (field.type === 'RECORD') {
      continue;
    }

    const error = validateFormField(field, values[field.name]);

    if (isDefined(error)) {
      errors[field.name] = error;
    }
  }

  return errors;
};
