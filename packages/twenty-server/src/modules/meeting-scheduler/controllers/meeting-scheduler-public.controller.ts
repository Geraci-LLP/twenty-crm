import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
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
import { BookingNotificationService } from 'src/modules/meeting-scheduler/services/booking-notification.service';
import { MeetingSchedulerService } from 'src/modules/meeting-scheduler/services/meeting-scheduler.service';
import { type BookingWorkspaceEntity } from 'src/modules/meeting-scheduler/standard-objects/booking.workspace-entity';
import { type MeetingTypeWorkspaceEntity } from 'src/modules/meeting-scheduler/standard-objects/meeting-type.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

type BookMeetingBody = {
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
  startTime: string;
};

@Controller('meetings')
export class MeetingSchedulerPublicController {
  private readonly logger = new Logger(MeetingSchedulerPublicController.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly meetingSchedulerService: MeetingSchedulerService,
    private readonly bookingNotificationService: BookingNotificationService,
  ) {}

  @Get(':workspaceId/:meetingTypeId/schema')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getMeetingTypeSchema(
    @Param('workspaceId') workspaceId: string,
    @Param('meetingTypeId') meetingTypeId: string,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const meetingType =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const meetingTypeRepository =
            await this.globalWorkspaceOrmManager.getRepository<MeetingTypeWorkspaceEntity>(
              workspaceId,
              'meetingType',
              { shouldBypassPermissionChecks: true },
            );

          return meetingTypeRepository.findOne({
            where: { id: meetingTypeId },
          });
        },
        authContext,
      );

    if (!isDefined(meetingType)) {
      throw new HttpException('Meeting type not found', HttpStatus.NOT_FOUND);
    }

    if (meetingType.status !== 'ACTIVE') {
      throw new HttpException(
        'Meeting type is not active',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      id: meetingType.id,
      name: meetingType.name,
      slug: meetingType.slug,
      description: meetingType.description,
      durationMinutes: meetingType.durationMinutes,
      location: meetingType.location,
      confirmationMessage: meetingType.confirmationMessage,
      color: meetingType.color,
      status: meetingType.status,
    };
  }

  @Get(':workspaceId/:meetingTypeId/slots')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getAvailableSlots(
    @Param('workspaceId') workspaceId: string,
    @Param('meetingTypeId') meetingTypeId: string,
    @Query('date') date: string,
  ) {
    await this.validateWorkspace(workspaceId);

    if (!isDefined(date)) {
      throw new HttpException(
        'Query parameter "date" is required (YYYY-MM-DD)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const meetingTypeRepository =
            await this.globalWorkspaceOrmManager.getRepository<MeetingTypeWorkspaceEntity>(
              workspaceId,
              'meetingType',
              { shouldBypassPermissionChecks: true },
            );

          const meetingType = await meetingTypeRepository.findOne({
            where: { id: meetingTypeId },
          });

          if (!isDefined(meetingType)) {
            throw new HttpException(
              'Meeting type not found',
              HttpStatus.NOT_FOUND,
            );
          }

          if (meetingType.status !== 'ACTIVE') {
            throw new HttpException(
              'Meeting type is not active',
              HttpStatus.NOT_FOUND,
            );
          }

          // Fetch existing bookings for the requested date (excluding cancelled)
          const bookingRepository =
            await this.globalWorkspaceOrmManager.getRepository<BookingWorkspaceEntity>(
              workspaceId,
              'booking',
              { shouldBypassPermissionChecks: true },
            );

          const dayStart = new Date(date + 'T00:00:00');
          const dayEnd = new Date(date + 'T23:59:59');

          const existingBookings = await bookingRepository
            .createQueryBuilder('booking')
            .where('booking.startsAt >= :dayStart', { dayStart })
            .andWhere('booking.startsAt <= :dayEnd', { dayEnd })
            .andWhere('booking.status != :cancelledStatus', {
              cancelledStatus: 'CANCELLED',
            })
            .andWhere('booking.meetingTypeId = :meetingTypeId', {
              meetingTypeId,
            })
            .getMany();

          const availabilityConfig =
            (meetingType.availabilityConfig as Record<
              string,
              { start: string; end: string }[]
            >) ?? {};

          const slots = this.meetingSchedulerService.calculateAvailableSlots(
            date,
            availabilityConfig,
            meetingType.durationMinutes,
            meetingType.bufferBeforeMinutes,
            meetingType.bufferAfterMinutes,
            meetingType.timezone ?? 'UTC',
            existingBookings,
          );

          return { date, slots };
        },
        authContext,
      );

    return result;
  }

  @Post(':workspaceId/:meetingTypeId/book')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async bookMeeting(
    @Param('workspaceId') workspaceId: string,
    @Param('meetingTypeId') meetingTypeId: string,
    @Body() body: BookMeetingBody,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const meetingTypeRepository =
            await this.globalWorkspaceOrmManager.getRepository<MeetingTypeWorkspaceEntity>(
              workspaceId,
              'meetingType',
              { shouldBypassPermissionChecks: true },
            );

          const meetingType = await meetingTypeRepository.findOne({
            where: { id: meetingTypeId },
          });

          if (!isDefined(meetingType)) {
            throw new HttpException(
              'Meeting type not found',
              HttpStatus.NOT_FOUND,
            );
          }

          if (meetingType.status !== 'ACTIVE') {
            throw new HttpException(
              'Meeting type is not active',
              HttpStatus.NOT_FOUND,
            );
          }

          // Validate the requested slot is still available
          const bookingRepository =
            await this.globalWorkspaceOrmManager.getRepository<BookingWorkspaceEntity>(
              workspaceId,
              'booking',
              { shouldBypassPermissionChecks: true },
            );

          const requestedStart = new Date(body.startTime);
          const requestedEnd = new Date(
            requestedStart.getTime() + meetingType.durationMinutes * 60000,
          );

          // Fetch bookings that could conflict (same day, not cancelled)
          const dayStart = new Date(requestedStart);

          dayStart.setHours(0, 0, 0, 0);

          const dayEnd = new Date(requestedStart);

          dayEnd.setHours(23, 59, 59, 999);

          const existingBookings = await bookingRepository
            .createQueryBuilder('booking')
            .where('booking.startsAt >= :dayStart', { dayStart })
            .andWhere('booking.startsAt <= :dayEnd', { dayEnd })
            .andWhere('booking.status != :cancelledStatus', {
              cancelledStatus: 'CANCELLED',
            })
            .andWhere('booking.meetingTypeId = :meetingTypeId', {
              meetingTypeId,
            })
            .getMany();

          const slotAvailable = this.meetingSchedulerService.isSlotAvailable(
            body.startTime,
            meetingType.durationMinutes,
            meetingType.bufferBeforeMinutes,
            meetingType.bufferAfterMinutes,
            existingBookings,
          );

          if (!slotAvailable) {
            throw new HttpException(
              'The requested time slot is no longer available',
              HttpStatus.CONFLICT,
            );
          }

          // Try to auto-link a person by email
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
                emails: { primaryEmail: body.guestEmail } as never,
              },
            });

            if (isDefined(matchingPerson)) {
              personId = matchingPerson.id;
            }
          } catch {
            // Auto-linking is best-effort; do not block booking creation
          }

          // Create the booking record
          const bookingRecord = await bookingRepository.save({
            guestName: body.guestName,
            guestEmail: body.guestEmail,
            guestNotes: body.guestNotes ?? null,
            startsAt: requestedStart,
            endsAt: requestedEnd,
            status: 'CONFIRMED',
            meetingTypeId: meetingType.id,
            personId,
          });

          // Increment bookingCount on the meeting type (async, non-blocking)
          meetingTypeRepository
            .increment({ id: meetingTypeId }, 'bookingCount', 1)
            .catch(() => {});

          // Send notification email if notifyOnBooking is enabled (async, non-blocking)
          if (
            meetingType.notifyOnBooking &&
            isDefined(meetingType.notificationEmail)
          ) {
            this.bookingNotificationService
              .sendBookingNotification(
                meetingType.name,
                body.guestName,
                body.guestEmail,
                requestedStart,
                meetingType.notificationEmail,
              )
              .catch(() => {});
          }

          // Send confirmation to guest (async, non-blocking)
          this.bookingNotificationService
            .sendBookingConfirmation(
              meetingType.name,
              meetingType.location,
              meetingType.confirmationMessage,
              body.guestEmail,
              requestedStart,
              requestedEnd,
            )
            .catch(() => {});

          return {
            booking: {
              id: bookingRecord.id,
              startsAt: bookingRecord.startsAt,
              endsAt: bookingRecord.endsAt,
              status: bookingRecord.status,
            },
            meetingType: {
              name: meetingType.name,
              location: meetingType.location,
              confirmationMessage: meetingType.confirmationMessage,
            },
          };
        },
        authContext,
      );

    this.logger.log(
      `Booking created for meeting type ${meetingTypeId} in workspace ${workspaceId}`,
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
