/* oxlint-disable twenty/component-props-naming */
// Generic 'Props' type matches sibling email-builder module editors.

import { styled } from '@linaria/react';
import { useCallback } from 'react';

import { type HtmlModule } from '@/campaign/email-builder/types/CampaignDesign';
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

const StyledTextArea = styled.textarea`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: ${themeCssVariables.font.size.sm};
  min-height: 160px;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  resize: vertical;
`;

const StyledNote = styled.div`
  background: ${themeCssVariables.background.tertiary};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  padding: ${themeCssVariables.spacing[2]};
`;

type Props = {
  module: HtmlModule;
  onChange: (next: HtmlModule) => void;
};

export const HtmlModuleEditor = ({ module, onChange }: Props) => {
  const set = useCallback(
    <K extends keyof HtmlModule>(key: K, value: HtmlModule[K]) =>
      onChange({ ...module, [key]: value }),
    [module, onChange],
  );

  return (
    <StyledField>
      <StyledLabel>Custom HTML</StyledLabel>
      <StyledTextArea
        value={module.rawHtml}
        onChange={(e) => set('rawHtml', e.target.value)}
        placeholder="<p>Custom HTML…</p>"
      />
      <StyledNote>
        Custom HTML is sent as-is. Inline styles only (Outlook ignores
        &lt;style&gt; blocks). Avoid &lt;script&gt;, &lt;iframe&gt;, and modern
        CSS — most clients strip them.
      </StyledNote>
    </StyledField>
  );
};
