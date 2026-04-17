import { gql, useQuery } from '@apollo/client';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

// Top-level dashboard queries — each returns a list of the client-scoped items.
// The dashboard only needs counts, so we select the minimum set of fields.
const DASHBOARD_QUERIES = gql`
  query PortalDashboardCounts {
    myQuotes {
      id
    }
    myDocuments {
      id
    }
    myOpportunities {
      id
    }
  }
`;

type DashboardData = {
  myQuotes: Array<{ id: string }> | null;
  myDocuments: Array<{ id: string }> | null;
  myOpportunities: Array<{ id: string }> | null;
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
  margin: 0 auto;
  max-width: 900px;
`;

const StyledPageTitle = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledCardGrid = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[4]};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const StyledSummaryCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledCardLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  margin-bottom: ${themeCssVariables.spacing[1]};
  text-transform: uppercase;
`;

const StyledCardValue = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledActivitySection = styled.section`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledSectionTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0 0 ${themeCssVariables.spacing[3]} 0;
`;

const StyledEmptyActivity = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

export const PortalDashboard = () => {
  const { data, loading } = useQuery<DashboardData>(DASHBOARD_QUERIES, {
    errorPolicy: 'all',
  });

  const quoteCount = data?.myQuotes?.length ?? 0;
  const documentCount = data?.myDocuments?.length ?? 0;
  const opportunityCount = data?.myOpportunities?.length ?? 0;

  return (
    <StyledContainer>
      <StyledPageTitle>Dashboard</StyledPageTitle>

      <StyledCardGrid>
        <StyledSummaryCard>
          <StyledCardLabel>Quotes</StyledCardLabel>
          <StyledCardValue>{loading ? '—' : quoteCount}</StyledCardValue>
        </StyledSummaryCard>
        <StyledSummaryCard>
          <StyledCardLabel>Documents</StyledCardLabel>
          <StyledCardValue>{loading ? '—' : documentCount}</StyledCardValue>
        </StyledSummaryCard>
        <StyledSummaryCard>
          <StyledCardLabel>Opportunities</StyledCardLabel>
          <StyledCardValue>{loading ? '—' : opportunityCount}</StyledCardValue>
        </StyledSummaryCard>
      </StyledCardGrid>

      <StyledActivitySection>
        <StyledSectionTitle>Recent Activity</StyledSectionTitle>
        <StyledEmptyActivity>
          Recent activity will appear here as documents and quotes are shared
          with you.
        </StyledEmptyActivity>
      </StyledActivitySection>
    </StyledContainer>
  );
};
