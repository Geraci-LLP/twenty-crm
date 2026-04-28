import gql from 'graphql-tag';

// Hand-written mutation document for the new uploadMarketingFile resolver
// added in PR 31. Lives outside generated-metadata/graphql.ts because the
// generated file is regenerated only when the front-end codegen runs
// against a live server schema — keeping this manual ensures the new
// mutation is callable in the same deploy that adds the resolver.
//
// The selection mirrors the FileWithSignedUrlDTO fields the existing
// UploadWorkflowFileDocument selects.
export const UPLOAD_MARKETING_FILE = gql`
  mutation UploadMarketingFile($file: Upload!) {
    uploadMarketingFile(file: $file) {
      id
      path
      size
      createdAt
      url
    }
  }
`;
