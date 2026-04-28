import { FormFieldInput } from '@/object-record/record-field/ui/components/FormFieldInput';
import { FormFieldInputContainer } from '@/object-record/record-field/ui/form-types/components/FormFieldInputContainer';
import { type FieldMetadata } from '@/object-record/record-field/ui/types/FieldMetadata';
import { type WorkflowFormActionField } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormActionField';
import { getDefaultFormFieldSettings } from '@/workflow/workflow-steps/workflow-actions/form-action/utils/getDefaultFormFieldSettings';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { type FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { Callout } from 'twenty-ui/display';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export type FormPreviewProps = {
  fields: WorkflowFormActionField[];
  formName?: string;
  formDescription?: string;
  // Custom submit button copy. Defaults to "Submit" when null /
  // undefined. Mirrors PublicFormPage so the in-CRM preview matches
  // what visitors will see.
  submitButtonLabel?: string | null;
};

const StyledFormPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledFormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledFormName = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledFormDescription = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  margin: 0;
`;

const StyledFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

/* oxlint-disable twenty/no-hardcoded-colors -- preview submit button
   uses the brand orange so it visually matches what visitors will
   see on the public form (which is also brand-colored). */
const StyledSubmitButtonPreview = styled.button`
  background: #ff7a59;
  border: 0;
  border-radius: 6px;
  color: #ffffff;
  cursor: not-allowed;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  margin-top: ${themeCssVariables.spacing[2]};
  padding: 10px 24px;
  width: 100%;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

export const FormPreview = ({
  fields,
  formName,
  formDescription,
  submitButtonLabel,
}: FormPreviewProps) => {
  const { t } = useLingui();

  if (fields.length === 0) {
    return (
      <StyledFormPreviewContainer>
        <Callout
          variant={'neutral'}
          isClosable={false}
          title={t`No fields configured`}
          description={t`Add fields to your form using the Builder tab to see a preview here.`}
        />
      </StyledFormPreviewContainer>
    );
  }

  return (
    <StyledFormPreviewContainer>
      {(isDefined(formName) || isDefined(formDescription)) && (
        <StyledFormHeader>
          {isDefined(formName) && <StyledFormName>{formName}</StyledFormName>}
          {isDefined(formDescription) && (
            <StyledFormDescription>{formDescription}</StyledFormDescription>
          )}
        </StyledFormHeader>
      )}

      <StyledFieldsContainer>
        {fields
          .filter((field) => field.type !== 'RECORD')
          .map((field) => (
            <FormFieldInputContainer key={field.id}>
              <FormFieldInput
                field={{
                  label: field.label,
                  type: field.type as FieldMetadataType,
                  metadata: {} as FieldMetadata,
                }}
                onChange={() => {}}
                defaultValue={field.value ?? null}
                readonly
                placeholder={
                  field.placeholder ??
                  getDefaultFormFieldSettings(field.type).placeholder
                }
              />
            </FormFieldInputContainer>
          ))}
        <StyledSubmitButtonPreview type="button" disabled>
          {submitButtonLabel !== undefined &&
          submitButtonLabel !== null &&
          submitButtonLabel.trim() !== ''
            ? submitButtonLabel
            : t`Submit`}
        </StyledSubmitButtonPreview>
      </StyledFieldsContainer>
    </StyledFormPreviewContainer>
  );
};
