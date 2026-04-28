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
  // Lead-capture tag policy: comma-separated string in the UI, an
  // array on the wire. Empty = no tagging.
  tagsToApplyOnSubmission: string[] | null;
  // Bot-protection toggles + per-form parameters.
  botProtectionEnabled: boolean;
  botProtectionSiteKey: string | null;
  honeypotFieldName: string | null;
  requireFormLoadToken: boolean;
  minSubmitTimeSeconds: number | null;
  rateLimitPerMinute: number | null;
  allowedOrigins: string[] | null;
  rejectDisposableEmails: boolean;
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

// Convert between an array (the wire shape) and a comma-separated
// string (the UI shape). Trims and drops empties on serialize.
const arrayToCsv = (arr: string[] | null | undefined): string =>
  Array.isArray(arr) ? arr.join(', ') : '';

const csvToArray = (csv: string): string[] | null => {
  const items = csv
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '');
  return items.length === 0 ? null : items;
};

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

      {settings.autoCreatePerson && (
        <FormFieldInputContainer>
          <InputLabel>{t`Tags to apply on submission`}</InputLabel>
          <StyledToggleDescription>
            {t`Comma-separated tags merged into the auto-created Person's tags array. Use to segment "filled out form X" vs "filled out form Y".`}
          </StyledToggleDescription>
          <TextInput
            value={arrayToCsv(settings.tagsToApplyOnSubmission)}
            onChange={(value) =>
              onSettingsChange({
                ...settings,
                tagsToApplyOnSubmission: csvToArray(value),
              })
            }
            placeholder={t`newsletter, demo-requested`}
            readOnly={readonly}
            fullWidth
          />
        </FormFieldInputContainer>
      )}

      <StyledSectionDivider />

      {/* Bot protection — six layers, all optional, configured per
          form. Cheapest checks first match the controller's order so
          the UI guides users through the same mental model. */}
      <StyledSectionLabel>{t`Bot Protection`}</StyledSectionLabel>

      <FormFieldInputContainer>
        <InputLabel>{t`Allowed origins`}</InputLabel>
        <StyledToggleDescription>
          {t`Comma-separated allowlist of Origin / Referer hosts permitted to submit. Empty = all allowed. e.g. https://customer-site.com`}
        </StyledToggleDescription>
        <TextInput
          value={arrayToCsv(settings.allowedOrigins)}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              allowedOrigins: csvToArray(value),
            })
          }
          placeholder={t`https://customer-site.com, https://staging.customer-site.com`}
          readOnly={readonly}
          fullWidth
        />
      </FormFieldInputContainer>

      <FormFieldInputContainer>
        <InputLabel>{t`Rate limit (per IP per minute)`}</InputLabel>
        <StyledToggleDescription>
          {t`Max submissions per source IP per rolling 60-second window. 0 or empty disables. Recommended: 5.`}
        </StyledToggleDescription>
        <TextInput
          value={
            settings.rateLimitPerMinute === null ||
            settings.rateLimitPerMinute === undefined
              ? ''
              : String(settings.rateLimitPerMinute)
          }
          onChange={(value) => {
            const parsed = parseInt(value, 10);
            onSettingsChange({
              ...settings,
              rateLimitPerMinute: Number.isFinite(parsed) ? parsed : null,
            });
          }}
          placeholder="5"
          readOnly={readonly}
          fullWidth
        />
      </FormFieldInputContainer>

      <StyledToggleRow>
        <StyledToggleTextContainer>
          <StyledToggleLabel>{t`Reject disposable emails`}</StyledToggleLabel>
          <StyledToggleDescription>
            {t`Drop submissions whose email ends in a known temp-mail domain (Mailinator, Tempmail, 10minutemail, etc.).`}
          </StyledToggleDescription>
        </StyledToggleTextContainer>
        <Toggle
          value={settings.rejectDisposableEmails}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              rejectDisposableEmails: value,
            })
          }
          disabled={readonly}
          toggleSize="small"
        />
      </StyledToggleRow>

      <StyledToggleRow>
        <StyledToggleTextContainer>
          <StyledToggleLabel>{t`Require form-load token`}</StyledToggleLabel>
          <StyledToggleDescription>
            {t`Require submissions to include the signed JWT issued by GET /schema. Defeats bots that POST without rendering the form.`}
          </StyledToggleDescription>
        </StyledToggleTextContainer>
        <Toggle
          value={settings.requireFormLoadToken}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              requireFormLoadToken: value,
            })
          }
          disabled={readonly}
          toggleSize="small"
        />
      </StyledToggleRow>

      {settings.requireFormLoadToken && (
        <FormFieldInputContainer>
          <InputLabel>{t`Minimum submit time (seconds)`}</InputLabel>
          <StyledToggleDescription>
            {t`Reject submissions whose form-load token age is below this floor. Catches instant-fire bots. Default 2.`}
          </StyledToggleDescription>
          <TextInput
            value={
              settings.minSubmitTimeSeconds === null ||
              settings.minSubmitTimeSeconds === undefined
                ? ''
                : String(settings.minSubmitTimeSeconds)
            }
            onChange={(value) => {
              const parsed = parseInt(value, 10);
              onSettingsChange({
                ...settings,
                minSubmitTimeSeconds: Number.isFinite(parsed) ? parsed : null,
              });
            }}
            placeholder="2"
            readOnly={readonly}
            fullWidth
          />
        </FormFieldInputContainer>
      )}

      <FormFieldInputContainer>
        <InputLabel>{t`Honeypot field name`}</InputLabel>
        <StyledToggleDescription>
          {t`Name of a CSS-hidden form field. Bots that auto-fill it get silently rejected (200 OK with submissionId "honeypot-rejected"). Empty = disabled.`}
        </StyledToggleDescription>
        <TextInput
          value={settings.honeypotFieldName ?? ''}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              honeypotFieldName: value || null,
            })
          }
          placeholder={t`company_url`}
          readOnly={readonly}
          fullWidth
        />
      </FormFieldInputContainer>

      <StyledToggleRow>
        <StyledToggleTextContainer>
          <StyledToggleLabel>{t`Cloudflare Turnstile`}</StyledToggleLabel>
          <StyledToggleDescription>
            {t`Require a valid Turnstile token (server validates against the CLOUDFLARE_TURNSTILE_SECRET_KEY env var). Optional — the native layers above are usually enough.`}
          </StyledToggleDescription>
        </StyledToggleTextContainer>
        <Toggle
          value={settings.botProtectionEnabled}
          onChange={(value) =>
            onSettingsChange({
              ...settings,
              botProtectionEnabled: value,
            })
          }
          disabled={readonly}
          toggleSize="small"
        />
      </StyledToggleRow>

      {settings.botProtectionEnabled && (
        <FormFieldInputContainer>
          <InputLabel>{t`Turnstile site key`}</InputLabel>
          <StyledToggleDescription>
            {t`Cloudflare Turnstile public site key embedded in the form's host page.`}
          </StyledToggleDescription>
          <TextInput
            value={settings.botProtectionSiteKey ?? ''}
            onChange={(value) =>
              onSettingsChange({
                ...settings,
                botProtectionSiteKey: value || null,
              })
            }
            placeholder="0x4AAAAAAA..."
            readOnly={readonly}
            fullWidth
          />
        </FormFieldInputContainer>
      )}

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
