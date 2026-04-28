/* oxlint-disable twenty/no-hardcoded-colors */
/* oxlint-disable twenty/no-state-useref */
// Public quote page is shown to anonymous external clients via a sharing
// link. The modal-overlay rgba background is intentional (it always shows on
// white/light backgrounds), and the viewer-session ref is a stable identifier
// for tracking pings, not application state.
import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

// -- Types --

type QuoteStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

type QuoteCompany = {
  name: string | null;
};

type QuotePointOfContact = {
  name: string | null;
  email: string | null;
};

type Quote = {
  id: string;
  name: string;
  quoteNumber: string;
  status: QuoteStatus;
  issueDate: string | null;
  expiryDate: string | null;
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  taxRate: number;
  currency: string | null;
  notes: string | null;
  terms: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  clientSignature: string | null;
  company: QuoteCompany | null;
  pointOfContact: QuotePointOfContact | null;
};

type QuoteLineItem = {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  position: number;
};

type QuoteResponse = {
  quote: Quote;
  lineItems: QuoteLineItem[];
};

type PageState =
  | 'loading'
  | 'viewing'
  | 'accepting'
  | 'accepted'
  | 'rejecting'
  | 'rejected'
  | 'error';

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

const StyledHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  margin-bottom: ${themeCssVariables.spacing[6]};
  padding-bottom: ${themeCssVariables.spacing[4]};
`;

const StyledLogoPlaceholder = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  height: 48px;
  justify-content: center;
  width: 48px;
`;

const StyledCompanyName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledQuoteTitle = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0 0 ${themeCssVariables.spacing[4]} 0;
`;

const StyledMetadataPanel = styled.div`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: grid;
  gap: ${themeCssVariables.spacing[3]};
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: ${themeCssVariables.spacing[6]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledMetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledMetadataLabel = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  text-transform: uppercase;
`;

const StyledMetadataValue = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledStatusBadge = styled.span<{ statusColor: string }>`
  background: ${({ statusColor }) => statusColor};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  display: inline-block;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.04em;
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  text-transform: uppercase;
  width: fit-content;
`;

const StyledBanner = styled.div<{ variant: 'warning' | 'success' | 'danger' }>`
  background: ${({ variant }) =>
    variant === 'success'
      ? themeCssVariables.color.green
      : variant === 'danger'
        ? themeCssVariables.color.red
        : themeCssVariables.color.orange};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  display: flex;
  flex-direction: column;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[1]};
  margin-bottom: ${themeCssVariables.spacing[6]};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledBannerTitle = styled.span`
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledSectionTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0 0 ${themeCssVariables.spacing[3]} 0;
`;

const StyledLineItemsTable = styled.table`
  border: 1px solid ${themeCssVariables.border.color.light};
  border-collapse: collapse;
  margin-bottom: ${themeCssVariables.spacing[6]};
  width: 100%;
`;

const StyledTableHeadCell = styled.th`
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: left;
  text-transform: uppercase;
`;

const StyledTableCell = styled.td`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  vertical-align: top;
`;

const StyledTableCellRight = styled.td`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: right;
  vertical-align: top;
`;

const StyledItemName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledItemDescription = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.xs};
  margin-top: ${themeCssVariables.spacing[1]};
`;

const StyledTotalsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  margin-bottom: ${themeCssVariables.spacing[6]};
  margin-left: auto;
  max-width: 320px;
`;

const StyledTotalsRow = styled.div<{ emphasize?: boolean }>`
  border-top: ${({ emphasize }) =>
    emphasize ? `1px solid ${themeCssVariables.border.color.medium}` : 'none'};
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  font-size: ${({ emphasize }) =>
    emphasize
      ? themeCssVariables.font.size.md
      : themeCssVariables.font.size.sm};
  font-weight: ${({ emphasize }) =>
    emphasize
      ? themeCssVariables.font.weight.semiBold
      : themeCssVariables.font.weight.regular};
  justify-content: space-between;
  padding-top: ${({ emphasize }) =>
    emphasize ? themeCssVariables.spacing[2] : '0'};
`;

const StyledRichTextSection = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.6;
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

