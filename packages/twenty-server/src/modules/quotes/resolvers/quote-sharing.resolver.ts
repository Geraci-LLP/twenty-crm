import { randomBytes } from 'crypto';

import {
  HttpException,
  HttpStatus,
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { isDefined } from 'twenty-shared/utils';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { AuthGraphqlApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-graphql-api-exception.filter';
import { DomainServerConfigService } from 'src/engine/core-modules/domain/domain-server-config/services/domain-server-config.service';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { type DocumentSharingLinkWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-sharing-link.workspace-entity';
import { QuoteSharingLinkDto } from 'src/modules/quotes/dtos/quote-sharing-link.dto';
import { QuoteStatusService } from 'src/modules/quotes/services/quote-status.service';
import { type QuoteWorkspaceEntity } from 'src/modules/quotes/standard-objects/quote.workspace-entity';

// Twenty ORM generates *Id columns for relations at the DB level,
// but the workspace entity types only declare the relation objects.
type SharingLinkWithForeignKeys = DocumentSharingLinkWorkspaceEntity & {
  quoteId?: string | null;
  trackedDocumentId?: string | null;
  targetType?: string | null;
};

// Base32-ish alphabet (Crockford-safe) used for human-typeable slugs
const SLUG_BYTES = 10;
const SLUG_LENGTH = 16;

const generateSlug = (): string =>
  randomBytes(SLUG_BYTES).toString('base64url').slice(0, SLUG_LENGTH);

@MetadataResolver()
@UsePipes(ResolverValidationPipe)
@UseFilters(AuthGraphqlApiExceptionFilter)
@UseGuards(WorkspaceAuthGuard, NoPermissionGuard)
export class QuoteSharingResolver {
  private readonly logger = new Logger(QuoteSharingResolver.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly quoteStatusService: QuoteStatusService,
    private readonly domainServerConfigService: DomainServerConfigService,
  ) {}

  @Mutation(() => QuoteSharingLinkDto)
  async createQuoteSharingLink(
    @Args('quoteId') quoteId: string,
    @Args('recipientEmail', { nullable: true }) recipientEmail: string | null,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<QuoteSharingLinkDto> {
    const workspaceId = workspace.id;

    // Verify the quote exists inside the caller's workspace (real user auth;
    // permissions are checked against the caller's role by default — no bypass).
    const quoteRepository =
      await this.globalWorkspaceOrmManager.getRepository<QuoteWorkspaceEntity>(
        workspaceId,
        'quote',
      );

    const quote = await quoteRepository.findOne({
      where: { id: quoteId },
    });

    if (!isDefined(quote)) {
      throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);
    }

    // Insert the sharing link. We use shouldBypassPermissionChecks: true here
    // because documentSharingLink is a cross-cutting resource — once the user has
    // been authorized against the quote above, they should be able to create
    // a link regardless of per-field permissions on documentSharingLink.
    const sharingLinkRepository =
      await this.globalWorkspaceOrmManager.getRepository<SharingLinkWithForeignKeys>(
        workspaceId,
        'documentSharingLink',
        { shouldBypassPermissionChecks: true },
      );

    const slug = generateSlug();

    const saved = await sharingLinkRepository.save({
      slug,
      isActive: true,
      recipientEmail: recipientEmail ?? null,
      viewCount: 0,
      quoteId,
      trackedDocumentId: null,
      targetType: 'QUOTE',
    } as Partial<SharingLinkWithForeignKeys>);

    // Transition DRAFT -> SENT (idempotent).
    await this.quoteStatusService.markSent(quoteId, workspaceId).catch(
      // Best-effort: failing to update the status must not block link creation.
      (error) => {
        this.logger.warn(
          `Failed to mark quote ${quoteId} as SENT: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      },
    );

    const frontUrl = this.domainServerConfigService.getFrontUrl();
    const shareUrl = `${frontUrl.origin}/q/${workspaceId}/${slug}`;

    this.logger.log(
      `Quote sharing link ${saved.id} created for quote ${quoteId} in workspace ${workspaceId}`,
    );

    return {
      id: saved.id,
      slug,
      shareUrl,
      isActive: true,
      recipientEmail: recipientEmail ?? null,
      quoteId,
    };
  }
}
