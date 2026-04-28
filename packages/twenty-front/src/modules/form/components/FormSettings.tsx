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
  redirectUrl: string | null;
  sendConfirmationEmail: boolean;
  confirmationEmailSubject: string | null;
  confirmationEmailBody: string | null;
  autoCreatePerson: boolean;
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

const StyledSectionDivider = styled.div`
  border-top: 1px solid ${themeCssVariables.border.color.light};
  margin: ${themeCssVariables.spacing[1]} 0;
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  text-transform: uppercase;
`;

export const FormSettings = ({
  settings,
  onSettingsChange,
  readonly = false,
}: FormSettingsProps) => {
  return (
    <StyledFormSettingsContainer>
      {/* Submission behavior */}
      <StyledSectionLabel>{t`After Submission`}</StyledSectionLabel>

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

      <FormFieldInputContainer>
        <InputLabel>{t`Redirect URL`}</InputLabel>
        <TextInput
          value={settings.redirectUrl ?? ''}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              redirectUrl: value || null,
            })
          }
          placeholder={t`https://example.com/thank-you`}
          readOnly={readonly}
          fullWidth
        />
      </FormFieldInputContainer>

      <StyledSectionDivider />

      {/* Notification emails */}
      <StyledSectionLabel>{t`Notifications`}</StyledSectionLabel>

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

      <StyledSectionDivider />

      {/* Lead auto-creation */}
      <StyledSectionLabel>{t`Lead Capture`}</StyledSectionLabel>

      <StyledToggleRow>
        <StyledToggleTextContainer>
          <StyledToggleLabel>{t`Auto-create Person on submit`}</StyledToggleLabel>
          <StyledToggleDescription>
            {t`Create a Person record from each submission's email/name fields. Disable for surveys or feedback forms where the submitter shouldn't become a contact.`}
          </StyledToggleDescription>
        </StyledToggleTextContainer>
        <Toggle
          value={settings.autoCreatePerson}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              autoCreatePerson: value,
            })
          }
          disabled={readonly}
          toggleSize="small"
        />
      </StyledToggleRow>

      <StyledSectionDivider />

      {/* Confirmation emails */}
      <StyledSectionLabel>{t`Confirmation Email`}</StyledSectionLabel>

      <StyledToggleRow>
        <StyledToggleTextContainer>
          <StyledToggleLabel>{t`Send Confirmation Email`}</StyledToggleLabel>
          <StyledToggleDescription>
            {t`Send a confirmation email to the submitter`}
          </StyledToggleDescription>
        </StyledToggleTextContainer>
        <Toggle
          value={settings.sendConfirmationEmail}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              sendConfirmationEmail: value,
            })
          }
          disabled={readonly}
          toggleSize="small"
        />
      </StyledToggleRow>

      {settings.sendConfirmationEmail && (
        <>
          <FormFieldInputContainer>
            <InputLabel>{t`Subject`}</InputLabel>
            <TextInput
              value={settings.confirmationEmailSubject ?? ''}
              onChange={(value) =>
                onSettingsChange({
                  ...settings,
                  confirmationEmailSubject: value || null,
                })
              }
              placeholder={t`Thank you for your submission`}
              readOnly={readonly}
              fullWidth
            />
          </FormFieldInputContainer>

          <FormFieldInputContainer>
            <InputLabel>{t`Body (HTML)`}</InputLabel>
            <TextInput
              value={settings.confirmationEmailBody ?? ''}
              onChange={(value) =>
                onSettingsChange({
                  ...settings,
                  confirmationEmailBody: value || null,
                })
              }
              placeholder={t`<p>Thank you for contacting us. We'll be in touch shortly.</p>`}
              readOnly={readonly}
              fullWidth
            />
          </FormFieldInputContainer>
        </>
      )}
    </StyledFormSettingsContainer>
  );
};
