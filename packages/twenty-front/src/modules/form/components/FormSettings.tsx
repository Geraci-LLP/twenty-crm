import { FormFieldInputContainer } from '@/object-record/record-field/ui/form-types/components/FormFieldInputContainer';
import { InputLabel } from '@/ui/input/components/InputLabel';
import { TextInput } from '@/ui/input/components/TextInput';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { Toggle } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export type FormSettingsData = {
  thankYouMessage: string | null;
  notifyOnSubmission: boolean;
  notificationEmail: string | null;
};

export type FormSettingsProps = {
  settings: FormSettingsData;
  onSettingsChange: (settings: FormSettingsData) => void;
  readonly?: boolean;
};

const StyledFormSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledToggleRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
`;

const StyledToggleLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
`;

const StyledToggleDescription = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledToggleTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[0.5]};
`;

export const FormSettings = ({
  settings,
  onSettingsChange,
  readonly = false,
}: FormSettingsProps) => {
  return (
    <StyledFormSettingsContainer>
      <FormFieldInputContainer>
        <InputLabel>{t`Thank You Message`}</InputLabel>
        <TextInput
          value={settings.thankYouMessage ?? ''}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              thankYouMessage: value || null,
            })
          }
          placeholder={t`Thank you for your submission!`}
          readOnly={readonly}
          fullWidth
        />
      </FormFieldInputContainer>

      <StyledToggleRow>
        <StyledToggleTextContainer>
          <StyledToggleLabel>{t`Email Notifications`}</StyledToggleLabel>
          <StyledToggleDescription>
            {t`Send an email when a new submission is received`}
          </StyledToggleDescription>
        </StyledToggleTextContainer>
        <Toggle
          value={settings.notifyOnSubmission}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              notifyOnSubmission: value,
            })
          }
          disabled={readonly}
          toggleSize="small"
        />
      </StyledToggleRow>

      {settings.notifyOnSubmission && (
        <FormFieldInputContainer>
          <InputLabel>{t`Notification Email`}</InputLabel>
          <TextInput
            value={settings.notificationEmail ?? ''}
            onChange={(value) =>
              onSettingsChange({
                ...settings,
                notificationEmail: value || null,
              })
            }
            placeholder={t`email@example.com`}
            readOnly={readonly}
            fullWidth
          />
        </FormFieldInputContainer>
      )}
    </StyledFormSettingsContainer>
  );
};
