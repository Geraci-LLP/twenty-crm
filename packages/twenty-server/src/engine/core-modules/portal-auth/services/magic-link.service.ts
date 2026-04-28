import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import crypto from 'crypto';

import { render } from '@react-email/render';
import { addMinutes } from 'date-fns';
import { isDefined } from 'twenty-shared/utils';
import { IsNull, MoreThan, Repository } from 'typeorm';

import {
  AppTokenEntity,
  AppTokenType,
} from 'src/engine/core-modules/app-token/app-token.entity';
import { EmailService } from 'src/engine/core-modules/email/email.service';
import { PortalUserEntity } from 'src/engine/core-modules/portal-user/portal-user.entity';
import { PortalUserService } from 'src/engine/core-modules/portal-user/services/portal-user.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

type PersonLookupResult = {
  personId: string;
  name: string | null;
};

type RequestMagicLinkInput = {
  email: string;
  workspaceId: string;
};

type RequestMagicLinkResult = {
  success: true;
  // Generic message by design — never reveal whether the email exists
  message: string;
};

type VerifyMagicLinkResult = {
  portalUser: PortalUserEntity;
  workspace: WorkspaceEntity;
};

@Injectable()
export class MagicLinkService {
  private readonly logger = new Logger(MagicLinkService.name);

