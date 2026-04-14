import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { SEND_CAMPAIGN } from '@/campaign/graphql/mutations/sendCampaign';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type SendCampaignResult = {
  sendCampaign: {
    success: boolean;
    error?: string;
  };
};

type SendCampaignVariables = {
  input: {
    campaignId: string;
  };
};

export const useSendCampaign = () => {
  const [sendCampaignMutation, { loading }] = useMutation<
    SendCampaignResult,
    SendCampaignVariables
  >(SEND_CAMPAIGN);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const sendCampaign = useCallback(
    async (campaignId: string): Promise<boolean> => {
      try {
        const result = await sendCampaignMutation({
          variables: {
            input: { campaignId },
          },
        });

        if (result.data?.sendCampaign.success) {
          enqueueSuccessSnackBar({
            message: t`Campaign is being sent`,
          });

          return true;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.sendCampaign.error ?? t`Failed to send campaign`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to send campaign`,
        });

        return false;
      }
    },
    [sendCampaignMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { sendCampaign, loading };
};
