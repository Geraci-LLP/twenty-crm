/* oxlint-disable twenty/component-props-naming */
/* oxlint-disable twenty/sort-css-properties-alphabetically */
// Generic 'Props' type matches sibling email-builder module editors;
// CSS ordering is grouped semantically to mirror the rendered output.

import { styled } from '@linaria/react';
import { useCallback } from 'react';

import { ColorWithSwatches } from '@/campaign/email-builder/components/modules/ColorWithSwatches';
import {
  type HeadingLevel,
  type HeadingModule,
} from '@/campaign/email-builder/types/CampaignDesign';
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

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
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

const StyledNumberInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  width: 70px;
`;

type Props = {
  module: HeadingModule;
  onChange: (next: HeadingModule) => void;
};

export const HeadingModuleEditor = ({ module, onChange }: Props) => {
  const set = useCallback(
    <K extends keyof HeadingModule>(key: K, value: HeadingModule[K]) =>
      onChange({ ...module, [key]: value }),
    [module, onChange],
  );

  return (
    <StyledStack>
      <StyledField>
        <StyledLabel>Heading</StyledLabel>
        <StyledInput
          value={module.text}
          onChange={(e) => set('text', e.target.value)}
        />
      </StyledField>
      <StyledRow>
        <StyledField>
          <StyledLabel>Level</StyledLabel>
          <StyledSelect
            value={module.level}
            onChange={(e) => set('level', e.target.value as HeadingLevel)}
          >
            <option value="h1">H1 (28px)</option>
            <option value="h2">H2 (22px)</option>
            <option value="h3">H3 (18px)</option>
          </StyledSelect>
        </StyledField>
        <StyledField>
          <StyledLabel>Weight</StyledLabel>
          <StyledNumberInput
            type="number"
            min={400}
            max={900}
            step={100}
            value={module.fontWeight}
            onChange={(e) => set('fontWeight', Number(e.target.value))}
          />
        </StyledField>
        <StyledField>
          <StyledLabel>Alignment</StyledLabel>
          <StyledSelect
            value={module.alignment}
            onChange={(e) =>
              set('alignment', e.target.value as HeadingModule['alignment'])
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </StyledSelect>
        </StyledField>
        <StyledField>
          <StyledLabel>Color</StyledLabel>
          <ColorWithSwatches
            value={module.textColor}
            onChange={(next) => set('textColor', next)}
          />
        </StyledField>
      </StyledRow>
    </StyledStack>
  );
};