const StyledRichTextContent = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.6;
`;

const StyledActionRow = styled.div`
  border-top: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  justify-content: flex-end;
  margin-top: ${themeCssVariables.spacing[4]};
  padding-top: ${themeCssVariables.spacing[4]};
`;

const StyledPrimaryButton = styled.button`
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

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledSecondaryButton = styled.button`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  transition: background 150ms ease;

  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledModalOverlay = styled.div`
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: ${themeCssVariables.spacing[4]};
  position: fixed;
  z-index: 1000;
`;

const StyledModal = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.strong};
  max-width: 480px;
  padding: ${themeCssVariables.spacing[6]};
  width: 100%;
`;

const StyledModalTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0 0 ${themeCssVariables.spacing[4]} 0;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledLabel = styled.label`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledHelpText = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
  margin: 0 0 ${themeCssVariables.spacing[2]} 0;
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

const StyledTextArea = styled.textarea`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-sizing: border-box;
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  min-height: 80px;
  outline: none;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  resize: vertical;
  transition: border-color 150ms ease;
  width: 100%;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
  }

  &::placeholder {
    color: ${themeCssVariables.font.color.light};
  }
`;

const StyledModalActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: flex-end;
  margin-top: ${themeCssVariables.spacing[4]};
`;

const StyledFormError = styled.p`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.sm};
  margin: ${themeCssVariables.spacing[2]} 0 0 0;
`;

const StyledLoadingMessage = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  font-size: ${themeCssVariables.font.size.md};
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]} 0;
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

