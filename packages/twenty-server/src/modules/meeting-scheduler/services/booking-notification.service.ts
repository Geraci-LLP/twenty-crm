import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BookingNotificationService {
  private readonly logger = new Logger(BookingNotificationService.name);

  async sendBookingNotification(
    meetingTypeName: string,
    guestName: string,
    guestEmail: string,
    startsAt: Date,
    notificationEmail: string,
  ): Promise<void> {
    // For MVP, log the notification. Email integration will come later.
    this.logger.log(
      `New booking for "${meetingTypeName}" by ${guestName} (${guestEmail}) at ${startsAt.toISOString()} — notification to ${notificationEmail}`,
    );
  }

  async sendBookingConfirmation(
    meetingTypeName: string,
    location: string | null,
    confirmationMessage: string | null,
    guestEmail: string,
    startsAt: Date,
    endsAt: Date,
  ): Promise<void> {
    this.logger.log(
      `Booking confirmation for "${meetingTypeName}" sent to ${guestEmail} — ${startsAt.toISOString()} to ${endsAt.toISOString()}`,
    );
  }
}
