import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingEntity } from './entities/booking.entity';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
  private bookings: BookingEntity[] = [];

  constructor(private readonly servicesService: ServicesService) {
    // Seed initial mock bookings for realistic demonstration
    const today = new Date().toISOString().split('T')[0];
    const tomorrowObj = new Date();
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);
    const tomorrow = tomorrowObj.toISOString().split('T')[0];

    this.bookings.push(
      {
        id: 'LELEYA-SEED-101',
        clientName: 'Андрій Василенко',
        clientPhone: '+380671234567',
        serviceId: 'm4',
        serviceName: 'Декілька насадок',
        servicePrice: '250 грн',
        date: today,
        timeSlot: '11:00',
        notes: 'Постійний клієнт',
        createdAt: new Date().toISOString(),
        status: 'CONFIRMED',
      },
      {
        id: 'LELEYA-SEED-102',
        clientName: 'Анна Ткаченко',
        clientPhone: '+380509876543',
        serviceId: 'w3',
        serviceName: 'Жіноча коротка',
        servicePrice: '350 грн',
        date: today,
        timeSlot: '14:30',
        createdAt: new Date().toISOString(),
        status: 'CONFIRMED',
      },
      {
        id: 'LELEYA-SEED-103',
        clientName: 'Віталій Бондар',
        clientPhone: '+380635554433',
        serviceId: 'm2',
        serviceName: '«Під нуль» + шейвер',
        servicePrice: '250 грн',
        date: tomorrow,
        timeSlot: '10:00',
        createdAt: new Date().toISOString(),
        status: 'CONFIRMED',
      }
    );
  }

  private generateAllSlots(): string[] {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 20;

    for (let hour = startHour; hour < endHour; hour++) {
      const hStr = hour.toString().padStart(2, '0');
      slots.push(`${hStr}:00`);
      slots.push(`${hStr}:30`);
    }
    return slots;
  }

  getAvailableSlots(date: string): { availableSlots: string[]; bookedSlots: string[]; date: string } {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Некоректний формат дати YYYY-MM-DD');
    }

    const allSlots = this.generateAllSlots();
    const existingBookingsForDate = this.bookings.filter(
      (b) => b.date === date && b.status !== 'CANCELLED'
    );

    const bookedSlots = existingBookingsForDate.map((b) => b.timeSlot);
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    return {
      date,
      availableSlots,
      bookedSlots,
    };
  }

  createBooking(dto: CreateBookingDto): BookingEntity {
    const service = this.servicesService.getServiceById(dto.serviceId);
    if (!service) {
      throw new BadRequestException('Обрану послугу не знайдено в каталозі');
    }

    // Check if slot is already taken
    const existing = this.bookings.find(
      (b) => b.date === dto.date && b.timeSlot === dto.timeSlot && b.status !== 'CANCELLED'
    );

    if (existing) {
      throw new ConflictException(
        `Часовий слот ${dto.timeSlot} на ${dto.date} вже зайнято. Будь ласка, оберіть інший час.`
      );
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const confirmationId = `LELEYA-${new Date().getFullYear()}-${randomNum}`;

    const newBooking: BookingEntity = {
      id: confirmationId,
      clientName: dto.clientName,
      clientPhone: dto.clientPhone,
      serviceId: dto.serviceId,
      serviceName: service.name,
      servicePrice: service.price,
      date: dto.date,
      timeSlot: dto.timeSlot,
      notes: dto.notes || '',
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
    };

    this.bookings.push(newBooking);
    return newBooking;
  }

  getAllBookings(): BookingEntity[] {
    return this.bookings;
  }
}
