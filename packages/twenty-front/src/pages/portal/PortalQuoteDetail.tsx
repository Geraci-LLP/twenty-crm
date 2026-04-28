import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

// -- Types (mirrors the shape exposed by `myQuotes(id:)` portal query) --

type QuoteStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

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

type PortalQuote = {
  id: string;
  quoteNumber: string;
  name: string | null;
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
  workspaceId: string | null;
  slug: string | null;
  lineItems: QuoteLineItem[];
  company: { name: string | null } | null;
  pointOfContact: { name: string | null; email: string | null } | null;
};

const PORTAL_QUOTE_DETAIL_QUERY = gql`
  query PortalQuoteDetail($id: ID!) {
    myQuote(id: $id) {
      id
      quoteNumber
      name
      status
      issueDate
      expiryDate
      subtotal
      taxAmount
      discount
      total
      taxRate
      currency
      notes
      terms
      acceptedAt
      rejectedAt
      rejectionReason
      clientSignature
      workspaceId
      slug
      company {
        name
      }
      pointOfContact {
        name
        email
      }
      lineItems {
        id
        name
        description
        quantity
        unitPrice
        discount
        total
        position
      }
    }
  }
`;

// -- Styled components (kept local; we duplicate the layout from
// PublicQuotePage for MVP. A shared QuoteView extraction is tracked
// as follow-up work.) --

const StyledContainer = styled.div`
  margin: 0 auto;
  max-width: 900px;
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[6]};
`;

const StyledHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  margin-bottom: ${themeCssVariables.spacing[4]};
  padding-bottom: ${themeCssVariables.spacing[4]};
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

const StyledSectionTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0 0 ${themeCssVariables.spacing[3]} 0;
`;

const StyledTable = styled.table`
  border: 1px solid ${themeCssVariables.border.color.light};
  border-collapse: collapse;
  margin-bottom: ${themeCssVariables.spacing[6]};
  width: 100%;
`;

const StyledTableHead = styled.th`
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
`;

const StyledTableCellRight = styled.td`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: right;
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
`;

const StyledMessage = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

const StyledFormError = styled.p`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0 0 ${themeCssVariables.spacing[3]} 0;
`;

// Accept / reject are exposed as GraphQL mutations on the portal schema.
// These call through to the same underlying service as the public
// `/quotes/:workspaceId/:slug/accept` REST endpoint.
const ACCEPT_MUTATION = gql`
  mutation PortalAcceptQuote($id: ID!) {
    acceptMyQuote(id: $id) {
      id
      status
      acceptedAt
      clientSignature
    }
  }
`;

const REJECT_MUTATION = gql`
  mutation PortalRejectQuote($id: ID!, $reason: String) {
    rejectMyQuote(id: $id, reason: $reason) {
      id
      status
      rejectedAt
      rejectionReason
    }
  }
