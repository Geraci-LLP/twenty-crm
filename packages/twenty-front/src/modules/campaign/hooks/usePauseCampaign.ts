import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { PAUSE_CAMPAIGN } from '@/campaign/graphql/mutations/pauseCampaign';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type PauseCampaignResult = {
  pauseCampaign: {
    success: boolean;
    error?: string;
  };
};

type PauseCampaignVariables = {
  input: {
    campaignId: string;
  };
};

export const usePauseCampaign = () => {
  const [pauseCampaignMutation, { loading }] = useMutation<
    PauseCampaignResult,
    PauseCampaignVariables
  >(PAUSE_CAMPAIGN);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const pauseCampaign = useCallback(
    async (campaignId: string): Promise<boolean> => {
      try {
        const result = await pauseCampaignMutation({
          variables: {
            input: { campaignId },
          },
        });

        if (result.data?.pauseCampaign.success) {
          enqueueSuccessSnackBar({
            message: t`Campaign paused`,
          });

          return true;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.pauseCampaign.error ?? t`Failed to pause campaign`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to pause campaign`,
        });

        return false;
      }
    },
    [pauseCampaignMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { pauseCampaign, loading };
};
