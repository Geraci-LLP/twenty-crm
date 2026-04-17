import { ViewType } from 'twenty-shared/types';

import { createEmptyFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant';
import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { addFlatEntityToFlatEntityMapsOrThrow } from 'src/engine/metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { computeStandardAttachmentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-attachment-views.util';
import { computeStandardBlocklistViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-blocklist-views.util';
import { computeStandardBookingViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-booking-views.util';
import { computeStandardCampaignViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-campaign-views.util';
import { computeStandardCampaignRecipientViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-campaign-recipient-views.util';
import { computeStandardCampaignTemplateViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-campaign-template-views.util';
import { computeStandardChatConversationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-chat-conversation-views.util';
import { computeStandardChatMessageViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-chat-message-views.util';
import { computeStandardChatWidgetViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-chat-widget-views.util';
import { computeStandardCalendarChannelViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-channel-views.util';
import { computeStandardCalendarChannelEventAssociationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-channel-event-association-views.util';
import { computeStandardCalendarEventParticipantViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-event-participant-views.util';
import { computeStandardCalendarEventViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-calendar-event-views.util';
import { computeStandardCompanyViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-company-views.util';
import { computeStandardConnectedAccountViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-connected-account-views.util';
import { computeStandardDashboardViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-dashboard-views.util';
import { computeStandardDripCampaignViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-drip-campaign-views.util';
import { computeStandardDripEnrollmentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-drip-enrollment-views.util';
import { computeStandardFormViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-form-views.util';
import { computeStandardFormSubmissionViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-form-submission-views.util';
import { computeStandardLandingPageViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-landing-page-views.util';
import { computeStandardTrackedDocumentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-tracked-document-views.util';
import { computeStandardDocumentSharingLinkViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-document-sharing-link-views.util';
import { computeStandardDocumentViewViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-document-view-views.util';
import { computeStandardFavoriteFolderViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-favorite-folder-views.util';
import { computeStandardFavoriteViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-favorite-views.util';
import { computeStandardMessageChannelMessageAssociationMessageFolderViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-channel-message-association-message-folder-views.util';
import { computeStandardMessageChannelMessageAssociationViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-channel-message-association-views.util';
import { computeStandardMessageChannelViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-channel-views.util';
import { computeStandardMessageFolderViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-folder-views.util';
import { computeStandardMessageParticipantViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-participant-views.util';
import { computeStandardMessageThreadViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-thread-views.util';
import { computeStandardMessageViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-message-views.util';
import { computeStandardMeetingTypeViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-meeting-type-views.util';
import { computeStandardNoteTargetViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-note-target-views.util';
import { computeStandardNoteViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-note-views.util';
import { computeStandardOpportunityViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-opportunity-views.util';
import { computeStandardPersonViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-person-views.util';
import { computeStandardQuoteViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-quote-views.util';
import { computeStandardQuoteLineItemViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-quote-line-item-views.util';
import { computeStandardSequenceViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-sequence-views.util';
import { computeStandardSequenceEnrollmentViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-sequence-enrollment-views.util';
import { computeStandardSequenceStepViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-sequence-step-views.util';
import { computeStandardTaskTargetViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-task-target-views.util';
import { computeStandardTaskViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-task-views.util';
import { computeStandardTimelineActivityViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-timeline-activity-views.util';
import { computeStandardWorkflowAutomatedTriggerViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-automated-trigger-views.util';
import { computeStandardWorkflowRunViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-run-views.util';
import { computeStandardWorkflowVersionViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-version-views.util';
import { computeStandardWorkflowViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workflow-views.util';
import { computeStandardWorkspaceMemberViews } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/compute-standard-workspace-member-views.util';
import { type CreateStandardViewArgs } from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

type StandardViewBuilder<P extends AllStandardObjectName> = (
  args: Omit<CreateStandardViewArgs<P>, 'context'>,
) => Record<string, FlatView>;

const STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME = {
  attachment: computeStandardAttachmentViews,
  blocklist: computeStandardBlocklistViews,
  booking: computeStandardBookingViews,
  campaign: computeStandardCampaignViews,
  campaignRecipient: computeStandardCampaignRecipientViews,
  campaignTemplate: computeStandardCampaignTemplateViews,
  chatConversation: computeStandardChatConversationViews,
  chatMessage: computeStandardChatMessageViews,
  chatWidget: computeStandardChatWidgetViews,
  calendarChannel: computeStandardCalendarChannelViews,
  calendarChannelEventAssociation:
    computeStandardCalendarChannelEventAssociationViews,
  calendarEvent: computeStandardCalendarEventViews,
  calendarEventParticipant: computeStandardCalendarEventParticipantViews,
  company: computeStandardCompanyViews,
  connectedAccount: computeStandardConnectedAccountViews,
  dashboard: computeStandardDashboardViews,
  dripCampaign: computeStandardDripCampaignViews,
  dripEnrollment: computeStandardDripEnrollmentViews,
  form: computeStandardFormViews,
  formSubmission: computeStandardFormSubmissionViews,
  landingPage: computeStandardLandingPageViews,
  trackedDocument: computeStandardTrackedDocumentViews,
  documentSharingLink: computeStandardDocumentSharingLinkViews,
  documentView: computeStandardDocumentViewViews,
  favorite: computeStandardFavoriteViews,
  favoriteFolder: computeStandardFavoriteFolderViews,
  message: computeStandardMessageViews,
  messageChannel: computeStandardMessageChannelViews,
  messageChannelMessageAssociation:
    computeStandardMessageChannelMessageAssociationViews,
  messageChannelMessageAssociationMessageFolder:
    computeStandardMessageChannelMessageAssociationMessageFolderViews,
  messageFolder: computeStandardMessageFolderViews,
  messageParticipant: computeStandardMessageParticipantViews,
  messageThread: computeStandardMessageThreadViews,
  meetingType: computeStandardMeetingTypeViews,
  note: computeStandardNoteViews,
  noteTarget: computeStandardNoteTargetViews,
  opportunity: computeStandardOpportunityViews,
  person: computeStandardPersonViews,
  quote: computeStandardQuoteViews,
  quoteLineItem: computeStandardQuoteLineItemViews,
  sequence: computeStandardSequenceViews,
  sequenceEnrollment: computeStandardSequenceEnrollmentViews,
  sequenceStep: computeStandardSequenceStepViews,
  task: computeStandardTaskViews,
  taskTarget: computeStandardTaskTargetViews,
  timelineActivity: computeStandardTimelineActivityViews,
  workflow: computeStandardWorkflowViews,
  workflowAutomatedTrigger: computeStandardWorkflowAutomatedTriggerViews,
  workflowRun: computeStandardWorkflowRunViews,
  workflowVersion: computeStandardWorkflowVersionViews,
  workspaceMember: computeStandardWorkspaceMemberViews,
} as const satisfies {
  [P in AllStandardObjectName]?: StandardViewBuilder<P>;
};

export type BuildStandardFlatViewMetadataMapsArgs = Omit<
  CreateStandardViewArgs,
  'context' | 'objectName'
> & {
  shouldIncludeRecordPageLayouts?: boolean;
};

export const buildStandardFlatViewMetadataMaps = ({
  shouldIncludeRecordPageLayouts,
  ...args
}: BuildStandardFlatViewMetadataMapsArgs): FlatEntityMaps<FlatView> => {
  const allViewMetadatas: FlatView[] = (
    Object.keys(
      STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME,
    ) as (keyof typeof STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME)[]
  ).flatMap((objectName) => {
    const builder: StandardViewBuilder<typeof objectName> =
      STANDARD_FLAT_VIEW_METADATA_BUILDERS_BY_OBJECT_NAME[objectName];

    const result = builder({
      ...args,
      objectName,
    });

    return Object.values(result).filter(
      (view) =>
        shouldIncludeRecordPageLayouts || view.type !== ViewType.FIELDS_WIDGET,
    );
  });

  let flatViewMaps = createEmptyFlatEntityMaps();

  for (const viewMetadata of allViewMetadatas) {
    flatViewMaps = addFlatEntityToFlatEntityMapsOrThrow({
      flatEntity: viewMetadata,
      flatEntityMaps: flatViewMaps,
    });
  }

  return flatViewMaps;
};
