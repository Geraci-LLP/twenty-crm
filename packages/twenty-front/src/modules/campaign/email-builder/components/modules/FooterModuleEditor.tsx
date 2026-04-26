import { styled } from '@linaria/react';
import { useCallback } from 'react';

import { type FooterModule } from '@/campaign/email-builder/types/CampaignDesign';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

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
  min-height: 60px;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  resize: vertical;
  width: 100%;
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledNumberInput = styled(StyledInput)`
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

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledNote = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
`;

type Props = {
  module: FooterModule;
  onChange: (next: FooterModule) => void;
};

export const FooterModuleEditor = ({ module, onChange }: Props) => {
  const set = useCallback(
    <K extends keyof FooterModule>(key: K, value: FooterModule[K]) =>
      onChange({ ...module, [key]: value }),
    [module, onChange],
  );

  return (
    <StyledStack>
      <StyledField>
        <StyledLabel>Address / company info</StyledLabel>
        <StyledTextArea
          value={module.address}
          onChange={(e) => set('address', e.target.value)}
        />
      </StyledField>
      <StyledRow>
        <StyledField style={{ flex: 1 }}>
          <StyledLabel>Unsubscribe link label</StyledLabel>
          <StyledInput
            value={module.unsubscribeLabel}
            onChange={(e) => set('unsubscribeLabel', e.target.value)}
          />
        </StyledField>
        <StyledField style={{ flex: 1 }}>
          <StyledLabel>Preferences link label</StyledLabel>
          <StyledInput
            value={module.preferencesLabel}
            onChange={(e) => set('preferencesLabel', e.target.value)}
          />
        </StyledField>
      </StyledRow>
      <StyledRow>
        <StyledField>
          <StyledLabel>Font size</StyledLabel>
          <StyledNumberInput
            type="number"
            min={9}
            max={20}
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
        <StyledField>
          <StyledLabel>Alignment</StyledLabel>
          <StyledSelect
            value={module.alignment}
            onChange={(e) => set('alignment', e.target.value as FooterModule['alignment'])}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </StyledSelect>
        </StyledField>
      </StyledRow>
      <StyledNote>
        Both link labels point to the per-recipient unsubscribe URL
        (CAN-SPAM compliant). The token <code>{'{{unsubscribe_link}}'}</code> is
        always rendered — keep at least one Footer module on every email.
      </StyledNote>
    </StyledStack>
  );
};
