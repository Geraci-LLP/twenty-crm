import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
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
import { type DocumentSharingLinkWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-sharing-link.workspace-entity';
import { type DocumentViewWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/document-view.workspace-entity';
import { type TrackedDocumentWorkspaceEntity } from 'src/modules/document-tracking/standard-objects/tracked-document.workspace-entity';
import { DocumentViewService } from 'src/modules/document-tracking/services/document-view.service';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

type IdentifyBody = {
  email: string;
  name?: string;
};

type TrackBody = {
  viewId: string;
  durationSeconds: number;
  pagesViewed: number;
  completionPercent: number;
};

// Twenty ORM generates *Id columns for relations at the DB level,
// but the workspace entity types only declare the relation objects.
// These extended types expose the FK columns for type-safe access.
type SharingLinkWithForeignKeys = DocumentSharingLinkWorkspaceEntity & {
  trackedDocumentId?: string | null;
  quoteId?: string | null;
  targetType?: string | null;
};

// Polymorphism guard: documentSharingLink is shared between tracked-documents
// (F9) and quotes (F11). The /documents/* endpoints must NOT serve quote
// sharing links. A row is treated as a document link when targetType is
// either DOCUMENT, null (legacy pre-targetType rows), or absent, AND it has
// a trackedDocumentId. Any row with targetType = 'QUOTE' is rejected as 404.
const isDocumentSharingLink = (link: SharingLinkWithForeignKeys): boolean => {
  if (link.targetType === 'QUOTE') return false;

  if (!isDefined(link.trackedDocumentId)) return false;

  return true;
};

@Controller('documents')
export class DocumentPublicController {
  private readonly logger = new Logger(DocumentPublicController.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly documentViewService: DocumentViewService,
  ) {}

  @Get(':workspaceId/:slug')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getDocumentBySlug(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const sharingLinkRepository =
            await this.globalWorkspaceOrmManager.getRepository<SharingLinkWithForeignKeys>(
              workspaceId,
              'documentSharingLink',
              { shouldBypassPermissionChecks: true },
            );

          const sharingLink = await sharingLinkRepository.findOne({
            where: { slug },
          });

          if (!isDefined(sharingLink) || !isDocumentSharingLink(sharingLink)) {
            throw new HttpException(
              'Sharing link not found',
              HttpStatus.NOT_FOUND,
            );
          }

          if (!sharingLink.isActive) {
            throw new HttpException(
              'Sharing link is no longer active',
              HttpStatus.GONE,
            );
          }

          const documentRepository =
            await this.globalWorkspaceOrmManager.getRepository<TrackedDocumentWorkspaceEntity>(
              workspaceId,
              'trackedDocument',
              { shouldBypassPermissionChecks: true },
            );

          const document = await documentRepository.findOne({
            where: { id: sharingLink.trackedDocumentId as string },
          });

          if (!isDefined(document)) {
            throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
          }

          // Increment sharing link view count (async, non-blocking)
          sharingLinkRepository
            .increment({ id: sharingLink.id }, 'viewCount', 1)
            .catch(() => {});

          // Return limited metadata when email gate is enabled
          if (document.requireEmail) {
            return {
              requiresEmail: true,
              document: {
                name: document.name,
                mimeType: document.mimeType,
                pageCount: document.pageCount,
              },
            };
          }

          return {
            requiresEmail: false,
            document: {
              id: document.id,
              name: document.name,
              description: document.description,
              mimeType: document.mimeType,
              pageCount: document.pageCount,
              status: document.status,
              enableDownload: document.enableDownload,
            },
          };
        },
        authContext,
      );

    this.logger.log(
      `Document metadata served for slug "${slug}" in workspace ${workspaceId}`,
    );

    return result;
  }

  @Post(':workspaceId/:slug/identify')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async identifyViewer(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
    @Body() body: IdentifyBody,
  ) {
    await this.validateWorkspace(workspaceId);

    if (!isDefined(body.email)) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const sharingLinkRepository =
            await this.globalWorkspaceOrmManager.getRepository<SharingLinkWithForeignKeys>(
              workspaceId,
              'documentSharingLink',
              { shouldBypassPermissionChecks: true },
            );

          const sharingLink = await sharingLinkRepository.findOne({
            where: { slug },
          });

          if (!isDefined(sharingLink) || !isDocumentSharingLink(sharingLink)) {
            throw new HttpException(
              'Sharing link not found',
              HttpStatus.NOT_FOUND,
            );
          }

          if (!sharingLink.isActive) {
            throw new HttpException(
              'Sharing link is no longer active',
              HttpStatus.GONE,
            );
          }

          const documentViewRepository =
            await this.globalWorkspaceOrmManager.getRepository<DocumentViewWorkspaceEntity>(
              workspaceId,
              'documentView',
              { shouldBypassPermissionChecks: true },
            );

          const documentView = await documentViewRepository.save({
            viewerEmail: body.email,
            viewerName: body.name ?? null,
            viewedAt: new Date(),
            trackedDocumentId: sharingLink.trackedDocumentId,
            documentSharingLinkId: sharingLink.id,
          } as Partial<DocumentViewWorkspaceEntity>);

          // Try to auto-link to an existing person by primary email
          let personId: string | null = null;

          try {
            const personRepository =
              await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
                workspaceId,
                'person',
                { shouldBypassPermissionChecks: true },
              );

            const matchingPerson = await personRepository.findOne({
              where: {
                emails: { primaryEmail: body.email.toLowerCase() } as never,
              },
            });

            if (isDefined(matchingPerson)) {
              personId = matchingPerson.id;
            }
          } catch {
            // Auto-linking is best-effort; do not block the identify flow
          }

          if (isDefined(personId)) {
            await documentViewRepository.update({ id: documentView.id }, {
              personId,
            } as Partial<DocumentViewWorkspaceEntity>);
          }

          // Send notification if the document has it enabled (async, non-blocking)
          const documentRepository =
            await this.globalWorkspaceOrmManager.getRepository<TrackedDocumentWorkspaceEntity>(
              workspaceId,
              'trackedDocument',
              { shouldBypassPermissionChecks: true },
            );

          const document = await documentRepository.findOne({
            where: { id: sharingLink.trackedDocumentId as string },
          });

          if (
            isDefined(document) &&
            document.notifyOnView &&
            isDefined(document.notificationEmail)
          ) {
            this.documentViewService
              .sendViewNotificationEmail(
                document.name,
                body.email,
                body.name ?? null,
                document.notificationEmail,
              )
              .catch(() => {});
          }

          return {
            accessGranted: true,
            viewId: documentView.id,
          };
        },
        authContext,
      );

    this.logger.log(
      `Viewer identified for slug "${slug}" in workspace ${workspaceId}: ${body.email}`,
    );

    return result;
  }

  @Post(':workspaceId/:slug/track')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async trackViewAnalytics(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
    @Body() body: TrackBody,
  ) {
    await this.validateWorkspace(workspaceId);

    if (!isDefined(body.viewId)) {
      throw new HttpException('viewId is required', HttpStatus.BAD_REQUEST);
    }

    const authContext = buildSystemAuthContext(workspaceId);

    // Analytics tracking is non-blocking — fire and forget
    this.globalWorkspaceOrmManager
      .executeInWorkspaceContext(async () => {
        const documentViewRepository =
          await this.globalWorkspaceOrmManager.getRepository<DocumentViewWorkspaceEntity>(
            workspaceId,
            'documentView',
            { shouldBypassPermissionChecks: true },
          );

        await documentViewRepository.update(
          { id: body.viewId },
          {
            durationSeconds: body.durationSeconds,
            pagesViewed: body.pagesViewed,
            completionPercent: body.completionPercent,
          },
        );
      }, authContext)
      .catch(() => {});

    this.logger.log(
      `View analytics tracked for slug "${slug}", viewId ${body.viewId} in workspace ${workspaceId}`,
    );

    return { success: true };
  }

  @Get(':workspaceId/:slug/view')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async viewDocument(
    @Param('workspaceId') workspaceId: string,
    @Param('slug') slug: string,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const sharingLinkRepository =
            await this.globalWorkspaceOrmManager.getRepository<SharingLinkWithForeignKeys>(
              workspaceId,
              'documentSharingLink',
              { shouldBypassPermissionChecks: true },
            );

          const sharingLink = await sharingLinkRepository.findOne({
            where: { slug },
          });

          if (!isDefined(sharingLink) || !isDocumentSharingLink(sharingLink)) {
            throw new HttpException(
              'Sharing link not found',
              HttpStatus.NOT_FOUND,
            );
          }

          if (!sharingLink.isActive) {
            throw new HttpException(
              'Sharing link is no longer active',
              HttpStatus.GONE,
            );
          }

          const documentRepository =
            await this.globalWorkspaceOrmManager.getRepository<TrackedDocumentWorkspaceEntity>(
              workspaceId,
              'trackedDocument',
              { shouldBypassPermissionChecks: true },
            );

          const document = await documentRepository.findOne({
            where: { id: sharingLink.trackedDocumentId as string },
          });

          if (!isDefined(document)) {
            throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
          }

          // Actual file serving via FileStorageService will be added in a future iteration
          return {
            name: document.name,
            mimeType: document.mimeType,
            pageCount: document.pageCount,
            status: document.status,
          };
        },
        authContext,
      );

    this.logger.log(
      `Document view served for slug "${slug}" in workspace ${workspaceId}`,
    );

    return result;
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
