import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  Context,
  Field,
  Float,
  Int,
  Mutation,
  ObjectType,
  Query,
} from '@nestjs/graphql';

import { isDefined } from 'twenty-shared/utils';

import { CoreResolver } from 'src/engine/api/graphql/graphql-config/decorators/core-resolver.decorator';
import { type PortalUserWorkspaceAuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { PortalAuthGuard } from 'src/engine/core-modules/portal-auth/guards/portal-auth.guard';
import { PortalUserService } from 'src/engine/core-modules/portal-user/services/portal-user.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type DocumentSharingLinkWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-sharing-link.workspace-entity';
import { type TrackedDocumentWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/tracked-document.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { type QuoteLineItemWorkspaceEntity } from 'src/modules/quotes/standard-objects/quote-line-item.workspace-entity';
import {
  QuoteStatus,
  type QuoteWorkspaceEntity,
} from 'src/modules/quotes/standard-objects/quote.workspace-entity';
import { QuoteStatusService } from 'src/modules/quotes/services/quote-status.service';

@ObjectType('PortalProfile')
class PortalProfileDto {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  personId?: string;

  @Field()
  workspaceId: string;
}

@ObjectType('PortalCompany')
class PortalCompanyDto {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  domainName?: string;

  @Field(() => String, { nullable: true })
  address?: string;
}

@ObjectType('PortalQuoteContact')
class PortalQuoteContactDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;
}

@ObjectType('PortalQuoteCompany')
class PortalQuoteCompanyDto {
  @Field(() => String, { nullable: true })
  name?: string;
}

@ObjectType('PortalQuoteLineItem')
class PortalQuoteLineItemDto {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  quantity?: number;

  @Field(() => Float, { nullable: true })
  unitPrice?: number;

  @Field(() => Float, { nullable: true })
  discount?: number;

  @Field(() => Float, { nullable: true })
  total?: number;

  @Field(() => Int, { nullable: true })
  position?: number;
}

@ObjectType('PortalQuote')
class PortalQuoteDto {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  quoteNumber?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Float, { nullable: true })
  total?: number;

  @Field(() => Float, { nullable: true })
  subtotal?: number;

  @Field(() => Float, { nullable: true })
  taxAmount?: number;

  @Field(() => Float, { nullable: true })
  discount?: number;

  @Field(() => Float, { nullable: true })
  taxRate?: number;

  @Field(() => String, { nullable: true })
  currency?: string;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => String, { nullable: true })
  terms?: string;

  @Field(() => Date, { nullable: true })
  issueDate?: Date;

  @Field(() => Date, { nullable: true })
  expiryDate?: Date;

  @Field(() => Date, { nullable: true })
  acceptedAt?: Date;

  @Field(() => Date, { nullable: true })
  rejectedAt?: Date;

  @Field(() => String, { nullable: true })
  rejectionReason?: string;

  @Field(() => String, { nullable: true })
  clientSignature?: string;

  @Field(() => String, { nullable: true })
  workspaceId?: string;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => [PortalQuoteLineItemDto], { nullable: true })
  lineItems?: PortalQuoteLineItemDto[];

  @Field(() => PortalQuoteCompanyDto, { nullable: true })
  company?: PortalQuoteCompanyDto | null;

  @Field(() => PortalQuoteContactDto, { nullable: true })
  pointOfContact?: PortalQuoteContactDto | null;
}

@ObjectType('PortalDocument')
class PortalDocumentDto {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  sharingLinkId?: string;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => String, { nullable: true })
  workspaceId?: string;

  @Field(() => Date, { nullable: true })
  sharedAt?: Date;

  @Field(() => Int, { nullable: true })
  viewCount?: number;
}

@ObjectType('PortalOpportunity')
class PortalOpportunityDto {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  stage?: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => Date, { nullable: true })
  closeDate?: Date;
}

type QuoteWithFks = QuoteWorkspaceEntity & {
  pointOfContactId?: string | null;
  companyId?: string | null;
};

type OpportunityWithFks = OpportunityWorkspaceEntity & {
  pointOfContactId?: string | null;
  companyId?: string | null;
};

type PersonWithFks = PersonWorkspaceEntity & {
  companyId?: string | null;
};

