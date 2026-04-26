import { useApolloClient, useMutation } from '@apollo/client/react';
import { t } from '@lingui/core/macro';
import { useCallback, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';

import { UPLOAD_MARKETING_FILE } from '@/campaign/graphql/mutations/uploadMarketingFile';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

// Uploads marketing email assets (e.g. images embedded in campaign body
// designs) via the dedicated uploadMarketingFile mutation added in PR 31.
// Files land in FileFolder.Marketing with isTemporaryFile=false so the
// signed URL stays valid indefinitely — recipients may open the email
// weeks after send. Earlier PRs reused the workflow upload as a temporary
// stop-gap; this hook now points at the proper resolver.

const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
];

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

type UploadMarketingFileResult = {
  uploadMarketingFile: {
    id: string;
    path: string;
    size: number;
    createdAt: string;
    url: string;
  } | null;
};

type UploadMarketingFileVariables = {
  file: File;
};

export const useUploadCampaignAssetFile = () => {
  const apolloClient = useApolloClient();
  const [uploadMarketingFile] = useMutation<
    UploadMarketingFileResult,
    UploadMarketingFileVariables
  >(UPLOAD_MARKETING_FILE, {
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
        const result = await uploadMarketingFile({ variables: { file } });
        const uploaded = result.data?.uploadMarketingFile;
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
    [uploadMarketingFile, enqueueErrorSnackBar],
  );

  return { upload, uploading };
};
