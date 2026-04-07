import { FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_CAMPAIGN_TEMPLATE: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum CampaignTemplateCategory {
  NEWSLETTER = 'NEWSLETTER',
  FOLLOW_UP = 'FOLLOW_UP',
  CONFERENCE = 'CONFERENCE',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  CUSTOM = 'CUSTOM',
}

export class CampaignTemplateWorkspaceEntity extends BaseWorkspaceEntity {
  name: string | null;
  subject: string | null;
  bodyHtml: string | null;
  category: string;
  thumbnailUrl: string | null;
  searchVector: string;
}
