import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class BarberService {
  constructor(private readonly prisma: PrismaService) {}

  private async getMasterForUser(userId: string) {
    const master = await this.prisma.master.findUnique({
      where: { userId },
    });
    if (!master) {
      throw new NotFoundException('Профіль перукаря не знайдено для даного користувача');
    }
    return master;
  }

  // GET /api/barber/my-schedule
  async getMySchedule(userId: string) {
    const master = await this.getMasterForUser(userId);
    const schedules = await this.prisma.workSchedule.findMany({
      where: { masterId: master.id },
      orderBy: { workDate: 'asc' },
    });
    return schedules.map((s) => dayjs(s.workDate).format('YYYY-MM-DD'));
  }

  // POST /api/barber/my-schedule (Toggle work date)
  async toggleWorkDate(userId: string, dateStr: string) {
    const master = await this.getMasterForUser(userId);
    const targetDate = dayjs(dateStr).startOf('day').toDate();

    const existing = await this.prisma.workSchedule.findUnique({
      where: {
        masterId_workDate: {
          masterId: master.id,
          workDate: targetDate,
        },
      },
    });

    if (existing) {
      await this.prisma.workSchedule.delete({
        where: { id: existing.id },
      });
      return { action: 'removed', date: dateStr };
    } else {
      await this.prisma.workSchedule.create({
        data: {
          masterId: master.id,
          workDate: targetDate,
        },
      });
      return { action: 'added', date: dateStr };
    }
  }

  // GET /api/barber/my-bookings
  async getMyBookings(userId: string, date?: string) {
    const master = await this.getMasterForUser(userId);
    const whereClause: any = { masterId: master.id };

    if (date) {
      whereClause.date = date;
    }

    return this.prisma.booking.findMany({
      where: whereClause,
      include: {
        service: true,
      },
      orderBy: [
        { date: 'asc' },
        { timeSlot: 'asc' },
      ],
    });
  }

  // PATCH /api/barber/bookings/:id/complete
  async markBookingCompleted(userId: string, bookingId: string) {
    const master = await this.getMasterForUser(userId);
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Запис не знайдено');
    }

    if (booking.masterId !== master.id) {
      throw new ForbiddenException('Ви можете змінювати статус тільки своїх записів');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.COMPLETED },
      include: { service: true },
    });
  }

  // GET /api/barber/earnings?period=today|month|all
  async getEarnings(userId: string, period: 'today' | 'month' | 'all' = 'today') {
    const master = await this.getMasterForUser(userId);

    const completedBookings = await this.prisma.booking.findMany({
      where: {
        masterId: master.id,
        status: BookingStatus.COMPLETED,
      },
      include: { service: true },
    });

    const now = dayjs();
    const todayStr = now.format('YYYY-MM-DD');
    const currentMonth = now.format('YYYY-MM');

    let filteredBookings = completedBookings;

    if (period === 'today') {
      filteredBookings = completedBookings.filter((b) => b.date === todayStr);
    } else if (period === 'month') {
      filteredBookings = completedBookings.filter((b) => b.date.startsWith(currentMonth));
    }

    const totalCompletedCount = filteredBookings.length;
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.service?.priceValue || 0), 0);
    const barberPayout = Math.round(totalRevenue * 0.40);

    return {
      period,
      totalCompletedCount,
      totalRevenue,
      barberPayout,
    };
  }
}
