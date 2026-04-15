import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type TrackedDocumentWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/tracked-document.workspace-entity';
import { type DocumentSharingLinkWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-sharing-link.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

export class DocumentViewWorkspaceEntity extends BaseWorkspaceEntity {
  viewerEmail: string | null;
  viewerName: string | null;
  viewedAt: Date;
  durationSeconds: number | null;
  pagesViewed: number | null;
  completionPercent: number | null;
  trackedDocument: EntityRelation<TrackedDocumentWorkspaceEntity>;
  documentSharingLink: EntityRelation<DocumentSharingLinkWorkspaceEntity>;
  person: EntityRelation<PersonWorkspaceEntity>;
}
