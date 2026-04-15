import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type SequenceWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence.workspace-entity';

export enum SequenceStepType {
  EMAIL = 'EMAIL',
  LINKEDIN_TASK = 'LINKEDIN_TASK',
  CALL_TASK = 'CALL_TASK',
  WAIT = 'WAIT',
}

export class SequenceStepWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  stepOrder: number;
  type: string;
  delayDays: number;
  subject: string | null;
  bodyHtml: string | null;
  sequence: EntityRelation<SequenceWorkspaceEntity>;
}
