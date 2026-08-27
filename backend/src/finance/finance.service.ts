import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import dayjs from 'dayjs';

export interface FinanceQueryParams {
  period?: 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateRange(params: FinanceQueryParams): { startStr: string; endStr: string } {
    const { period = 'today', startDate, endDate } = params;
    const now = dayjs();

    if (period === 'today') {
      const today = now.format('YYYY-MM-DD');
      return { startStr: today, endStr: today };
    }

    if (period === 'week') {
      const startOfWeek = now.startOf('week').add(1, 'day').format('YYYY-MM-DD'); // Monday
      const endOfWeek = now.endOf('week').add(1, 'day').format('YYYY-MM-DD'); // Sunday
      return { startStr: startOfWeek, endStr: endOfWeek };
    }

    if (period === 'month') {
      const startOfMonth = now.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = now.endOf('month').format('YYYY-MM-DD');
      return { startStr: startOfMonth, endStr: endOfMonth };
    }

    if (period === 'custom' && startDate && endDate) {
      return { startStr: startDate, endStr: endDate };
    }

    const today = now.format('YYYY-MM-DD');
    return { startStr: today, endStr: today };
  }

  /**
   * Helper to safely extract numeric price value from booking service to prevent NaN issues
   */
  private getBookingPrice(b: any): number {
    if (typeof b.service?.priceValue === 'number' && !isNaN(b.service.priceValue)) {
      return Number(b.service.priceValue);
    }
    if (b.service?.price) {
      const parsed = parseInt(String(b.service.price).replace(/\D/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) return Number(parsed);
    }
    return 0;
  }

  // GET /api/admin/finance/summary
  async getFinanceSummary(params: FinanceQueryParams) {
    const { startStr, endStr } = this.getDateRange(params);

    const completedBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
        date: {
          gte: startStr,
          lte: endStr,
        },
      },
      include: {
        service: true,
        master: true,
      },
    });

    const totalCompletedOrders = completedBookings.length;
    const totalRevenue = completedBookings.reduce(
      (sum, b) => sum + this.getBookingPrice(b),
      0,
    );
    const barberPayouts = Math.round(totalRevenue * 0.40);
    const salonProfit = totalRevenue - barberPayouts; // 60%
    const averageCheck = totalCompletedOrders > 0 ? Math.round(totalRevenue / totalCompletedOrders) : 0;

    return {
      period: params.period || 'today',
      startDate: startStr,
      endDate: endStr,
      totalRevenue,
      salonProfit,
      barberPayouts,
      totalCompletedOrders,
      averageCheck,
    };
  }

  // GET /api/admin/finance/masters-breakdown
  async getMastersBreakdown(params: FinanceQueryParams) {
    const { startStr, endStr } = this.getDateRange(params);

    const masters = await this.prisma.master.findMany({
      where: { isActive: true },
    });

    const completedBookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
        date: {
          gte: startStr,
          lte: endStr,
        },
      },
      include: {
        service: true,
        master: true,
      },
    });

    return masters.map((master) => {
      const masterBookings = completedBookings.filter((b) => b.masterId === master.id);
      const completedOrdersCount = masterBookings.length;
      const totalGeneratedRevenue = masterBookings.reduce(
        (sum, b) => sum + this.getBookingPrice(b),
        0,
      );
      const masterEarnings = Math.round(totalGeneratedRevenue * 0.40);
      const salonShareFromMaster = totalGeneratedRevenue - masterEarnings;

      return {
        masterId: master.id,
        masterName: master.name,
        completedOrdersCount,
        totalGeneratedRevenue,
        masterEarnings,
        salonShareFromMaster,
      };
    });
  }

  // GET /api/admin/finance/master-details/:masterId
  async getMasterBookingsDetails(masterId: string, params: FinanceQueryParams) {
    const { startStr, endStr } = this.getDateRange(params);

    const master = await this.prisma.master.findUnique({
      where: { id: masterId },
    });

    if (!master) {
      throw new NotFoundException('Майстра не знайдено');
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        masterId: master.id,
        status: BookingStatus.COMPLETED,
        date: {
          gte: startStr,
          lte: endStr,
        },
      },
      include: {
        service: true,
        master: true,
      },
      orderBy: [{ date: 'desc' }, { timeSlot: 'asc' }],
    });

    return {
      masterId: master.id,
      masterName: master.name,
      startDate: startStr,
      endDate: endStr,
      bookings: bookings.map((b) => {
        const priceVal = this.getBookingPrice(b);
        const masterShare = Math.round(priceVal * 0.40);
        const salonShare = priceVal - masterShare;

        return {
          id: b.id,
          clientName: b.clientName,
          clientPhone: b.clientPhone,
          date: b.date,
          timeSlot: b.timeSlot,
          serviceName: b.service?.name || 'Стрижка',
          priceValue: priceVal,
          masterShare,
          salonShare,
        };
      }),
    };
  }

  // GET /api/admin/finance/period-details
  async getAllPeriodBookingsDetails(params: FinanceQueryParams) {
    const { startStr, endStr } = this.getDateRange(params);

    const bookings = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.COMPLETED,
        date: {
          gte: startStr,
          lte: endStr,
        },
      },
      include: {
        service: true,
        master: true,
      },
      orderBy: [{ date: 'desc' }, { timeSlot: 'asc' }],
    });

    return bookings.map((b) => {
      const priceVal = this.getBookingPrice(b);

      return {
        id: b.id,
        date: b.date,
        timeSlot: b.timeSlot,
        clientName: b.clientName,
        clientPhone: b.clientPhone,
        serviceName: b.service?.name || 'Стрижка',
        priceValue: priceVal,
        masterName: b.master?.name || 'Не призначено',
        masterShare: Math.round(priceVal * 0.40),
        status: b.status,
      };
    });
  }
}
