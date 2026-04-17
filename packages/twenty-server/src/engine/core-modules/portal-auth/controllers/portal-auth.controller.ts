import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import { type Response as ExpressResponse } from 'express';

import { MagicLinkService } from 'src/engine/core-modules/portal-auth/services/magic-link.service';
import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

type RequestLinkBody = {
  email: string;
  workspaceId: string;
};

const PORTAL_COOKIE_NAME = 'twenty_portal_token';
const PORTAL_JWT_EXPIRES_IN_SECONDS = 60 * 60; // 1 hour

@Controller('portal-auth')
export class PortalAuthController {
  private readonly logger = new Logger(PortalAuthController.name);

  constructor(
    private readonly magicLinkService: MagicLinkService,
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  @Post('request-link')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PublicEndpointGuard)
  async requestLink(@Body() body: RequestLinkBody) {
    // Always return a generic 200 to prevent email/workspace enumeration.
    if (!body?.email || !body?.workspaceId) {
      return {
        success: true,
        message:
          'If an account with that email exists, a login link has been sent.',
      };
    }

    return this.magicLinkService.requestMagicLink({
      email: body.email,
      workspaceId: body.workspaceId,
    });
  }

  @Get('verify')
  @UseGuards(PublicEndpointGuard)
  async verify(
    @Query('token') token: string,
    @Res() response: ExpressResponse,
  ) {
    const portalBaseUrl =
      this.twentyConfigService.get('PORTAL_BASE_URL') ??
      'http://localhost:3001/portal';

    try {
      const { portalUser, workspace } =
        await this.magicLinkService.verifyMagicLink(token);

      const appSecret = this.twentyConfigService.get('APP_SECRET');

      if (!appSecret) {
        throw new Error('APP_SECRET is not set');
      }

      // oxlint-disable-next-line @typescript-eslint/no-explicit-any
      const jwt = (this.jwtWrapperService as any).sign(
        {
          sub: portalUser.id,
          type: 'portalUser',
          portalUserId: portalUser.id,
          workspaceId: workspace.id,
          personId: portalUser.personId,
          email: portalUser.email,
        },
        {
          secret: appSecret,
          expiresIn: `${PORTAL_JWT_EXPIRES_IN_SECONDS}s`,
        },
      );

      const cookieAttrs = [
        `${PORTAL_COOKIE_NAME}=${jwt}`,
        'HttpOnly',
        'Path=/',
        'SameSite=Lax',
        `Max-Age=${PORTAL_JWT_EXPIRES_IN_SECONDS}`,
      ];

      if (portalBaseUrl.startsWith('https://')) {
        cookieAttrs.push('Secure');
      }

      response.setHeader('Set-Cookie', cookieAttrs.join('; '));

      return response.redirect(portalBaseUrl);
    } catch (error) {
      this.logger.warn(
        `Portal verify failed: ${(error as Error).message ?? 'unknown error'}`,
      );

      return response.redirect(
        `${portalBaseUrl.replace(/\/$/, '')}/auth/error`,
      );
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PublicEndpointGuard)
  async logout(@Res() response: ExpressResponse) {
    const portalBaseUrl = this.twentyConfigService.get('PORTAL_BASE_URL') ?? '';

    const cookieAttrs = [
      `${PORTAL_COOKIE_NAME}=`,
      'HttpOnly',
      'Path=/',
      'SameSite=Lax',
      'Max-Age=0',
    ];

    if (portalBaseUrl.startsWith('https://')) {
      cookieAttrs.push('Secure');
    }

    response.setHeader('Set-Cookie', cookieAttrs.join('; '));
    response.status(HttpStatus.OK).json({ success: true });
  }
}
