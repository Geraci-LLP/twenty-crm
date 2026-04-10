import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { CREATE_DRIP_CAMPAIGN } from '@/campaign/graphql/mutations/createDripCampaign';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type CreateDripCampaignResult = {
  createDripCampaign: {
    success: boolean;
    dripCampaignId?: string;
    error?: string;
  };
};

type CreateDripCampaignVariables = {
  input: {
    name: string;
  };
};

export const useCreateDripCampaign = () => {
  const [createDripCampaignMutation, { loading }] = useMutation<
    CreateDripCampaignResult,
    CreateDripCampaignVariables
  >(CREATE_DRIP_CAMPAIGN);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const createDripCampaign = useCallback(
    async (name: string): Promise<string | null> => {
      try {
        const result = await createDripCampaignMutation({
          variables: {
            input: { name },
          },
        });

        if (result.data?.createDripCampaign.success) {
          enqueueSuccessSnackBar({
            message: t`Drip campaign created`,
          });

          return result.data.createDripCampaign.dripCampaignId ?? null;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.createDripCampaign.error ??
            t`Failed to create drip campaign`,
        });

        return null;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to create drip campaign`,
        });

        return null;
      }
    },
    [createDripCampaignMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { createDripCampaign, loading };
};
