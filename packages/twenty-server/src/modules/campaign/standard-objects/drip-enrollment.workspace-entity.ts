import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type DripCampaignWorkspaceEntity } from 'src/modules/campaign/standard-objects/drip-campaign.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export const SEARCH_FIELDS_FOR_DRIP_ENROLLMENT: FieldTypeAndNameMetadata[] = [];

export enum DripEnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

export class DripEnrollmentWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  status: string;
  currentStepIndex: number;
  enrolledAt: string | null;
  completedAt: string | null;
  dripCampaign: EntityRelation<DripCampaignWorkspaceEntity>;
  dripCampaignId: string;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
  workflowRunId: string | null;
  searchVector: string;
}
