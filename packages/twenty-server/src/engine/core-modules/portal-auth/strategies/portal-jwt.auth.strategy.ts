import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { Request as ExpressRequest } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import {
  type PortalUserJwtPayload,
  type PortalUserWorkspaceAuthContext,
} from 'src/engine/core-modules/auth/types/auth-context.type';
import { PortalUserService } from 'src/engine/core-modules/portal-user/services/portal-user.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

const PORTAL_COOKIE_NAME = 'twenty_portal_token';

// Twenty doesn't apply cookie-parser middleware globally, so `request.cookies`
// is undefined on /graphql and /metadata endpoints. Parse the raw Cookie
// header ourselves to extract the portal token.
const cookieExtractor = (request: ExpressRequest): string | null => {
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedCookies = (request as any)?.cookies as
    | Record<string, string>
    | undefined;

  if (parsedCookies && typeof parsedCookies[PORTAL_COOKIE_NAME] === 'string') {
    return parsedCookies[PORTAL_COOKIE_NAME];
  }

  const rawCookieHeader = request.headers?.cookie;

  if (typeof rawCookieHeader !== 'string') {
    return null;
  }

  for (const part of rawCookieHeader.split(';')) {
    const eq = part.indexOf('=');

    if (eq === -1) continue;

    const name = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();

    if (name === PORTAL_COOKIE_NAME) {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }

  return null;
};

@Injectable()
export class PortalJwtAuthStrategy extends PassportStrategy(
  Strategy,
  'portal-jwt',
) {
  constructor(
    twentyConfigService: TwentyConfigService,
    private readonly portalUserService: PortalUserService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {
    const appSecret = twentyConfigService.get('APP_SECRET');

    if (!appSecret) {
      throw new Error('APP_SECRET is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: appSecret,
    });
  }

  async validate(
    payload: PortalUserJwtPayload,
  ): Promise<PortalUserWorkspaceAuthContext> {
    if (payload?.type !== 'portalUser' || !payload.portalUserId) {
      throw new UnauthorizedException('Invalid portal token');
    }

    const portalUser = await this.portalUserService.findById(
      payload.portalUserId,
    );

    if (!portalUser || !portalUser.isActive) {
      throw new UnauthorizedException('Portal user not found or inactive');
    }

    if (portalUser.workspaceId !== payload.workspaceId) {
      throw new UnauthorizedException('Workspace mismatch');
    }

    const workspace = await this.workspaceRepository.findOne({
      where: { id: portalUser.workspaceId },
    });

    if (!workspace) {
      throw new UnauthorizedException('Workspace not found');
    }

    return {
      type: 'portalUser',
      portalUserId: portalUser.id,
      workspaceId: portalUser.workspaceId,
      personId: portalUser.personId,
      email: portalUser.email,
      workspace,
    };
  }
}
