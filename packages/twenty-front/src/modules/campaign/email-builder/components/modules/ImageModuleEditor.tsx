import { styled } from '@linaria/react';
import { useCallback, useRef } from 'react';

import { useUploadCampaignAssetFile } from '@/campaign/hooks/useUploadCampaignAssetFile';
import { type ImageModule } from '@/campaign/email-builder/types/CampaignDesign';
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

const StyledSourceRow = styled.div`
  align-items: stretch;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledUploadButton = styled.button`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  white-space: nowrap;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledHiddenFileInput = styled.input`
  display: none;
`;

const StyledThumb = styled.img`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: block;
  height: 80px;
  object-fit: contain;
  width: 120px;
`;

type ImageModuleEditorProps = {
  module: ImageModule;
  onChange: (next: ImageModule) => void;
};

export const ImageModuleEditor = ({
  module,
  onChange,
}: ImageModuleEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUploadCampaignAssetFile();

  const set = useCallback(
    <K extends keyof ImageModule>(key: K, value: ImageModule[K]) =>
      onChange({ ...module, [key]: value }),
    [module, onChange],
  );

  const handleFilePicked = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      // Reset the input so picking the same file twice still fires onChange.
      e.target.value = '';
      if (!file) return;
      const url = await upload(file);
      if (url !== null) {
        // If user hasn't set alt text yet, default it to the filename
        // (without extension) so screen readers and image-blocked clients
        // get something descriptive.
        const next: ImageModule = { ...module, src: url };
        if (!module.alt || module.alt.trim() === '') {
          next.alt = file.name.replace(/\.[^.]+$/, '');
        }
        onChange(next);
      }
    },
    [upload, module, onChange],
  );

  return (
    <>
      <StyledField>
        <StyledLabel>Image</StyledLabel>
        <StyledSourceRow>
          <StyledInput
            type="url"
            value={module.src}
            onChange={(e) => set('src', e.target.value)}
            placeholder="https://… (paste an image URL)"
          />
          <StyledUploadButton
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </StyledUploadButton>
          <StyledHiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleFilePicked}
          />
        </StyledSourceRow>
      </StyledField>
      {module.src ? (
        <StyledThumb src={module.src} alt={module.alt || ''} />
      ) : null}
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
            onChange={(e) =>
              set('alignment', e.target.value as ImageModule['alignment'])
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
