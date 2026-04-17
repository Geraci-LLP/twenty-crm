import { gql, useQuery } from '@apollo/client';
import { styled } from '@linaria/react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

type PortalQuoteStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

type PortalQuoteRow = {
  id: string;
  quoteNumber: string;
  name: string | null;
  status: PortalQuoteStatus;
  issueDate: string | null;
  expiryDate: string | null;
  total: number;
  currency: string | null;
};

const MY_QUOTES_QUERY = gql`
  query PortalMyQuotes {
    myQuotes {
      id
      quoteNumber
      name
      status
      issueDate
      expiryDate
      total
      currency
    }
  }
`;

const STATUS_OPTIONS: Array<{
  value: PortalQuoteStatus | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'VIEWED', label: 'Viewed' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'EXPIRED', label: 'Expired' },
];

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  margin: 0 auto;
  max-width: 1100px;
`;

const StyledHeaderRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const StyledPageTitle = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledFilterSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledTable = styled.table`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-collapse: collapse;
  border-radius: ${themeCssVariables.border.radius.md};
  overflow: hidden;
  width: 100%;
`;

const StyledHeadCell = styled.th`
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: left;
  text-transform: uppercase;
`;

const StyledBodyRow = styled.tr`
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: ${themeCssVariables.background.secondary};
  }
`;

const StyledCell = styled.td`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledStatusBadge = styled.span<{ statusColor: string }>`
  background: ${({ statusColor }) => statusColor};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  display: inline-block;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  text-transform: uppercase;
`;

const StyledEmptyState = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[6]};
  text-align: center;
`;

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
    month: 'short',
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

const getStatusColor = (status: PortalQuoteStatus): string => {
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

export const PortalQuotes = () => {
  const navigate = useNavigate();
  const { data, loading } = useQuery<{ myQuotes: PortalQuoteRow[] | null }>(
    MY_QUOTES_QUERY,
    { errorPolicy: 'all' },
  );

  const [statusFilter, setStatusFilter] = useState<PortalQuoteStatus | 'ALL'>(
    'ALL',
  );

  const filteredQuotes = useMemo(() => {
    const quotes = data?.myQuotes ?? [];

    if (statusFilter === 'ALL') {
      return quotes;
    }

    return quotes.filter((quote) => quote.status === statusFilter);
  }, [data, statusFilter]);

  const handleRowClick = (quoteId: string) => {
    navigate(AppPath.PortalQuoteDetail.replace(':id', quoteId));
  };

  return (
    <StyledContainer>
      <StyledHeaderRow>
        <StyledPageTitle>Quotes</StyledPageTitle>
        <StyledFilterSelect
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as PortalQuoteStatus | 'ALL')
          }
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledFilterSelect>
      </StyledHeaderRow>

      <StyledTable>
        <thead>
          <tr>
            <StyledHeadCell>Quote #</StyledHeadCell>
            <StyledHeadCell>Name</StyledHeadCell>
            <StyledHeadCell>Status</StyledHeadCell>
            <StyledHeadCell>Issue Date</StyledHeadCell>
            <StyledHeadCell>Expiry Date</StyledHeadCell>
            <StyledHeadCell>Total</StyledHeadCell>
          </tr>
        </thead>
        <tbody>
          {loading && filteredQuotes.length === 0 && (
            <tr>
              <StyledCell colSpan={6}>
                <StyledEmptyState>Loading quotes...</StyledEmptyState>
              </StyledCell>
            </tr>
          )}

          {!loading && filteredQuotes.length === 0 && (
            <tr>
              <StyledCell colSpan={6}>
                <StyledEmptyState>No quotes found.</StyledEmptyState>
              </StyledCell>
            </tr>
          )}

          {filteredQuotes.map((quote) => (
            <StyledBodyRow
              key={quote.id}
              onClick={() => handleRowClick(quote.id)}
            >
              <StyledCell>{quote.quoteNumber}</StyledCell>
              <StyledCell>{quote.name ?? '—'}</StyledCell>
              <StyledCell>
                <StyledStatusBadge statusColor={getStatusColor(quote.status)}>
                  {quote.status}
                </StyledStatusBadge>
              </StyledCell>
              <StyledCell>{formatDate(quote.issueDate)}</StyledCell>
              <StyledCell>{formatDate(quote.expiryDate)}</StyledCell>
              <StyledCell>
                {formatCurrency(quote.total, quote.currency)}
              </StyledCell>
            </StyledBodyRow>
          ))}
        </tbody>
      </StyledTable>
    </StyledContainer>
  );
};