type SharingLinkWithFks = DocumentSharingLinkWorkspaceEntity & {
  recipientEmail?: string | null;
  personId?: string | null;
  trackedDocumentId?: string | null;
};

type ExpressRequestWithAuth = {
  user?: PortalUserWorkspaceAuthContext;
};

@CoreResolver()
@UseGuards(PortalAuthGuard)
export class PortalResolver {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    private readonly quoteStatusService: QuoteStatusService,
    private readonly portalUserService: PortalUserService,
  ) {}

  // Extracts a numeric currency amount from a Twenty money-composite field
  // (stored as amountMicros). Returns undefined when the amount is null.
  private microsToNumber(
    amount: { amountMicros: number | null } | null | undefined,
  ): number | undefined {
    if (!isDefined(amount) || !isDefined(amount.amountMicros)) {
      return undefined;
    }

    return Number(amount.amountMicros) / 1_000_000;
  }

  // Centralised ownership check: a portal user can see a quote iff
  // pointOfContactId === personId, OR (companyId matches the person's
  // companyId AND there is no pointOfContact set). Returns null when the
  // quote does not exist or is not theirs — callers decide whether to throw.
  private async findQuoteForPortalUser(
    quoteId: string,
    auth: PortalUserWorkspaceAuthContext,
  ): Promise<QuoteWithFks | null> {
    const systemContext = buildSystemAuthContext(auth.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const quoteRepo =
          await this.globalWorkspaceOrmManager.getRepository<QuoteWithFks>(
            auth.workspaceId,
            'quote',
            { shouldBypassPermissionChecks: true },
          );

        const quote = await quoteRepo.findOne({ where: { id: quoteId } });

        if (!isDefined(quote)) {
          return null;
        }

        // Direct contact match
        if (
          isDefined(auth.personId) &&
          quote.pointOfContactId === auth.personId
        ) {
          return quote;
        }

        // Company-wide fallback (only when the quote has no explicit contact)
        if (isDefined(auth.personId) && !isDefined(quote.pointOfContactId)) {
          const personRepo =
            await this.globalWorkspaceOrmManager.getRepository<PersonWithFks>(
              auth.workspaceId,
              'person',
              { shouldBypassPermissionChecks: true },
            );

          const person = await personRepo.findOne({
            where: { id: auth.personId },
          });

          if (
            isDefined(person?.companyId) &&
            isDefined(quote.companyId) &&
            person.companyId === quote.companyId
          ) {
            return quote;
          }
        }

        return null;
      },
      systemContext,
    );
  }

  private getAuth(context: {
    req: ExpressRequestWithAuth;
  }): PortalUserWorkspaceAuthContext {
    const auth = context?.req?.user;

    if (!auth || auth.type !== 'portalUser') {
      throw new Error('Portal authentication required');
    }

    return auth;
  }

  @Query(() => PortalProfileDto)
  async myProfile(
    @Context() context: { req: ExpressRequestWithAuth },
  ): Promise<PortalProfileDto> {
    const auth = this.getAuth(context);

    return {
      id: auth.portalUserId,
      email: auth.email,
      personId: auth.personId ?? undefined,
      workspaceId: auth.workspaceId,
    };
  }

  @Query(() => PortalCompanyDto, { nullable: true })
  async myCompany(
    @Context() context: { req: ExpressRequestWithAuth },
  ): Promise<PortalCompanyDto | null> {
    const auth = this.getAuth(context);

    if (!auth.personId) {
      return null;
    }

    const systemContext = buildSystemAuthContext(auth.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const personRepo =
          await this.globalWorkspaceOrmManager.getRepository<PersonWithFks>(
            auth.workspaceId,
            'person',
            { shouldBypassPermissionChecks: true },
          );

        const person = await personRepo.findOne({
          where: { id: auth.personId ?? undefined },
        });

        if (!isDefined(person) || !isDefined(person.companyId)) {
          return null;
        }

        const companyRepo =
          await this.globalWorkspaceOrmManager.getRepository<CompanyWorkspaceEntity>(
            auth.workspaceId,
            'company',
            { shouldBypassPermissionChecks: true },
          );

        const company = await companyRepo.findOne({
          where: { id: person.companyId },
        });

        if (!isDefined(company)) {
          return null;
        }

        // oxlint-disable-next-line @typescript-eslint/no-explicit-any
        const c = company as any;

        return {
          id: company.id,
          name: c.name ?? undefined,
          domainName: c.domainName?.primaryLinkUrl ?? undefined,
          address: c.address?.addressStreet1 ?? undefined,
        };
      },
      systemContext,
    );
  }

  @Query(() => [PortalQuoteDto])
  async myQuotes(
    @Context() context: { req: ExpressRequestWithAuth },
  ): Promise<PortalQuoteDto[]> {
    const auth = this.getAuth(context);
    const systemContext = buildSystemAuthContext(auth.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const quoteRepo =
          await this.globalWorkspaceOrmManager.getRepository<QuoteWithFks>(
            auth.workspaceId,
            'quote',
            { shouldBypassPermissionChecks: true },
          );

        // Build filter: quotes where pointOfContactId === personId,
        // OR (companyId matches the person's company AND pointOfContactId is null).
        let companyId: string | null = null;

        if (auth.personId) {
          const personRepo =
            await this.globalWorkspaceOrmManager.getRepository<PersonWithFks>(
              auth.workspaceId,
              'person',
              { shouldBypassPermissionChecks: true },
            );

          const person = await personRepo.findOne({
            where: { id: auth.personId },
          });

          companyId = person?.companyId ?? null;
        }

        const all = await quoteRepo.find({});

        const filtered = all.filter((quote) => {
          if (auth.personId && quote.pointOfContactId === auth.personId) {
            return true;
          }

          if (
            companyId &&
            quote.companyId === companyId &&
            !quote.pointOfContactId
          ) {
            return true;
          }

          return false;
        });

        return filtered.map((quote) => ({
          id: quote.id,
          name: quote.name,
          quoteNumber: quote.quoteNumber,
          status: quote.status,
          total: quote.total?.amountMicros
            ? Number(quote.total.amountMicros) / 1_000_000
            : undefined,
          issueDate: quote.issueDate ?? undefined,
          expiryDate: quote.expiryDate ?? undefined,
        }));
      },
      systemContext,
    );
  }

  @Query(() => PortalQuoteDto, { nullable: true })
  async myQuote(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: ExpressRequestWithAuth },
  ): Promise<PortalQuoteDto | null> {
    const auth = this.getAuth(context);

    const ownedQuote = await this.findQuoteForPortalUser(id, auth);

    if (!isDefined(ownedQuote)) {
      // Return null rather than throw — safer UX, avoids leaking existence.
      return null;
    }

    const systemContext = buildSystemAuthContext(auth.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const lineItemRepo = await this.globalWorkspaceOrmManager.getRepository<
          QuoteLineItemWorkspaceEntity & { quoteId?: string | null }
        >(auth.workspaceId, 'quoteLineItem', {
          shouldBypassPermissionChecks: true,
        });

        const allLineItems = await lineItemRepo.find({});
        const relatedLineItems = allLineItems.filter(
          (item) => item.quoteId === ownedQuote.id,
        );

        let company: PortalQuoteCompanyDto | null = null;

        if (isDefined(ownedQuote.companyId)) {
          const companyRepo =
            await this.globalWorkspaceOrmManager.getRepository<CompanyWorkspaceEntity>(
              auth.workspaceId,
              'company',
              { shouldBypassPermissionChecks: true },
            );

          const companyRecord = await companyRepo.findOne({
            where: { id: ownedQuote.companyId },
          });

          if (isDefined(companyRecord)) {
            // oxlint-disable-next-line @typescript-eslint/no-explicit-any
            const c = companyRecord as any;

            company = { name: c.name ?? undefined };
          }
        }

        let pointOfContact: PortalQuoteContactDto | null = null;

        if (isDefined(ownedQuote.pointOfContactId)) {
          const personRepo =
            await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
              auth.workspaceId,
              'person',
              { shouldBypassPermissionChecks: true },
            );

          const personRecord = await personRepo.findOne({
            where: { id: ownedQuote.pointOfContactId },
          });

          if (isDefined(personRecord)) {
            // oxlint-disable-next-line @typescript-eslint/no-explicit-any
            const p = personRecord as any;

            const nameParts = [p.name?.firstName, p.name?.lastName]
              .filter(
                (part: string | null | undefined) =>
                  isDefined(part) && part.length > 0,
              )
              .join(' ')
              .trim();

            pointOfContact = {
              name: nameParts.length > 0 ? nameParts : undefined,
              email: p.emails?.primaryEmail ?? undefined,
            };
          }
        }

        // oxlint-disable-next-line @typescript-eslint/no-explicit-any
        const q = ownedQuote as any;

        return {
          id: ownedQuote.id,
          name: ownedQuote.name ?? undefined,
          quoteNumber: ownedQuote.quoteNumber ?? undefined,
          status: ownedQuote.status,
          total: this.microsToNumber(ownedQuote.total),
          subtotal: this.microsToNumber(ownedQuote.subtotal),
          taxAmount: this.microsToNumber(ownedQuote.taxAmount),
          discount: this.microsToNumber(ownedQuote.discount),
          taxRate: ownedQuote.taxRate ?? undefined,
          currency:
            ownedQuote.currency ?? ownedQuote.total?.currencyCode ?? undefined,
          notes: ownedQuote.notes ?? undefined,
          terms: ownedQuote.terms ?? undefined,
          issueDate: ownedQuote.issueDate ?? undefined,
          expiryDate: ownedQuote.expiryDate ?? undefined,
          acceptedAt: ownedQuote.acceptedAt ?? undefined,
          rejectedAt: ownedQuote.rejectedAt ?? undefined,
          rejectionReason: ownedQuote.rejectionReason ?? undefined,
          clientSignature: ownedQuote.clientSignature ?? undefined,
          workspaceId: auth.workspaceId,
          slug: q.slug ?? undefined,
          company,
          pointOfContact,
          lineItems: relatedLineItems
            .slice()
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map((item) => ({
              id: item.id,
              name: item.name ?? undefined,
              description: item.description ?? undefined,
              quantity: item.quantity ?? undefined,
              unitPrice: this.microsToNumber(item.unitPrice),
              discount: item.discount ?? undefined,
              total: this.microsToNumber(item.total),
              position: item.position ?? undefined,
            })),
        };
      },
      systemContext,
    );
  }

  @Mutation(() => PortalQuoteDto)
  async acceptMyQuote(
    @Args('id', { type: () => String }) id: string,
    @Args('signatureText', { type: () => String, nullable: true })
    signatureText: string | null,
    @Context() context: { req: ExpressRequestWithAuth },
  ): Promise<PortalQuoteDto> {
    const auth = this.getAuth(context);

    const ownedQuote = await this.findQuoteForPortalUser(id, auth);

    if (!isDefined(ownedQuote)) {
      throw new UnauthorizedException(
        'Quote not found or not accessible for this portal user',
      );
    }

    if (
      ownedQuote.status !== QuoteStatus.SENT &&
      ownedQuote.status !== QuoteStatus.VIEWED
    ) {
      throw new ConflictException(
        `Quote is in status ${ownedQuote.status} and cannot be accepted`,
      );
    }

    const portalUser = await this.portalUserService.findById(auth.portalUserId);

    const signerName = portalUser?.name ?? auth.email;
    const signerEmail = auth.email;
    const signature = signatureText ?? signerName;

    await this.quoteStatusService.accept(
      ownedQuote.id,
      signerName,
      signerEmail,
      signature,
      auth.workspaceId,
    );

    const refreshed = await this.myQuote(id, context);

    if (!isDefined(refreshed)) {
      throw new NotFoundException('Quote unavailable after accept');
    }

    return refreshed;
  }

  @Mutation(() => PortalQuoteDto)
  async rejectMyQuote(
    @Args('id', { type: () => String }) id: string,
    @Args('reason', { type: () => String, nullable: true })
    reason: string | null,
    @Context() context: { req: ExpressRequestWithAuth },
  ): Promise<PortalQuoteDto> {
    const auth = this.getAuth(context);

    const ownedQuote = await this.findQuoteForPortalUser(id, auth);

    if (!isDefined(ownedQuote)) {
      throw new UnauthorizedException(
        'Quote not found or not accessible for this portal user',
      );
    }

    if (
      ownedQuote.status !== QuoteStatus.SENT &&
      ownedQuote.status !== QuoteStatus.VIEWED
    ) {
      throw new ConflictException(
        `Quote is in status ${ownedQuote.status} and cannot be rejected`,
      );
    }

    await this.quoteStatusService.reject(
      ownedQuote.id,
      reason ?? '',
      auth.workspaceId,
    );

    const refreshed = await this.myQuote(id, context);

    if (!isDefined(refreshed)) {
      throw new NotFoundException('Quote unavailable after reject');
    }

    return refreshed;
  }

  @Query(() => [PortalDocumentDto])
  async myDocuments(
    @Context() context: { req: ExpressRequestWithAuth },
  ): Promise<PortalDocumentDto[]> {
    const auth = this.getAuth(context);
    const systemContext = buildSystemAuthContext(auth.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const linkRepo =
          await this.globalWorkspaceOrmManager.getRepository<SharingLinkWithFks>(
            auth.workspaceId,
            'documentSharingLink',
            { shouldBypassPermissionChecks: true },
          );

        const allLinks = await linkRepo.find({});

        const mine = allLinks.filter((link) => {
          if (link.recipientEmail?.toLowerCase() === auth.email.toLowerCase()) {
            return true;
          }

          if (auth.personId && link.personId === auth.personId) {
            return true;
          }

          return false;
        });

        if (mine.length === 0) {
          return [];
        }

        const docRepo =
          await this.globalWorkspaceOrmManager.getRepository<TrackedDocumentWorkspaceEntity>(
            auth.workspaceId,
            'trackedDocument',
            { shouldBypassPermissionChecks: true },
          );

        const trackedDocumentIds = mine
          .map((link) => link.trackedDocumentId)
          .filter((id): id is string => isDefined(id));

        const docs = trackedDocumentIds.length ? await docRepo.find({}) : [];

        return mine.map((link) => {
          const doc = docs.find((d) => d.id === link.trackedDocumentId);

          // oxlint-disable-next-line @typescript-eslint/no-explicit-any
          const d = doc as any;
          // oxlint-disable-next-line @typescript-eslint/no-explicit-any
          const l = link as any;

          return {
            id: link.id,
            name: d?.name ?? undefined,
            status: d?.status ?? undefined,
            sharingLinkId: link.id,
            slug: l.slug ?? undefined,
            workspaceId: auth.workspaceId,
            sharedAt: l.createdAt ?? d?.createdAt ?? undefined,
            viewCount: l.viewCount ?? d?.viewCount ?? 0,
          };
        });
      },
      systemContext,
    );
  }

  @Query(() => [PortalOpportunityDto])
  async myOpportunities(
    @Context() context: { req: ExpressRequestWithAuth },
  ): Promise<PortalOpportunityDto[]> {
    const auth = this.getAuth(context);
    const systemContext = buildSystemAuthContext(auth.workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const oppRepo =
          await this.globalWorkspaceOrmManager.getRepository<OpportunityWithFks>(
            auth.workspaceId,
            'opportunity',
            { shouldBypassPermissionChecks: true },
          );

        let companyId: string | null = null;

        if (auth.personId) {
          const personRepo =
            await this.globalWorkspaceOrmManager.getRepository<PersonWithFks>(
              auth.workspaceId,
              'person',
              { shouldBypassPermissionChecks: true },
            );

          const person = await personRepo.findOne({
            where: { id: auth.personId },
          });

          companyId = person?.companyId ?? null;
        }

        const all = await oppRepo.find({});

        const filtered = all.filter((opp) => {
          if (auth.personId && opp.pointOfContactId === auth.personId) {
            return true;
          }

          if (companyId && opp.companyId === companyId) {
            return true;
          }

          return false;
        });

        return filtered.map((opp) => {
          // oxlint-disable-next-line @typescript-eslint/no-explicit-any
          const o = opp as any;

          return {
            id: opp.id,
            name: o.name ?? undefined,
            stage: o.stage ?? undefined,
            amount: o.amount?.amountMicros
              ? Number(o.amount.amountMicros) / 1_000_000
              : undefined,
            closeDate: o.closeDate ?? undefined,
          };
        });
      },
      systemContext,
    );
  }
}
