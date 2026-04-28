import { type FieldMetadataType } from 'twenty-shared/types';

import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { addFlatEntityToFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { buildAttachmentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-attachment-standard-flat-field-metadata.util';
import { buildBlocklistStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-blocklist-standard-flat-field-metadata.util';
import { buildBookingStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-booking-standard-flat-field-metadata.util';
import { buildCampaignStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-campaign-standard-flat-field-metadata.util';
import { buildCampaignRecipientStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-campaign-recipient-standard-flat-field-metadata.util';
import { buildCampaignTemplateStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-campaign-template-standard-flat-field-metadata.util';
import { buildChatConversationStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-chat-conversation-standard-flat-field-metadata.util';
import { buildChatMessageStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-chat-message-standard-flat-field-metadata.util';
import { buildChatWidgetStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-chat-widget-standard-flat-field-metadata.util';
import { buildCalendarChannelEventAssociationStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-calendar-channel-event-association-standard-flat-field-metadata.util';
import { buildCalendarChannelStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-calendar-channel-standard-flat-field-metadata.util';
import { buildCalendarEventParticipantStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-calendar-event-participant-standard-flat-field-metadata.util';
import { buildCalendarEventStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-calendar-event-standard-flat-field-metadata.util';
import { buildCompanyStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-company-standard-flat-field-metadata.util';
import { buildConnectedAccountStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-connected-account-standard-flat-field-metadata.util';
import { buildDashboardStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-dashboard-standard-flat-field-metadata.util';
import { buildDripCampaignStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-drip-campaign-standard-flat-field-metadata.util';
import { buildDripEnrollmentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-drip-enrollment-standard-flat-field-metadata.util';
import { buildFormStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-form-standard-flat-field-metadata.util';
import { buildFormSubmissionStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-form-submission-standard-flat-field-metadata.util';
import { buildLandingPageStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-landing-page-standard-flat-field-metadata.util';
import { buildTrackedDocumentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-tracked-document-standard-flat-field-metadata.util';
import { buildDocumentSharingLinkStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-document-sharing-link-standard-flat-field-metadata.util';
import { buildDocumentViewStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-document-view-standard-flat-field-metadata.util';
import { buildFavoriteFolderStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-favorite-folder-standard-flat-field-metadata.util';
import { buildFavoriteStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-favorite-standard-flat-field-metadata.util';
import { buildMessageChannelMessageAssociationMessageFolderStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-channel-message-association-message-folder-standard-flat-field-metadata.util';
import { buildMessageChannelStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-channel-standard-flat-field-metadata.util';
import { buildMessageChannelMessageAssociationStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-channel-message-association-standard-flat-field-metadata.util';
import { buildMessageFolderStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-folder-standard-flat-field-metadata.util';
import { buildMessageParticipantStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-participant-standard-flat-field-metadata.util';
import { buildMessageStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-standard-flat-field-metadata.util';
import { buildMessageThreadStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-message-thread-standard-flat-field-metadata.util';
import { buildMeetingTypeStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-meeting-type-standard-flat-field-metadata.util';
import { buildNoteStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-note-standard-flat-field-metadata.util';
import { buildNoteTargetStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-note-target-standard-flat-field-metadata.util';
import { buildOpportunityStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-opportunity-standard-flat-field-metadata.util';
import { buildPersonStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-person-standard-flat-field-metadata.util';
import { buildQuoteStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-quote-standard-flat-field-metadata.util';
import { buildQuoteLineItemStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-quote-line-item-standard-flat-field-metadata.util';
import { buildSequenceStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-sequence-standard-flat-field-metadata.util';
import { buildSequenceEnrollmentStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-sequence-enrollment-standard-flat-field-metadata.util';
import { buildSequenceStepStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-sequence-step-standard-flat-field-metadata.util';
import { buildTaskStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-task-standard-flat-field-metadata.util';
import { buildTaskTargetStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-task-target-standard-flat-field-metadata.util';
import { buildTimelineActivityStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-timeline-activity-standard-flat-field-metadata.util';
import { buildWorkflowAutomatedTriggerStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workflow-automated-trigger-standard-flat-field-metadata.util';
import { buildWorkflowRunStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workflow-run-standard-flat-field-metadata.util';
import { buildWorkflowStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workflow-standard-flat-field-metadata.util';
import { buildWorkflowVersionStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workflow-version-standard-flat-field-metadata.util';
import { buildWorkspaceMemberStandardFlatFieldMetadatas } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-workspace-member-standard-flat-field-metadata.util';
import { type CreateStandardFieldArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/create-standard-field-flat-metadata.util';

type StandardFieldBuilder<P extends AllStandardObjectName> = (
  args: Omit<CreateStandardFieldArgs<P, FieldMetadataType>, 'context'>,
) => Record<string, FlatFieldMetadata>;

const STANDARD_FLAT_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME = {
  attachment: buildAttachmentStandardFlatFieldMetadatas,
  blocklist: buildBlocklistStandardFlatFieldMetadatas,
  booking: buildBookingStandardFlatFieldMetadatas,
  campaign: buildCampaignStandardFlatFieldMetadatas,
  campaignRecipient: buildCampaignRecipientStandardFlatFieldMetadatas,
  campaignTemplate: buildCampaignTemplateStandardFlatFieldMetadatas,
  chatConversation: buildChatConversationStandardFlatFieldMetadatas,
  chatMessage: buildChatMessageStandardFlatFieldMetadatas,
  chatWidget: buildChatWidgetStandardFlatFieldMetadatas,
  calendarChannel: buildCalendarChannelStandardFlatFieldMetadatas,
  calendarChannelEventAssociation:
    buildCalendarChannelEventAssociationStandardFlatFieldMetadatas,
  calendarEventParticipant:
    buildCalendarEventParticipantStandardFlatFieldMetadatas,
  calendarEvent: buildCalendarEventStandardFlatFieldMetadatas,
  company: buildCompanyStandardFlatFieldMetadatas,
  connectedAccount: buildConnectedAccountStandardFlatFieldMetadatas,
  dashboard: buildDashboardStandardFlatFieldMetadatas,
  dripCampaign: buildDripCampaignStandardFlatFieldMetadatas,
  dripEnrollment: buildDripEnrollmentStandardFlatFieldMetadatas,
  form: buildFormStandardFlatFieldMetadatas,
  formSubmission: buildFormSubmissionStandardFlatFieldMetadatas,
  landingPage: buildLandingPageStandardFlatFieldMetadatas,
  trackedDocument: buildTrackedDocumentStandardFlatFieldMetadatas,
  documentSharingLink: buildDocumentSharingLinkStandardFlatFieldMetadatas,
  documentView: buildDocumentViewStandardFlatFieldMetadatas,
  favorite: buildFavoriteStandardFlatFieldMetadatas,
  favoriteFolder: buildFavoriteFolderStandardFlatFieldMetadatas,
  message: buildMessageStandardFlatFieldMetadatas,
  messageChannel: buildMessageChannelStandardFlatFieldMetadatas,
  messageChannelMessageAssociation:
    buildMessageChannelMessageAssociationStandardFlatFieldMetadatas,
  messageChannelMessageAssociationMessageFolder:
    buildMessageChannelMessageAssociationMessageFolderStandardFlatFieldMetadatas,
  messageFolder: buildMessageFolderStandardFlatFieldMetadatas,
  messageParticipant: buildMessageParticipantStandardFlatFieldMetadatas,
  messageThread: buildMessageThreadStandardFlatFieldMetadatas,
  meetingType: buildMeetingTypeStandardFlatFieldMetadatas,
  note: buildNoteStandardFlatFieldMetadatas,
  noteTarget: buildNoteTargetStandardFlatFieldMetadatas,
  opportunity: buildOpportunityStandardFlatFieldMetadatas,
  person: buildPersonStandardFlatFieldMetadatas,
  quote: buildQuoteStandardFlatFieldMetadatas,
  quoteLineItem: buildQuoteLineItemStandardFlatFieldMetadatas,
  sequence: buildSequenceStandardFlatFieldMetadatas,
  sequenceEnrollment: buildSequenceEnrollmentStandardFlatFieldMetadatas,
  sequenceStep: buildSequenceStepStandardFlatFieldMetadatas,
  task: buildTaskStandardFlatFieldMetadatas,
  taskTarget: buildTaskTargetStandardFlatFieldMetadatas,
  timelineActivity: buildTimelineActivityStandardFlatFieldMetadatas,
  workflow: buildWorkflowStandardFlatFieldMetadatas,
  workflowAutomatedTrigger:
    buildWorkflowAutomatedTriggerStandardFlatFieldMetadatas,
  workflowRun: buildWorkflowRunStandardFlatFieldMetadatas,
  workflowVersion: buildWorkflowVersionStandardFlatFieldMetadatas,
  workspaceMember: buildWorkspaceMemberStandardFlatFieldMetadatas,
} satisfies {
  [P in AllStandardObjectName]: StandardFieldBuilder<P>;
};

export const buildStandardFlatFieldMetadataMaps = (
  args: Omit<
    CreateStandardFieldArgs<AllStandardObjectName, FieldMetadataType>,
    'context' | 'objectName'
  >,
): FlatEntityMaps<FlatFieldMetadata> => {
  const allFieldMetadatas: FlatFieldMetadata[] = (
    Object.keys(
      STANDARD_FLAT_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME,
    ) as (keyof typeof STANDARD_FLAT_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME)[]
  ).flatMap((objectName) => {
    const builder: StandardFieldBuilder<typeof objectName> =
      STANDARD_FLAT_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME[objectName];

    const result = builder({
      ...args,
      objectName,
    });

    return Object.values(result);
  });

  let flatFieldMetadataMaps = createEmptyFlatEntityMaps();

  for (const fieldMetadata of allFieldMetadatas) {
    flatFieldMetadataMaps = addFlatEntityToFlatEntityMapsOrThrow({
      flatEntity: fieldMetadata,
      flatEntityMaps: flatFieldMetadataMaps,
    });
  }

  return flatFieldMetadataMaps;
};
