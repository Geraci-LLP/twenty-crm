import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { MeetingSchedulerPublicController } from 'src/modules/meeting-scheduler/controllers/meeting-scheduler-public.controller';
import { MeetingSchedulerService } from 'src/modules/meeting-scheduler/services/meeting-scheduler.service';
import { BookingNotificationService } from 'src/modules/meeting-scheduler/services/booking-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  controllers: [MeetingSchedulerPublicController],
  providers: [MeetingSchedulerService, BookingNotificationService],
  exports: [],
})
export class MeetingSchedulerModule {}
