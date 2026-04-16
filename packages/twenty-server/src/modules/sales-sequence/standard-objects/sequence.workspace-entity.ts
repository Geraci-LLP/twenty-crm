import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type SequenceStepWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence-step.workspace-entity';
import { type SequenceEnrollmentWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence-enrollment.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_SEQUENCE: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum SequenceStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
}

export class SequenceWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  name: string;
  description: string | null;
  status: string;
  stepCount: number;
  enrollmentCount: number;
  activeEnrollmentCount: number;
  completedCount: number;
  replyRate: number;
  autoEnrollEnabled: boolean;
  pauseOnReply: boolean;
  steps: EntityRelation<SequenceStepWorkspaceEntity[]>;
  enrollments: EntityRelation<SequenceEnrollmentWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  searchVector: string;
}
