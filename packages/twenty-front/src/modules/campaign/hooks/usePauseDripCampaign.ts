import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { PAUSE_DRIP_CAMPAIGN } from '@/campaign/graphql/mutations/pauseDripCampaign';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type PauseDripCampaignResult = {
  pauseDripCampaign: {
    success: boolean;
    error?: string;
  };
};

type PauseDripCampaignVariables = {
  input: {
    dripCampaignId: string;
  };
};

export const usePauseDripCampaign = () => {
  const [pauseDripCampaignMutation, { loading }] = useMutation<
    PauseDripCampaignResult,
    PauseDripCampaignVariables
  >(PAUSE_DRIP_CAMPAIGN);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const pauseDripCampaign = useCallback(
    async (dripCampaignId: string): Promise<boolean> => {
      try {
        const result = await pauseDripCampaignMutation({
          variables: {
            input: { dripCampaignId },
          },
        });

        if (result.data?.pauseDripCampaign.success) {
          enqueueSuccessSnackBar({
            message: t`Drip campaign paused`,
          });

          return true;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.pauseDripCampaign.error ??
            t`Failed to pause drip campaign`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to pause drip campaign`,
        });

        return false;
      }
    },
    [pauseDripCampaignMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { pauseDripCampaign, loading };
};
