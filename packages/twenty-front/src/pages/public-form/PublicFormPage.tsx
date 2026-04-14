import { FormFieldInput } from '@/object-record/record-field/ui/components/FormFieldInput';
import { FormFieldInputContainer } from '@/object-record/record-field/ui/form-types/components/FormFieldInputContainer';
import { type FieldMetadata } from '@/object-record/record-field/ui/types/FieldMetadata';
import { type WorkflowFormActionField } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormActionField';
import { getDefaultFormFieldSettings } from '@/workflow/workflow-steps/workflow-actions/form-action/utils/getDefaultFormFieldSettings';
import { styled } from '@linaria/react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { type FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

type FormSchema = {
  id: string;
  name: string;
  description: string | null;
  fields: WorkflowFormActionField[];
  thankYouMessage: string | null;
};

type FormState = 'loading' | 'ready' | 'submitting' | 'success' | 'error';

const StyledPageContainer = styled.div`
  align-items: flex-start;
  background: ${themeCssVariables.background.noisy};
  display: flex;
  justify-content: center;
  min-height: 100dvh;
  padding: ${themeCssVariables.spacing[8]} ${themeCssVariables.spacing[4]};
`;

const StyledFormCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.light};
  max-width: 600px;
  padding: ${themeCssVariables.spacing[8]};
  width: 100%;
`;

const StyledFormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

const StyledFormName = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledFormDescription = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  margin: 0;
`;

const StyledFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

const StyledSubmitButton = styled.button`
  background: ${themeCssVariables.color.blue};
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  transition: opacity 150ms ease;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledStatusContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[8]} 0;
  text-align: center;
`;

const StyledStatusTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledStatusMessage = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  margin: 0;
`;

const StyledErrorMessage = styled.p`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

export const PublicFormPage = () => {
  const { workspaceId, formId } = useParams<{
    workspaceId: string;
    formId: string;
  }>();

  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [formState, setFormState] = useState<FormState>('loading');
  const [fieldValues, setFieldValues] = useState<Record<string, unknown>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [thankYouMessage, setThankYouMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormSchema = async () => {
      try {
        const response = await fetch(
          `${REACT_APP_SERVER_BASE_URL}/forms/${workspaceId}/${formId}/schema`,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ?? `Form not found (${response.status})`,
          );
        }

        const data: FormSchema = await response.json();

        setFormSchema(data);
        setFormState('ready');
      } catch (fetchError) {
        setErrorMessage(
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load form',
        );
        setFormState('error');
      }
    };

    if (isDefined(workspaceId) && isDefined(formId)) {
      fetchFormSchema();
    }
  }, [workspaceId, formId]);

  const onFieldChange = useCallback((fieldName: string, value: unknown) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  const onSubmit = useCallback(async () => {
    if (!isDefined(formSchema) || formState !== 'ready') {
      return;
    }

    setFormState('submitting');
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${REACT_APP_SERVER_BASE_URL}/forms/${workspaceId}/${formId}/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: fieldValues }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? 'Submission failed');
      }

      const data = await response.json();

      setThankYouMessage(
        data.thankYouMessage ?? 'Thank you for your submission!',
      );
      setFormState('success');
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to submit form',
      );
      setFormState('ready');
    }
  }, [formSchema, formState, workspaceId, formId, fieldValues]);

  if (formState === 'loading') {
    return (
      <StyledPageContainer>
        <StyledFormCard>
          <StyledStatusContainer>
            <StyledStatusMessage>Loading form...</StyledStatusMessage>
          </StyledStatusContainer>
        </StyledFormCard>
      </StyledPageContainer>
    );
  }

  if (formState === 'error' && !isDefined(formSchema)) {
    return (
      <StyledPageContainer>
        <StyledFormCard>
          <StyledStatusContainer>
            <StyledStatusTitle>Form Unavailable</StyledStatusTitle>
            <StyledStatusMessage>
              {errorMessage ?? 'This form is not available.'}
            </StyledStatusMessage>
          </StyledStatusContainer>
        </StyledFormCard>
      </StyledPageContainer>
    );
  }

  if (formState === 'success') {
    return (
      <StyledPageContainer>
        <StyledFormCard>
          <StyledStatusContainer>
            <StyledStatusTitle>Submitted</StyledStatusTitle>
            <StyledStatusMessage>
              {thankYouMessage ?? 'Thank you for your submission!'}
            </StyledStatusMessage>
          </StyledStatusContainer>
        </StyledFormCard>
      </StyledPageContainer>
    );
  }

  if (!isDefined(formSchema)) {
    return null;
  }

  const displayFields = formSchema.fields.filter(
    (field) => field.type !== 'RECORD',
  );

  return (
    <StyledPageContainer>
      <StyledFormCard>
        <StyledFormHeader>
          {isDefined(formSchema.name) && (
            <StyledFormName>{formSchema.name}</StyledFormName>
          )}
          {isDefined(formSchema.description) && (
            <StyledFormDescription>
              {formSchema.description}
            </StyledFormDescription>
          )}
        </StyledFormHeader>

        <StyledFieldsContainer>
          {displayFields.map((field) => (
            <FormFieldInputContainer key={field.id}>
              <FormFieldInput
                field={{
                  label: field.label,
                  type: field.type as FieldMetadataType,
                  metadata: {} as FieldMetadata,
                }}
                onChange={(value) => onFieldChange(field.name, value)}
                defaultValue={field.value ?? null}
                placeholder={
                  field.placeholder ??
                  getDefaultFormFieldSettings(field.type).placeholder
                }
              />
            </FormFieldInputContainer>
          ))}
        </StyledFieldsContainer>

        {isDefined(errorMessage) && (
          <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
        )}

        <StyledSubmitButton
          onClick={onSubmit}
          disabled={formState === 'submitting'}
        >
          {formState === 'submitting' ? 'Submitting...' : 'Submit'}
        </StyledSubmitButton>
      </StyledFormCard>
    </StyledPageContainer>
  );
};
