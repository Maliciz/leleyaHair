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
};
