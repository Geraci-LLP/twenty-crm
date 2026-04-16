import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type DocumentSharingLinkWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-sharing-link.workspace-entity';
import { type DocumentViewWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-view.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_TRACKED_DOCUMENT: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum TrackedDocumentStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class TrackedDocumentWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  name: string;
  description: string | null;
  mimeType: string | null;
  pageCount: number | null;
  status: string;
  requireEmail: boolean;
  enableDownload: boolean;
  expiresAt: Date | null;
  viewCount: number;
  uniqueViewerCount: number;
  notifyOnView: boolean;
  notificationEmail: string | null;
  sharingLinks: EntityRelation<DocumentSharingLinkWorkspaceEntity[]>;
  documentViews: EntityRelation<DocumentViewWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  searchVector: string;
}
