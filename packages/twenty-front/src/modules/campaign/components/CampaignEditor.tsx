import { styled } from '@linaria/react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { currentUserState } from '@/auth/states/currentUserState';
import { CampaignSaveAsTemplateButton } from '@/campaign/components/CampaignSaveAsTemplateButton';
import { CampaignTemplateGallery } from '@/campaign/components/CampaignTemplateGallery';
import { CAMPAIGN_PERSONALIZATION_TOKENS } from '@/campaign/constants/CampaignPersonalizationTokens';
import { useSendTestEmail } from '@/campaign/hooks/useSendTestEmail';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import {
  EmailBuilder,
  buildEmptyDesign,
  renderEmailDesign,
  wrapHtmlAsDesign,
} from '@/campaign/email-builder/components/EmailBuilder';
import { type EmailDesign } from '@/campaign/email-builder/types/CampaignDesign';
import {
  type CampaignEditorData,
  type CampaignPersonalizationToken,
} from '@/campaign/types/CampaignTypes';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledLabel = styled.label`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledLabelRow = styled.div`
  align-items: baseline;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
`;

const StyledCharCount = styled.span<{ overLimit: boolean }>`
  color: ${(p) =>
    p.overLimit
      ? themeCssVariables.color.red
      : themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-variant-numeric: tabular-nums;
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};

  &:focus {
    border-color: ${themeCssVariables.color.blue};
    outline: none;
  }

  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const StyledSenderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledSenderField = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledTextArea = styled.textarea`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  min-height: 300px;
  padding: ${themeCssVariables.spacing[3]};
  resize: vertical;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
    outline: none;
  }

  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const StyledTokenRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledTokenSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledInsertButton = styled.button`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};

  &:hover {
    background: ${themeCssVariables.background.quaternary};
  }
`;

const StyledWarningBanner = styled.div`
  background: ${themeCssVariables.color.orange}15;
  border: 1px solid ${themeCssVariables.color.orange};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledTemplatesButton = styled.button`
  background: none;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};

  &:hover {
    background: ${themeCssVariables.background.tertiary};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledToolbar = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
`;

