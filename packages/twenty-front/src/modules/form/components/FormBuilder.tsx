import { FormFieldInputContainer } from '@/object-record/record-field/ui/form-types/components/FormFieldInputContainer';
import { FormFieldInputInnerContainer } from '@/object-record/record-field/ui/form-types/components/FormFieldInputInnerContainer';
import { FormFieldInputRowContainer } from '@/object-record/record-field/ui/form-types/components/FormFieldInputRowContainer';
import { FormFieldPlaceholder } from '@/object-record/record-field/ui/form-types/components/FormFieldPlaceholder';
import { InputLabel } from '@/ui/input/components/InputLabel';
import { DraggableItem } from '@/ui/layout/draggable-list/components/DraggableItem';
import { DraggableList } from '@/ui/layout/draggable-list/components/DraggableList';
import { type WorkflowFormActionField } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormActionField';
import { WorkflowEditActionFormFieldSettings } from '@/workflow/workflow-steps/workflow-actions/form-action/components/WorkflowEditActionFormFieldSettings';
import { getDefaultFormFieldSettings } from '@/workflow/workflow-steps/workflow-actions/form-action/utils/getDefaultFormFieldSettings';
import { type OnDragEndResponder } from '@hello-pangea/dnd';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { useContext, useEffect, useState } from 'react';
import { FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import {
  Callout,
  IconChevronDown,
  IconGripVertical,
  IconPlus,
  IconTrash,
} from 'twenty-ui/display';
import { LightIconButton } from 'twenty-ui/input';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';
import { useDebouncedCallback } from 'use-debounce';
import { v4 } from 'uuid';

export type FormBuilderProps = {
  fields: WorkflowFormActionField[];
  onFieldsChange: (fields: WorkflowFormActionField[]) => void;
  readonly?: boolean;
};

const StyledFormBuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledFormFieldContainer = styled.div`
  align-items: flex-end;
  column-gap: ${themeCssVariables.spacing[1]};
  display: grid;
  grid-template-areas:
    'grip input delete'
    '. settings .';
  grid-template-columns: 24px 1fr 24px;
  position: relative;
`;

const StyledDraggingIndicator = styled.div`
  background-color: ${themeCssVariables.background.transparent.light};
  inset: -8px;
  position: absolute;
  top: -4px;
`;

const StyledGripButtonContainer = styled.div`
  align-items: flex-end;
  display: flex;
  grid-area: grip;
  margin-bottom: ${themeCssVariables.spacing[1]};
`;

const StyledTrashButtonContainer = styled.div`
  align-items: flex-end;
  display: flex;
  grid-area: delete;
  margin-bottom: ${themeCssVariables.spacing[1]};
`;

const StyledFormFieldInputContainerWrapper = styled.div`
  grid-area: input;
`;

const StyledOpenedSettingsContainer = styled.div`
  grid-area: settings;
`;

const StyledFieldContainer = styled.div<{
  readonly?: boolean;
}>`
  align-items: center;
  background: transparent;
  border: none;
  cursor: ${({ readonly }) => (readonly ? 'default' : 'pointer')};
  display: flex;
  font-family: inherit;
  height: 100%;
  padding-left: ${themeCssVariables.spacing[2]};
  padding-right: ${themeCssVariables.spacing[2]};
  width: 100%;

  &:hover,
  &[data-open='true'] {
    background-color: ${({ readonly }) =>
      readonly
        ? 'transparent'
        : themeCssVariables.background.transparent.lighter};
  }
`;

const StyledPlaceholderContainer = styled.div`
  width: 100%;
`;

const StyledAddFieldButtonContainer = styled.div`
  padding-top: ${themeCssVariables.spacing[2]};
`;

const StyledAddFieldButtonContentContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: ${themeCssVariables.spacing[0.5]};
  justify-content: center;
  width: 100%;
`;

const StyledCalloutContainer = styled.div`
  padding-bottom: ${themeCssVariables.spacing[4]};
`;

export const FormBuilder = ({
  fields,
  onFieldsChange,
  readonly = false,
}: FormBuilderProps) => {
  const { t } = useLingui();
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState<WorkflowFormActionField[]>(fields);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const isFieldSelected = (fieldId: string) => selectedField === fieldId;
  const isFieldHovered = (fieldId: string) => hoveredField === fieldId;

  const handleFieldClick = (fieldId: string) => {
    if (readonly) return;

    setSelectedField(isFieldSelected(fieldId) ? null : fieldId);
  };

  const saveFields = useDebouncedCallback(
    (updatedFields: WorkflowFormActionField[]) => {
      if (readonly) return;
      onFieldsChange(updatedFields);
    },
    1_000,
  );

  useEffect(() => {
    return () => {
      saveFields.flush();
    };
  }, [saveFields]);

  const onFieldUpdate = (updatedField: WorkflowFormActionField) => {
    if (readonly) return;

    const updatedFormData = formData.map((currentField) =>
      currentField.id === updatedField.id ? updatedField : currentField,
    );

    setFormData(updatedFormData);
    saveFields(updatedFormData);
  };

  const handleDragEnd: OnDragEndResponder = ({ source, destination }) => {
    if (readonly) return;

    const movedField = formData.at(source.index);

    if (!isDefined(movedField) || !isDefined(destination)) return;

    const copiedFormData = [...formData];

    copiedFormData.splice(source.index, 1);
    copiedFormData.splice(destination.index, 0, movedField);

    setFormData(copiedFormData);
    saveFields(copiedFormData);
  };

  const handleAddField = () => {
    const { label, name } = getDefaultFormFieldSettings(FieldMetadataType.TEXT);

    const newField: WorkflowFormActionField = {
      id: v4(),
      name,
      type: FieldMetadataType.TEXT,
      label,
    };

    const updatedFormData = [...formData, newField];

    setFormData(updatedFormData);
    onFieldsChange(updatedFormData);
    setSelectedField(newField.id);
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedFormData = formData.filter(
      (currentField) => currentField.id !== fieldId,
    );

    setFormData(updatedFormData);
    onFieldsChange(updatedFormData);
  };

  return (
    <StyledFormBuilderContainer>
      {formData.length === 0 && (
        <StyledCalloutContainer>
          <Callout
            variant={'neutral'}
            isClosable={false}
            title={t`Add fields to your form`}
            description={t`Click "Add Field" below to add the first input. Published forms will be accessible via a public URL.`}
          />
        </StyledCalloutContainer>
      )}

      <DraggableList
        onDragEnd={handleDragEnd}
        draggableItems={
          <>
            {formData.map((field, index) => (
              <DraggableItem
                key={field.id}
                draggableId={field.id}
                index={index}
                isDragDisabled={readonly}
                isInsideScrollableContainer
                disableDraggingBackground
                draggableComponentStyles={{
                  marginBottom: themeCssVariables.spacing[4],
                }}
                itemComponent={({ isDragging }) => {
                  const showButtons =
                    !readonly &&
                    (isFieldSelected(field.id) ||
                      isFieldHovered(field.id) ||
                      isDragging);

                  return (
                    <StyledFormFieldContainer
                      key={field.id}
                      onMouseEnter={() => setHoveredField(field.id)}
                      onMouseLeave={() => setHoveredField(null)}
                    >
                      {isDragging && <StyledDraggingIndicator />}

                      {showButtons && (
                        <StyledGripButtonContainer>
                          <LightIconButton
                            Icon={IconGripVertical}
                            aria-label={t`Reorder field`}
                          />
                        </StyledGripButtonContainer>
                      )}

                      <StyledFormFieldInputContainerWrapper>
                        <InputLabel>{field.label || ''}</InputLabel>

                        <FormFieldInputRowContainer>
                          <FormFieldInputInnerContainer
                            formFieldInputInstanceId={field.id}
                            hasRightElement={false}
                            onClick={() => handleFieldClick(field.id)}
                          >
                            <StyledFieldContainer readonly={readonly}>
                              <StyledPlaceholderContainer>
                                <FormFieldPlaceholder>
                                  {isDefined(field.placeholder) &&
                                  isNonEmptyString(field.placeholder)
                                    ? field.placeholder
                                    : getDefaultFormFieldSettings(field.type)
                                        .placeholder}
                                </FormFieldPlaceholder>
                              </StyledPlaceholderContainer>
                              {(field.type === 'RECORD' ||
                                field.type === 'SELECT' ||
                                field.type === 'MULTI_SELECT') && (
                                <IconChevronDown
                                  size={theme.icon.size.md}
                                  color={themeCssVariables.font.color.tertiary}
                                />
                              )}
                            </StyledFieldContainer>
                          </FormFieldInputInnerContainer>
                        </FormFieldInputRowContainer>
                      </StyledFormFieldInputContainerWrapper>

                      {showButtons && (
                        <StyledTrashButtonContainer>
                          <LightIconButton
                            Icon={IconTrash}
                            aria-label={t`Delete field`}
                            onClick={() => handleDeleteField(field.id)}
                          />
                        </StyledTrashButtonContainer>
                      )}

                      {isFieldSelected(field.id) && (
                        <StyledOpenedSettingsContainer>
                          <WorkflowEditActionFormFieldSettings
                            field={field}
                            onChange={onFieldUpdate}
                            onClose={() => setSelectedField(null)}
                          />
                        </StyledOpenedSettingsContainer>
                      )}
                    </StyledFormFieldContainer>
                  );
                }}
              />
            ))}
          </>
        }
      />

      {!readonly && (
        <StyledAddFieldButtonContainer>
          <FormFieldInputContainer>
            <FormFieldInputRowContainer>
              <FormFieldInputInnerContainer
                formFieldInputInstanceId="add-field-button"
                hasRightElement={false}
                onClick={handleAddField}
              >
                <StyledFieldContainer>
                  <StyledAddFieldButtonContentContainer>
                    <IconPlus size={theme.icon.size.sm} />
                    {t`Add Field`}
                  </StyledAddFieldButtonContentContainer>
                </StyledFieldContainer>
              </FormFieldInputInnerContainer>
            </FormFieldInputRowContainer>
          </FormFieldInputContainer>
        </StyledAddFieldButtonContainer>
      )}
    </StyledFormBuilderContainer>
  );
};
