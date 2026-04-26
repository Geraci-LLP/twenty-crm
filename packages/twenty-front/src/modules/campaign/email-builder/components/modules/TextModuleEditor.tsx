import { styled } from '@linaria/react';
import { useCallback } from 'react';

import { CAMPAIGN_PERSONALIZATION_TOKENS } from '@/campaign/constants/CampaignPersonalizationTokens';
import { EmailRichTextEditor } from '@/campaign/email-builder/components/modules/EmailRichTextEditor';
import { type TextModule } from '@/campaign/email-builder/types/CampaignDesign';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledRow = styled.div`
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
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

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
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

type TextModuleEditorProps = {
  module: TextModule;
  onChange: (next: TextModule) => void;
};

export const TextModuleEditor = ({
  module,
  onChange,
}: TextModuleEditorProps) => {
  const set = useCallback(
    <K extends keyof TextModule>(key: K, value: TextModule[K]) => {
      onChange({ ...module, [key]: value });
    },
    [module, onChange],
  );

  return (
    <>
      <EmailRichTextEditor
        value={module.html}
        onChange={(html) => set('html', html)}
        tokens={CAMPAIGN_PERSONALIZATION_TOKENS}
      />
      <StyledRow>
        <StyledField>
          <StyledLabel>Alignment</StyledLabel>
          <StyledSelect
            value={module.alignment}
            onChange={(e) =>
              set('alignment', e.target.value as TextModule['alignment'])
            }
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
