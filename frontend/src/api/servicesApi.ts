import { apiClient } from './axiosInstance';
import {
  ServiceCategory,
  AvailableSlotsResponse,
  CreateBookingPayload,
  BookingConfirmation,
  ReviewItem,
} from '../types';

export const getServices = async (): Promise<ServiceCategory[]> => {
  const response = await apiClient.get<ServiceCategory[]>('/services');
  return response.data;
};

export const getAvailableSlots = async (date: string): Promise<AvailableSlotsResponse> => {
  const response = await apiClient.get<AvailableSlotsResponse>(`/bookings/available-slots`, {
    params: { date },
  });
  return response.data;
};

export const submitBooking = async (payload: CreateBookingPayload): Promise<BookingConfirmation> => {
  const response = await apiClient.post<BookingConfirmation>('/bookings', payload);
  return response.data;
};

export const getReviews = async (): Promise<ReviewItem[]> => {
  const response = await apiClient.get<ReviewItem[]>('/reviews');
  return response.data;
};
