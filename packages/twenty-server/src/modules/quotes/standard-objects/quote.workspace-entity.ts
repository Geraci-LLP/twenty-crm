import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type DocumentSharingLinkWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-sharing-link.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type QuoteLineItemWorkspaceEntity } from 'src/modules/quotes/standard-objects/quote-line-item.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';

const NAME_FIELD_NAME = 'name';
const QUOTE_NUMBER_FIELD_NAME = 'quoteNumber';

export const SEARCH_FIELDS_FOR_QUOTE: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: QUOTE_NUMBER_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export class QuoteWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  name: string;
  quoteNumber: string;
  status: string;
  issueDate: Date | null;
  expiryDate: Date | null;
  acceptedAt: Date | null;
  rejectedAt: Date | null;
  subtotal: {
    amountMicros: number | null;
    currencyCode: string;
  };
  taxAmount: {
    amountMicros: number | null;
    currencyCode: string;
  };
  discount: {
    amountMicros: number | null;
    currencyCode: string;
  };
  total: {
    amountMicros: number | null;
    currencyCode: string;
  };
  taxRate: number;
  notes: string | null;
  terms: string | null;
  rejectionReason: string;
  clientSignature: string;
  currency: string;
  searchVector: string;
  opportunity: EntityRelation<OpportunityWorkspaceEntity> | null;
  company: EntityRelation<CompanyWorkspaceEntity> | null;
  pointOfContact: EntityRelation<PersonWorkspaceEntity> | null;
  lineItems: EntityRelation<QuoteLineItemWorkspaceEntity[]>;
  sharingLinks: EntityRelation<DocumentSharingLinkWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
}
