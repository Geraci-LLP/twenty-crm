import { gql } from '@apollo/client';

export const ACTIVATE_DRIP_CAMPAIGN = gql`
  mutation ActivateDripCampaign($input: ActivateDripCampaignInput!) {
    activateDripCampaign(input: $input) {
      success
      error
    }
  }
`;
