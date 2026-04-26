import { styled } from '@linaria/react';
import { useCallback } from 'react';

import { type ImageModule } from '@/campaign/email-builder/types/CampaignDesign';
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
  width: 90px;
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
  module: ImageModule;
  onChange: (next: ImageModule) => void;
};

export const ImageModuleEditor = ({ module, onChange }: Props) => {
  const set = useCallback(
    <K extends keyof ImageModule>(key: K, value: ImageModule[K]) =>
      onChange({ ...module, [key]: value }),
    [module, onChange],
  );

  return (
    <>
      <StyledField>
        <StyledLabel>Image URL</StyledLabel>
        <StyledInput
          type="url"
          value={module.src}
          onChange={(e) => set('src', e.target.value)}
          placeholder="https://… (paste an image URL)"
        />
      </StyledField>
      <StyledField>
        <StyledLabel>Alt text</StyledLabel>
        <StyledInput
          value={module.alt}
          onChange={(e) => set('alt', e.target.value)}
          placeholder="Describe the image (for accessibility + image-blocked clients)"
        />
      </StyledField>
      <StyledField>
        <StyledLabel>Click-through link (optional)</StyledLabel>
        <StyledInput
          type="url"
          value={module.href ?? ''}
          onChange={(e) => set('href', e.target.value || undefined)}
          placeholder="https://…"
        />
      </StyledField>
      <StyledRow>
        <StyledField>
          <StyledLabel>Width (px)</StyledLabel>
          <StyledNumberInput
            type="number"
            min={50}
            max={1200}
            value={module.width}
            onChange={(e) => set('width', Number(e.target.value))}
          />
        </StyledField>
        <StyledField>
          <StyledLabel>Alignment</StyledLabel>
          <StyledSelect
            value={module.alignment}
            onChange={(e) => set('alignment', e.target.value as ImageModule['alignment'])}
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
