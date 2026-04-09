import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { SCHEDULE_CAMPAIGN } from '@/campaign/graphql/mutations/scheduleCampaign';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type ScheduleCampaignResult = {
  scheduleCampaign: {
    success: boolean;
    error?: string;
  };
};

type ScheduleCampaignVariables = {
  input: {
    campaignId: string;
    scheduledAt: string;
  };
};

export const useScheduleCampaign = () => {
  const [scheduleCampaignMutation, { loading }] = useMutation<
    ScheduleCampaignResult,
    ScheduleCampaignVariables
  >(SCHEDULE_CAMPAIGN);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const scheduleCampaign = useCallback(
    async (campaignId: string, scheduledAt: Date): Promise<boolean> => {
      try {
        const result = await scheduleCampaignMutation({
          variables: {
            input: {
              campaignId,
              scheduledAt: scheduledAt.toISOString(),
            },
          },
        });

        if (result.data?.scheduleCampaign.success) {
          enqueueSuccessSnackBar({
            message: t`Campaign scheduled successfully`,
          });

          return true;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.scheduleCampaign.error ??
            t`Failed to schedule campaign`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to schedule campaign`,
        });

        return false;
      }
    },
    [scheduleCampaignMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { scheduleCampaign, loading };
};
