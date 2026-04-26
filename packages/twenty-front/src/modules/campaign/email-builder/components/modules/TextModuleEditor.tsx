import { styled } from '@linaria/react';
import { useCallback, useRef, useState } from 'react';

import { CAMPAIGN_PERSONALIZATION_TOKENS } from '@/campaign/constants/CampaignPersonalizationTokens';
import { type TextModule } from '@/campaign/email-builder/types/CampaignDesign';
import { type CampaignPersonalizationToken } from '@/campaign/types/CampaignTypes';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
  align-items: flex-end;
`;

const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledLabel = styled.label`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledTextArea = styled.textarea`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  min-height: 120px;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  resize: vertical;
  width: 100%;
`;

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledButton = styled.button`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  &:hover { background: ${themeCssVariables.background.transparent.lighter}; }
`;

const StyledNumberInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  width: 70px;
`;

const StyledColorInput = styled.input`
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  height: 32px;
  padding: 2px;
  width: 50px;
`;

type Props = {
  module: TextModule;
  onChange: (next: TextModule) => void;
};

export const TextModuleEditor = ({ module, onChange }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedToken, setSelectedToken] =
    useState<CampaignPersonalizationToken>(CAMPAIGN_PERSONALIZATION_TOKENS[0]);

  const set = useCallback(
    <K extends keyof TextModule>(key: K, value: TextModule[K]) => {
      onChange({ ...module, [key]: value });
    },
    [module, onChange],
  );

  const insertToken = useCallback(() => {
    const ta = textAreaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const next = module.html.slice(0, start) + selectedToken.value + module.html.slice(end);
    set('html', next);
    requestAnimationFrame(() => {
      const cursor = start + selectedToken.value.length;
      ta.focus();
      ta.setSelectionRange(cursor, cursor);
    });
  }, [module.html, selectedToken, set]);

  return (
    <>
      <StyledRow>
        <StyledSelect
          value={selectedToken.value}
          onChange={(e) => {
            const t = CAMPAIGN_PERSONALIZATION_TOKENS.find((x) => x.value === e.target.value);
            if (t) setSelectedToken(t);
          }}
        >
          {CAMPAIGN_PERSONALIZATION_TOKENS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </StyledSelect>
        <StyledButton onClick={insertToken}>Insert Token</StyledButton>
      </StyledRow>
      <StyledTextArea
        ref={textAreaRef}
        value={module.html}
        onChange={(e) => set('html', e.target.value)}
        placeholder="Write your text. HTML allowed. Use {{contact.firstName}} etc."
      />
      <StyledRow>
        <StyledField>
          <StyledLabel>Alignment</StyledLabel>
          <StyledSelect
            value={module.alignment}
            onChange={(e) => set('alignment', e.target.value as TextModule['alignment'])}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </StyledSelect>
        </StyledField>
        <StyledField>
          <StyledLabel>Font size</StyledLabel>
          <StyledNumberInput
            type="number"
            min={8}
            max={72}
            value={module.fontSize}
            onChange={(e) => set('fontSize', Number(e.target.value))}
          />
        </StyledField>
        <StyledField>
          <StyledLabel>Color</StyledLabel>
          <StyledColorInput
            type="color"
            value={module.textColor}
            onChange={(e) => set('textColor', e.target.value)}
          />
        </StyledField>
      </StyledRow>
    </>
  );
};
