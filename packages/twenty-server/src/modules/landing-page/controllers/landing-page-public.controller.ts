import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isDefined } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type LandingPageWorkspaceEntity } from 'src/modules/landing-page/standard-objects/landing-page.workspace-entity';

@Controller('landing-pages')
export class LandingPagePublicController {
  private readonly logger = new Logger(LandingPagePublicController.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  @Get(':workspaceId/:slug')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getPublicLandingPage(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const landingPage =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const repository =
            await this.globalWorkspaceOrmManager.getRepository<LandingPageWorkspaceEntity>(
              workspaceId,
              'landingPage',
              { shouldBypassPermissionChecks: true },
            );

          return repository.findOne({
            where: { slug },
          });
        },
        authContext,
      );

    if (!isDefined(landingPage)) {
      throw new HttpException('Landing page not found', HttpStatus.NOT_FOUND);
    }

    if (landingPage.status !== 'PUBLISHED') {
      throw new HttpException(
        'Landing page is not published',
        HttpStatus.NOT_FOUND,
      );
    }

    // Increment view count (async, non-blocking)
    this.globalWorkspaceOrmManager
      .executeInWorkspaceContext(async () => {
        const repository =
          await this.globalWorkspaceOrmManager.getRepository<LandingPageWorkspaceEntity>(
            workspaceId,
            'landingPage',
            { shouldBypassPermissionChecks: true },
          );

        await repository.increment({ id: landingPage.id }, 'viewCount', 1);
      }, authContext)
      .catch(() => {});

    this.logger.log(
      `Public landing page served: ${slug} in workspace ${workspaceId}`,
    );

    return {
      id: landingPage.id,
      title: landingPage.title,
      slug: landingPage.slug,
      sectionsConfig: landingPage.sectionsConfig,
      metaTitle: landingPage.metaTitle,
      metaDescription: landingPage.metaDescription,
      headerConfig: landingPage.headerConfig,
      footerConfig: landingPage.footerConfig,
    };
  }

  private async validateWorkspace(workspaceId: string): Promise<void> {
    const workspaceExists = await this.workspaceRepository.existsBy({
      id: workspaceId,
    });

    if (!workspaceExists) {
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
    }
  }
}
