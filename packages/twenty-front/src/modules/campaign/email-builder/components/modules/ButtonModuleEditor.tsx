/* oxlint-disable twenty/component-props-naming */
/* oxlint-disable twenty/sort-css-properties-alphabetically */
// Generic 'Props' type matches sibling email-builder module editors;
// CSS ordering is grouped semantically to mirror the rendered output.

import { styled } from '@linaria/react';
import { useCallback } from 'react';

import { ColorWithSwatches } from '@/campaign/email-builder/components/modules/ColorWithSwatches';
import { type ButtonModule } from '@/campaign/email-builder/types/CampaignDesign';
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

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  width: 100%;
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

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

type Props = {
  module: ButtonModule;
  onChange: (next: ButtonModule) => void;
};

export const ButtonModuleEditor = ({ module, onChange }: Props) => {
  const set = useCallback(
    <K extends keyof ButtonModule>(key: K, value: ButtonModule[K]) =>
      onChange({ ...module, [key]: value }),
    [module, onChange],
  );

  return (
    <>
      <StyledField>
        <StyledLabel>Label</StyledLabel>
        <StyledInput
          value={module.label}
          onChange={(e) => set('label', e.target.value)}
        />
      </StyledField>
      <StyledField>
        <StyledLabel>Link URL</StyledLabel>
        <StyledInput
          type="url"
          value={module.href}
          onChange={(e) => set('href', e.target.value)}
          placeholder="https://example.com"
        />
      </StyledField>
      <StyledRow>
        <StyledField>
          <StyledLabel>Background</StyledLabel>
          <ColorWithSwatches
            value={module.bgColor}
            onChange={(next) => set('bgColor', next)}
          />
        </StyledField>
        <StyledField>
          <StyledLabel>Text</StyledLabel>
          <ColorWithSwatches
            value={module.textColor}
            onChange={(next) => set('textColor', next)}
          />
        </StyledField>
        <StyledField>
          <StyledLabel>Radius</StyledLabel>
          <StyledNumberInput
            type="number"
            min={0}
            max={999}
            value={module.borderRadius}
            onChange={(e) => set('borderRadius', Number(e.target.value))}
          />
        </StyledField>
        <StyledField>
          <StyledLabel>Alignment</StyledLabel>
          <StyledSelect
            value={module.alignment}
            onChange={(e) =>
              set('alignment', e.target.value as ButtonModule['alignment'])
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </StyledSelect>
        </StyledField>
      </StyledRow>
    </>
  );
};
