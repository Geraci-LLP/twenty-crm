import { Injectable, Logger } from '@nestjs/common';

type TimeWindow = {
  start: string; // HH:mm
  end: string; // HH:mm
};

type AvailabilityConfig = Record<string, TimeWindow[]>; // key: day name (monday, tuesday, etc.)

type TimeSlot = {
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
};

type ExistingBooking = {
  startsAt: Date;
  endsAt: Date;
};

@Injectable()
export class MeetingSchedulerService {
  private readonly logger = new Logger(MeetingSchedulerService.name);

  calculateAvailableSlots(
    date: string,
    availabilityConfig: AvailabilityConfig,
    durationMinutes: number,
    bufferBeforeMinutes: number,
    bufferAfterMinutes: number,
    timezone: string,
    existingBookings: ExistingBooking[],
  ): TimeSlot[] {
    const requestedDate = new Date(date + 'T00:00:00');
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const dayName = dayNames[requestedDate.getDay()];

    const windows = availabilityConfig[dayName];

    if (!windows || windows.length === 0) {
      return [];
    }

    const slots: TimeSlot[] = [];

    for (const window of windows) {
      const [startHour, startMinute] = window.start.split(':').map(Number);
      const [endHour, endMinute] = window.end.split(':').map(Number);

      const windowStart = new Date(requestedDate);

      windowStart.setHours(startHour, startMinute, 0, 0);

      const windowEnd = new Date(requestedDate);

      windowEnd.setHours(endHour, endMinute, 0, 0);

      let slotStart = new Date(windowStart);

      while (
        slotStart.getTime() + durationMinutes * 60000 <=
        windowEnd.getTime()
      ) {
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

        // Check buffer zones around existing bookings
        const bufferStart = new Date(
          slotStart.getTime() - bufferBeforeMinutes * 60000,
        );
        const bufferEnd = new Date(
          slotEnd.getTime() + bufferAfterMinutes * 60000,
        );

        const hasConflict = existingBookings.some((booking) => {
          const bookingStart = new Date(booking.startsAt);
          const bookingEnd = new Date(booking.endsAt);

          return bufferStart < bookingEnd && bufferEnd > bookingStart;
        });

        if (!hasConflict) {
          slots.push({
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
          });
        }

        // Move to next slot (30-minute increments)
        slotStart = new Date(slotStart.getTime() + 30 * 60000);
      }
    }

    return slots;
  }

  isSlotAvailable(
    startTime: string,
    durationMinutes: number,
    bufferBeforeMinutes: number,
    bufferAfterMinutes: number,
    existingBookings: ExistingBooking[],
  ): boolean {
    const slotStart = new Date(startTime);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);
    const bufferStart = new Date(
      slotStart.getTime() - bufferBeforeMinutes * 60000,
    );
    const bufferEnd = new Date(slotEnd.getTime() + bufferAfterMinutes * 60000);

    return !existingBookings.some((booking) => {
      const bookingStart = new Date(booking.startsAt);
      const bookingEnd = new Date(booking.endsAt);

      return bufferStart < bookingEnd && bufferEnd > bookingStart;
    });
  }
}
