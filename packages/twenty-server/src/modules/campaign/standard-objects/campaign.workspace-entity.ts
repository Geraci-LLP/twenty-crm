import { FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CampaignRecipientWorkspaceEntity } from 'src/modules/campaign/standard-objects/campaign-recipient.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_CAMPAIGN: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  PAUSED = 'PAUSED',
}

export class CampaignWorkspaceEntity extends BaseWorkspaceEntity {
  name: string | null;
  subject: string | null;
  bodyHtml: string | null;
  status: string;
  scheduledDate: string | null;
  fromEmail: string | null;
  fromName: string | null;
  recipientCount: number;
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
  campaignRecipients: EntityRelation<CampaignRecipientWorkspaceEntity[]>;
  searchVector: string;
}
