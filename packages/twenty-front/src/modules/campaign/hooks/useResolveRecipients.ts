import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { RESOLVE_RECIPIENTS } from '@/campaign/graphql/mutations/resolveRecipients';
import { type ResolveRecipientsResult } from '@/campaign/types/CampaignTypes';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type ResolveRecipientsResponse = {
  resolveRecipients: ResolveRecipientsResult;
};

type ResolveRecipientsVariables = {
  input: {
    campaignId: string;
    mode: 'SAVED_VIEW' | 'MANUAL';
    viewId?: string;
    personIds?: string[];
  };
};

export const useResolveRecipients = () => {
  const [resolveRecipientsMutation, { loading }] = useMutation<
    ResolveRecipientsResponse,
    ResolveRecipientsVariables
  >(RESOLVE_RECIPIENTS);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const resolveRecipients = useCallback(
    async (
      campaignId: string,
      mode: 'SAVED_VIEW' | 'MANUAL',
      options?: { viewId?: string; personIds?: string[] },
    ): Promise<ResolveRecipientsResult | null> => {
      try {
        const result = await resolveRecipientsMutation({
          variables: {
            input: {
              campaignId,
              mode,
              viewId: options?.viewId,
              personIds: options?.personIds,
            },
          },
        });

        const data = result.data?.resolveRecipients;

        if (data?.success) {
          enqueueSuccessSnackBar({
            message: t`${data.created} recipients added (${data.skipped} skipped)`,
          });

          return data;
        }

        enqueueErrorSnackBar({
          message: data?.error ?? t`Failed to resolve recipients`,
        });

        return null;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to resolve recipients`,
        });

        return null;
      }
    },
    [resolveRecipientsMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { resolveRecipients, loading };
};
