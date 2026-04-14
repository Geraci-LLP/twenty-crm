import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type FormWorkspaceEntity } from 'src/modules/form/standard-objects/form.workspace-entity';

const SUBMITTER_EMAIL_FIELD_NAME = 'submitterEmail';

export const SEARCH_FIELDS_FOR_FORM_SUBMISSION: FieldTypeAndNameMetadata[] = [
  { name: SUBMITTER_EMAIL_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum FormSubmissionSource {
  DIRECT = 'DIRECT',
  LANDING_PAGE = 'LANDING_PAGE',
  EMBED = 'EMBED',
}

export class FormSubmissionWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  data: object | null;
  submitterEmail: string | null;
  submitterName: string | null;
  source: string;
  form: EntityRelation<FormWorkspaceEntity>;
  searchVector: string;
}
