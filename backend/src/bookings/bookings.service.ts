import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';
import { NotificationService } from '../notification/notification.service';
import { BookingStatus } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) {}

  async getAvailableMastersForDate(dateStr: string) {
    const startOfDay = dayjs(dateStr).startOf('day').toDate();
    const endOfDay = dayjs(dateStr).endOf('day').toDate();

    const schedules = await this.prisma.workSchedule.findMany({
      where: {
        workDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        master: {
          isActive: true,
        },
      },
      include: {
        master: true,
      },
      orderBy: {
        master: {
          name: 'asc',
        },
      },
    });

    const mastersMap = new Map<string, { id: string; name: string; isActive: boolean }>();
    for (const s of schedules) {
      if (s.master && s.master.isActive) {
        mastersMap.set(s.master.id, {
          id: s.master.id,
          name: s.master.name,
          isActive: s.master.isActive,
        });
      }
    }

    return Array.from(mastersMap.values());
  }

  async getAvailableSlots(dateString: string, masterId?: string, serviceId?: string) {
    const allSlots: string[] = [];
    let currentMinutes = 9 * 60; // 09:00
    const endMinutes = 20 * 60; // 20:00

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const mins = currentMinutes % 60;
      const formattedSlot = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      allSlots.push(formattedSlot);
      currentMinutes += 30;
    }

    const workingMasters = await this.getAvailableMastersForDate(dateString);
    const workingMasterIds = new Set(workingMasters.map((m) => m.id));

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        date: dateString,
        status: {
          not: BookingStatus.CANCELLED,
        },
      },
      select: {
        timeSlot: true,
        masterId: true,
      },
    });

    const slotsResult = allSlots.map((slot) => {
      if (workingMasters.length === 0) {
        return { timeSlot: slot, isAvailable: false };
      }

      if (masterId && masterId !== 'ANY') {
        if (!workingMasterIds.has(masterId)) {
          return { timeSlot: slot, isAvailable: false };
        }
        const isBooked = existingBookings.some(
          (b) => b.timeSlot === slot && (b.masterId === masterId || b.masterId === null)
        );
        return { timeSlot: slot, isAvailable: !isBooked };
      }

      const bookingsAtSlot = existingBookings.filter((b) => b.timeSlot === slot);
      const bookedMasterIdsAtSlot = new Set(
        bookingsAtSlot.filter((b) => b.masterId).map((b) => b.masterId)
      );
      const unassignedBookingsCount = bookingsAtSlot.filter((b) => !b.masterId).length;

      const totalBusyCount = bookedMasterIdsAtSlot.size + unassignedBookingsCount;
      const isAvailable = totalBusyCount < workingMasters.length;

      return { timeSlot: slot, isAvailable };
    });

    return {
      date: dateString,
      scheduledMastersCount: workingMasters.length,
      availableSlots: slotsResult,
    };
  }

  async createBooking(dto: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });

    if (!service) {
      throw new BadRequestException('Обрану послугу не знайдено в каталозі.');
    }

    const workingMasters = await this.getAvailableMastersForDate(dto.date);

    if (workingMasters.length === 0) {
      throw new BadRequestException('На обрану дату немає працюючих майстрів.');
    }

    let assignedMasterId: string | null = dto.masterId || null;
    if (assignedMasterId === 'ANY') assignedMasterId = null;

    if (assignedMasterId) {
      const masterIsWorking = workingMasters.some((m) => m.id === assignedMasterId);
      if (!masterIsWorking) {
        throw new BadRequestException('Обраний майстер не працює на цю дату.');
      }

      const existing = await this.prisma.booking.findFirst({
        where: {
          date: dto.date,
          timeSlot: dto.timeSlot,
          status: { not: BookingStatus.CANCELLED },
          OR: [
            { masterId: assignedMasterId },
            { masterId: null },
          ],
        },
      });

      if (existing) {
        throw new BadRequestException('Вибачте, цей час у даного майстра вже зайнято.');
      }
    } else {
      const existingBookings = await this.prisma.booking.findMany({
        where: {
          date: dto.date,
          timeSlot: dto.timeSlot,
          status: { not: BookingStatus.CANCELLED },
        },
      });

      const bookedMasterIds = new Set(existingBookings.map((b) => b.masterId).filter(Boolean));
      const freeMaster = workingMasters.find((m) => !bookedMasterIds.has(m.id));

      if (!freeMaster) {
        throw new BadRequestException('Вибачте, на цей час всі працюючі майстри вже зайняті.');
      }

      assignedMasterId = freeMaster.id;
    }

    const dateTimeStr = `${dto.date}T${dto.timeSlot}:00.000Z`;
    const dateTime = new Date(dateTimeStr);

    const booking = await this.prisma.booking.create({
      data: {
        clientName: dto.clientName,
        clientPhone: dto.clientPhone,
        date: dto.date,
        timeSlot: dto.timeSlot,
        dateTime: dateTime,
        comment: dto.comment,
        serviceId: dto.serviceId,
        masterId: assignedMasterId,
        status: BookingStatus.PENDING,
      },
      include: {
        service: true,
        master: true,
      },
    });

    // Send instant notification alert to master and admin if configured
    const adminChatId = (process.env.TELEGRAM_ADMIN_CHAT_ID || '').trim();
    const alertData = {
      clientName: dto.clientName,
      clientPhone: dto.clientPhone,
      date: dto.date,
      timeSlot: dto.timeSlot,
      serviceName: service.name,
      price: service.price,
      priceValue: service.priceValue,
      comment: dto.comment,
    };

    if (assignedMasterId) {
      this.prisma.master
        .findUnique({ where: { id: assignedMasterId } })
        .then((master) => {
          const masterChatId = master?.telegramChatId || master?.notificationUserId;
          if (masterChatId) {
            this.notificationService.sendBookingAlert(masterChatId, alertData);
          }
          if (adminChatId && adminChatId !== masterChatId) {
            this.notificationService.sendBookingAlert(adminChatId, alertData);
          }
        })
        .catch((err) => console.error('Failed to trigger booking notification:', err));
    } else if (adminChatId) {
      this.notificationService.sendBookingAlert(adminChatId, alertData);
    }

    const refCode = `LELEYA-${dto.date.replace(/-/g, '')}-${booking.id.slice(0, 4).toUpperCase()}`;

    return {
      success: true,
      message: 'Запис успішно створено!',
      confirmationCode: refCode,
      booking: {
        id: booking.id,
        clientName: booking.clientName,
        clientPhone: booking.clientPhone,
        serviceName: service.name,
        price: service.price,
        date: booking.date,
        timeSlot: booking.timeSlot,
        masterName: booking.master?.name || 'Лелея Майстер',
        status: booking.status,
        createdAt: booking.createdAt,
      },
    };
  }

  async rescheduleBooking(id: string, dto: RescheduleBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Запис не знайдено');
    }

    const targetMasterId = dto.masterId !== undefined ? dto.masterId : booking.masterId;

    if (targetMasterId && targetMasterId !== 'ANY') {
      const conflict = await this.prisma.booking.findFirst({
        where: {
          id: { not: id },
          date: dto.date,
          timeSlot: dto.timeSlot,
          masterId: targetMasterId,
          status: { not: BookingStatus.CANCELLED },
        },
      });

      if (conflict) {
        throw new BadRequestException('Обраний слот часу у даного майстра вже зайнятий іншим записом.');
      }
    }

    const dateTimeStr = `${dto.date}T${dto.timeSlot}:00.000Z`;
    const dateTime = new Date(dateTimeStr);

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        date: dto.date,
        timeSlot: dto.timeSlot,
        dateTime: dateTime,
        ...(dto.masterId !== undefined && { masterId: dto.masterId === 'ANY' ? null : dto.masterId }),
        ...(dto.comment !== undefined && { comment: dto.comment }),
      },
      include: {
        service: true,
        master: true,
      },
    });

    // Send reschedule notification alert
    const finalMasterId = updatedBooking.masterId || (targetMasterId !== 'ANY' ? targetMasterId : null);
    const adminChatId = (process.env.TELEGRAM_ADMIN_CHAT_ID || '').trim();
    const rescheduleData = {
      clientName: updatedBooking.clientName,
      clientPhone: updatedBooking.clientPhone,
      date: updatedBooking.date,
      timeSlot: updatedBooking.timeSlot,
      serviceName: updatedBooking.service.name,
      comment: updatedBooking.comment || undefined,
    };

    if (finalMasterId) {
      this.prisma.master
        .findUnique({ where: { id: finalMasterId } })
        .then((master) => {
          const masterChatId = master?.telegramChatId || master?.notificationUserId;
          if (masterChatId) {
            this.notificationService.sendRescheduleAlert(masterChatId, rescheduleData);
          }
          if (adminChatId && adminChatId !== masterChatId) {
            this.notificationService.sendRescheduleAlert(adminChatId, rescheduleData);
          }
        })
        .catch((err) => console.error('Failed to trigger reschedule notification:', err));
    } else if (adminChatId) {
      this.notificationService.sendRescheduleAlert(adminChatId, rescheduleData);
    }

    return updatedBooking;
  }

  async getAllBookings(date?: string) {
    const whereCondition = date ? { date } : {};
    return this.prisma.booking.findMany({
      where: whereCondition,
      include: {
        service: true,
        master: true,
      },
      orderBy: {
        dateTime: 'desc',
      },
    });
  }

  async updateBooking(id: string, dto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Запис не знайдено');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.masterId !== undefined && { masterId: dto.masterId }),
        ...(dto.comment !== undefined && { comment: dto.comment }),
      },
      include: {
        service: true,
        master: true,
      },
    });
  }
}
