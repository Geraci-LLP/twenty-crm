import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { RESUME_CAMPAIGN } from '@/campaign/graphql/mutations/resumeCampaign';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type ResumeCampaignResult = {
  resumeCampaign: {
    success: boolean;
    error?: string;
  };
};

type ResumeCampaignVariables = {
  input: {
    campaignId: string;
  };
};

export const useResumeCampaign = () => {
  const [resumeCampaignMutation, { loading }] = useMutation<
    ResumeCampaignResult,
    ResumeCampaignVariables
  >(RESUME_CAMPAIGN);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const resumeCampaign = useCallback(
    async (campaignId: string): Promise<boolean> => {
      try {
        const result = await resumeCampaignMutation({
          variables: {
            input: { campaignId },
          },
        });

        if (result.data?.resumeCampaign.success) {
          enqueueSuccessSnackBar({
            message: t`Campaign resumed`,
          });

          return true;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.resumeCampaign.error ?? t`Failed to resume campaign`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to resume campaign`,
        });

        return false;
      }
    },
    [resumeCampaignMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { resumeCampaign, loading };
};
