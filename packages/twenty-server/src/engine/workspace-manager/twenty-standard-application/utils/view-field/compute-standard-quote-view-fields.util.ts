import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardQuoteViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'quote'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allQuotesName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quote',
      context: {
        viewName: 'allQuotes',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 210,
      },
    }),
    allQuotesQuoteNumber: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quote',
      context: {
        viewName: 'allQuotes',
        viewFieldName: 'quoteNumber',
        fieldName: 'quoteNumber',
        position: 1,
        isVisible: true,
        size: 150,
      },
    }),
    allQuotesStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quote',
      context: {
        viewName: 'allQuotes',
        viewFieldName: 'status',
        fieldName: 'status',
        position: 2,
        isVisible: true,
        size: 120,
      },
    }),
    allQuotesIssueDate: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quote',
      context: {
        viewName: 'allQuotes',
        viewFieldName: 'issueDate',
        fieldName: 'issueDate',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
    allQuotesExpiryDate: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quote',
      context: {
        viewName: 'allQuotes',
        viewFieldName: 'expiryDate',
        fieldName: 'expiryDate',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
    allQuotesTotal: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quote',
      context: {
        viewName: 'allQuotes',
        viewFieldName: 'total',
        fieldName: 'total',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
    allQuotesCompany: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quote',
      context: {
        viewName: 'allQuotes',
        viewFieldName: 'company',
        fieldName: 'company',
        position: 6,
        isVisible: true,
        size: 180,
      },
    }),
    allQuotesPointOfContact: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quote',
      context: {
        viewName: 'allQuotes',
        viewFieldName: 'pointOfContact',
        fieldName: 'pointOfContact',
        position: 7,
        isVisible: true,
        size: 180,
      },
    }),
    allQuotesCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'quote',
      context: {
        viewName: 'allQuotes',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 8,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