  constructor(
    @InjectRepository(AppTokenEntity)
    private readonly appTokenRepository: Repository<AppTokenEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly portalUserService: PortalUserService,
    private readonly emailService: EmailService,
    private readonly twentyConfigService: TwentyConfigService,
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  // Look up a `person` whose primary email matches the given email. Used to
  // gate portal-user auto-provisioning — callers should not create a portalUser
  // unless this returns a match.
  private async findPersonByEmail(
    email: string,
    workspaceId: string,
  ): Promise<PersonLookupResult | null> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        try {
          const personRepository =
            await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
              workspaceId,
              'person',
              { shouldBypassPermissionChecks: true },
            );

          const matchingPerson = await personRepository.findOne({
            where: {
              emails: { primaryEmail: email.toLowerCase() } as never,
            },
          });

          if (!isDefined(matchingPerson)) {
            return null;
          }

          const fullName = matchingPerson.name;
          const composedName =
            isDefined(fullName) && (fullName.firstName || fullName.lastName)
              ? [fullName.firstName, fullName.lastName]
                  .filter((part) => isDefined(part) && part.length > 0)
                  .join(' ')
                  .trim()
              : null;

          return {
            personId: matchingPerson.id,
            name: composedName && composedName.length > 0 ? composedName : null,
          };
        } catch (error) {
          this.logger.warn(
            `Error looking up person by email for portal login: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );

          return null;
        }
      },
      authContext,
    );
  }

  async requestMagicLink(
    input: RequestMagicLinkInput,
  ): Promise<RequestMagicLinkResult> {
    const genericResponse: RequestMagicLinkResult = {
      success: true,
      message:
        'If an account with that email exists, a login link has been sent.',
    };

    const workspace = await this.workspaceRepository.findOne({
      where: { id: input.workspaceId },
    });

    if (!workspace) {
      // Still return success to prevent workspace enumeration.
      this.logger.warn(
        `Magic-link requested for unknown workspace ${input.workspaceId}`,
      );

      return genericResponse;
    }

    const email = input.email.toLowerCase();

    let portalUser = await this.portalUserService.findByEmail(
      email,
      input.workspaceId,
    );

    if (!portalUser) {
      // Gate auto-provisioning: only create a portalUser if the email
      // corresponds to an existing person in the workspace's CRM. Prevents
      // anyone from self-provisioning a portal account just by requesting a
      // link for an arbitrary address.
      const personMatch = await this.findPersonByEmail(
        email,
        input.workspaceId,
      );

      if (!personMatch) {
        // Log internally but return a generic success to prevent enumeration.
        this.logger.log(`No person found for portal login request: ${email}`);

        return genericResponse;
      }

      portalUser = await this.portalUserService.create({
        email,
        workspaceId: input.workspaceId,
        personId: personMatch.personId,
        name: personMatch.name,
      });
    }

    if (!portalUser.isActive) {
      this.logger.warn(
        `Magic-link requested for inactive portal user ${portalUser.id}`,
      );

      return genericResponse;
    }

    const expiryMinutes =
      this.twentyConfigService.get('MAGIC_LINK_EXPIRY_MINUTES') ?? 15;

    const expiresAt = addMinutes(new Date(), expiryMinutes);

    // Generate the plain token that is emailed to the user, and store only
    // the SHA-256 hash so a DB leak does not expose usable tokens.
    const plainToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(plainToken)
      .digest('hex');

    await this.appTokenRepository.save({
      type: AppTokenType.MagicLinkToken,
      value: hashedToken,
      workspaceId: input.workspaceId,
      expiresAt,
      context: {
        portalUserId: portalUser.id,
        workspaceId: input.workspaceId,
        email: portalUser.email,
      },
    });

    await this.sendMagicLinkEmail({
      portalUser,
      plainToken,
      expiryMinutes,
    });

    return genericResponse;
  }

  async verifyMagicLink(rawToken: string): Promise<VerifyMagicLinkResult> {
    if (!rawToken) {
      throw new UnauthorizedException('Invalid or expired magic link');
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const appToken = await this.appTokenRepository.findOne({
      where: {
        value: hashedToken,
        type: AppTokenType.MagicLinkToken,
        expiresAt: MoreThan(new Date()),
        revokedAt: IsNull(),
      },
    });

    if (!appToken || !appToken.context?.portalUserId) {
      throw new UnauthorizedException('Invalid or expired magic link');
    }

    const portalUser = await this.portalUserService.findById(
      appToken.context.portalUserId,
    );

    if (!portalUser || !portalUser.isActive) {
      throw new UnauthorizedException('Invalid or expired magic link');
    }

    const workspace = await this.workspaceRepository.findOne({
      where: { id: portalUser.workspaceId },
    });

    if (!workspace) {
      throw new UnauthorizedException('Invalid or expired magic link');
    }

    // Single-use: delete the token so it cannot be replayed.
    await this.appTokenRepository.delete({ id: appToken.id });

    await this.portalUserService.updateLastLogin(portalUser.id);

    return { portalUser, workspace };
  }

  private async sendMagicLinkEmail(params: {
    portalUser: PortalUserEntity;
    plainToken: string;
    expiryMinutes: number;
  }): Promise<void> {
    const { portalUser, plainToken, expiryMinutes } = params;

    // Lazy-import to avoid bundling the email template at startup.
    // oxlint-disable-next-line @typescript-eslint/no-var-requires
    const { PortalMagicLinkEmail } = await import('twenty-emails');

    const portalBaseUrl =
      this.twentyConfigService.get('PORTAL_BASE_URL') ??
      'http://localhost:3001/portal';

    const magicLinkUrl = `${portalBaseUrl.replace(/\/$/, '')}/auth/verify?token=${encodeURIComponent(
      plainToken,
    )}`;

    // Dev-only: print the link so it's testable without SendGrid wired up.
    // Strip this branch (or move behind a feature flag) before any prod deploy
    // since logging tokens enables session takeover via log access.
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(
        `[dev] Magic link URL for ${portalUser.email}: ${magicLinkUrl}`,
      );
      // Also expose the raw token directly so the auto-test can hit
      // /portal-auth/verify?token=<raw> without parsing the URL.
      this.logger.log(`[dev] Magic link raw token: ${plainToken}`);
    }

    const emailTemplate = PortalMagicLinkEmail({
      magicLinkUrl,
      expiresInMinutes: expiryMinutes,
      recipientName: portalUser.name ?? undefined,
    });

    const html = await render(emailTemplate, { pretty: true });
    const text = await render(emailTemplate, { plainText: true });

    const fromName =
      this.twentyConfigService.get('EMAIL_FROM_NAME') ?? 'Geraci LLP';
    const fromAddress =
      this.twentyConfigService.get('EMAIL_FROM_ADDRESS') ??
      'no-reply@geraci.local';

    await this.emailService.send({
      from: `${fromName} <${fromAddress}>`,
      to: portalUser.email,
      subject: 'Your Geraci LLP Client Portal sign-in link',
      text,
      html,
    });
  }
}
