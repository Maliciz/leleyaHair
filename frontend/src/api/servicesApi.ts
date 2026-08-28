import { axiosInstance as apiClient } from './axiosInstance';
import { ServiceCategory } from '../types';

export interface AvailableMaster {
  id: string;
  name: string;
  isActive: boolean;
}

export interface SlotItem {
  timeSlot: string;
  isAvailable: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  scheduledMastersCount: number;
  availableSlots: SlotItem[];
}

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
  async getAvailableMasters(date: string): Promise<AvailableMaster[]> {
    try {
      const response = await apiClient.get('/bookings/available-masters', {
        params: { date },
      });
      return response.data || [];
    } catch (error) {
      console.warn('Error fetching available masters', error);
      return [];
    }
  },

  async getAvailableSlots(date: string, masterId?: string, serviceId?: string): Promise<AvailableSlotsResponse> {
    try {
      const response = await apiClient.get(`/bookings/available-slots`, {
        params: { date, masterId, serviceId },
      });
      const data = response.data;
      if (Array.isArray(data.availableSlots)) {
        return {
          date: data.date || date,
          scheduledMastersCount: data.scheduledMastersCount || 0,
          availableSlots: data.availableSlots,
        };
      }
      // Fallback if array of strings returned
      if (Array.isArray(data)) {
        return {
          date,
          scheduledMastersCount: 1,
          availableSlots: data.map((t: string) => ({ timeSlot: t, isAvailable: true })),
        };
      }
      return { date, scheduledMastersCount: 0, availableSlots: [] };
    } catch (error) {
      console.warn('Backend booking service offline, returning fallback slots', error);
      const defaultSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
      return {
        date,
        scheduledMastersCount: 1,
        availableSlots: defaultSlots.map((t) => ({ timeSlot: t, isAvailable: true })),
      };
    }
  },

  async createBooking(bookingData: {
    clientName: string;
    clientPhone: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    masterId?: string;
    comment?: string;
  }) {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },
};
