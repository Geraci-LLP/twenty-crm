import gql from 'graphql-tag';

export const SEND_TEST_EMAIL = gql`
  mutation SendTestEmail($input: SendTestEmailInput!) {
    sendTestEmail(input: $input) {
      success
      error
    }
  }
`;
