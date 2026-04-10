import { gql } from '@apollo/client';

export const CREATE_DRIP_CAMPAIGN = gql`
  mutation CreateDripCampaign($input: CreateDripCampaignInput!) {
    createDripCampaign(input: $input) {
      success
      dripCampaignId
      error
    }
  }
`;
