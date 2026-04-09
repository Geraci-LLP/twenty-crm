import gql from 'graphql-tag';

export const SAVE_AS_TEMPLATE = gql`
  mutation SaveAsTemplate($input: SaveAsTemplateInput!) {
    saveAsTemplate(input: $input) {
      success
      error
    }
  }
`;
