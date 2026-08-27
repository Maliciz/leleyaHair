import { Controller, Get, Post, Patch, Query, Body, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('available-slots')
  async getAvailableSlots(@Query('date') date: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const slots = await this.bookingsService.getAvailableSlots(targetDate);
    return {
      date: targetDate,
      availableSlots: slots,
    };
  }

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllBookings(@Query('date') date?: string) {
    return this.bookingsService.getAllBookings(date);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateBooking(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.updateBooking(id, updateBookingDto);
  }
}
