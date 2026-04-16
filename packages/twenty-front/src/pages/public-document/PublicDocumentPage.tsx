import { styled } from '@linaria/react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

type DocumentMetadata = {
  id: string;
  name: string;
  mimeType: string | null;
  pageCount: number | null;
  requiresEmail: boolean;
};

type IdentifyResponse = {
  viewId: string;
};

type PageState = 'loading' | 'emailGate' | 'viewing' | 'error';

// Tracking interval in milliseconds (30 seconds)
const TRACKING_INTERVAL_MS = 30_000;

// -- Styled components --

const StyledPageContainer = styled.div`
  align-items: flex-start;
  background: ${themeCssVariables.background.noisy};
  display: flex;
  justify-content: center;
  min-height: 100dvh;
  padding: ${themeCssVariables.spacing[8]} ${themeCssVariables.spacing[4]};
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.light};
  max-width: 900px;
  padding: ${themeCssVariables.spacing[8]};
  width: 100%;
`;

const StyledDocumentHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

const StyledDocumentName = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledDocumentMeta = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

const StyledEmailGateForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  margin: 0 auto;
  max-width: 400px;
  padding: ${themeCssVariables.spacing[8]} 0;
`;

const StyledEmailGateHeading = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
  text-align: center;
`;

const StyledEmailGateDescription = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.5;
  margin: 0;
  text-align: center;
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-sizing: border-box;
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  outline: none;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: border-color 150ms ease;
  width: 100%;

  &::placeholder {
    color: ${themeCssVariables.font.color.light};
  }

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }
`;

const StyledSubmitButton = styled.button`
  background: ${themeCssVariables.color.blue};
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  transition: opacity 150ms ease;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledDocumentViewer = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  justify-content: center;
  min-height: 600px;
`;

const StyledDocumentPlaceholder = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-direction: column;
  font-size: ${themeCssVariables.font.size.md};
  gap: ${themeCssVariables.spacing[2]};
  line-height: 1.6;
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

const StyledPlaceholderTitle = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledMetadataBar = styled.div`
  align-items: center;
  border-top: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[4]};
  margin-top: ${themeCssVariables.spacing[4]};
  padding-top: ${themeCssVariables.spacing[4]};
`;

const StyledErrorMessage = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.danger};
  display: flex;
  flex-direction: column;
  font-size: ${themeCssVariables.font.size.md};
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[8]} 0;
  text-align: center;
`;

const StyledErrorTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledLoadingMessage = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  font-size: ${themeCssVariables.font.size.md};
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]} 0;
`;

const StyledFormError = styled.p`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

