/* oxlint-disable twenty/component-props-naming */
/* oxlint-disable twenty/sort-css-properties-alphabetically */
// Generic 'Props' type matches sibling email-builder module editors;
// CSS ordering is grouped semantically to mirror the rendered output.

import { styled } from '@linaria/react';
import { useCallback } from 'react';

import { ColorWithSwatches } from '@/campaign/email-builder/components/modules/ColorWithSwatches';
import { type DividerModule } from '@/campaign/email-builder/types/CampaignDesign';
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

const StyledNumberInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  width: 80px;
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
  module: DividerModule;
  onChange: (next: DividerModule) => void;
};

export const DividerModuleEditor = ({ module, onChange }: Props) => {
  const set = useCallback(
    <K extends keyof DividerModule>(key: K, value: DividerModule[K]) =>
      onChange({ ...module, [key]: value }),
    [module, onChange],
  );

  return (
    <StyledRow>
      <StyledField>
        <StyledLabel>Color</StyledLabel>
        <ColorWithSwatches
          value={module.color}
          onChange={(next) => set('color', next)}
        />
      </StyledField>
      <StyledField>
        <StyledLabel>Thickness (px)</StyledLabel>
        <StyledNumberInput
          type="number"
          min={1}
          max={20}
          value={module.thickness}
          onChange={(e) => set('thickness', Number(e.target.value))}
        />
      </StyledField>
      <StyledField>
        <StyledLabel>Style</StyledLabel>
        <StyledSelect
          value={module.style}
          onChange={(e) =>
            set('style', e.target.value as DividerModule['style'])
          }
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </StyledSelect>
      </StyledField>
      <StyledField>
        <StyledLabel>Width (%)</StyledLabel>
        <StyledNumberInput
          type="number"
          min={1}
          max={100}
          value={module.widthPercent}
          onChange={(e) => set('widthPercent', Number(e.target.value))}
        />
      </StyledField>
    </StyledRow>
  );
};
