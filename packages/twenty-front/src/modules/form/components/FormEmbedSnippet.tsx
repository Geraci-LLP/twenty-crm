import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { InputLabel } from '@/ui/input/components/InputLabel';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { useContext } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconCopy } from 'twenty-ui/display';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';
import { useDebouncedCallback } from 'use-debounce';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

export type FormEmbedSnippetProps = {
  formId: string;
};

const StyledSnippetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledCodeContainer = styled.div`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: monospace;
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.4;
  padding: ${themeCssVariables.spacing[3]};
  padding-right: ${themeCssVariables.spacing[8]};
  position: relative;
  white-space: pre-wrap;
  word-break: break-all;
`;

const StyledCopyButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: ${themeCssVariables.spacing[1]};
  position: absolute;
  right: ${themeCssVariables.spacing[2]};
  top: ${themeCssVariables.spacing[2]};
`;

export const FormEmbedSnippet = ({ formId }: FormEmbedSnippetProps) => {
  const { theme } = useContext(ThemeContext);
  const { copyToClipboard } = useCopyToClipboard();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const publicUrl = `${window.location.origin}/forms/${currentWorkspace?.id}/${formId}`;

  const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0" style="border: none; max-width: 640px;"></iframe>`;

  const copyToClipboardDebounced = useDebouncedCallback(
    () => copyToClipboard(embedCode),
    200,
  );

  if (!isDefined(currentWorkspace)) {
    return null;
  }

  return (
    <StyledSnippetContainer>
      <InputLabel>{t`Embed Code`}</InputLabel>
      <StyledCodeContainer>
        {embedCode}
        <StyledCopyButton onClick={copyToClipboardDebounced}>
          <IconCopy
            size={theme.icon.size.md}
            color={theme.font.color.secondary}
          />
        </StyledCopyButton>
      </StyledCodeContainer>
    </StyledSnippetContainer>
  );
};
