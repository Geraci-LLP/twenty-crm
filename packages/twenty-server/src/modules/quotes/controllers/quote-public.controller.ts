import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isDefined } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type DocumentSharingLinkWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-sharing-link.workspace-entity';
import { type DocumentViewWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-view.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { QuoteStatusService } from 'src/modules/quotes/services/quote-status.service';
import { type QuoteLineItemWorkspaceEntity } from 'src/modules/quotes/standard-objects/quote-line-item.workspace-entity';
import { type QuoteWorkspaceEntity } from 'src/modules/quotes/standard-objects/quote.workspace-entity';

type IdentifyBody = {
  email: string;
  name?: string;
};

type TrackBody = {
  viewId: string;
  durationSeconds: number;
  pagesViewed: number;
  completionPercent: number;
};

type AcceptBody = {
  signerName: string;
  signerEmail: string;
  signatureText: string;
};

type RejectBody = {
  signerName: string;
  signerEmail: string;
  reason: string;
};

// Twenty ORM generates *Id columns for relations at the DB level. For some
// relations the FK column is exposed on the read object (`trackedDocumentId`,
// `personId`); for others (`targetQuote`) the FK isn't projected and you have
// to load the relation eagerly to get the related id.
type SharingLinkWithForeignKeys = DocumentSharingLinkWorkspaceEntity & {
  quoteId?: string | null;
  trackedDocumentId?: string | null;
  targetType?: string | null;
  targetQuote?: { id: string } | null;
};

// Polymorphism guard: documentSharingLink is shared between tracked-documents
// (F9) and quotes (F11). The /quotes/* endpoints must only accept links whose
// targetType is QUOTE (or, for legacy rows written before targetType existed,
// links with a non-null quote relation).
const isQuoteSharingLink = (link: SharingLinkWithForeignKeys): boolean => {
  if (link.targetType === 'QUOTE') return true;

  if (
    !isDefined(link.targetType) &&
    (isDefined(link.quoteId) || isDefined(link.targetQuote?.id))
  ) {
    return true;
  }

  return false;
};

// Pull the quote id off either the FK column (if TwentyORM projects it) or
// the eagerly loaded relation object.
const getQuoteIdFromLink = (
  link: SharingLinkWithForeignKeys,
): string | null | undefined => link.quoteId ?? link.targetQuote?.id;

type LineItemWithForeignKeys = QuoteLineItemWorkspaceEntity & {
  quoteId: string;
};

@Controller('quotes')
export class QuotePublicController {
  private readonly logger = new Logger(QuotePublicController.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly quoteStatusService: QuoteStatusService,
  ) {}

  @Get(':workspaceId/:slug')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getQuoteBySlug(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const sharingLinkRepository =
            await this.globalWorkspaceOrmManager.getRepository<SharingLinkWithForeignKeys>(
              workspaceId,
              'documentSharingLink',
              { shouldBypassPermissionChecks: true },
            );

          const sharingLink = await sharingLinkRepository.findOne({
            where: { slug },
            relations: { targetQuote: true } as never,
          });

          if (!isDefined(sharingLink) || !isQuoteSharingLink(sharingLink)) {
            throw new HttpException(
              'Sharing link not found',
              HttpStatus.NOT_FOUND,
            );
          }

          if (!sharingLink.isActive) {
            throw new HttpException(
              'Sharing link is no longer active',
              HttpStatus.GONE,
            );
          }

          const quoteId = getQuoteIdFromLink(sharingLink);
          if (!isDefined(quoteId)) {
            throw new HttpException(
              'Sharing link is not attached to a quote',
              HttpStatus.NOT_FOUND,
            );
          }

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
            throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);
          }

          const lineItemRepository =
            await this.globalWorkspaceOrmManager.getRepository<LineItemWithForeignKeys>(
              workspaceId,
              'quoteLineItem',
              { shouldBypassPermissionChecks: true },
            );

          const lineItems = await lineItemRepository.find({
            where: { quoteId: quote.id },
          });

          // Increment sharing link view count (async, non-blocking)
          sharingLinkRepository
            .increment({ id: sharingLink.id }, 'viewCount', 1)
            .catch(() => {});

          // MVP: quotes are viewable via the link without an email gate.
          return {
            requiresEmail: false,
            quote: {
              id: quote.id,
              name: quote.name,
              quoteNumber: quote.quoteNumber,
              status: quote.status,
              issueDate: quote.issueDate,
              expiryDate: quote.expiryDate,
              acceptedAt: quote.acceptedAt,
              rejectedAt: quote.rejectedAt,
              subtotal: quote.subtotal,
              taxAmount: quote.taxAmount,
              discount: quote.discount,
              total: quote.total,
              taxRate: quote.taxRate,
              notes: quote.notes,
              terms: quote.terms,
              currency: quote.currency,
              clientSignature: quote.clientSignature,
              rejectionReason: quote.rejectionReason,
            },
            lineItems: lineItems.map((lineItem) => ({
              id: lineItem.id,
              name: lineItem.name,
              description: lineItem.description,
              quantity: lineItem.quantity,
              unitPrice: lineItem.unitPrice,
              discount: lineItem.discount,
              total: lineItem.total,
              position: lineItem.position,
            })),
          };
        },
        authContext,
      );

    this.logger.log(
      `Quote served for slug "${slug}" in workspace ${workspaceId}`,
    );

    return result;
  }

  @Post(':workspaceId/:slug/identify')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async identifyViewer(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
    @Body() body: IdentifyBody,
  ) {
    await this.validateWorkspace(workspaceId);

    if (!isDefined(body.email)) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const sharingLinkRepository =
            await this.globalWorkspaceOrmManager.getRepository<SharingLinkWithForeignKeys>(
              workspaceId,
              'documentSharingLink',
              { shouldBypassPermissionChecks: true },
            );

          const sharingLink = await sharingLinkRepository.findOne({
            where: { slug },
            relations: { targetQuote: true } as never,
          });

          if (!isDefined(sharingLink) || !isQuoteSharingLink(sharingLink)) {
            throw new HttpException(
              'Sharing link not found',
              HttpStatus.NOT_FOUND,
            );
          }

          if (!sharingLink.isActive) {
            throw new HttpException(
              'Sharing link is no longer active',
              HttpStatus.GONE,
            );
          }

          const documentViewRepository =
            await this.globalWorkspaceOrmManager.getRepository<DocumentViewWorkspaceEntity>(
              workspaceId,
              'documentView',
              { shouldBypassPermissionChecks: true },
            );

          const documentView = await documentViewRepository.save({
            viewerEmail: body.email,
            viewerName: body.name ?? null,
            viewedAt: new Date(),
            trackedDocumentId: sharingLink.trackedDocumentId ?? null,
            documentSharingLinkId: sharingLink.id,
          } as Partial<DocumentViewWorkspaceEntity>);

          // Try to auto-link to an existing person by primary email
          let personId: string | null = null;

          try {
            const personRepository =
              await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
                workspaceId,
                'person',
                { shouldBypassPermissionChecks: true },
              );

            const matchingPerson = await personRepository.findOne({
              where: {
                emails: { primaryEmail: body.email.toLowerCase() } as never,
              },
            });

            if (isDefined(matchingPerson)) {
              personId = matchingPerson.id;
            }
          } catch {
            // Auto-linking is best-effort; do not block the identify flow
          }

          if (isDefined(personId)) {
            await documentViewRepository.update({ id: documentView.id }, {
              personId,
            } as Partial<DocumentViewWorkspaceEntity>);
          }

          // Best-effort: mark the quote as viewed when the first viewer identifies
          const linkedQuoteId = getQuoteIdFromLink(sharingLink);
          if (isDefined(linkedQuoteId)) {
            this.quoteStatusService
              .markViewed(linkedQuoteId, workspaceId)
              .catch(() => {});
          }

          return {
            accessGranted: true,
            viewId: documentView.id,
          };
        },
        authContext,
      );

    this.logger.log(
      `Quote viewer identified for slug "${slug}" in workspace ${workspaceId}: ${body.email}`,
    );

    return result;
  }

  @Post(':workspaceId/:slug/track')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async trackViewAnalytics(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
    @Body() body: TrackBody,
  ) {
    await this.validateWorkspace(workspaceId);

    if (!isDefined(body.viewId)) {
      throw new HttpException('viewId is required', HttpStatus.BAD_REQUEST);
    }

    const authContext = buildSystemAuthContext(workspaceId);

    // Analytics tracking is non-blocking — fire and forget
    this.globalWorkspaceOrmManager
      .executeInWorkspaceContext(async () => {
        const documentViewRepository =
          await this.globalWorkspaceOrmManager.getRepository<DocumentViewWorkspaceEntity>(
            workspaceId,
            'documentView',
            { shouldBypassPermissionChecks: true },
          );

        await documentViewRepository.update(
          { id: body.viewId },
          {
            durationSeconds: body.durationSeconds,
            pagesViewed: body.pagesViewed,
            completionPercent: body.completionPercent,
          },
        );
      }, authContext)
      .catch(() => {});

    this.logger.log(
      `Quote view analytics tracked for slug "${slug}", viewId ${body.viewId} in workspace ${workspaceId}`,
    );

    return { success: true };
  }

  @Post(':workspaceId/:slug/accept')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async acceptQuote(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
    @Body() body: AcceptBody,
  ) {
    await this.validateWorkspace(workspaceId);

    if (
      !isDefined(body.signerName) ||
      !isDefined(body.signerEmail) ||
      !isDefined(body.signatureText)
    ) {
      throw new HttpException(
        'signerName, signerEmail and signatureText are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const authContext = buildSystemAuthContext(workspaceId);

    const quoteId = await this.resolveQuoteIdFromSlug(workspaceId, slug);

    try {
      const result = await this.quoteStatusService.accept(
        quoteId,
        body.signerName,
        body.signerEmail,
        body.signatureText,
        workspaceId,
      );

      this.logger.log(
        `Quote ${quoteId} accept requested via slug "${slug}" by ${body.signerEmail}`,
      );

      return result;
    } catch (error) {
      if (error instanceof Error && /expired/i.test(error.message)) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      throw new HttpException(
        'Unable to accept quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      void authContext;
    }
  }

  @Post(':workspaceId/:slug/reject')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async rejectQuote(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
    @Body() body: RejectBody,
  ) {
    await this.validateWorkspace(workspaceId);

    if (!isDefined(body.reason)) {
      throw new HttpException('reason is required', HttpStatus.BAD_REQUEST);
    }

    const quoteId = await this.resolveQuoteIdFromSlug(workspaceId, slug);

    const result = await this.quoteStatusService.reject(
      quoteId,
      body.reason,
      workspaceId,
    );

    this.logger.log(
      `Quote ${quoteId} reject requested via slug "${slug}" by ${body.signerEmail ?? 'unknown'}`,
    );

    return result;
  }

  // Ensures consistency across status endpoints: resolves the active sharing
  // link's slug to the attached quote's id (or throws a 404/410).
  private async resolveQuoteIdFromSlug(
    workspaceId: string,
    slug: string,
  ): Promise<string> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const sharingLinkRepository =
          await this.globalWorkspaceOrmManager.getRepository<SharingLinkWithForeignKeys>(
            workspaceId,
            'documentSharingLink',
            { shouldBypassPermissionChecks: true },
          );

        const sharingLink = await sharingLinkRepository.findOne({
          where: { slug },
          relations: { targetQuote: true } as never,
        });

        if (!isDefined(sharingLink) || !isQuoteSharingLink(sharingLink)) {
          throw new HttpException(
            'Sharing link not found',
            HttpStatus.NOT_FOUND,
          );
        }

        if (!sharingLink.isActive) {
          throw new HttpException(
            'Sharing link is no longer active',
            HttpStatus.GONE,
          );
        }

        const quoteId = getQuoteIdFromLink(sharingLink);
        if (!isDefined(quoteId)) {
          throw new HttpException(
            'Sharing link is not attached to a quote',
            HttpStatus.NOT_FOUND,
          );
        }

        return quoteId;
      },
      authContext,
    );
  }

  private async validateWorkspace(workspaceId: string): Promise<void> {
    const workspaceExists = await this.workspaceRepository.existsBy({
      id: workspaceId,
    });

    if (!workspaceExists) {
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
    }
  }
}
