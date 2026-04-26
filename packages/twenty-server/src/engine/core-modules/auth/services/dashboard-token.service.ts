import { Injectable } from '@nestjs/common';

import { AccessTokenService } from 'src/engine/core-modules/auth/token/services/access-token.service';
import { AuthProviderEnum } from 'src/engine/core-modules/workspace/types/workspace.type';

// Hands a CRM user off to the external dashboard app (e.g. dash.geracillp.com)
// by minting a regular workspace-scoped access token via AccessTokenService.
//
// MVP shortcut: this is the same shape as the user's normal CRM access token,
// which means the dashboard token grants full CRM permissions for that user.
// Acceptable for a single-tenant fork; revisit when we need true audience
// scoping (e.g. add an `aud === 'dashboard'` enforcement to JwtAuthStrategy
// and a separate sign path that the strategy still accepts).
@Injectable()
export class DashboardTokenService {
  constructor(private readonly accessTokenService: AccessTokenService) {}

  async generateDashboardToken(
    userId: string,
    workspaceId: string,
    _email: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const accessToken = await this.accessTokenService.generateAccessToken({
      userId,
      workspaceId,
      authProvider: AuthProviderEnum.Password,
    });

    return {
      token: accessToken.token,
      expiresAt: new Date(accessToken.expiresAt),
    };
  }
}
