import { axiosInstance } from './axiosInstance';

export interface AdminBookingItem {
  id: string;
  clientName: string;
  clientPhone: string;
  dateTime: string;
  date: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  comment?: string;
  serviceId: string;
  masterId?: string | null;
  createdAt: string;
  service?: {
    id: string;
    name: string;
    category: string;
    price: string;
    priceValue: number;
    duration: number;
  };
  master?: {
    id: string;
    name: string;
    isActive: boolean;
  } | null;
}

export interface MasterItem {
  id: string;
  name: string;
  isActive: boolean;
  telegramChatId?: string | null;
  notificationUserId?: string | null;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const adminApi = {
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  async getBookings(params?: { date?: string; status?: string }): Promise<AdminBookingItem[]> {
    const response = await axiosInstance.get('/admin/bookings', { params });
    return response.data;
  },

  async updateBookingStatus(id: string, status: string): Promise<AdminBookingItem> {
    const response = await axiosInstance.patch(`/admin/bookings/${id}/status`, { status });
    return response.data;
  },

  async assignMaster(bookingId: string, masterId: string): Promise<AdminBookingItem> {
    const response = await axiosInstance.patch(`/admin/bookings/${bookingId}/master`, { masterId });
    return response.data;
  },

  async rescheduleBooking(
    id: string,
    data: { date: string; timeSlot: string; masterId?: string; comment?: string }
  ): Promise<AdminBookingItem> {
    const response = await axiosInstance.patch(`/admin/bookings/${id}/reschedule`, data);
    return response.data;
  },

  async updateBookingDetails(id: string, data: { status?: string; masterId?: string; comment?: string }): Promise<AdminBookingItem> {
    const response = await axiosInstance.patch(`/admin/bookings/${id}`, data);
    return response.data;
  },

  async getMastersList(): Promise<MasterItem[]> {
    const response = await axiosInstance.get('/admin/masters');
    return response.data;
  },

  async createMaster(data: { name: string; email: string; password: string; phone?: string; telegramChatId?: string; notificationUserId?: string }): Promise<MasterItem> {
    const response = await axiosInstance.post('/admin/masters', data);
    return response.data;
  },

  async updateMaster(id: string, data: { name?: string; telegramChatId?: string; notificationUserId?: string }): Promise<MasterItem> {
    const response = await axiosInstance.patch(`/admin/masters/${id}`, data);
    return response.data;
  },

  async toggleMasterStatus(id: string): Promise<MasterItem> {
    const response = await axiosInstance.patch(`/admin/masters/${id}/toggle-status`);
    return response.data;
  },
};
