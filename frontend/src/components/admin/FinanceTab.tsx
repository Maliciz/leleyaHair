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
  Avatar,
} from '@mui/material';
import {
  AttachMoney,
  AccountBalanceWallet,
  People,
  TrendingUp,
  ReceiptLong,
  Refresh,
  Visibility,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { financeApi, FinanceSummary, MasterBreakdown, MasterDetailsResponse } from '../../api/financeApi';
import MasterDetailModal from './MasterDetailModal';

export const FinanceTab: React.FC = () => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(dayjs().endOf('month').format('YYYY-MM-DD'));

  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [breakdown, setBreakdown] = useState<MasterBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State for Master Details
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [masterDetails, setMasterDetails] = useState<MasterDetailsResponse | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);

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

  const handleOpenMasterDetails = async (masterId: string) => {
    setSelectedMasterId(masterId);
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const params = {
        period,
        startDate: period === 'custom' ? startDate : undefined,
        endDate: period === 'custom' ? endDate : undefined,
      };
      const res = await financeApi.getMasterDetails(masterId, params);
      setMasterDetails(res);
    } catch (err) {
      console.error('Error fetching master details:', err);
    } finally {
      setModalLoading(false);
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
            Фінанси та звітність
          </span>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-gold-400" />
            <span>Аналітика виручки та виплат</span>
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
              Поточний тиждень
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
                onClick={fetchData}
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
          {/* KEY FINANCIAL KPI CARDS (TOP ROW) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Total Revenue (100%) */}
            <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-gold-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Загальна каса (100%)
                </span>
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <AttachMoney className="text-gold-400" />
                </div>
              </div>
              <span className="text-2xl font-serif font-bold text-white block">
                ₴ {summary?.totalRevenue.toLocaleString() || 0}
              </span>
              <p className="text-[10px] text-gray-400 mt-1">100% всієї виручки</p>
            </div>

            {/* Card 2: Salon Net Profit (60%) - Highlighted #C59A77 */}
            <div className="bg-dark-900 border-2 border-gold-500/80 rounded-2xl p-5 shadow-gold-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider">
                  Прибуток перукарні (60%)
                </span>
                <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center">
                  <AccountBalanceWallet className="text-gold-400" />
                </div>
              </div>
              <span className="text-2xl font-serif font-bold text-gold-400 block">
                ₴ {summary?.salonProfit.toLocaleString() || 0}
              </span>
              <p className="text-[10px] text-gold-400/80 mt-1 font-medium">
                Чиста частка закладу
              </p>
            </div>

            {/* Card 3: Barber Payouts (40%) - Highlighted Green */}
            <div className="bg-dark-900 border border-emerald-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Фонд виплат майстрам (40%)
                </span>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <People className="text-emerald-400" />
                </div>
              </div>
              <span className="text-2xl font-serif font-bold text-emerald-400 block">
                ₴ {summary?.barberPayouts.toLocaleString() || 0}
              </span>
              <p className="text-[10px] text-gray-400 mt-1">Виплати майстрам</p>
            </div>

            {/* Card 4: Total Completed Orders */}
            <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-gold-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Виконано замовлень
                </span>
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <ReceiptLong className="text-gold-400" />
                </div>
              </div>
              <span className="text-2xl font-serif font-bold text-white block">
                {summary?.totalCompletedOrders || 0} <span className="text-xs text-gray-400 font-sans font-normal">стрижок</span>
              </span>
              <p className="text-[10px] text-gray-400 mt-1">Кількість замовлень</p>
            </div>

            {/* Card 5: Average Check */}
            <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-gold-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Середній чек
                </span>
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <TrendingUp className="text-gold-400" />
                </div>
              </div>
              <span className="text-2xl font-serif font-bold text-white block">
                ₴ {summary?.averageCheck || 0}
              </span>
              <p className="text-[10px] text-gray-400 mt-1">Середня вартість стрижки</p>
            </div>

          </div>

          {/* TABLE: MASTERS PERFORMANCE TABLE */}
          <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <People className="text-gold-400" />
                  <span>Таблиця ефективності майстрів</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Облік виконаних замовлень та розподіл виплат перукарям (40%) і салону (60%)
                </p>
              </div>
            </div>

            <TableContainer component={Paper} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow style={{ borderBottom: '1px solid rgba(197, 154, 119, 0.3)' }}>
                    <TableCell style={{ color: '#C59A77', fontWeight: 'bold' }}>Майстер</TableCell>
                    <TableCell align="center" style={{ color: '#C59A77', fontWeight: 'bold' }}>
                      Виконано стрижок
                    </TableCell>
                    <TableCell align="right" style={{ color: '#C59A77', fontWeight: 'bold' }}>
                      Загальна каса майстра (₴)
                    </TableCell>
                    <TableCell align="right" style={{ color: '#4ADE80', fontWeight: 'bold' }}>
                      До виплати майстру (40%)
                    </TableCell>
                    <TableCell align="right" style={{ color: '#38BDF8', fontWeight: 'bold' }}>
                      Частка перукарні (60%)
                    </TableCell>
                    <TableCell align="center" style={{ color: '#C59A77', fontWeight: 'bold' }}>
                      Дії
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {breakdown.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" style={{ color: '#9CA3AF', padding: '32px' }}>
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
                        {/* Master Avatar + Name */}
                        <TableCell style={{ color: '#FFFFFF', fontWeight: '600' }}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              style={{
                                backgroundColor: '#18181B',
                                border: '1px solid #C59A77',
                                color: '#C59A77',
                                width: 36,
                                height: 36,
                                fontSize: '14px',
                                fontWeight: 'bold',
                              }}
                            >
                              {row.masterName.charAt(0)}
                            </Avatar>
                            <span className="text-sm">{row.masterName}</span>
                          </div>
                        </TableCell>

                        {/* Completed Cuts Count */}
                        <TableCell align="center" style={{ color: '#E5E7EB' }}>
                          <span className="px-3 py-1 rounded-lg bg-dark-950 border border-gold-600/20 font-bold text-xs">
                            {row.completedOrdersCount} стрижок
                          </span>
                        </TableCell>

                        {/* Total Master Generated Revenue */}
                        <TableCell align="right" style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                          ₴ {row.totalGeneratedRevenue.toLocaleString()}
                        </TableCell>

                        {/* Master Payout 40% (Green) */}
                        <TableCell align="right" style={{ color: '#4ADE80', fontWeight: 'bold' }}>
                          +₴ {row.masterEarnings.toLocaleString()}
                        </TableCell>

                        {/* Salon Share 60% */}
                        <TableCell align="right" style={{ color: '#38BDF8', fontWeight: 'bold' }}>
                          +₴ {row.salonShareFromMaster.toLocaleString()}
                        </TableCell>

                        {/* Action Button: Details Modal */}
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenMasterDetails(row.masterId)}
                            startIcon={<Visibility style={{ fontSize: '14px' }} />}
                            style={{
                              borderColor: 'rgba(197, 154, 119, 0.4)',
                              color: '#C59A77',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              borderRadius: '8px',
                              textTransform: 'none',
                            }}
                          >
                            Детальніше
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}

                  {/* Summary Totals Row */}
                  {breakdown.length > 0 && (
                    <TableRow style={{ borderTop: '2px solid rgba(197, 154, 119, 0.4)', backgroundColor: 'rgba(12, 12, 14, 0.9)' }}>
                      <TableCell style={{ color: '#C59A77', fontWeight: 'extrabold', fontSize: '14px' }}>
                        Разом по усім майстрам:
                      </TableCell>
                      <TableCell align="center" style={{ color: '#FFFFFF', fontWeight: 'extrabold', fontSize: '14px' }}>
                        {totalOrdersAll} стрижок
                      </TableCell>
                      <TableCell align="right" style={{ color: '#FFFFFF', fontWeight: 'extrabold', fontSize: '15px' }}>
                        ₴ {totalRevenueAll.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" style={{ color: '#4ADE80', fontWeight: 'extrabold', fontSize: '15px' }}>
                        +₴ {totalEarningsAll.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" style={{ color: '#38BDF8', fontWeight: 'extrabold', fontSize: '15px' }}>
                        +₴ {totalSalonShareAll.toLocaleString()}
                      </TableCell>
                      <TableCell align="center" />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </>
      )}

      {/* Itemized Cuts Modal for Selected Master */}
      <MasterDetailModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMasterId(null);
          setMasterDetails(null);
        }}
        loading={modalLoading}
        details={masterDetails}
      />

    </div>
  );
};

export default FinanceTab;
