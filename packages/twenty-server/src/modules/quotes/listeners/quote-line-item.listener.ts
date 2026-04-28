import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';
import {
  type ObjectRecordCreateEvent,
  type ObjectRecordDeleteEvent,
  type ObjectRecordUpdateEvent,
} from 'twenty-shared/database-events';

import { OnDatabaseBatchEvent } from 'src/engine/api/graphql/graphql-query-runner/decorators/on-database-batch-event.decorator';
import { DatabaseEventAction } from 'src/engine/api/graphql/graphql-query-runner/enums/database-event-action';
import { WorkspaceEventBatch } from 'src/engine/workspace-event-emitter/types/workspace-event-batch.type';
import { QuoteTotalService } from 'src/modules/quotes/services/quote-total.service';
import { type QuoteLineItemWorkspaceEntity } from 'src/modules/quotes/standard-objects/quote-line-item.workspace-entity';

// The persisted row has the FK column quoteId in addition to the relation
// object declared on the workspace entity.
type LineItemEventRecord = QuoteLineItemWorkspaceEntity & {
  quoteId?: string | null;
};

@Injectable()
export class QuoteLineItemListener {
  private readonly logger = new Logger(QuoteLineItemListener.name);

  constructor(private readonly quoteTotalService: QuoteTotalService) {}

  @OnDatabaseBatchEvent('quoteLineItem', DatabaseEventAction.CREATED)
  async handleCreatedEvent(
    payload: WorkspaceEventBatch<ObjectRecordCreateEvent<LineItemEventRecord>>,
  ): Promise<void> {
    const quoteIds = this.extractQuoteIds(
      payload.events.map((event) => event.properties.after),
    );

    await this.recomputeAffectedQuotes(payload.workspaceId, quoteIds);
  }

  @OnDatabaseBatchEvent('quoteLineItem', DatabaseEventAction.UPDATED)
  async handleUpdatedEvent(
    payload: WorkspaceEventBatch<ObjectRecordUpdateEvent<LineItemEventRecord>>,
  ): Promise<void> {
    // Include both sides so a line item moving between quotes recomputes both.
    const affected = payload.events.flatMap((event) => [
      event.properties.before,
      event.properties.after,
    ]);

    const quoteIds = this.extractQuoteIds(affected);

    await this.recomputeAffectedQuotes(payload.workspaceId, quoteIds);
  }

  @OnDatabaseBatchEvent('quoteLineItem', DatabaseEventAction.DELETED)
  async handleDeletedEvent(
    payload: WorkspaceEventBatch<ObjectRecordDeleteEvent<LineItemEventRecord>>,
  ): Promise<void> {
    // For DELETED events, the row is gone — we rely on the `before` snapshot.
    const quoteIds = this.extractQuoteIds(
      payload.events.map((event) => event.properties.before),
    );

    await this.recomputeAffectedQuotes(payload.workspaceId, quoteIds);
  }

  private extractQuoteIds(
    records: Array<LineItemEventRecord | undefined>,
  ): string[] {
    const ids = records
      .map((record) => record?.quoteId)
      .filter((quoteId): quoteId is string => isDefined(quoteId));

    return Array.from(new Set(ids));
  }

  private async recomputeAffectedQuotes(
    workspaceId: string,
    quoteIds: string[],
  ): Promise<void> {
    if (quoteIds.length === 0) {
      return;
    }

    // Run recomputations in parallel — each one is an isolated workspace-scoped
    // write and a failure on one should not block the others.
    const settled = await Promise.allSettled(
      quoteIds.map((quoteId) =>
        this.quoteTotalService.recomputeTotals(quoteId, workspaceId),
      ),
    );

    for (const [index, result] of settled.entries()) {
      if (result.status === 'rejected') {
        this.logger.warn(
          `Failed to recompute totals for quote ${quoteIds[index]} in workspace ${workspaceId}: ${
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason)
          }`,
        );
      }
    }
  }
}
