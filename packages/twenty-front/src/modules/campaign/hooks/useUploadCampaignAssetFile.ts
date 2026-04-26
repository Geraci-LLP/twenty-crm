import { useApolloClient, useMutation } from '@apollo/client/react';
import { t } from '@lingui/core/macro';
import { useCallback, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';

import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { UploadWorkflowFileDocument } from '~/generated-metadata/graphql';

// Reuses the workflow file upload mutation for marketing email assets. The
// dedicated marketing upload mutation (with its own FileFolder + accounting)
// is queued as a follow-up — for now this gives us a stable signed URL with
// no DI risk on the server. Files land in FileFolder.Workflow as
// isTemporaryFile=true; there is currently no active TTL cleanup of those,
// but if/when one is added we'll need to migrate to a dedicated marketing
// folder before that lands.

const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

export const useUploadCampaignAssetFile = () => {
  const apolloClient = useApolloClient();
  const [uploadWorkflowFile] = useMutation(UploadWorkflowFileDocument, {
    client: apolloClient,
  });
  const { enqueueErrorSnackBar } = useSnackBar();
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        enqueueErrorSnackBar({
          message: t`Unsupported image type. Use PNG, JPG, GIF, or WebP.`,
        });
        return null;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        enqueueErrorSnackBar({
          message: t`Image is too large (max 10 MB).`,
        });
        return null;
      }

      setUploading(true);
      try {
        const result = await uploadWorkflowFile({ variables: { file } });
        const uploaded = result.data?.uploadWorkflowFile;
        if (!isDefined(uploaded?.url)) {
          enqueueErrorSnackBar({ message: t`Upload failed.` });
          return null;
        }
        return uploaded.url;
      } catch {
        enqueueErrorSnackBar({ message: t`Upload failed.` });
        return null;
      } finally {
        setUploading(false);
      }
    },
    [uploadWorkflowFile, enqueueErrorSnackBar],
  );

  return { upload, uploading };
};
