import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CampaignWorkspaceEntity } from 'src/modules/campaign/standard-objects/campaign.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export enum CampaignRecipientStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED',
  BOUNCED = 'BOUNCED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}

export class CampaignRecipientWorkspaceEntity extends BaseWorkspaceEntity {
  status: string;
  sentAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  campaign: EntityRelation<CampaignWorkspaceEntity>;
  campaignId: string;
  person: EntityRelation<PersonWorkspaceEntity> | null;
  personId: string | null;
}
