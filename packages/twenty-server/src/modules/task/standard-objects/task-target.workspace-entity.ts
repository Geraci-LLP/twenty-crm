import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type CustomWorkspaceEntity } from 'src/engine/twenty-orm/custom.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type TrackedDocumentWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/tracked-document.workspace-entity';
import { type ChatWidgetWorkspaceEntity } from 'src/modules/live-chat/standard-objects/chat-widget.workspace-entity';
import { type MeetingTypeWorkspaceEntity } from 'src/modules/meeting-scheduler/standard-objects/meeting-type.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type SequenceWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence.workspace-entity';
import { type TaskWorkspaceEntity } from 'src/modules/task/standard-objects/task.workspace-entity';

export class TaskTargetWorkspaceEntity extends BaseWorkspaceEntity {
  task: EntityRelation<TaskWorkspaceEntity> | null;
  taskId: string | null;
  targetPerson: EntityRelation<PersonWorkspaceEntity> | null;
  targetPersonId: string | null;
  targetCompany: EntityRelation<CompanyWorkspaceEntity> | null;
  targetCompanyId: string | null;
  targetOpportunity: EntityRelation<OpportunityWorkspaceEntity> | null;
  targetOpportunityId: string | null;
  targetTrackedDocument: EntityRelation<TrackedDocumentWorkspaceEntity> | null;
  targetTrackedDocumentId: string | null;
  targetMeetingType: EntityRelation<MeetingTypeWorkspaceEntity> | null;
  targetMeetingTypeId: string | null;
  targetChatWidget: EntityRelation<ChatWidgetWorkspaceEntity> | null;
  targetChatWidgetId: string | null;
  targetSequence: EntityRelation<SequenceWorkspaceEntity> | null;
  targetSequenceId: string | null;
  custom: EntityRelation<CustomWorkspaceEntity>;
}
