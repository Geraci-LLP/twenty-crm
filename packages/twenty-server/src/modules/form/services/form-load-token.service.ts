import { Injectable } from '@nestjs/common';

import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';

// Issues + verifies short-lived JWTs that bind a single form-load to a
// later submission. The flow:
//
//   1. Browser GETs /forms/<wid>/<fid>/schema — server signs a token
//      with subject "form-load", workspaceId + formId claims, and the
//      issuedAt timestamp baked in (the JWT's iat claim, RFC 7519).
//   2. Browser POSTs /forms/<wid>/<fid>/submit with body.formLoadToken
//      set to that token.
//   3. Server verifies signature, subject, claims, age, and rejects on
//      any mismatch.
//
// Time-trap: JWT.iat plus a per-form `minSubmitTimeSeconds` floor means
// instant-fire bots are caught even if they have a valid token.
//
// Tokens expire after 24h — bots that scrape and replay later get a
// "token expired" rejection. 24h is generous enough that humans who
// open a form and finish filling it tomorrow still succeed.

const TOKEN_SUBJECT = 'form-load';
const TOKEN_TTL = '24h';

export type FormLoadTokenPayload = {
  sub: string;
  workspaceId: string;
  formId: string;
  iat?: number;
  exp?: number;
};

export type FormLoadTokenVerdict =
  | { valid: true; ageSeconds: number }
  | { valid: false; reason: string };

@Injectable()
export class FormLoadTokenService {
  constructor(private readonly jwtWrapperService: JwtWrapperService) {}

  sign(workspaceId: string, formId: string): string {
    return this.jwtWrapperService.sign(
      {
        sub: TOKEN_SUBJECT,
        workspaceId,
        formId,
      } as never,
      { expiresIn: TOKEN_TTL },
    );
  }

  async verify(
    token: string | undefined | null,
    workspaceId: string,
    formId: string,
    minSubmitTimeSeconds: number | null,
  ): Promise<FormLoadTokenVerdict> {
    if (typeof token !== 'string' || token.trim() === '') {
      return { valid: false, reason: 'missing-token' };
    }
    let payload: FormLoadTokenPayload;
    try {
      payload =
        (await this.jwtWrapperService.verifyJwtToken(token)) as FormLoadTokenPayload;
    } catch {
      return { valid: false, reason: 'invalid-or-expired-token' };
    }
    if (payload.sub !== TOKEN_SUBJECT) {
      return { valid: false, reason: 'wrong-subject' };
    }
    if (payload.workspaceId !== workspaceId || payload.formId !== formId) {
      return { valid: false, reason: 'token-form-mismatch' };
    }
    // Time-trap: compare token age against the per-form floor.
    const issuedAtSec = typeof payload.iat === 'number' ? payload.iat : 0;
    const nowSec = Math.floor(Date.now() / 1000);
    const ageSeconds = Math.max(0, nowSec - issuedAtSec);
    const floor =
      typeof minSubmitTimeSeconds === 'number' && minSubmitTimeSeconds > 0
        ? minSubmitTimeSeconds
        : 2;
    if (ageSeconds < floor) {
      return { valid: false, reason: `submit-too-fast-${ageSeconds}s` };
    }
    return { valid: true, ageSeconds };
  }
}
