import { axiosInstance as apiClient } from './axiosInstance';
import { ServiceCategory } from '../types';

export const servicesApi = {
  async getServices(): Promise<ServiceCategory[]> {
    try {
      const response = await apiClient.get('/services');
      return response.data;
    } catch (error) {
      console.warn('Backend service offline, returning fallback catalog', error);
      return [];
    }
  },
};

export const bookingsApi = {
  async getAvailableSlots(date: string): Promise<string[]> {
    try {
      const response = await apiClient.get(`/bookings/available-slots`, {
        params: { date },
      });
      return response.data.availableSlots || [];
    } catch (error) {
      console.warn('Backend booking service offline, returning fallback slots', error);
      return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    }
  },

  async createBooking(bookingData: {
    clientName: string;
    clientPhone: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    comment?: string;
  }) {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },
};
