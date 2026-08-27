import { axiosInstance as apiClient } from './axiosInstance';

export interface BarberEarnings {
  period: 'today' | 'month' | 'all';
  totalCompletedCount: number;
  totalRevenue: number;
  barberPayout: number;
}

export interface BarberBooking {
  id: string;
  clientName: string;
  clientPhone: string;
  dateTime: string;
  date: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  comment?: string;
  serviceId: string;
  service?: {
    id: string;
    name: string;
    price: string;
    priceValue: number;
  };
}

export const barberApi = {
  // Get scheduled working dates
  async getMySchedule(): Promise<string[]> {
    const response = await apiClient.get('/barber/my-schedule');
    return response.data;
  },

  // Toggle scheduled working date
  async toggleWorkDate(workDate: string): Promise<{ action: 'added' | 'removed'; date: string }> {
    const response = await apiClient.post('/barber/my-schedule', { workDate });
    return response.data;
  },

  // Get barber's bookings
  async getMyBookings(date?: string): Promise<BarberBooking[]> {
    const response = await apiClient.get('/barber/my-bookings', {
      params: date ? { date } : {},
    });
    return response.data;
  },

  // Mark booking completed
  async markBookingCompleted(bookingId: string): Promise<BarberBooking> {
    const response = await apiClient.patch(`/barber/bookings/${bookingId}/complete`);
    return response.data;
  },

  // Get earnings report
  async getEarnings(period: 'today' | 'month' | 'all' = 'today'): Promise<BarberEarnings> {
    const response = await apiClient.get('/barber/earnings', {
      params: { period },
    });
    return response.data;
  },
};
