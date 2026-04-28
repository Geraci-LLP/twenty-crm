import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

type PortalDocumentRow = {
  id: string;
  name: string;
  status: string | null;
  sharedAt: string | null;
  viewCount: number | null;
  slug: string | null;
  workspaceId: string | null;
};

const MY_DOCUMENTS_QUERY = gql`
  query PortalMyDocuments {
    myDocuments {
      id
      name
      status
      sharedAt
      viewCount
      slug
      workspaceId
    }
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  margin: 0 auto;
  max-width: 1100px;
`;

const StyledPageTitle = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
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

const StyledLink = styled.a`
  color: ${themeCssVariables.color.blue};
  font-size: ${themeCssVariables.font.size.sm};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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

const buildDocumentUrl = (doc: PortalDocumentRow): string | null => {
  if (!isDefined(doc.workspaceId) || !isDefined(doc.slug)) {
    return null;
  }

  return `${REACT_APP_SERVER_BASE_URL}/docs/${doc.workspaceId}/${doc.slug}`;
};

export const PortalDocuments = () => {
  const { data, loading } = useQuery<{
    myDocuments: PortalDocumentRow[] | null;
  }>(MY_DOCUMENTS_QUERY, { errorPolicy: 'all' });

  const documents = data?.myDocuments ?? [];

  const handleRowClick = (doc: PortalDocumentRow) => {
    const url = buildDocumentUrl(doc);

    if (isDefined(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <StyledContainer>
      <StyledPageTitle>Documents</StyledPageTitle>

      <StyledTable>
        <thead>
          <tr>
            <StyledHeadCell>Name</StyledHeadCell>
            <StyledHeadCell>Status</StyledHeadCell>
            <StyledHeadCell>Shared</StyledHeadCell>
            <StyledHeadCell>Views</StyledHeadCell>
            <StyledHeadCell>Link</StyledHeadCell>
          </tr>
        </thead>
        <tbody>
          {loading && documents.length === 0 && (
            <tr>
              <StyledCell colSpan={5}>
                <StyledEmptyState>Loading documents...</StyledEmptyState>
              </StyledCell>
            </tr>
          )}

          {!loading && documents.length === 0 && (
            <tr>
              <StyledCell colSpan={5}>
                <StyledEmptyState>
                  No documents have been shared with you yet.
                </StyledEmptyState>
              </StyledCell>
            </tr>
          )}

          {documents.map((doc) => {
            const url = buildDocumentUrl(doc);

            return (
              <StyledBodyRow key={doc.id} onClick={() => handleRowClick(doc)}>
                <StyledCell>{doc.name}</StyledCell>
                <StyledCell>{doc.status ?? '—'}</StyledCell>
                <StyledCell>{formatDate(doc.sharedAt)}</StyledCell>
                <StyledCell>{doc.viewCount ?? 0}</StyledCell>
                <StyledCell onClick={(event) => event.stopPropagation()}>
                  {isDefined(url) ? (
                    <StyledLink
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </StyledLink>
                  ) : (
                    '—'
                  )}
                </StyledCell>
              </StyledBodyRow>
            );
          })}
        </tbody>
      </StyledTable>
    </StyledContainer>
  );
};
