import { FormFieldInputContainer } from '@/object-record/record-field/ui/form-types/components/FormFieldInputContainer';
import { FormNumberFieldInput } from '@/object-record/record-field/ui/form-types/components/FormNumberFieldInput';
import { FormTextFieldInput } from '@/object-record/record-field/ui/form-types/components/FormTextFieldInput';
import { InputLabel } from '@/ui/input/components/InputLabel';
import { type FormFieldValidation } from '@/workflow/workflow-steps/workflow-actions/form-action/types/FormFieldValidation';
import { type WorkflowFormActionField } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormActionField';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { FieldMetadataType } from 'twenty-shared/types';
import { Toggle } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

type WorkflowFormFieldValidationSettingsProps = {
  field: WorkflowFormActionField;
  onChange: (updatedField: WorkflowFormActionField) => void;
};

const StyledValidationContainer = styled.div`
  border-top: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding-top: ${themeCssVariables.spacing[2]};
`;

const StyledToggleRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
`;

const StyledToggleLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  text-transform: uppercase;
`;

export const WorkflowFormFieldValidationSettings = ({
  field,
  onChange,
}: WorkflowFormFieldValidationSettingsProps) => {
  const validation = field.validation ?? {};

  const updateValidation = (updates: Partial<FormFieldValidation>) => {
    onChange({
      ...field,
      validation: { ...validation, ...updates },
    });
  };

  const isTextField = field.type === FieldMetadataType.TEXT;
  const isNumberField = field.type === FieldMetadataType.NUMBER;

  return (
    <StyledValidationContainer>
      <StyledSectionLabel>{t`Validation`}</StyledSectionLabel>

      <StyledToggleRow>
        <StyledToggleLabel>{t`Required`}</StyledToggleLabel>
        <Toggle
          value={validation.required ?? false}
          onChange={(value) => updateValidation({ required: value })}
          toggleSize="small"
        />
      </StyledToggleRow>

      {isTextField && (
        <StyledRow>
          <FormFieldInputContainer>
            <InputLabel>{t`Min Length`}</InputLabel>
            <FormNumberFieldInput
              defaultValue={validation.minLength ?? undefined}
              onChange={(value) =>
                updateValidation({
                  minLength:
                    typeof value === 'number'
                      ? value
                      : Number(value) || undefined,
                })
              }
              placeholder="0"
            />
          </FormFieldInputContainer>
          <FormFieldInputContainer>
            <InputLabel>{t`Max Length`}</InputLabel>
            <FormNumberFieldInput
              defaultValue={validation.maxLength ?? undefined}
              onChange={(value) =>
                updateValidation({
                  maxLength:
                    typeof value === 'number'
                      ? value
                      : Number(value) || undefined,
                })
              }
              placeholder="500"
            />
          </FormFieldInputContainer>
        </StyledRow>
      )}

      {isTextField && (
        <StyledRow>
          <FormFieldInputContainer>
            <InputLabel>{t`Pattern (regex)`}</InputLabel>
            <FormTextFieldInput
              defaultValue={validation.pattern ?? ''}
              onChange={(value) =>
                updateValidation({ pattern: value || undefined })
              }
              placeholder={t`e.g. ^[\\w.+-]+@[\\w-]+\\.[\\w.]+$`}
            />
          </FormFieldInputContainer>
        </StyledRow>
      )}

      {isTextField && validation.pattern && (
        <FormFieldInputContainer>
          <InputLabel>{t`Pattern Error Message`}</InputLabel>
          <FormTextFieldInput
            defaultValue={validation.patternMessage ?? ''}
            onChange={(value) =>
              updateValidation({ patternMessage: value || undefined })
            }
            placeholder={t`Please enter a valid value`}
          />
        </FormFieldInputContainer>
      )}

      {isNumberField && (
        <StyledRow>
          <FormFieldInputContainer>
            <InputLabel>{t`Min Value`}</InputLabel>
            <FormNumberFieldInput
              defaultValue={validation.min ?? undefined}
              onChange={(value) =>
                updateValidation({
                  min:
                    typeof value === 'number'
                      ? value
                      : Number(value) || undefined,
                })
              }
              placeholder="0"
            />
          </FormFieldInputContainer>
          <FormFieldInputContainer>
            <InputLabel>{t`Max Value`}</InputLabel>
            <FormNumberFieldInput
              defaultValue={validation.max ?? undefined}
              onChange={(value) =>
                updateValidation({
                  max:
                    typeof value === 'number'
                      ? value
                      : Number(value) || undefined,
                })
              }
              placeholder="1000"
            />
          </FormFieldInputContainer>
        </StyledRow>
      )}
    </StyledValidationContainer>
  );
};
