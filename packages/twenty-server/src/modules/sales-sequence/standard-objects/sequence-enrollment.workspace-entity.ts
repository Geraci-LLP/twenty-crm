import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type SequenceWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export const SEARCH_FIELDS_FOR_SEQUENCE_ENROLLMENT: FieldTypeAndNameMetadata[] =
  [];

export enum SequenceEnrollmentStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  BOUNCED = 'BOUNCED',
}

export class SequenceEnrollmentWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  status: string;
  currentStepIndex: number;
  enrolledAt: Date;
  completedAt: Date | null;
  lastStepAt: Date | null;
  sequence: EntityRelation<SequenceWorkspaceEntity>;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  searchVector: string;
}
