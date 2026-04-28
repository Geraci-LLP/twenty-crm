import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import {
  QuoteStatus,
  type QuoteWorkspaceEntity,
} from 'src/modules/quotes/standard-objects/quote.workspace-entity';

export type QuoteAcceptResult = {
  status: string;
  acceptedAt: Date | null;
  alreadyAccepted: boolean;
};

export type QuoteRejectResult = {
  status: string;
  rejectedAt: Date | null;
  alreadyRejected: boolean;
};

@Injectable()
export class QuoteStatusService {
  private readonly logger = new Logger(QuoteStatusService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async accept(
    quoteId: string,
    signerName: string,
    signerEmail: string,
    signature: string,
    workspaceId: string,
  ): Promise<QuoteAcceptResult> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const quoteRepository =
          await this.globalWorkspaceOrmManager.getRepository<QuoteWorkspaceEntity>(
            workspaceId,
            'quote',
            { shouldBypassPermissionChecks: true },
          );

        const quote = await quoteRepository.findOne({
          where: { id: quoteId },
        });

        if (!isDefined(quote)) {
          throw new Error(`Quote ${quoteId} not found`);
        }

        if (quote.status === QuoteStatus.EXPIRED) {
          throw new Error('Cannot accept an expired quote');
        }

        if (quote.status === QuoteStatus.ACCEPTED) {
          return {
            status: quote.status,
            acceptedAt: quote.acceptedAt,
            alreadyAccepted: true,
          };
        }

        const acceptedAt = new Date();

        await quoteRepository.update({ id: quoteId }, {
          status: QuoteStatus.ACCEPTED,
          acceptedAt,
          clientSignature: signature,
        } as Partial<QuoteWorkspaceEntity>);

        this.logger.log(
          `Quote ${quoteId} accepted by ${signerEmail} (${signerName})`,
        );

        return {
          status: QuoteStatus.ACCEPTED,
          acceptedAt,
          alreadyAccepted: false,
        };
      },
      authContext,
    );
  }

  async reject(
    quoteId: string,
    reason: string,
    workspaceId: string,
  ): Promise<QuoteRejectResult> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const quoteRepository =
          await this.globalWorkspaceOrmManager.getRepository<QuoteWorkspaceEntity>(
            workspaceId,
            'quote',
            { shouldBypassPermissionChecks: true },
          );

        const quote = await quoteRepository.findOne({
          where: { id: quoteId },
        });

        if (!isDefined(quote)) {
          throw new Error(`Quote ${quoteId} not found`);
        }

        if (quote.status === QuoteStatus.REJECTED) {
          return {
            status: quote.status,
            rejectedAt: quote.rejectedAt,
            alreadyRejected: true,
          };
        }

        const rejectedAt = new Date();

        await quoteRepository.update({ id: quoteId }, {
          status: QuoteStatus.REJECTED,
          rejectedAt,
          rejectionReason: reason,
        } as Partial<QuoteWorkspaceEntity>);

        this.logger.log(`Quote ${quoteId} rejected: ${reason}`);

        return {
          status: QuoteStatus.REJECTED,
          rejectedAt,
          alreadyRejected: false,
        };
      },
      authContext,
    );
  }

  async markSent(quoteId: string, workspaceId: string): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const quoteRepository =
        await this.globalWorkspaceOrmManager.getRepository<QuoteWorkspaceEntity>(
          workspaceId,
          'quote',
          { shouldBypassPermissionChecks: true },
        );

      const quote = await quoteRepository.findOne({
        where: { id: quoteId },
      });

      if (!isDefined(quote)) {
        return;
      }

      // Idempotent: only transition from DRAFT to SENT
      if (quote.status !== QuoteStatus.DRAFT) {
        return;
      }

      await quoteRepository.update({ id: quoteId }, {
        status: QuoteStatus.SENT,
      } as Partial<QuoteWorkspaceEntity>);
    }, authContext);
  }

  async markViewed(quoteId: string, workspaceId: string): Promise<void> {
    const authContext = buildSystemAuthContext(workspaceId);

    await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async () => {
      const quoteRepository =
        await this.globalWorkspaceOrmManager.getRepository<QuoteWorkspaceEntity>(
          workspaceId,
          'quote',
          { shouldBypassPermissionChecks: true },
        );

      const quote = await quoteRepository.findOne({
        where: { id: quoteId },
      });

      if (!isDefined(quote)) {
        return;
      }

      // Idempotent: only advance SENT → VIEWED. Terminal states are left alone.
      if (
        quote.status !== QuoteStatus.SENT &&
        quote.status !== QuoteStatus.DRAFT
      ) {
        return;
      }

      await quoteRepository.update({ id: quoteId }, {
        status: QuoteStatus.VIEWED,
      } as Partial<QuoteWorkspaceEntity>);
    }, authContext);
  }
}
