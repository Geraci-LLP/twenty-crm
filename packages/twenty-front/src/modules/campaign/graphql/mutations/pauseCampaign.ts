import gql from 'graphql-tag';

export const PAUSE_CAMPAIGN = gql`
  mutation PauseCampaign($input: PauseCampaignInput!) {
    pauseCampaign(input: $input) {
      success
      error
    }
  }
`;
