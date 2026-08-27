import { axiosInstance as apiClient } from './axiosInstance';

export interface FinanceSummary {
  period: 'today' | 'week' | 'month' | 'custom';
  startDate: string;
  endDate: string;
  totalRevenue: number;
  salonProfit: number;
  barberPayouts: number;
  totalCompletedOrders: number;
  averageCheck: number;
}

export interface MasterBreakdown {
  masterId: string;
  masterName: string;
  completedOrdersCount: number;
  totalGeneratedRevenue: number;
  masterEarnings: number;
  salonShareFromMaster: number;
}

export interface ItemizedMasterBooking {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  timeSlot: string;
  serviceName: string;
  priceValue: number;
  masterShare: number;
  salonShare: number;
}

export interface MasterDetailsResponse {
  masterId: string;
  masterName: string;
  startDate: string;
  endDate: string;
  bookings: ItemizedMasterBooking[];
}

export interface FinanceQueryParams {
  period?: 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
}

export const financeApi = {
  // Get financial summary
  async getSummary(params?: FinanceQueryParams): Promise<FinanceSummary> {
    const response = await apiClient.get('/admin/finance/summary', { params });
    return response.data;
  },

  // Get master performance breakdown
  async getMastersBreakdown(params?: FinanceQueryParams): Promise<MasterBreakdown[]> {
    const response = await apiClient.get('/admin/finance/masters-breakdown', { params });
    return response.data;
  },

  // Get itemized completed cuts for a master
  async getMasterDetails(masterId: string, params?: FinanceQueryParams): Promise<MasterDetailsResponse> {
    const response = await apiClient.get(`/admin/finance/master-details/${masterId}`, { params });
    return response.data;
  },
};