const StyledSignatureBlock = styled.div`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: cursive;
  font-size: ${themeCssVariables.font.size.md};
  margin-bottom: ${themeCssVariables.spacing[6]};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

// -- Helpers --

const generateSessionId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const formatDate = (isoDate: string | null): string => {
  if (!isDefined(isoDate) || isoDate.length === 0) {
    return '—';
  }

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number, currency: string | null): string => {
  const resolvedCurrency =
    isDefined(currency) && currency.length > 0 ? currency : 'USD';

  try {
    return new Intl.NumberFormat([], {
      style: 'currency',
      currency: resolvedCurrency,
    }).format(amount);
  } catch {
    return `${resolvedCurrency} ${amount.toFixed(2)}`;
  }
};

const getStatusColor = (status: QuoteStatus): string => {
  switch (status) {
    case 'ACCEPTED':
      return themeCssVariables.color.green;
    case 'REJECTED':
      return themeCssVariables.color.red;
    case 'EXPIRED':
      return themeCssVariables.color.orange;
    case 'SENT':
    case 'VIEWED':
      return themeCssVariables.color.blue;
    case 'DRAFT':
    default:
      return themeCssVariables.color.gray;
  }
};

const isActionable = (status: QuoteStatus): boolean => {
  return status === 'SENT' || status === 'VIEWED';
};

// -- Main component --

export const PublicQuotePage = () => {
  const { workspaceId, slug } = useParams<{
    workspaceId: string;
    slug: string;
  }>();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Signer form state (shared between accept and reject)
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signatureText, setSignatureText] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stable viewer session id for tracking pings
  const viewerSessionIdRef = useRef<string>(generateSessionId());

  // Fetch quote on mount
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(
          `${REACT_APP_SERVER_BASE_URL}/quotes/${workspaceId}/${slug}`,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);

          throw new Error(
            errorData?.message ?? `Quote not found (${response.status})`,
          );
        }

        const data: QuoteResponse = await response.json();

        setQuote(data.quote);
        setLineItems(
          [...(data.lineItems ?? [])].sort((a, b) => a.position - b.position),
        );

        // Map existing quote status to appropriate page state
        if (data.quote.status === 'ACCEPTED') {
          setPageState('accepted');
        } else if (data.quote.status === 'REJECTED') {
          setPageState('rejected');
        } else {
          setPageState('viewing');
        }

        // Update the browser tab title
        const titleParts = [data.quote.quoteNumber, data.quote.name].filter(
          (part) => isDefined(part) && part.length > 0,
        );

        if (titleParts.length > 0) {
          document.title = `Quote ${titleParts.join(' — ')}`;
        }
      } catch (fetchError) {
        setErrorMessage(
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load quote',
        );
        setPageState('error');
      }
    };

    if (isDefined(workspaceId) && isDefined(slug)) {
      fetchQuote();
    }
  }, [workspaceId, slug]);

  // Send tracking pings every 30s while viewing (non-blocking)
  useEffect(() => {
    if (
      pageState !== 'viewing' &&
      pageState !== 'accepting' &&
      pageState !== 'rejecting'
    ) {
      return;
    }

    if (!isDefined(workspaceId) || !isDefined(slug)) {
      return;
    }

    const viewerSessionId = viewerSessionIdRef.current;

    const sendTrackingPing = async () => {
      try {
        await fetch(
          `${REACT_APP_SERVER_BASE_URL}/quotes/${workspaceId}/${slug}/track`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ viewerSessionId }),
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
  }, [pageState, workspaceId, slug]);

  const openAcceptModal = useCallback(() => {
    setModalError(null);
    setSignerName('');
    setSignerEmail('');
    setSignatureText('');
    setPageState('accepting');
  }, []);

  const openRejectModal = useCallback(() => {
    setModalError(null);
    setSignerName('');
    setSignerEmail('');
    setRejectionReason('');
    setPageState('rejecting');
  }, []);

  const closeModal = useCallback(() => {
    setModalError(null);

    if (!isDefined(quote)) {
      setPageState('viewing');
      return;
    }

    if (quote.status === 'ACCEPTED') {
      setPageState('accepted');
    } else if (quote.status === 'REJECTED') {
      setPageState('rejected');
    } else {
      setPageState('viewing');
    }
  }, [quote]);

  const handleAcceptSubmit = useCallback(async () => {
    const trimmedName = signerName.trim();
    const trimmedEmail = signerEmail.trim();
    const trimmedSignature = signatureText.trim();

    if (trimmedName.length === 0) {
      setModalError('Please enter your legal name.');
      return;
    }

    if (trimmedEmail.length === 0) {
      setModalError('Please enter your email.');
      return;
    }

    if (trimmedSignature.length === 0) {
      setModalError('Please type your name as a signature.');
      return;
    }

    // Signature must match the legal name (case-insensitive)
    if (trimmedSignature.toLowerCase() !== trimmedName.toLowerCase()) {
      setModalError('Signature must match your legal name exactly.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const response = await fetch(
        `${REACT_APP_SERVER_BASE_URL}/quotes/${workspaceId}/${slug}/accept`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signerName: trimmedName,
            signerEmail: trimmedEmail,
            signatureText: trimmedSignature,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? 'Failed to accept quote');
      }

      const data = await response.json().catch(() => null);

      // Merge the updated quote fields back into state
      setQuote((previousQuote) => {
        if (!isDefined(previousQuote)) {
          return previousQuote;
        }

        return {
          ...previousQuote,
          status: 'ACCEPTED',
          acceptedAt: data?.quote?.acceptedAt ?? new Date().toISOString(),
          clientSignature: data?.quote?.clientSignature ?? trimmedSignature,
        };
      });

      setPageState('accepted');
    } catch (submitError) {
      setModalError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to accept quote',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [signerName, signerEmail, signatureText, workspaceId, slug]);

  const handleRejectSubmit = useCallback(async () => {
    const trimmedName = signerName.trim();
    const trimmedEmail = signerEmail.trim();
    const trimmedReason = rejectionReason.trim();

    if (trimmedName.length === 0) {
      setModalError('Please enter your legal name.');
      return;
    }

    if (trimmedEmail.length === 0) {
      setModalError('Please enter your email.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const response = await fetch(
        `${REACT_APP_SERVER_BASE_URL}/quotes/${workspaceId}/${slug}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signerName: trimmedName,
            signerEmail: trimmedEmail,
            reason: trimmedReason,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? 'Failed to reject quote');
      }

      const data = await response.json().catch(() => null);

      setQuote((previousQuote) => {
        if (!isDefined(previousQuote)) {
          return previousQuote;
        }

        return {
          ...previousQuote,
          status: 'REJECTED',
          rejectedAt: data?.quote?.rejectedAt ?? new Date().toISOString(),
          rejectionReason: data?.quote?.rejectionReason ?? trimmedReason,
        };
      });

      setPageState('rejected');
    } catch (submitError) {
      setModalError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to reject quote',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [signerName, signerEmail, rejectionReason, workspaceId, slug]);

  const statusBadgeColor = useMemo(() => {
    if (!isDefined(quote)) {
      return themeCssVariables.color.gray;
    }

    return getStatusColor(quote.status);
  }, [quote]);

  // -- Loading state --
  if (pageState === 'loading') {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledLoadingMessage>Loading quote...</StyledLoadingMessage>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  // -- Error state --
  if (pageState === 'error' || !isDefined(quote)) {
    return (
      <StyledPageContainer>
        <StyledCard>
          <StyledErrorMessage>
            <StyledErrorTitle>Quote Unavailable</StyledErrorTitle>
            {errorMessage ?? 'This quote is not available.'}
          </StyledErrorMessage>
        </StyledCard>
      </StyledPageContainer>
    );
  }

  const companyName = quote.company?.name ?? 'Company';
  const contactName = quote.pointOfContact?.name ?? '—';
  const contactEmail = quote.pointOfContact?.email ?? '';
  const canTakeAction = isActionable(quote.status);
  const quoteTitle = `Quote ${quote.quoteNumber}${
    isDefined(quote.name) && quote.name.length > 0 ? ` — ${quote.name}` : ''
  }`;

  const showAcceptModal = pageState === 'accepting';
  const showRejectModal = pageState === 'rejecting';

  return (
    <StyledPageContainer>
      <StyledCard>
        {/* Header: company logo + name */}
        <StyledHeader>
          <StyledLogoPlaceholder aria-hidden="true">
            {companyName.charAt(0).toUpperCase()}
          </StyledLogoPlaceholder>
          <StyledCompanyName>{companyName}</StyledCompanyName>
        </StyledHeader>

        <StyledQuoteTitle>{quoteTitle}</StyledQuoteTitle>

        {/* Status banners */}
        {quote.status === 'EXPIRED' && (
          <StyledBanner variant="warning" role="alert">
            <StyledBannerTitle>This quote has expired</StyledBannerTitle>
            <span>
              This quote expired on {formatDate(quote.expiryDate)} and can no
              longer be accepted.
            </span>
          </StyledBanner>
        )}

        {quote.status === 'ACCEPTED' && (
          <StyledBanner variant="success" role="status">
            <StyledBannerTitle>
              Accepted on {formatDate(quote.acceptedAt)}
            </StyledBannerTitle>
            <span>Thank you for accepting this quote.</span>
          </StyledBanner>
        )}

        {quote.status === 'REJECTED' && (
          <StyledBanner variant="danger" role="status">
            <StyledBannerTitle>
              Rejected on {formatDate(quote.rejectedAt)}
            </StyledBannerTitle>
            {isDefined(quote.rejectionReason) &&
              quote.rejectionReason.length > 0 && (
                <span>Reason: {quote.rejectionReason}</span>
              )}
          </StyledBanner>
        )}

        {/* Metadata panel */}
        <StyledMetadataPanel>
          <StyledMetadataItem>
            <StyledMetadataLabel>Issue Date</StyledMetadataLabel>
            <StyledMetadataValue>
              {formatDate(quote.issueDate)}
            </StyledMetadataValue>
          </StyledMetadataItem>

          <StyledMetadataItem>
            <StyledMetadataLabel>Expiry Date</StyledMetadataLabel>
            <StyledMetadataValue>
              {formatDate(quote.expiryDate)}
            </StyledMetadataValue>
          </StyledMetadataItem>

          <StyledMetadataItem>
            <StyledMetadataLabel>Status</StyledMetadataLabel>
            <StyledStatusBadge
              statusColor={statusBadgeColor}
              aria-label={`Quote status: ${quote.status}`}
            >
              {quote.status}
            </StyledStatusBadge>
          </StyledMetadataItem>

          <StyledMetadataItem>
            <StyledMetadataLabel>Prepared By</StyledMetadataLabel>
            <StyledMetadataValue>{companyName}</StyledMetadataValue>
          </StyledMetadataItem>

          <StyledMetadataItem>
            <StyledMetadataLabel>Prepared For</StyledMetadataLabel>
            <StyledMetadataValue>
              {contactName}
              {contactEmail.length > 0 && ` (${contactEmail})`}
            </StyledMetadataValue>
          </StyledMetadataItem>
        </StyledMetadataPanel>

        {/* Line items table */}
        <StyledSectionTitle>Line Items</StyledSectionTitle>
        <StyledLineItemsTable>
          <thead>
            <tr>
              <StyledTableHeadCell scope="col">Item</StyledTableHeadCell>
              <StyledTableHeadCell scope="col">Description</StyledTableHeadCell>
              <StyledTableHeadCell scope="col" style={{ textAlign: 'right' }}>
                Qty
              </StyledTableHeadCell>
              <StyledTableHeadCell scope="col" style={{ textAlign: 'right' }}>
                Unit Price
              </StyledTableHeadCell>
              <StyledTableHeadCell scope="col" style={{ textAlign: 'right' }}>
                Discount
              </StyledTableHeadCell>
              <StyledTableHeadCell scope="col" style={{ textAlign: 'right' }}>
                Total
              </StyledTableHeadCell>
            </tr>
          </thead>
          <tbody>
            {lineItems.length === 0 ? (
              <tr>
                <StyledTableCell colSpan={6}>
                  No line items on this quote.
                </StyledTableCell>
              </tr>
            ) : (
              lineItems.map((lineItem) => (
                <tr key={lineItem.id}>
                  <StyledTableCell>
                    <StyledItemName>{lineItem.name}</StyledItemName>
                  </StyledTableCell>
                  <StyledTableCell>
                    {isDefined(lineItem.description) &&
                      lineItem.description.length > 0 && (
                        <StyledItemDescription>
                          {lineItem.description}
                        </StyledItemDescription>
                      )}
                  </StyledTableCell>
                  <StyledTableCellRight>
                    {lineItem.quantity}
                  </StyledTableCellRight>
                  <StyledTableCellRight>
                    {formatCurrency(lineItem.unitPrice, quote.currency)}
                  </StyledTableCellRight>
                  <StyledTableCellRight>
                    {formatCurrency(lineItem.discount, quote.currency)}
                  </StyledTableCellRight>
                  <StyledTableCellRight>
                    {formatCurrency(lineItem.total, quote.currency)}
                  </StyledTableCellRight>
                </tr>
              ))
            )}
          </tbody>
        </StyledLineItemsTable>

        {/* Totals panel */}
        <StyledTotalsPanel>
          <StyledTotalsRow>
            <span>Subtotal</span>
            <span>{formatCurrency(quote.subtotal, quote.currency)}</span>
          </StyledTotalsRow>
          <StyledTotalsRow>
            <span>Discount</span>
            <span>-{formatCurrency(quote.discount, quote.currency)}</span>
          </StyledTotalsRow>
          <StyledTotalsRow>
            <span>Tax ({quote.taxRate}%)</span>
            <span>{formatCurrency(quote.taxAmount, quote.currency)}</span>
          </StyledTotalsRow>
          <StyledTotalsRow emphasize>
            <span>Grand Total</span>
            <span>{formatCurrency(quote.total, quote.currency)}</span>
          </StyledTotalsRow>
        </StyledTotalsPanel>

        {/* Signature block (if accepted) */}
        {quote.status === 'ACCEPTED' &&
          isDefined(quote.clientSignature) &&
          quote.clientSignature.length > 0 && (
            <>
              <StyledSectionTitle>Client Signature</StyledSectionTitle>
              <StyledSignatureBlock>
                {quote.clientSignature}
              </StyledSignatureBlock>
            </>
          )}

        {/* Notes section */}
        {isDefined(quote.notes) && quote.notes.length > 0 && (
          <StyledRichTextSection>
            <StyledSectionTitle>Notes</StyledSectionTitle>
            {/* RICH_TEXT is stored as HTML. In production this should be sanitized server-side. */}
            <StyledRichTextContent
              dangerouslySetInnerHTML={{ __html: quote.notes }}
            />
          </StyledRichTextSection>
        )}

        {/* Terms section */}
        {isDefined(quote.terms) && quote.terms.length > 0 && (
          <StyledRichTextSection>
            <StyledSectionTitle>Terms</StyledSectionTitle>
            <StyledRichTextContent
              dangerouslySetInnerHTML={{ __html: quote.terms }}
            />
          </StyledRichTextSection>
        )}

        {/* Action row — only shown when quote is actionable */}
        {canTakeAction && (
          <StyledActionRow>
            <StyledSecondaryButton
              onClick={openRejectModal}
              disabled={!canTakeAction}
              aria-label="Reject this quote"
            >
              Reject
            </StyledSecondaryButton>
            <StyledPrimaryButton
              onClick={openAcceptModal}
              disabled={!canTakeAction}
              aria-label="Accept this quote"
            >
              Accept
            </StyledPrimaryButton>
          </StyledActionRow>
        )}
      </StyledCard>

      {/* Accept modal */}
      {showAcceptModal && (
        <StyledModalOverlay
          role="dialog"
          aria-modal="true"
          aria-labelledby="accept-modal-title"
        >
          <StyledModal>
            <StyledModalTitle id="accept-modal-title">
              Accept Quote
            </StyledModalTitle>

            <StyledFormGroup>
              <StyledLabel htmlFor="accept-signer-name">
                Legal name *
              </StyledLabel>
              <StyledInput
                id="accept-signer-name"
                type="text"
                placeholder="Full legal name"
                value={signerName}
                onChange={(event) => setSignerName(event.target.value)}
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="accept-signer-email">Email *</StyledLabel>
              <StyledInput
                id="accept-signer-email"
                type="email"
                placeholder="you@example.com"
                value={signerEmail}
                onChange={(event) => setSignerEmail(event.target.value)}
                required
              />
            </StyledFormGroup>

            <StyledHelpText>
              By typing your name below, you agree this serves as your
              electronic signature:
            </StyledHelpText>

            <StyledFormGroup>
              <StyledLabel htmlFor="accept-signature">Signature *</StyledLabel>
              <StyledInput
                id="accept-signature"
                type="text"
                placeholder="Type your name to sign"
                value={signatureText}
                onChange={(event) => setSignatureText(event.target.value)}
                required
              />
            </StyledFormGroup>

            {isDefined(modalError) && (
              <StyledFormError>{modalError}</StyledFormError>
            )}

            <StyledModalActions>
              <StyledSecondaryButton
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </StyledSecondaryButton>
              <StyledPrimaryButton
                onClick={handleAcceptSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Accepting...' : 'Confirm Accept'}
              </StyledPrimaryButton>
            </StyledModalActions>
          </StyledModal>
        </StyledModalOverlay>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <StyledModalOverlay
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-modal-title"
        >
          <StyledModal>
            <StyledModalTitle id="reject-modal-title">
              Reject Quote
            </StyledModalTitle>

            <StyledFormGroup>
              <StyledLabel htmlFor="reject-signer-name">
                Legal name *
              </StyledLabel>
              <StyledInput
                id="reject-signer-name"
                type="text"
                placeholder="Full legal name"
                value={signerName}
                onChange={(event) => setSignerName(event.target.value)}
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="reject-signer-email">Email *</StyledLabel>
              <StyledInput
                id="reject-signer-email"
                type="email"
                placeholder="you@example.com"
                value={signerEmail}
                onChange={(event) => setSignerEmail(event.target.value)}
                required
              />
            </StyledFormGroup>

            <StyledFormGroup>
              <StyledLabel htmlFor="reject-reason">
                Reason (optional)
              </StyledLabel>
              <StyledTextArea
                id="reject-reason"
                placeholder="Let us know why you're rejecting this quote"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
              />
            </StyledFormGroup>

            {isDefined(modalError) && (
              <StyledFormError>{modalError}</StyledFormError>
            )}

            <StyledModalActions>
              <StyledSecondaryButton
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </StyledSecondaryButton>
              <StyledPrimaryButton
                onClick={handleRejectSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Reject'}
              </StyledPrimaryButton>
            </StyledModalActions>
          </StyledModal>
        </StyledModalOverlay>
      )}
    </StyledPageContainer>
  );
};
