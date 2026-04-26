import { useMutation } from '@apollo/client/react';
import { t } from '@lingui/core/macro';
import { useCallback } from 'react';

import { GENERATE_CAMPAIGN_PREVIEW_LINK } from '@/campaign/graphql/mutations/generateCampaignPreviewLink';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

type GeneratePreviewLinkResult = {
  generateCampaignPreviewLink: {
    success: boolean;
    url?: string | null;
    error?: string | null;
  };
};

type GeneratePreviewLinkVariables = {
  input: { campaignId: string };
};

export const useGenerateCampaignPreviewLink = () => {
  const [generateMutation, { loading }] = useMutation<
    GeneratePreviewLinkResult,
    GeneratePreviewLinkVariables
  >(GENERATE_CAMPAIGN_PREVIEW_LINK);

  const { enqueueErrorSnackBar } = useSnackBar();

  const generate = useCallback(
    async (campaignId: string): Promise<string | null> => {
      try {
        const result = await generateMutation({
          variables: { input: { campaignId } },
        });
        const data = result.data?.generateCampaignPreviewLink;
        if (data?.success === true && data.url) {
          return data.url;
        }
        enqueueErrorSnackBar({
          message: data?.error ?? t`Failed to generate preview link`,
        });
        return null;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to generate preview link`,
        });
        return null;
      }
    },
    [generateMutation, enqueueErrorSnackBar],
  );

  return { generate, loading };
};
