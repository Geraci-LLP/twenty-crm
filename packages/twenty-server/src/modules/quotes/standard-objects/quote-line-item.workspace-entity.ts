import { FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type QuoteWorkspaceEntity } from 'src/modules/quotes/standard-objects/quote.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_QUOTE_LINE_ITEM: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class QuoteLineItemWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: {
    amountMicros: number | null;
    currencyCode: string;
  };
  discount: number;
  total: {
    amountMicros: number | null;
    currencyCode: string;
  };
  searchVector: string;
  quote: EntityRelation<QuoteWorkspaceEntity>;
}
