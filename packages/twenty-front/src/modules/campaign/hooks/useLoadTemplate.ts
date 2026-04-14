import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { LOAD_TEMPLATE } from '@/campaign/graphql/mutations/loadTemplate';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type LoadTemplateResult = {
  loadTemplate: {
    success: boolean;
    error?: string;
  };
};

type LoadTemplateVariables = {
  input: {
    templateId: string;
    campaignId: string;
  };
};

export const useLoadTemplate = () => {
  const [loadTemplateMutation, { loading }] = useMutation<
    LoadTemplateResult,
    LoadTemplateVariables
  >(LOAD_TEMPLATE);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const loadTemplate = useCallback(
    async (templateId: string, campaignId: string): Promise<boolean> => {
      try {
        const result = await loadTemplateMutation({
          variables: {
            input: { templateId, campaignId },
          },
        });

        if (result.data?.loadTemplate.success) {
          enqueueSuccessSnackBar({
            message: t`Template loaded into campaign`,
          });

          return true;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.loadTemplate.error ?? t`Failed to load template`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to load template`,
        });

        return false;
      }
    },
    [loadTemplateMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { loadTemplate, loading };
};
