import { gql } from '@apollo/client';

export const GENERATE_DASHBOARD_TOKEN = gql`
  mutation generateDashboardToken {
    generateDashboardToken {
      token
      expiresAt
    }
  }
`;
