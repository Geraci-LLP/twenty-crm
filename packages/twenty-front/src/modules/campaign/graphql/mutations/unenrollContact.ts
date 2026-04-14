import { gql } from '@apollo/client';

export const UNENROLL_CONTACT = gql`
  mutation UnenrollContact($input: UnenrollContactInput!) {
    unenrollContact(input: $input) {
      success
      error
    }
  }
`;
