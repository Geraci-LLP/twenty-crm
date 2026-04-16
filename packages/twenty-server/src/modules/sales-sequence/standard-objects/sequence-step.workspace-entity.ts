import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type SequenceWorkspaceEntity } from 'src/modules/sales-sequence/standard-objects/sequence.workspace-entity';

export const SEARCH_FIELDS_FOR_SEQUENCE_STEP: FieldTypeAndNameMetadata[] = [];

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
  searchVector: string;
}
