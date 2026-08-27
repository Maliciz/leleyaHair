import { Controller, Get, Post, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('available-slots')
  getAvailableSlots(@Query('date') date: string) {
    return this.bookingsService.getAvailableSlots(date);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Get()
  getAllBookings() {
    return this.bookingsService.getAllBookings();
  }
}
