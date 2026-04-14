import gql from 'graphql-tag';

export const SEND_CAMPAIGN = gql`
  mutation SendCampaign($input: SendCampaignInput!) {
    sendCampaign(input: $input) {
      success
      error
    }
  }
`;
