import {
  type ActorMetadata,
  type EmailsMetadata,
  FieldMetadataType,
  type FullNameMetadata,
  type LinksMetadata,
  type PhonesMetadata,
} from 'twenty-shared/types';

import { type FileOutput } from 'src/engine/api/common/common-args-processors/data-arg-processor/types/file-item.type';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type BookingWorkspaceEntity } from 'src/modules/meeting-scheduler/standard-objects/booking.workspace-entity';
import { type ChatConversationWorkspaceEntity } from 'src/modules/live-chat/standard-objects/chat-conversation.workspace-entity';
import { type SequenceEnrollmentWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence-enrollment.workspace-entity';
import { type CalendarEventParticipantWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-event-participant.workspace-entity';
import { type CampaignRecipientWorkspaceEntity } from 'src/modules/campaign/standard-objects/campaign-recipient.workspace-entity';
import { type DripEnrollmentWorkspaceEntity } from 'src/modules/campaign/standard-objects/drip-enrollment.workspace-entity';
import { type DocumentSharingLinkWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-sharing-link.workspace-entity';
import { type DocumentViewWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-view.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type FavoriteWorkspaceEntity } from 'src/modules/favorite/standard-objects/favorite.workspace-entity';
import { type MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const NAME_FIELD_NAME = 'name';
const EMAILS_FIELD_NAME = 'emails';
const PHONES_FIELD_NAME = 'phones';
const JOB_TITLE_FIELD_NAME = 'jobTitle';

export const SEARCH_FIELDS_FOR_PERSON: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.FULL_NAME },
  { name: EMAILS_FIELD_NAME, type: FieldMetadataType.EMAILS },
  { name: PHONES_FIELD_NAME, type: FieldMetadataType.PHONES },
  { name: JOB_TITLE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class PersonWorkspaceEntity extends BaseWorkspaceEntity {
  name: FullNameMetadata | null;
  emails: EmailsMetadata;
  linkedinLink: LinksMetadata | null;
  xLink: LinksMetadata | null;
  jobTitle: string | null;
  /** @deprecated Use `phones` field instead */
  phone: string | null;
  phones: PhonesMetadata;
  city: string | null;
  /** @deprecated Use `avatarFile` field instead */
  avatarUrl: string | null;
  avatarFile: FileOutput[] | null;
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  pointOfContactForOpportunities: EntityRelation<OpportunityWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  favorites: EntityRelation<FavoriteWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  messageParticipants: EntityRelation<MessageParticipantWorkspaceEntity[]>;
  calendarEventParticipants: EntityRelation<
    CalendarEventParticipantWorkspaceEntity[]
  >;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
  campaignRecipients: EntityRelation<CampaignRecipientWorkspaceEntity[]>;
  dripEnrollments: EntityRelation<DripEnrollmentWorkspaceEntity[]>;
  documentSharingLinks: EntityRelation<DocumentSharingLinkWorkspaceEntity[]>;
  documentViews: EntityRelation<DocumentViewWorkspaceEntity[]>;
  bookings: EntityRelation<BookingWorkspaceEntity[]>;
  chatConversations: EntityRelation<ChatConversationWorkspaceEntity[]>;
  sequenceEnrollments: EntityRelation<SequenceEnrollmentWorkspaceEntity[]>;
  // Free-form tag list for segmenting people. Stored as a string array
  // (no separate Tag entity) to keep the schema simple and queryable
  // via array-contains filters. Auto-applied when a form has
  // `tagsToApplyOnSubmission` set and the form auto-creates a person.
  tags: string[] | null;
  searchVector: string;
}
