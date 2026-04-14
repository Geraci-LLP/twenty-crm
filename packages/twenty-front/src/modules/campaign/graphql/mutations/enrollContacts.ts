import { gql } from '@apollo/client';

export const ENROLL_CONTACTS = gql`
  mutation EnrollContacts($input: EnrollContactsInput!) {
    enrollContacts(input: $input) {
      success
      enrolled
      skipped
      error
    }
  }
`;
