import { type ActorMetadata } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type TrackedDocumentWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/tracked-document.workspace-entity';
import { type DocumentSharingLinkWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-sharing-link.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export const SEARCH_FIELDS_FOR_DOCUMENT_VIEW: FieldTypeAndNameMetadata[] = [];

export class DocumentViewWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  viewerEmail: string | null;
  viewerName: string | null;
  viewedAt: Date;
  durationSeconds: number | null;
  pagesViewed: number | null;
  completionPercent: number | null;
  trackedDocument: EntityRelation<TrackedDocumentWorkspaceEntity>;
  documentSharingLink: EntityRelation<DocumentSharingLinkWorkspaceEntity>;
  person: EntityRelation<PersonWorkspaceEntity>;
  searchVector: string;
}
