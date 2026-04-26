import { styled } from '@linaria/react';
import { useCallback } from 'react';

import {
  type SocialLink,
  type SocialModule,
  type SocialPlatform,
} from '@/campaign/email-builder/types/CampaignDesign';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledRow = styled.div`
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledField = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 120px;
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
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledNumberInput = styled(StyledInput)`
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

const StyledIconButton = styled.button`
  background: transparent;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  &:hover { background: ${themeCssVariables.background.tertiary}; }
`;

const PLATFORM_OPTIONS: SocialPlatform[] = [
  'twitter', 'linkedin', 'facebook', 'instagram', 'youtube',
];

type Props = {
  module: SocialModule;
  onChange: (next: SocialModule) => void;
};

export const SocialModuleEditor = ({ module, onChange }: Props) => {
  const set = useCallback(
    <K extends keyof SocialModule>(key: K, value: SocialModule[K]) =>
      onChange({ ...module, [key]: value }),
    [module, onChange],
  );

  const updateLink = useCallback(
    (idx: number, next: SocialLink) => {
      const links = module.links.slice();
      links[idx] = next;
      set('links', links);
    },
    [module.links, set],
  );

  const removeLink = useCallback(
    (idx: number) => set('links', module.links.filter((_, i) => i !== idx)),
    [module.links, set],
  );

  const addLink = useCallback(
    () => set('links', [...module.links, { platform: 'twitter', href: '' }]),
    [module.links, set],
  );

  return (
    <StyledStack>
      <StyledRow>
        <StyledField>
          <StyledLabel>Icon size (px)</StyledLabel>
          <StyledNumberInput
            type="number"
            min={16}
            max={72}
            value={module.iconSize}
            onChange={(e) => set('iconSize', Number(e.target.value))}
          />
        </StyledField>
        <StyledField>
          <StyledLabel>Spacing (px)</StyledLabel>
          <StyledNumberInput
            type="number"
            min={0}
            max={64}
            value={module.spacing}
            onChange={(e) => set('spacing', Number(e.target.value))}
          />
        </StyledField>
        <StyledField>
          <StyledLabel>Alignment</StyledLabel>
          <StyledSelect
            value={module.alignment}
            onChange={(e) => set('alignment', e.target.value as SocialModule['alignment'])}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </StyledSelect>
        </StyledField>
      </StyledRow>
      <StyledLabel>Links</StyledLabel>
      {module.links.map((link, idx) => (
        <StyledRow key={idx}>
          <StyledSelect
            value={link.platform}
            onChange={(e) => updateLink(idx, { ...link, platform: e.target.value as SocialPlatform })}
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </StyledSelect>
          <StyledField style={{ flex: 2 }}>
            <StyledInput
              type="url"
              value={link.href}
              onChange={(e) => updateLink(idx, { ...link, href: e.target.value })}
              placeholder="https://…"
            />
          </StyledField>
          <StyledIconButton onClick={() => removeLink(idx)} title="Remove">✕</StyledIconButton>
        </StyledRow>
      ))}
      <StyledIconButton onClick={addLink}>+ Add link</StyledIconButton>
    </StyledStack>
  );
};