`;

// -- Helpers --

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

const isActionable = (status: QuoteStatus): boolean =>
  status === 'SENT' || status === 'VIEWED';

// -- Main component --

export const PortalQuoteDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error, refetch } = useQuery<{
    myQuote: PortalQuote | null;
  }>(PORTAL_QUOTE_DETAIL_QUERY, {
    variables: { id },
    skip: !isDefined(id),
    errorPolicy: 'all',
  });

  const [acceptMutation] = useMutation(ACCEPT_MUTATION);
  const [rejectMutation] = useMutation(REJECT_MUTATION);

  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quote = data?.myQuote ?? null;

  const sortedLineItems = useMemo(() => {
    if (!isDefined(quote)) {
      return [];
    }

    return [...(quote.lineItems ?? [])].sort((a, b) => a.position - b.position);
  }, [quote]);

  // Fallback handler: call the public REST accept endpoint if the GraphQL
  // mutation is unavailable. Uses workspaceId + slug from the quote.
  const fallbackRestAccept = useCallback(async () => {
    if (
      !isDefined(quote) ||
      !isDefined(quote.workspaceId) ||
      !isDefined(quote.slug)
    ) {
      throw new Error('Quote is missing workspace or slug.');
    }

    const response = await fetch(
      `${REACT_APP_SERVER_BASE_URL}/quotes/${quote.workspaceId}/${quote.slug}/accept`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to accept quote');
    }
  }, [quote]);

  const handleAccept = useCallback(async () => {
    if (!isDefined(quote)) {
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      try {
        await acceptMutation({ variables: { id: quote.id } });
      } catch {
        // Fall back to REST endpoint if mutation not registered yet.
        await fallbackRestAccept();
      }

      await refetch();
    } catch (submitError) {
      setActionError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to accept quote',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [quote, acceptMutation, fallbackRestAccept, refetch]);

  const handleReject = useCallback(async () => {
    if (!isDefined(quote)) {
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      await rejectMutation({
        variables: { id: quote.id, reason: null },
      });

      await refetch();
    } catch (submitError) {
      setActionError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to reject quote',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [quote, rejectMutation, refetch]);

  if (loading && !isDefined(quote)) {
    return (
      <StyledContainer>
        <StyledCard>
          <StyledMessage>Loading quote...</StyledMessage>
        </StyledCard>
      </StyledContainer>
    );
  }

  if (isDefined(error) && !isDefined(quote)) {
    return (
      <StyledContainer>
        <StyledCard>
          <StyledMessage>This quote is not available.</StyledMessage>
        </StyledCard>
      </StyledContainer>
    );
  }

  if (!isDefined(quote)) {
    return null;
  }

  const companyName = quote.company?.name ?? 'Company';
  const contactName = quote.pointOfContact?.name ?? '—';
  const contactEmail = quote.pointOfContact?.email ?? '';
  const canTakeAction = isActionable(quote.status);
  const quoteTitle = `Quote ${quote.quoteNumber}${
    isDefined(quote.name) && quote.name.length > 0 ? ` — ${quote.name}` : ''
  }`;

  return (
    <StyledContainer>
      <StyledCard>
        <StyledHeader>
          <StyledCompanyName>{companyName}</StyledCompanyName>
        </StyledHeader>

        <StyledQuoteTitle>{quoteTitle}</StyledQuoteTitle>

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
            <StyledStatusBadge statusColor={getStatusColor(quote.status)}>
              {quote.status}
            </StyledStatusBadge>
          </StyledMetadataItem>

          <StyledMetadataItem>
            <StyledMetadataLabel>Prepared For</StyledMetadataLabel>
            <StyledMetadataValue>
              {contactName}
              {contactEmail.length > 0 && ` (${contactEmail})`}
            </StyledMetadataValue>
          </StyledMetadataItem>
        </StyledMetadataPanel>

        <StyledSectionTitle>Line Items</StyledSectionTitle>
        <StyledTable>
          <thead>
            <tr>
              <StyledTableHead>Item</StyledTableHead>
              <StyledTableHead>Description</StyledTableHead>
              <StyledTableHead style={{ textAlign: 'right' }}>
                Qty
              </StyledTableHead>
              <StyledTableHead style={{ textAlign: 'right' }}>
                Unit Price
              </StyledTableHead>
              <StyledTableHead style={{ textAlign: 'right' }}>
                Discount
              </StyledTableHead>
              <StyledTableHead style={{ textAlign: 'right' }}>
                Total
              </StyledTableHead>
            </tr>
          </thead>
          <tbody>
            {sortedLineItems.length === 0 ? (
              <tr>
                <StyledTableCell colSpan={6}>
                  No line items on this quote.
                </StyledTableCell>
              </tr>
            ) : (
              sortedLineItems.map((lineItem) => (
                <tr key={lineItem.id}>
                  <StyledTableCell>{lineItem.name}</StyledTableCell>
                  <StyledTableCell>
                    {lineItem.description ?? ''}
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
        </StyledTable>

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

        {isDefined(actionError) && (
          <StyledFormError>{actionError}</StyledFormError>
        )}

        {canTakeAction && (
          <StyledActionRow>
            <StyledSecondaryButton
              onClick={handleReject}
              disabled={isSubmitting}
            >
              Reject
            </StyledSecondaryButton>
            <StyledPrimaryButton onClick={handleAccept} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Accept'}
            </StyledPrimaryButton>
          </StyledActionRow>
        )}
      </StyledCard>
    </StyledContainer>
  );
};
