import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      name: 'Перукарня «Лелея» API',
      status: 'online',
      version: '1.0.0',
      endpoints: {
        services: '/api/services',
        bookingSlots: '/api/bookings/available-slots',
        adminLogin: '/api/auth/login',
        adminBookings: '/api/admin/bookings',
      },
    };
  }
}
