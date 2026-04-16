import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type TrackedDocumentWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/tracked-document.workspace-entity';
import { type DocumentViewWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-view.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

const SLUG_FIELD_NAME = 'slug';

export const SEARCH_FIELDS_FOR_DOCUMENT_SHARING_LINK: FieldTypeAndNameMetadata[] =
  [{ name: SLUG_FIELD_NAME, type: FieldMetadataType.TEXT }];

export class DocumentSharingLinkWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  slug: string;
  isActive: boolean;
  recipientEmail: string | null;
  viewCount: number;
  trackedDocument: EntityRelation<TrackedDocumentWorkspaceEntity>;
  person: EntityRelation<PersonWorkspaceEntity>;
  documentViews: EntityRelation<DocumentViewWorkspaceEntity[]>;
  searchVector: string;
}
