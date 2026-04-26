import { styled } from '@linaria/react';
import { useCallback } from 'react';

import { type SpacerModule } from '@/campaign/email-builder/types/CampaignDesign';
import { themeCssVariables } from 'twenty-ui/theme-constants';

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
  width: 100px;
`;

type Props = {
  module: SpacerModule;
  onChange: (next: SpacerModule) => void;
};

export const SpacerModuleEditor = ({ module, onChange }: Props) => {
  const set = useCallback(
    <K extends keyof SpacerModule>(key: K, value: SpacerModule[K]) =>
      onChange({ ...module, [key]: value }),
    [module, onChange],
  );

  return (
    <StyledField>
      <StyledLabel>Height (px)</StyledLabel>
      <StyledNumberInput
        type="number"
        min={1}
        max={500}
        value={module.height}
        onChange={(e) => set('height', Number(e.target.value))}
      />
    </StyledField>
  );
};
