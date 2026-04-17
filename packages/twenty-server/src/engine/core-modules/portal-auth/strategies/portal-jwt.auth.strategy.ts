import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { Request as ExpressRequest } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { type PortalUserJwtPayload } from 'src/engine/core-modules/auth/types/auth-context.type';
import { type PortalUserWorkspaceAuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { PortalUserService } from 'src/engine/core-modules/portal-user/services/portal-user.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

const PORTAL_COOKIE_NAME = 'twenty_portal_token';

const cookieExtractor = (request: ExpressRequest): string | null => {
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  const cookies = (request as any)?.cookies as
    | Record<string, string>
    | undefined;

  if (cookies && typeof cookies[PORTAL_COOKIE_NAME] === 'string') {
    return cookies[PORTAL_COOKIE_NAME];
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
