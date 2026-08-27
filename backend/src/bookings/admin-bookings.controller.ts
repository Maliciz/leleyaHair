import { Controller, Get, Patch, Query, Body, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookingStatus } from '@prisma/client';

@Controller('api/admin/bookings')
@UseGuards(JwtAuthGuard)
export class AdminBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getAdminBookings(@Query('date') date?: string, @Query('status') status?: string) {
    const bookings = await this.bookingsService.getAllBookings(date);
    if (status && status !== 'ALL') {
      return bookings.filter((b) => b.status === status);
    }
    return bookings;
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: BookingStatus) {
    return this.bookingsService.updateBooking(id, { status });
  }

  @Patch(':id/master')
  async assignMaster(@Param('id') id: string, @Body('masterId') masterId: string) {
    return this.bookingsService.updateBooking(id, { masterId });
  }

  @Patch(':id')
  async updateBookingDetails(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.updateBooking(id, updateBookingDto);
  }
}
