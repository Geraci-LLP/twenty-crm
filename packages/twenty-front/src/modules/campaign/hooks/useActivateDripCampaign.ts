import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { ACTIVATE_DRIP_CAMPAIGN } from '@/campaign/graphql/mutations/activateDripCampaign';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type ActivateDripCampaignResult = {
  activateDripCampaign: {
    success: boolean;
    error?: string;
  };
};

type ActivateDripCampaignVariables = {
  input: {
    dripCampaignId: string;
  };
};

export const useActivateDripCampaign = () => {
  const [activateDripCampaignMutation, { loading }] = useMutation<
    ActivateDripCampaignResult,
    ActivateDripCampaignVariables
  >(ACTIVATE_DRIP_CAMPAIGN);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const activateDripCampaign = useCallback(
    async (dripCampaignId: string): Promise<boolean> => {
      try {
        const result = await activateDripCampaignMutation({
          variables: {
            input: { dripCampaignId },
          },
        });

        if (result.data?.activateDripCampaign.success) {
          enqueueSuccessSnackBar({
            message: t`Drip campaign activated`,
          });

          return true;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.activateDripCampaign.error ??
            t`Failed to activate drip campaign`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to activate drip campaign`,
        });

        return false;
      }
    },
    [
      activateDripCampaignMutation,
      enqueueSuccessSnackBar,
      enqueueErrorSnackBar,
    ],
  );

  return { activateDripCampaign, loading };
};
