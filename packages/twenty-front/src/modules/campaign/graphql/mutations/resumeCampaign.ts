import gql from 'graphql-tag';

export const RESUME_CAMPAIGN = gql`
  mutation ResumeCampaign($input: ResumeCampaignInput!) {
    resumeCampaign(input: $input) {
      success
      error
    }
  }
`;
