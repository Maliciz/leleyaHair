import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import { FinanceSummary, MasterBreakdown, PeriodBookingDetail } from '../api/financeApi';
import { AdminBookingItem } from '../api/adminApi';

/**
 * Formats column widths dynamically based on content length
 */
const autoFitColumns = (worksheet: XLSX.WorkSheet, data: any[]) => {
  if (!data || data.length === 0) return;
  const keys = Object.keys(data[0]);
  const colWidths = keys.map((key) => {
    const maxLen = Math.max(
      key.toString().length,
      ...data.map((row) => (row[key] ? row[key].toString().length : 0))
    );
    return { wch: Math.min(Math.max(maxLen + 4, 12), 40) };
  });
  worksheet['!cols'] = colWidths;
};

/**
 * 1. Export Financial Report to Excel (.xlsx) with 3 sheets
 */
export const exportFinancialReportToExcel = (
  summary: FinanceSummary,
  breakdown: MasterBreakdown[],
  periodDetails: PeriodBookingDetail[]
) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: "Загальні показники" (KPI Summary)
  const kpiData = [
    { 'Показник': 'Обраний період', 'Значення': `${summary.startDate} — ${summary.endDate}` },
    { 'Показник': 'Загальна каса перукарні (100%)', 'Значення': `₴ ${summary.totalRevenue.toLocaleString()}` },
    { 'Показник': 'Чистий прибуток перукарні (60%)', 'Значення': `₴ ${summary.salonProfit.toLocaleString()}` },
    { 'Показник': 'Фонд виплат майстрам (40%)', 'Значення': `₴ ${summary.barberPayouts.toLocaleString()}` },
    { 'Показник': 'Всього виконано стрижок', 'Значення': `${summary.totalCompletedOrders} стрижок` },
    { 'Показник': 'Середній чек', 'Значення': `₴ ${summary.averageCheck.toLocaleString()}` },
  ];
  const ws1 = XLSX.utils.json_to_sheet(kpiData);
  autoFitColumns(ws1, kpiData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Загальні показники');

  // Sheet 2: "Звіт по майстрах" (Masters Breakdown)
  const mastersData = breakdown.map((m) => ({
    'Майстер': m.masterName,
    'Кількість стрижок': m.completedOrdersCount,
    'Згенерована каса (₴)': m.totalGeneratedRevenue,
    'Виплата майстру 40% (₴)': m.masterEarnings,
    'Частка салону 60% (₴)': m.salonShareFromMaster,
  }));
  const ws2 = XLSX.utils.json_to_sheet(mastersData);
  autoFitColumns(ws2, mastersData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Звіт по майстрах');

  // Sheet 3: "Детальні записи" (Detailed Orders)
  const ordersData = periodDetails.map((b) => ({
    'Дата': b.date,
    'Час': b.timeSlot,
    'Клієнт': b.clientName,
    'Телефон': b.clientPhone,
    'Послуга': b.serviceName,
    'Ціна (₴)': b.priceValue,
    'Майстер': b.masterName,
    'Виплата майстру (40%)': b.masterShare,
    'Статус': b.status === 'COMPLETED' ? 'Виконано' : b.status,
  }));
  const ws3 = XLSX.utils.json_to_sheet(ordersData);
  autoFitColumns(ws3, ordersData);
  XLSX.utils.book_append_sheet(wb, ws3, 'Детальні записи');

  // Generate Excel buffer & save file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  const todayStr = dayjs().format('YYYY-MM-DD');
  saveAs(blob, `Finansovyi_Zvit_Leleya_${todayStr}.xlsx`);
};

/**
 * 2. Export Bookings List to Excel (.xlsx)
 */
export const exportBookingsToExcel = (bookings: AdminBookingItem[]) => {
  const statusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Очікує';
      case 'CONFIRMED':
        return 'Підтверджено';
      case 'COMPLETED':
        return 'Виконано';
      case 'CANCELLED':
        return 'Скасовано';
      default:
        return status;
    }
  };

  const data = bookings.map((b) => ({
    'ID запису': b.id,
    'Дата та час': `${b.date} ${b.timeSlot}`,
    "Ім'я клієнта": b.clientName,
    'Номер телефону': b.clientPhone,
    'Послуга': b.service?.name || 'Послуга',
    'Ціна': b.service?.price || '—',
    'Призначений майстер': b.master?.name || 'Не призначено',
    'Статус': statusLabel(b.status),
    'Коментар': b.comment || '—',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  autoFitColumns(ws, data);
  XLSX.utils.book_append_sheet(wb, ws, 'Записи клієнтів');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  const todayStr = dayjs().format('YYYY-MM-DD');
  saveAs(blob, `Zapysy_Kliientiv_Leleya_${todayStr}.xlsx`);
};
