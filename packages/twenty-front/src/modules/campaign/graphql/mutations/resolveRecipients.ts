import gql from 'graphql-tag';

export const RESOLVE_RECIPIENTS = gql`
  mutation ResolveRecipients($input: ResolveRecipientsInput!) {
    resolveRecipients(input: $input) {
      success
      created
      skipped
      total
      error
    }
  }
`;
