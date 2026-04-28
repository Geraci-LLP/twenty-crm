import gql from 'graphql-tag';

// Hand-written until codegen regenerates against the new server-side
// resolver added in PR 35. Mints a short-lived signed URL that anyone
// can open to view a preview of a draft campaign body.
export const GENERATE_CAMPAIGN_PREVIEW_LINK = gql`
  mutation GenerateCampaignPreviewLink(
    $input: GenerateCampaignPreviewLinkInput!
  ) {
    generateCampaignPreviewLink(input: $input) {
      success
      url
      error
    }
  }
`;
