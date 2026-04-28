import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { DashboardTokenDto } from 'src/engine/core-modules/auth/dto/dashboard-token.dto';
import { DashboardTokenService } from 'src/engine/core-modules/auth/services/dashboard-token.service';
import { type AuthContextUser } from 'src/engine/core-modules/auth/types/auth-context.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

// Mints a short-lived, audience-scoped JWT for the external dashboard app.
// Requires an authenticated CRM user + an active workspace context so we can
// bake both ids (plus the user's email) into the token payload.
@MetadataResolver()
@Resolver()
export class DashboardTokenResolver {
  constructor(private readonly dashboardTokenService: DashboardTokenService) {}

  @Mutation(() => DashboardTokenDto)
  @UseGuards(WorkspaceAuthGuard, UserAuthGuard, NoPermissionGuard)
  async generateDashboardToken(
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<DashboardTokenDto> {
    return await this.dashboardTokenService.generateDashboardToken(
      user.id,
      workspace.id,
      user.email,
    );
  }
}
