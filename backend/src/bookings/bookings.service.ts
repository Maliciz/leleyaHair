import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableSlots(dateString: string): Promise<string[]> {
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

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        date: dateString,
        status: {
          not: BookingStatus.CANCELLED,
        },
      },
      select: {
        timeSlot: true,
      },
    });

    const bookedSlotsSet = new Set(existingBookings.map((b) => b.timeSlot));
    return allSlots.filter((slot) => !bookedSlotsSet.has(slot));
  }

  async createBooking(dto: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });

    if (!service) {
      throw new BadRequestException('Обрану послугу не знайдено в каталозі.');
    }

    const existing = await this.prisma.booking.findFirst({
      where: {
        date: dto.date,
        timeSlot: dto.timeSlot,
        status: {
          not: BookingStatus.CANCELLED,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Вибачте, цей час вже зайнято. Будь ласка, оберіть інший слот.');
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
        masterId: dto.masterId || null,
        status: BookingStatus.PENDING,
      },
      include: {
        service: true,
        master: true,
      },
    });

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
        status: booking.status,
        createdAt: booking.createdAt,
      },
    };
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
