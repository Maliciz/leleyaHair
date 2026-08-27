import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import {
  AttachMoney,
  AccountBalanceWallet,
  People,
  TrendingUp,
  ReceiptLong,
  CalendarToday,
  Refresh,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { financeApi, FinanceSummary, MasterBreakdown } from '../../api/financeApi';

export const FinanceTab: React.FC = () => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(dayjs().endOf('month').format('YYYY-MM-DD'));

  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [breakdown, setBreakdown] = useState<MasterBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        period,
        startDate: period === 'custom' ? startDate : undefined,
        endDate: period === 'custom' ? endDate : undefined,
      };

      const [summaryRes, breakdownRes] = await Promise.all([
        financeApi.getSummary(params),
        financeApi.getMastersBreakdown(params),
      ]);

      setSummary(summaryRes);
      setBreakdown(breakdownRes);
    } catch (err: any) {
      console.error('Error fetching finance data:', err);
      setError(err.message || 'Не вдалося завантажити фінансову звітність');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCustomDates = () => {
    if (period === 'custom') {
      fetchData();
    }
  };

  // Grand totals calculation for footer
  const totalRevenueAll = breakdown.reduce((s, m) => s + m.totalGeneratedRevenue, 0);
  const totalEarningsAll = breakdown.reduce((s, m) => s + m.masterEarnings, 0);
  const totalSalonShareAll = breakdown.reduce((s, m) => s + m.salonShareFromMaster, 0);
  const totalOrdersAll = breakdown.reduce((s, m) => s + m.completedOrdersCount, 0);

  return (
    <div className="space-y-8">
      
      {/* Top Filter Header Bar */}
      <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold block mb-1">
            Аналітика та Виплати
          </span>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-gold-400" />
            <span>Фінансовий Звіт Перукарні</span>
          </h2>
        </div>

        {/* Period Buttons & Custom Date Pickers */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-dark-950 rounded-xl border border-gold-600/20">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'today'
                  ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Сьогодні
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'week'
                  ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Цей тиждень
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'month'
                  ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Цей місяць
            </button>
            <button
              onClick={() => setPeriod('custom')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === 'custom'
                  ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Довільний період
            </button>
          </div>

          {period === 'custom' && (
            <div className="flex items-center gap-2 bg-dark-950 p-1.5 rounded-xl border border-gold-600/30">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-xs text-white px-2 py-1 focus:outline-none"
              />
              <span className="text-gray-500 text-xs">—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-xs text-white px-2 py-1 focus:outline-none"
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleApplyCustomDates}
                style={{
                  backgroundColor: '#C59A77',
                  color: '#0C0C0E',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  borderRadius: '6px',
                  padding: '4px 10px',
                }}
              >
                Оновити
              </Button>
            </div>
          )}

          <Button
            variant="outlined"
            onClick={fetchData}
            startIcon={<Refresh />}
            style={{
              borderColor: 'rgba(197, 154, 119, 0.4)',
              color: '#C59A77',
              borderRadius: '10px',
            }}
          >
            Оновити
          </Button>
        </div>
      </div>

      {error && (
        <Alert severity="error" className="bg-red-950/80 border border-red-500/40 text-red-200">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <CircularProgress style={{ color: '#C59A77' }} size={48} />
        </div>
      ) : (
        <>
          {/* KPI CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Total Revenue (100%) */}
            <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-gold-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Загальна каса (100%)
                </span>
                <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <AttachMoney className="text-gold-400" />
                </div>
              </div>
              <span className="text-3xl font-serif font-bold text-white block">
                {summary?.totalRevenue.toLocaleString() || 0} <span className="text-lg text-gold-400">грн</span>
              </span>
              <p className="text-[11px] text-gray-400 mt-2">
                Загальний виторг від усіх виконаних стрижок
              </p>
            </div>

            {/* Card 2: Salon Net Profit (60%) */}
            <div className="bg-dark-900 border border-gold-600/40 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Прибуток перукарні (60%)
                </span>
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <AccountBalanceWallet className="text-emerald-400" />
                </div>
              </div>
              <span className="text-3xl font-serif font-bold text-emerald-300 block">
                {summary?.salonProfit.toLocaleString() || 0} <span className="text-lg">грн</span>
              </span>
              <p className="text-[11px] text-gray-400 mt-2">
                Чиста частка закладу після виплати майстрам
              </p>
            </div>

            {/* Card 3: Barber Payouts (40%) */}
            <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Виплати майстрам (40%)
                </span>
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <People className="text-amber-400" />
                </div>
              </div>
              <span className="text-3xl font-serif font-bold text-amber-300 block">
                {summary?.barberPayouts.toLocaleString() || 0} <span className="text-lg">грн</span>
              </span>
              <p className="text-[11px] text-gray-400 mt-2">
                Сукупна комісія перукарів за виконану роботу
              </p>
            </div>

            {/* Card 4: Orders & Average Check */}
            <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-gold-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Виконано замовлень
                </span>
                <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <ReceiptLong className="text-gold-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-white">
                  {summary?.totalCompletedOrders || 0}
                </span>
                <span className="text-xs text-gray-400">замовлень</span>
              </div>
              <p className="text-[11px] text-gold-400 mt-2 font-medium">
                Середній чек: <strong className="text-white">{summary?.averageCheck || 0} грн</strong>
              </p>
            </div>

          </div>

          {/* TABLE: MASTERS PERFORMANCE BREAKDOWN */}
          <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <People className="text-gold-400" />
                <span>Розподіл виручки по перукарях</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Детальний розрахунок заробітку кожного майстра (40%) та доходу салону (60%)
              </p>
            </div>

            <TableContainer component={Paper} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow style={{ borderBottom: '1px solid rgba(197, 154, 119, 0.3)' }}>
                    <TableCell style={{ color: '#C59A77', fontWeight: 'bold' }}>Майстер перукарні</TableCell>
                    <TableCell align="center" style={{ color: '#C59A77', fontWeight: 'bold' }}>
                      Виконано стрижок
                    </TableCell>
                    <TableCell align="right" style={{ color: '#C59A77', fontWeight: 'bold' }}>
                      Згенерована каса (100%)
                    </TableCell>
                    <TableCell align="right" style={{ color: '#16A34A', fontWeight: 'bold' }}>
                      Заробіток майстра (40%)
                    </TableCell>
                    <TableCell align="right" style={{ color: '#38BDF8', fontWeight: 'bold' }}>
                      Частка салону (60%)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {breakdown.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" style={{ color: '#9CA3AF', padding: '32px' }}>
                        За вибраний період completed-замовлень не знайдено
                      </TableCell>
                    </TableRow>
                  ) : (
                    breakdown.map((row) => (
                      <TableRow
                        key={row.masterId}
                        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                        className="hover:bg-dark-850/50 transition-colors"
                      >
                        <TableCell style={{ color: '#FFFFFF', fontWeight: '600' }}>
                          ✂️ {row.masterName}
                        </TableCell>
                        <TableCell align="center" style={{ color: '#E5E7EB' }}>
                          <span className="px-2.5 py-1 rounded-md bg-dark-950 border border-gray-800 font-bold text-xs">
                            {row.completedOrdersCount}
                          </span>
                        </TableCell>
                        <TableCell align="right" style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                          {row.totalGeneratedRevenue.toLocaleString()} грн
                        </TableCell>
                        <TableCell align="right" style={{ color: '#4ADE80', fontWeight: 'bold' }}>
                          +{row.masterEarnings.toLocaleString()} грн
                        </TableCell>
                        <TableCell align="right" style={{ color: '#38BDF8', fontWeight: 'bold' }}>
                          +{row.salonShareFromMaster.toLocaleString()} грн
                        </TableCell>
                      </TableRow>
                    ))
                  )}

                  {/* Summary Totals Row */}
                  {breakdown.length > 0 && (
                    <TableRow style={{ borderTop: '2px solid rgba(197, 154, 119, 0.4)', backgroundColor: 'rgba(12, 12, 14, 0.8)' }}>
                      <TableCell style={{ color: '#C59A77', fontWeight: 'extrabold', fontSize: '14px' }}>
                        Всього по салону:
                      </TableCell>
                      <TableCell align="center" style={{ color: '#FFFFFF', fontWeight: 'extrabold', fontSize: '14px' }}>
                        {totalOrdersAll}
                      </TableCell>
                      <TableCell align="right" style={{ color: '#FFFFFF', fontWeight: 'extrabold', fontSize: '15px' }}>
                        {totalRevenueAll.toLocaleString()} грн
                      </TableCell>
                      <TableCell align="right" style={{ color: '#4ADE80', fontWeight: 'extrabold', fontSize: '15px' }}>
                        +{totalEarningsAll.toLocaleString()} грн
                      </TableCell>
                      <TableCell align="right" style={{ color: '#38BDF8', fontWeight: 'extrabold', fontSize: '15px' }}>
                        +{totalSalonShareAll.toLocaleString()} грн
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}

    </div>
  );
};

export default FinanceTab;
