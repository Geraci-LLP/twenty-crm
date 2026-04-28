import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardQuoteLineItemViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'quoteLineItem'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allQuoteLineItemsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quoteLineItem',
      context: {
        viewName: 'allQuoteLineItems',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allQuoteLineItemsDescription: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quoteLineItem',
      context: {
        viewName: 'allQuoteLineItems',
        viewFieldName: 'description',
        fieldName: 'description',
        position: 1,
        isVisible: true,
        size: 240,
      },
    }),
    allQuoteLineItemsQuantity: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quoteLineItem',
      context: {
        viewName: 'allQuoteLineItems',
        viewFieldName: 'quantity',
        fieldName: 'quantity',
        position: 2,
        isVisible: true,
        size: 100,
      },
    }),
    allQuoteLineItemsUnitPrice: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quoteLineItem',
      context: {
        viewName: 'allQuoteLineItems',
        viewFieldName: 'unitPrice',
        fieldName: 'unitPrice',
        position: 3,
        isVisible: true,
        size: 130,
      },
    }),
    allQuoteLineItemsTotal: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quoteLineItem',
      context: {
        viewName: 'allQuoteLineItems',
        viewFieldName: 'total',
        fieldName: 'total',
        position: 4,
        isVisible: true,
        size: 130,
      },
    }),
    allQuoteLineItemsQuote: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quoteLineItem',
      context: {
        viewName: 'allQuoteLineItems',
        viewFieldName: 'quote',
        fieldName: 'quote',
        position: 5,
        isVisible: true,
        size: 180,
      },
    }),
  };
};
