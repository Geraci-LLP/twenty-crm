import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

import { type Request as ExpressRequest } from 'express';

import { type PortalUserWorkspaceAuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';

@Injectable()
export class PortalAuthGuard extends AuthGuard('portal-jwt') {
  getRequest(context: ExecutionContext): ExpressRequest {
    if (context.getType<'graphql' | 'http'>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);

      return gqlContext.getContext().req;
    }

    return context.switchToHttp().getRequest<ExpressRequest>();
  }

  handleRequest<TUser = PortalUserWorkspaceAuthContext>(
    err: unknown,
    user: TUser | false,
  ): TUser {
    if (err || !user) {
      throw new ForbiddenException('Portal authentication required');
    }

    const context = user as unknown as PortalUserWorkspaceAuthContext;

    if (context.type !== 'portalUser') {
      throw new ForbiddenException('Non-portal auth context is not allowed');
    }

    return user as TUser;
  }
}