const StyledModeTabs = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledActionsRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledTestSendButton = styled.button`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledModeTab = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${(p) => (p.active ? themeCssVariables.color.blue : 'transparent')};
  color: ${(p) =>
    p.active
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${(p) =>
    p.active
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

// Inbox truncation thresholds — Gmail / Apple Mail / Outlook all start
// truncating subject lines around 50 chars on mobile and around 70 on
// desktop. Preview text gets ~90–100 chars before truncation. These are
// soft limits; the count just turns red so the user knows.
const SUBJECT_RECOMMENDED_LIMIT = 60;
const PREVIEW_TEXT_RECOMMENDED_LIMIT = 90;

type CampaignEditorProps = {
  campaignId?: string;
  value: CampaignEditorData;
  onChange: (data: CampaignEditorData) => void;
  readOnly?: boolean;
};

type EditorMode = 'design' | 'code';

const parseDesign = (raw: unknown): EmailDesign | null => {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'object') return raw as EmailDesign;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as EmailDesign;
    } catch {
      return null;
    }
  }
  return null;
};

export const CampaignEditor = ({
  campaignId,
  value,
  onChange,
  readOnly = false,
}: CampaignEditorProps) => {
  const bodyTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedToken, setSelectedToken] =
    useState<CampaignPersonalizationToken>(CAMPAIGN_PERSONALIZATION_TOKENS[0]);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);

  const currentUser = useAtomStateValue(currentUserState);
  const { sendTestEmail, loading: testSendLoading } = useSendTestEmail();

  const handleTestSend = useCallback(async () => {
    if (!campaignId) return;
    const defaultEmail = currentUser?.email ?? '';
    const target = window.prompt('Send test email to:', defaultEmail);
    if (target === null) return;
    const trimmed = target.trim();
    if (trimmed === '') return;
    await sendTestEmail(campaignId, trimmed);
  }, [campaignId, currentUser?.email, sendTestEmail]);

  const initialDesign = useMemo(
    () => parseDesign(value.designJson),
    [value.designJson],
  );
  // Default to Design mode if a design exists; otherwise Code mode (legacy / new).
  const [mode, setMode] = useState<EditorMode>(
    initialDesign ? 'design' : 'code',
  );

  // CAN-SPAM compliance: every marketing email needs a physical mailing
  // address + unsubscribe mechanism. The Footer module renders both, so
  // warn if the user hasn't added one. Soft warning, not a block on save.
  const designLacksFooter = useMemo(() => {
    const design = parseDesign(value.designJson);
    if (!design) return false; // legacy / code mode — code-mode has its own warning
    return !design.sections.some((s) =>
      s.columns?.some((c) => c.modules.some((m) => m.type === 'footer')),
    );
  }, [value.designJson]);

  const handleFieldChange = useCallback(
    (field: keyof CampaignEditorData, fieldValue: string) => {
      onChange({ ...value, [field]: fieldValue });
    },
    [onChange, value],
  );

  const handleDesignChange = useCallback(
    (nextDesign: EmailDesign, renderedHtml: string) => {
      onChange({
        ...value,
        designJson: nextDesign,
        designVersion: nextDesign.version,
        body: renderedHtml,
      });
    },
    [onChange, value],
  );

  const handleEnterDesignMode = useCallback(() => {
    setMode('design');
    if (initialDesign) return;
    // Convert legacy HTML body to a single-text-module design so no content is
    // lost. Save happens on next user edit; switching modes alone doesn't write.
    const seed = value.body ? wrapHtmlAsDesign(value.body) : buildEmptyDesign();
    onChange({
      ...value,
      designJson: seed,
      designVersion: seed.version,
      body: renderEmailDesign(seed),
    });
  }, [initialDesign, onChange, value]);

  const handleInsertToken = useCallback(() => {
    const textArea = bodyTextAreaRef.current;

    if (!textArea) {
      return;
    }

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const currentBody = value.body;
    const newBody =
      currentBody.substring(0, start) +
      selectedToken.value +
      currentBody.substring(end);

    onChange({ ...value, body: newBody });

    requestAnimationFrame(() => {
      const cursorPosition = start + selectedToken.value.length;
      textArea.focus();
      textArea.setSelectionRange(cursorPosition, cursorPosition);
    });
  }, [onChange, selectedToken, value]);

  return (
    <StyledContainer>
      <StyledSenderRow>
        <StyledSenderField>
          <StyledLabel>From Name</StyledLabel>
          <StyledInput
            type="text"
            placeholder="Your Name"
            value={value.fromName}
            onChange={(event) =>
              handleFieldChange('fromName', event.target.value)
            }
            readOnly={readOnly}
          />
        </StyledSenderField>
        <StyledSenderField>
          <StyledLabel>From Email</StyledLabel>
          <StyledInput
            type="email"
            placeholder="you@company.com"
            value={value.fromEmail}
            onChange={(event) =>
              handleFieldChange('fromEmail', event.target.value)
            }
            readOnly={readOnly}
          />
        </StyledSenderField>
      </StyledSenderRow>

      <StyledFieldGroup>
        <StyledLabelRow>
          <StyledLabel>Subject</StyledLabel>
          <StyledCharCount
            overLimit={value.subject.length > SUBJECT_RECOMMENDED_LIMIT}
            title={`Most inboxes truncate after ~${SUBJECT_RECOMMENDED_LIMIT} chars`}
          >
            {value.subject.length} / {SUBJECT_RECOMMENDED_LIMIT}
          </StyledCharCount>
        </StyledLabelRow>
        <StyledInput
          type="text"
          placeholder="Email subject line"
          value={value.subject}
          onChange={(event) => handleFieldChange('subject', event.target.value)}
          readOnly={readOnly}
        />
      </StyledFieldGroup>

      <StyledFieldGroup>
        <StyledLabelRow>
          <StyledLabel>Preview text</StyledLabel>
          <StyledCharCount
            overLimit={
              value.previewText.length > PREVIEW_TEXT_RECOMMENDED_LIMIT
            }
            title={`Most inboxes truncate after ~${PREVIEW_TEXT_RECOMMENDED_LIMIT} chars`}
          >
            {value.previewText.length} / {PREVIEW_TEXT_RECOMMENDED_LIMIT}
          </StyledCharCount>
        </StyledLabelRow>
        <StyledInput
          type="text"
          placeholder="Inbox preview shown after the subject (recommended ~90 chars)"
          value={value.previewText}
          onChange={(event) =>
            handleFieldChange('previewText', event.target.value)
          }
          readOnly={readOnly}
        />
      </StyledFieldGroup>

      <StyledFieldGroup>
        <StyledLabel>Body</StyledLabel>
        {!readOnly && (
          <StyledModeTabs>
            <StyledModeTab
              active={mode === 'design'}
              onClick={handleEnterDesignMode}
              type="button"
            >
              Design
            </StyledModeTab>
            <StyledModeTab
              active={mode === 'code'}
              onClick={() => setMode('code')}
              type="button"
            >
              Code
            </StyledModeTab>
          </StyledModeTabs>
        )}
        {mode === 'design' ? (
          <>
            {!readOnly && designLacksFooter && (
              <StyledWarningBanner>
                Your email design has no Footer module. CAN-SPAM requires a
                physical mailing address and an unsubscribe mechanism in every
                marketing email — add a Footer module before sending.
              </StyledWarningBanner>
            )}
            <EmailBuilder
              design={parseDesign(value.designJson) ?? buildEmptyDesign()}
              onChange={handleDesignChange}
              readOnly={readOnly}
              meta={{
                fromName: value.fromName,
                fromEmail: value.fromEmail,
                subject: value.subject,
                previewText: value.previewText,
              }}
            />
          </>
        ) : (
          <>
            {!readOnly && (
              <StyledToolbar>
                <StyledTokenRow>
                  <StyledTokenSelect
                    value={selectedToken.value}
                    onChange={(event) => {
                      const token = CAMPAIGN_PERSONALIZATION_TOKENS.find(
                        (personalizationToken) =>
                          personalizationToken.value === event.target.value,
                      );

                      if (token) {
                        setSelectedToken(token);
                      }
                    }}
                  >
                    {CAMPAIGN_PERSONALIZATION_TOKENS.map(
                      (personalizationToken) => (
                        <option
                          key={personalizationToken.value}
                          value={personalizationToken.value}
                        >
                          {personalizationToken.label}
                        </option>
                      ),
                    )}
                  </StyledTokenSelect>
                  <StyledInsertButton onClick={handleInsertToken}>
                    Insert Token
                  </StyledInsertButton>
                </StyledTokenRow>
                {campaignId && (
                  <StyledTemplatesButton
                    onClick={() => setIsTemplateGalleryOpen(true)}
                  >
                    Templates
                  </StyledTemplatesButton>
                )}
              </StyledToolbar>
            )}
            <StyledTextArea
              ref={bodyTextAreaRef}
              placeholder="Write your email content here..."
              value={value.body}
              onChange={(event) =>
                handleFieldChange('body', event.target.value)
              }
              readOnly={readOnly}
            />
            {!value.body.includes('{{unsubscribe_link}}') && (
              <StyledWarningBanner>
                Your email does not include an unsubscribe link. An unsubscribe
                footer will be automatically appended. Use the &quot;Unsubscribe
                Link&quot; personalization token for a custom placement.
              </StyledWarningBanner>
            )}
          </>
        )}
      </StyledFieldGroup>

      {!readOnly && campaignId && (
        <StyledActionsRow>
          <StyledTestSendButton
            type="button"
            onClick={handleTestSend}
            disabled={testSendLoading}
            title="Send a test copy of this email to any address"
          >
            {testSendLoading ? 'Sending…' : '✉️ Send test'}
          </StyledTestSendButton>
          <CampaignSaveAsTemplateButton campaignId={campaignId} />
        </StyledActionsRow>
      )}

      {isTemplateGalleryOpen && campaignId && (
        <CampaignTemplateGallery
          campaignId={campaignId}
          onClose={() => setIsTemplateGalleryOpen(false)}
          onLoaded={() => {
            // Parent will re-fetch; editor reads from value prop
          }}
        />
      )}
    </StyledContainer>
  );
};
