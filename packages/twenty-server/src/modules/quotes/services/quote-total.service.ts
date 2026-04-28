import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type QuoteLineItemWorkspaceEntity } from 'src/modules/quotes/standard-objects/quote-line-item.workspace-entity';
import { type QuoteWorkspaceEntity } from 'src/modules/quotes/standard-objects/quote.workspace-entity';

type LineItemWithForeignKeys = QuoteLineItemWorkspaceEntity & {
  quoteId: string;
};

@Injectable()
export class QuoteTotalService {
  private readonly logger = new Logger(QuoteTotalService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  // Recomputes subtotal, taxAmount and total for a quote based on its line
  // items, the quote-level discount, and the quote-level taxRate.
  async recomputeTotals(quoteId: string, workspaceId: string): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const quoteRepository =
        await this.globalWorkspaceOrmManager.getRepository<QuoteWorkspaceEntity>(
          workspaceId,
          'quote',
          { shouldBypassPermissionChecks: true },
        );

      const lineItemRepository =
        await this.globalWorkspaceOrmManager.getRepository<LineItemWithForeignKeys>(
          workspaceId,
          'quoteLineItem',
          { shouldBypassPermissionChecks: true },
        );

      const quote = await quoteRepository.findOne({ where: { id: quoteId } });

      if (!isDefined(quote)) {
        this.logger.warn(`Quote ${quoteId} not found while recomputing totals`);

        return;
      }

      const lineItems = await lineItemRepository.find({
        where: { quoteId },
      });

      const currencyCode = quote.currency ?? 'USD';

      const subtotalMicros = lineItems.reduce((sum, lineItem) => {
        const lineTotal = lineItem.total?.amountMicros ?? 0;

        return sum + Number(lineTotal);
      }, 0);

      const discountMicros = Number(quote.discount?.amountMicros ?? 0);
      const afterDiscount = Math.max(subtotalMicros - discountMicros, 0);
      const taxRate = Number(quote.taxRate ?? 0);
      const taxAmountMicros = Math.round((afterDiscount * taxRate) / 100);
      const totalMicros = afterDiscount + taxAmountMicros;

      await quoteRepository.update({ id: quoteId }, {
        subtotal: { amountMicros: subtotalMicros, currencyCode },
        taxAmount: { amountMicros: taxAmountMicros, currencyCode },
        total: { amountMicros: totalMicros, currencyCode },
      } as Partial<QuoteWorkspaceEntity>);
    }, authContext);
  }
}
