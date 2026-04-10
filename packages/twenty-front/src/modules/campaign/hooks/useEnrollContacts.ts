import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { ENROLL_CONTACTS } from '@/campaign/graphql/mutations/enrollContacts';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type EnrollContactsResult = {
  enrollContacts: {
    success: boolean;
    enrolled: number;
    skipped: number;
    error?: string;
  };
};

type EnrollContactsVariables = {
  input: {
    dripCampaignId: string;
    personIds: string[];
  };
};

export const useEnrollContacts = () => {
  const [enrollContactsMutation, { loading }] = useMutation<
    EnrollContactsResult,
    EnrollContactsVariables
  >(ENROLL_CONTACTS);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const enrollContacts = useCallback(
    async (
      dripCampaignId: string,
      personIds: string[],
    ): Promise<{ enrolled: number; skipped: number } | null> => {
      try {
        const result = await enrollContactsMutation({
          variables: {
            input: { dripCampaignId, personIds },
          },
        });

        if (result.data?.enrollContacts.success) {
          const { enrolled, skipped } = result.data.enrollContacts;

          enqueueSuccessSnackBar({
            message: t`Enrolled ${enrolled} contacts (${skipped} skipped)`,
          });

          return { enrolled, skipped };
        }

        enqueueErrorSnackBar({
          message:
            result.data?.enrollContacts.error ?? t`Failed to enroll contacts`,
        });

        return null;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to enroll contacts`,
        });

        return null;
      }
    },
    [enrollContactsMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { enrollContacts, loading };
};
