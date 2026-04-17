import { Injectable } from '@nestjs/common';

import { addMilliseconds } from 'date-fns';

import { JwtTokenTypeEnum } from 'src/engine/core-modules/auth/types/auth-context.type';
import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
import { AuthProviderEnum } from 'src/engine/core-modules/workspace/types/workspace.type';

// Short-lived JWT used to hand a CRM user off to the external dashboard app
// (e.g. dash.geracillp.com). Deliberately narrow: only the claims the dashboard
// needs to identify the caller, and an `audience: 'dashboard'` claim so the
// main CRM API can reject the token if it ever gets presented there.
//
// Signed with APP_SECRET (via JwtWrapperService) — symmetric, same root secret
// family as the other tokens so the CRM can later verify it if needed.

const DASHBOARD_TOKEN_AUDIENCE = 'dashboard';
const DASHBOARD_TOKEN_EXPIRES_IN_SECONDS = 60 * 60; // 1 hour

export type DashboardTokenPayload = {
  sub: string;
  userId: string;
  workspaceId: string;
  email: string;
  aud: typeof DASHBOARD_TOKEN_AUDIENCE;
  // `type` is included so JwtWrapperService.verifyJwtToken can find a matching
  // secret body if this token is ever verified via the shared path. We reuse
  // WORKSPACE_AGNOSTIC since it keys on userId — matching our sign call.
  type: JwtTokenTypeEnum.WORKSPACE_AGNOSTIC;
  authProvider: AuthProviderEnum;
};

@Injectable()
export class DashboardTokenService {
  constructor(private readonly jwtWrapperService: JwtWrapperService) {}

  async generateDashboardToken(
    userId: string,
    workspaceId: string,
    email: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const expiresInMs = DASHBOARD_TOKEN_EXPIRES_IN_SECONDS * 1000;
    const expiresAt = addMilliseconds(new Date(), expiresInMs);

    const payload: DashboardTokenPayload = {
      sub: userId,
      userId,
      workspaceId,
      email,
      aud: DASHBOARD_TOKEN_AUDIENCE,
      type: JwtTokenTypeEnum.WORKSPACE_AGNOSTIC,
      authProvider: AuthProviderEnum.Password,
    };

    const token = this.jwtWrapperService.sign(payload, {
      secret: this.jwtWrapperService.generateAppSecret(
        JwtTokenTypeEnum.WORKSPACE_AGNOSTIC,
        userId,
      ),
      expiresIn: `${DASHBOARD_TOKEN_EXPIRES_IN_SECONDS}s`,
      audience: DASHBOARD_TOKEN_AUDIENCE,
    });

    return { token, expiresAt };
  }
}
