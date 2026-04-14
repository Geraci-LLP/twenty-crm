import gql from 'graphql-tag';

export const SCHEDULE_CAMPAIGN = gql`
  mutation ScheduleCampaign($input: ScheduleCampaignInput!) {
    scheduleCampaign(input: $input) {
      success
      error
    }
  }
`;
