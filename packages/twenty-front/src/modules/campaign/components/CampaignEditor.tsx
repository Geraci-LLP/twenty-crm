import { styled } from '@linaria/react';
import { useCallback, useRef, useState } from 'react';

import { CAMPAIGN_PERSONALIZATION_TOKENS } from '@/campaign/constants/CampaignPersonalizationTokens';
import {
  type CampaignEditorData,
  type CampaignPersonalizationToken,
} from '@/campaign/types/CampaignTypes';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContainer = styled.div`
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

type CampaignEditorProps = {
  value: CampaignEditorData;
  onChange: (data: CampaignEditorData) => void;
  readOnly?: boolean;
};

export const CampaignEditor = ({
  value,
  onChange,
  readOnly = false,
}: CampaignEditorProps) => {
  const bodyTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedToken, setSelectedToken] =
    useState<CampaignPersonalizationToken>(CAMPAIGN_PERSONALIZATION_TOKENS[0]);

  const handleFieldChange = useCallback(
    (field: keyof CampaignEditorData, fieldValue: string) => {
      onChange({ ...value, [field]: fieldValue });
    },
    [onChange, value],
  );

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
        <StyledLabel>Subject</StyledLabel>
        <StyledInput
          type="text"
          placeholder="Email subject line"
          value={value.subject}
          onChange={(event) => handleFieldChange('subject', event.target.value)}
          readOnly={readOnly}
        />
      </StyledFieldGroup>

      <StyledFieldGroup>
        <StyledLabel>Body</StyledLabel>
        {!readOnly && (
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
              {CAMPAIGN_PERSONALIZATION_TOKENS.map((personalizationToken) => (
                <option
                  key={personalizationToken.value}
                  value={personalizationToken.value}
                >
                  {personalizationToken.label}
                </option>
              ))}
            </StyledTokenSelect>
            <StyledInsertButton onClick={handleInsertToken}>
              Insert Token
            </StyledInsertButton>
          </StyledTokenRow>
        )}
        <StyledTextArea
          ref={bodyTextAreaRef}
          placeholder="Write your email content here..."
          value={value.body}
          onChange={(event) => handleFieldChange('body', event.target.value)}
          readOnly={readOnly}
        />
      </StyledFieldGroup>
    </StyledContainer>
  );
};
