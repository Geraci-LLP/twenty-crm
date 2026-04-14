import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import { SEND_TEST_EMAIL } from '@/campaign/graphql/mutations/sendTestEmail';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';

type SendTestEmailResult = {
  sendTestEmail: {
    success: boolean;
    error?: string;
  };
};

type SendTestEmailVariables = {
  input: {
    campaignId: string;
    testEmailAddress: string;
  };
};

export const useSendTestEmail = () => {
  const [sendTestEmailMutation, { loading }] = useMutation<
    SendTestEmailResult,
    SendTestEmailVariables
  >(SEND_TEST_EMAIL);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const sendTestEmail = useCallback(
    async (campaignId: string, testEmailAddress: string): Promise<boolean> => {
      try {
        const result = await sendTestEmailMutation({
          variables: {
            input: { campaignId, testEmailAddress },
          },
        });

        if (result.data?.sendTestEmail.success) {
          enqueueSuccessSnackBar({
            message: t`Test email sent to ${testEmailAddress}`,
          });

          return true;
        }

        enqueueErrorSnackBar({
          message:
            result.data?.sendTestEmail.error ?? t`Failed to send test email`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Failed to send test email`,
        });

        return false;
      }
    },
    [sendTestEmailMutation, enqueueSuccessSnackBar, enqueueErrorSnackBar],
  );

  return { sendTestEmail, loading };
};
