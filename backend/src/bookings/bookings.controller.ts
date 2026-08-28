import { Controller, Get, Post, Patch, Query, Body, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('available-masters')
  async getAvailableMasters(@Query('date') date: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.bookingsService.getAvailableMastersForDate(targetDate);
  }

  @Get('available-slots')
  async getAvailableSlots(
    @Query('date') date: string,
    @Query('masterId') masterId?: string,
    @Query('serviceId') serviceId?: string,
  ) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.bookingsService.getAvailableSlots(targetDate, masterId, serviceId);
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
