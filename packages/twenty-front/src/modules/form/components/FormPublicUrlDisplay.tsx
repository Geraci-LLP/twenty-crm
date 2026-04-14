import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { TextInput } from '@/ui/input/components/TextInput';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { t } from '@lingui/core/macro';
import { useContext } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconCopy } from 'twenty-ui/display';
import { ThemeContext } from 'twenty-ui/theme-constants';
import { useDebouncedCallback } from 'use-debounce';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

export type FormPublicUrlDisplayProps = {
  formId: string;
};

export const FormPublicUrlDisplay = ({ formId }: FormPublicUrlDisplayProps) => {
  const { theme } = useContext(ThemeContext);
  const { copyToClipboard } = useCopyToClipboard();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const publicUrl = `${REACT_APP_SERVER_BASE_URL}/forms/${currentWorkspace?.id}/${formId}/schema`;
  const displayUrl = publicUrl.replace(/^(https?:\/\/)?(www\.)?/, '');

  const copyToClipboardDebounced = useDebouncedCallback(
    () => copyToClipboard(publicUrl),
    200,
  );

  if (!isDefined(currentWorkspace)) {
    return null;
  }

  return (
    <TextInput
      label={t`Public URL`}
      value={displayUrl}
      RightIcon={() => (
        <IconCopy
          size={theme.icon.size.md}
          color={theme.font.color.secondary}
        />
      )}
      onRightIconClick={copyToClipboardDebounced}
      readOnly
      fullWidth
    />
  );
};
