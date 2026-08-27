import { Controller, Get, Post, Patch, Query, Param, Body, UseGuards, Request } from '@nestjs/common';
import { BarberService } from './barber.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/barber')
@UseGuards(JwtAuthGuard)
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Get('my-schedule')
  async getMySchedule(@Request() req: any) {
    return this.barberService.getMySchedule(req.user.id);
  }

  @Post('my-schedule')
  async toggleWorkDate(@Request() req: any, @Body('workDate') workDate: string) {
    return this.barberService.toggleWorkDate(req.user.id, workDate);
  }

  @Get('my-bookings')
  async getMyBookings(@Request() req: any, @Query('date') date?: string) {
    return this.barberService.getMyBookings(req.user.id, date);
  }

  @Patch('bookings/:id/complete')
  async markBookingCompleted(@Request() req: any, @Param('id') id: string) {
    return this.barberService.markBookingCompleted(req.user.id, id);
  }

  @Get('earnings')
  async getEarnings(@Request() req: any, @Query('period') period?: 'today' | 'month' | 'all') {
    return this.barberService.getEarnings(req.user.id, period || 'today');
  }
}
