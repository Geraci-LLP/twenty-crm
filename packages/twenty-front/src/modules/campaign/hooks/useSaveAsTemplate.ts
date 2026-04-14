import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { SAVE_AS_TEMPLATE } from '@/campaign/graphql/mutations/saveAsTemplate';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type SaveAsTemplateResult = {
  saveAsTemplate: {
    success: boolean;
    error?: string;
  };
};

type SaveAsTemplateVariables = {
  input: {
    campaignId: string;
    templateName: string;
    category?: string;
  };
};

export const useSaveAsTemplate = () => {
  const [saveAsTemplateMutation, { loading }] = useMutation<
    SaveAsTemplateResult,
    SaveAsTemplateVariables
  >(SAVE_AS_TEMPLATE);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const saveAsTemplate = useCallback(
    async (
      campaignId: string,
      templateName: string,
      category?: string,
    ): Promise<boolean> => {
      try {
        const result = await saveAsTemplateMutation({
          variables: {
            input: { campaignId, templateName, category },
          },
        });

        if (result.data?.saveAsTemplate.success) {
          enqueueSuccessSnackBar({
            message: t`Template saved successfully`,
          });

          return true;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.saveAsTemplate.error ?? t`Failed to save as template`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to save as template`,
        });

        return false;
      }
    },
    [saveAsTemplateMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { saveAsTemplate, loading };
};
