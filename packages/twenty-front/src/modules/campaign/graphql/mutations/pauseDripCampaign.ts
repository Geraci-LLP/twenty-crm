import { gql } from '@apollo/client';

export const PAUSE_DRIP_CAMPAIGN = gql`
  mutation PauseDripCampaign($input: PauseDripCampaignInput!) {
    pauseDripCampaign(input: $input) {
      success
      error
    }
  }
`;
