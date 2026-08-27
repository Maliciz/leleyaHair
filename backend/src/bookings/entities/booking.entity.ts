export interface BookingEntity {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  notes?: string;
  createdAt: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}
