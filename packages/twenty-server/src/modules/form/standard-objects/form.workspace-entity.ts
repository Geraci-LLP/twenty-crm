import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type FormSubmissionWorkspaceEntity } from 'src/modules/form/standard-objects/form-submission.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_FORM: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum FormStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class FormWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  name: string | null;
  description: string | null;
  status: string;
  fieldsConfig: object | null;
  submissionCount: number;
  thankYouMessage: string | null;
  notifyOnSubmission: boolean;
  notificationEmail: string | null;
  formSubmissions: EntityRelation<FormSubmissionWorkspaceEntity[]>;
  searchVector: string;
}
