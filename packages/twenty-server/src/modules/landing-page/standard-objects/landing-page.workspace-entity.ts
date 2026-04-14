import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';

const NAME_FIELD_NAME = 'title';

export const SEARCH_FIELDS_FOR_LANDING_PAGE: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum LandingPageStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class LandingPageWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  title: string | null;
  slug: string | null;
  status: string;
  sectionsConfig: object | null;
  metaTitle: string | null;
  metaDescription: string | null;
  headerConfig: object | null;
  footerConfig: object | null;
  viewCount: number;
  searchVector: string;
}
