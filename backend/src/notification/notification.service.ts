import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface BookingAlertDetails {
  clientName: string;
  clientPhone: string;
  date: string;
  timeSlot: string;
  serviceName: string;
  price?: string;
  priceValue?: number;
  comment?: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  private getCleanBotToken(): string | null {
    const rawToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    if (!rawToken) return null;
    const cleanToken = rawToken.replace(/;/g, '').replace(/^bot/i, '').trim();
    return cleanToken || null;
  }

  async sendBookingAlert(
    recipientChatId: string | null | undefined,
    details: BookingAlertDetails
  ) {
    if (!recipientChatId) {
      this.logger.log('No recipient notification ID / Telegram Chat ID provided. Skipping alert.');
      return;
    }

    const priceNum = details.priceValue || parseInt(details.price?.replace(/\D/g, '') || '0', 10);
    const earnings = Math.round(priceNum * 0.4);

    const messageText = [
      '✂️ <b>НОВИЙ ЗАПИС У САЛОН ЛЕЛЕЯ!</b>',
      '',
      `📅 <b>Дата та час:</b> ${details.date}, ${details.timeSlot}`,
      `👤 <b>Клієнт:</b> ${details.clientName}`,
      `📞 <b>Телефон:</b> ${details.clientPhone}`,
      `💇‍♂️ <b>Послуга:</b> ${details.serviceName} (${details.price || priceNum + ' грн'})`,
      `💬 <b>Коментар:</b> ${details.comment || 'Немає'}`,
      `💰 <b>Ваш дохід (40%):</b> ${earnings} грн`,
    ].join('\n');

    await this.dispatchNotification(recipientChatId, messageText);
  }

  async sendRescheduleAlert(
    recipientChatId: string | null | undefined,
    details: BookingAlertDetails
  ) {
    if (!recipientChatId) {
      this.logger.log('No recipient notification ID / Telegram Chat ID provided. Skipping alert.');
      return;
    }

    const messageText = [
      '⚠️ <b>УВАГА! ЗАПИС КЛІЄНТА ПЕРЕНЕСЕНО</b>',
      '',
      `👤 <b>Клієнт:</b> ${details.clientName}`,
      `📅 <b>Нова дата та час:</b> ${details.date}, ${details.timeSlot}`,
      `📞 <b>Телефон:</b> ${details.clientPhone}`,
      `💇‍♂️ <b>Послуга:</b> ${details.serviceName}`,
      `💬 <b>Коментар:</b> ${details.comment || 'Немає'}`,
    ].join('\n');

    await this.dispatchNotification(recipientChatId, messageText);
  }

  private async dispatchNotification(chatId: string, text: string) {
    const botToken = this.getCleanBotToken();
    const webhookUrl = process.env.NOTIFICATIONS_WEBHOOK_URL;
    const secretKey = process.env.API_SECRET_KEY;

    const cleanChatId = chatId.trim();

    // 1. Send via Telegram Bot API if botToken is present
    if (botToken) {
      try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await axios.post(url, {
          chat_id: cleanChatId,
          text: text,
          parse_mode: 'HTML',
        });
        this.logger.log(`Telegram notification successfully sent to Chat ID: ${cleanChatId}`);
      } catch (err: any) {
        const errDetails = err.response?.data ? JSON.stringify(err.response.data) : err.message;
        this.logger.error(`Failed to send Telegram message to Chat ID ${cleanChatId}: ${errDetails}`);
      }
    }

    // 2. Send via Webhook URL if NOTIFICATIONS_WEBHOOK_URL is set
    if (webhookUrl) {
      try {
        await axios.post(
          webhookUrl,
          {
            chatId: cleanChatId,
            message: text,
          },
          {
            headers: secretKey ? { Authorization: `Bearer ${secretKey}` } : {},
          }
        );
        this.logger.log(`Webhook notification successfully sent to ${webhookUrl}`);
      } catch (err: any) {
        this.logger.error(`Failed to dispatch webhook notification: ${err.message}`);
      }
    }

    if (!botToken && !webhookUrl) {
      this.logger.log(`[SIMULATED NOTIFICATION] To: ${cleanChatId}\n${text}`);
    }
  }
}