export const PublicDocumentPage = () => {
  const { workspaceId, slug } = useParams<{
    workspaceId: string;
    slug: string;
  }>();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [documentMetadata, setDocumentMetadata] =
    useState<DocumentMetadata | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Email gate state
  const [viewerEmail, setViewerEmail] = useState('');
  const [viewerName, setViewerName] = useState('');
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identifyError, setIdentifyError] = useState<string | null>(null);

  // View tracking state
  const [viewId, setViewId] = useState<string | null>(null);

  // Fetch document metadata on mount
  useEffect(() => {
    const fetchDocumentMetadata = async () => {
      try {
        const response = await fetch(
          `${REACT_APP_SERVER_BASE_URL}/documents/${workspaceId}/${slug}`,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);

          throw new Error(
            errorData?.message ?? `Document not found (${response.status})`,
          );
        }

        const data = await response.json();
        const metadata: DocumentMetadata = {
          id: data.document?.id ?? '',
          name: data.document?.name ?? '',
          mimeType: data.document?.mimeType ?? null,
          pageCount: data.document?.pageCount ?? null,
          requiresEmail: data.requiresEmail ?? false,
        };

        setDocumentMetadata(metadata);

        if (metadata.requiresEmail) {
          setPageState('emailGate');
        } else {
          setPageState('viewing');
        }

        // Update the browser tab title
        if (metadata.name.length > 0) {
          document.title = metadata.name;
        }
      } catch (fetchError) {
        setErrorMessage(
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load document',
        );
        setPageState('error');
      }
    };

    if (isDefined(workspaceId) && isDefined(slug)) {
      fetchDocumentMetadata();
    }
  }, [workspaceId, slug]);

  // Start view tracking when we have a viewId
  useEffect(() => {
    if (!isDefined(viewId)) {
      return;
    }

    const viewStartTime = Date.now();

    const sendTrackingPing = async () => {
      const elapsedSeconds = Math.round((Date.now() - viewStartTime) / 1000);

      try {
        await fetch(
          `${REACT_APP_SERVER_BASE_URL}/documents/${workspaceId}/${slug}/track`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              viewId,
              durationSeconds: elapsedSeconds,
              pagesViewed: 0,
              completionPercent: 0,
            }),
          },
        );
      } catch {
        // Tracking failures are non-critical, silently ignore
      }
    };

    // Send an initial tracking ping immediately
    sendTrackingPing();

    const intervalId = setInterval(sendTrackingPing, TRACKING_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [viewId, workspaceId, slug]);

  const onIdentifySubmit = useCallback(async () => {
    if (viewerEmail.trim().length === 0) {
      setIdentifyError('Email is required.');
      return;
    }

    setIsIdentifying(true);
    setIdentifyError(null);

    try {
      const response = await fetch(
        `${REACT_APP_SERVER_BASE_URL}/documents/${workspaceId}/${slug}/identify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: viewerEmail.trim(),
            name: viewerName.trim(),
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? 'Identification failed');
      }

      const data: IdentifyResponse = await response.json();

      setViewId(data.viewId);
      setPageState('viewing');
    } catch (submitError) {
      setIdentifyError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to verify identity',
      );
    } finally {
      setIsIdentifying(false);
    }
  }, [viewerEmail, viewerName, workspaceId, slug]);

  const onEmailKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onIdentifySubmit();
      }
    },
    [onIdentifySubmit],
  );

  // Build a human-readable metadata string for the document type
  const formatMimeType = (mimeType: string | null): string => {
    if (!isDefined(mimeType)) {
      return 'Document';
    }

    const mimeTypeMap: Record<string, string> = {
      'application/pdf': 'PDF',
      'application/msword': 'Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'Word Document',
      'application/vnd.ms-excel': 'Spreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'Spreadsheet',
      'application/vnd.ms-powerpoint': 'Presentation',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'Presentation',
      'image/png': 'PNG Image',
      'image/jpeg': 'JPEG Image',
      'text/plain': 'Text File',
    };

    return mimeTypeMap[mimeType] ?? mimeType;
  };

  // -- Loading state --
  if (pageState === 'loading') {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledLoadingMessage>Loading document...</StyledLoadingMessage>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  // -- Error state --
  if (pageState === 'error' || !isDefined(documentMetadata)) {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledErrorMessage>
            <StyledErrorTitle>Document Unavailable</StyledErrorTitle>
            {errorMessage ?? 'This document is not available.'}
          </StyledErrorMessage>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  // -- Email gate state --
  if (pageState === 'emailGate') {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledDocumentHeader>
            <StyledDocumentName>{documentMetadata.name}</StyledDocumentName>
            <StyledDocumentMeta>
              {formatMimeType(documentMetadata.mimeType)}
              {isDefined(documentMetadata.pageCount) &&
                documentMetadata.pageCount > 0 &&
                ` \u00B7 ${documentMetadata.pageCount} page${documentMetadata.pageCount === 1 ? '' : 's'}`}
            </StyledDocumentMeta>
          </StyledDocumentHeader>

          <StyledEmailGateForm>
            <StyledEmailGateHeading>
              Verify your identity
            </StyledEmailGateHeading>
            <StyledEmailGateDescription>
              Please enter your email to view this document.
            </StyledEmailGateDescription>

            <StyledInput
              type="text"
              placeholder="Your name"
              value={viewerName}
              onChange={(event) => setViewerName(event.target.value)}
            />
            <StyledInput
              type="email"
              placeholder="Your email address"
              value={viewerEmail}
              onChange={(event) => setViewerEmail(event.target.value)}
              onKeyDown={onEmailKeyDown}
            />

            {isDefined(identifyError) && (
              <StyledFormError>{identifyError}</StyledFormError>
            )}

            <StyledSubmitButton
              onClick={onIdentifySubmit}
              disabled={isIdentifying}
            >
              {isIdentifying ? 'Verifying...' : 'View Document'}
            </StyledSubmitButton>
          </StyledEmailGateForm>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  // -- Viewing state --
  return (
    <StyledPageContainer>
      <StyledCard>
        <StyledDocumentHeader>
          <StyledDocumentName>{documentMetadata.name}</StyledDocumentName>
          <StyledDocumentMeta>
            {formatMimeType(documentMetadata.mimeType)}
            {isDefined(documentMetadata.pageCount) &&
              documentMetadata.pageCount > 0 &&
              ` \u00B7 ${documentMetadata.pageCount} page${documentMetadata.pageCount === 1 ? '' : 's'}`}
          </StyledDocumentMeta>
        </StyledDocumentHeader>

        <StyledDocumentViewer>
          <StyledDocumentPlaceholder>
            <StyledPlaceholderTitle>
              {documentMetadata.name}
            </StyledPlaceholderTitle>
            Document viewer — file will be displayed here when file storage is
            configured.
          </StyledDocumentPlaceholder>
        </StyledDocumentViewer>

        <StyledMetadataBar>
          <span>{formatMimeType(documentMetadata.mimeType)}</span>
          {isDefined(documentMetadata.pageCount) &&
            documentMetadata.pageCount > 0 && (
              <span>
                {documentMetadata.pageCount} page
                {documentMetadata.pageCount === 1 ? '' : 's'}
              </span>
            )}
          {isDefined(viewId) && <span>View tracked</span>}
        </StyledMetadataBar>
      </StyledCard>
    </StyledPageContainer>
  );
};
