import { Injectable, Logger } from '@nestjs/common';

import { type SendMailOptions } from 'nodemailer';

import { type EmailDriverInterface } from 'src/engine/core-modules/email/drivers/interfaces/email-driver.interface';

// Personalizations for each recipient in a batch
export type SendGridPersonalization = {
  to: string;
  substitutions?: Record<string, string>;
};

export type SendGridBatchOptions = {
  subject: string;
  htmlContent: string;
  from: { email: string; name: string };
  recipientIds: string[];
  personalizations?: SendGridPersonalization[];
};

@Injectable()
export class SendGridDriverService implements EmailDriverInterface {
  private readonly logger = new Logger(SendGridDriverService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.sendgrid.com/v3/mail/send';

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY ?? '';

    if (!this.apiKey) {
      this.logger.warn(
        'SENDGRID_API_KEY is not set. SendGrid email sending will not work.',
      );
    }
  }

  // Implements EmailDriverInterface for single email sending
  async send(sendMailOptions: SendMailOptions): Promise<void> {
    const payload = {
      personalizations: [
        {
          to: this.normalizeRecipients(sendMailOptions.to),
        },
      ],
      from: this.normalizeFrom(sendMailOptions.from),
      subject: sendMailOptions.subject,
      content: [
        {
          type: 'text/html',
          value: sendMailOptions.html ?? sendMailOptions.text ?? '',
        },
      ],
    };

    await this.callSendGridApi(payload);
  }

  // Batch sending with personalizations (up to 1000 per API call)
  async sendBatch(options: SendGridBatchOptions): Promise<void> {
    const personalizations =
      options.personalizations?.map((personalization) => ({
        to: [{ email: personalization.to }],
        substitutions: personalization.substitutions,
      })) ?? [];

    if (personalizations.length === 0) {
      this.logger.warn('No personalizations provided for batch send');

      return;
    }

    const payload = {
      personalizations,
      from: options.from,
      subject: options.subject,
      content: [
        {
          type: 'text/html',
          value: options.htmlContent,
        },
      ],
    };

    await this.callSendGridApi(payload);
  }

  private async callSendGridApi(payload: unknown): Promise<void> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
          `SendGrid API returned ${response.status}: ${errorBody}`,
        );
      }

      this.logger.log('Email sent successfully via SendGrid');
    } catch (error) {
      this.logger.error(`SendGrid API call failed: ${error}`);

      throw error;
    }
  }

  private normalizeRecipients(
    recipients: SendMailOptions['to'],
  ): Array<{ email: string; name?: string }> {
    if (!recipients) {
      return [];
    }

    if (typeof recipients === 'string') {
      return [{ email: recipients }];
    }

    if (Array.isArray(recipients)) {
      return recipients.map((recipient) => {
        if (typeof recipient === 'string') {
          return { email: recipient };
        }

        return { email: recipient.address ?? '', name: recipient.name };
      });
    }

    if (typeof recipients === 'object' && 'address' in recipients) {
      return [{ email: recipients.address ?? '', name: recipients.name }];
    }

    return [{ email: String(recipients) }];
  }

  private normalizeFrom(
    from: SendMailOptions['from'],
  ): { email: string; name?: string } {
    if (!from) {
      return { email: '' };
    }

    if (typeof from === 'string') {
      return { email: from };
    }

    if (Array.isArray(from)) {
      const first = from[0];

      if (typeof first === 'string') {
        return { email: first };
      }

      return { email: first?.address ?? '', name: first?.name };
    }

    if ('address' in from) {
      return { email: from.address ?? '', name: from.name };
    }

    return { email: String(from) };
  }
}
