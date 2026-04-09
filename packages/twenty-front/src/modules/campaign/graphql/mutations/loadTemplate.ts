import gql from 'graphql-tag';

export const LOAD_TEMPLATE = gql`
  mutation LoadTemplate($input: LoadTemplateInput!) {
    loadTemplate(input: $input) {
      success
      error
    }
  }
`;
