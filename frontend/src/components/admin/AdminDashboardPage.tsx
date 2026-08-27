import React, { useState, useEffect } from 'react';
import {
  adminApi,
  AdminBookingItem,
  MasterItem,
} from '../../api/adminApi';
import BookingDetailModal from './BookingDetailModal';
import FinanceTab from './FinanceTab';
import {
  Scissors,
  LogOut,
  Calendar,
  Clock,
  Phone,
  User,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Filter,
  Check,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { Chip, MenuItem, Select, Tabs, Tab, Box } from '@mui/material';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [bookings, setBookings] = useState<AdminBookingItem[]>([]);
  const [masters, setMasters] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Booking for Modal
  const [activeBooking, setActiveBooking] = useState<AdminBookingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchMasters = async () => {
    try {
      const data = await adminApi.getMastersList();
      setMasters(data);
    } catch (err) {
      console.error('Error fetching masters:', err);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getBookings({
        date: selectedDate === 'ALL_DATES' ? undefined : selectedDate,
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
      });
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      fetchBookings();
    }
  }, [selectedDate, selectedStatus, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('leleya_admin_token');
    localStorage.removeItem('leleya_admin_user');
    window.location.hash = '#/admin/login';
    window.location.reload();
  };

  const handleQuickStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateBookingStatus(id, newStatus);
      fetchBookings();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAssignMaster = async (bookingId: string, masterId: string) => {
    try {
      await adminApi.assignMaster(bookingId, masterId);
      fetchBookings();
    } catch (err) {
      console.error('Failed to assign master:', err);
    }
  };

  const handleSaveModalUpdates = async (
    id: string,
    updates: { status?: string; masterId?: string; comment?: string }
  ) => {
    await adminApi.updateBookingDetails(id, updates);
    fetchBookings();
  };

  // Filtered Bookings by Search Query
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      b.clientName.toLowerCase().includes(q) ||
      b.clientPhone.toLowerCase().includes(q) ||
      b.service?.name.toLowerCase().includes(q)
    );
  });

  // Calculate Quick Stats
  const todayBookingsCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Очікує" color="warning" size="small" />;
      case 'CONFIRMED':
        return <Chip label="Підтверджено" color="info" size="small" />;
      case 'COMPLETED':
        return <Chip label="Виконано" color="success" size="small" />;
      case 'CANCELLED':
        return <Chip label="Скасовано" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans selection:bg-gold-500 selection:text-dark-950">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-gold-600/20 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-gold-600/40 p-0.5 flex items-center justify-center bg-dark-950 shadow-gold-sm">
            <img src="./leleya_logo.png" alt="ЛЕЛЕЯ Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wide text-white">
              Панель керування — Перукарня «Лелея»
            </h1>
            <p className="text-xs text-gold-400">Система управління онлайн-записами та фінансами</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-xs text-gray-400 hover:text-gold-400 transition-colors hidden sm:block"
          >
            ← Перейти на сайт
          </a>

          <div className="h-6 w-px bg-gold-600/20 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-xs font-semibold text-white">Адміністратор Лелея</span>
              <span className="block text-[10px] text-gold-400">manager@leleya.ua</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-900/40 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Вийти з панелі"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Вийти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Navigation Tabs (Bookings vs Finance) */}
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(197, 154, 119, 0.2)' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#C59A77', height: 3 },
              '& .MuiTab-root': {
                color: '#9CA3AF',
                fontWeight: 'bold',
                fontSize: '14px',
                textTransform: 'none',
                '&.Mui-selected': { color: '#C59A77' },
              },
            }}
          >
            <Tab icon={<BookOpen className="w-4 h-4 mr-2" />} iconPosition="start" label="📅 Записи та Замовлення" />
            <Tab icon={<TrendingUp className="w-4 h-4 mr-2" />} iconPosition="start" label="💰 Фінанси та Виплати" />
          </Tabs>
        </Box>

        {/* TAB 0: BOOKINGS MANAGEMENT */}
        {activeTab === 0 && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-dark-900/80 border border-gold-600/20 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium block mb-1">
                    Записів на обраний день
                  </span>
                  <span className="text-3xl font-serif font-bold text-white">
                    {todayBookingsCount}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-gold-400">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-dark-900/80 border border-gold-600/20 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium block mb-1">
                    Очікують підтвердження
                  </span>
                  <span className="text-3xl font-serif font-bold text-amber-400">
                    {pendingCount}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-dark-900/80 border border-gold-600/20 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium block mb-1">
                    Виконано стрижок
                  </span>
                  <span className="text-3xl font-serif font-bold text-emerald-400">
                    {completedCount}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filters & Control Panel */}
            <div className="bg-dark-900 border border-gold-600/20 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Quick Date Selector */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gold-400 font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Дата:</span>
                  </span>
                  <button
                    onClick={() => setSelectedDate(todayStr)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedDate === todayStr
                        ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                        : 'bg-dark-950 border border-gold-600/20 text-gray-300 hover:border-gold-500'
                    }`}
                  >
                    Сьогодні
                  </button>

                  <button
                    onClick={() => setSelectedDate(tomorrowStr)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedDate === tomorrowStr
                        ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                        : 'bg-dark-950 border border-gold-600/20 text-gray-300 hover:border-gold-500'
                    }`}
                  >
                    Завтра
                  </button>

                  <button
                    onClick={() => setSelectedDate('ALL_DATES')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedDate === 'ALL_DATES'
                        ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                        : 'bg-dark-950 border border-gold-600/20 text-gray-300 hover:border-gold-500'
                    }`}
                  >
                    Всі дати
                  </button>

                  {/* Custom Date Input */}
                  <input
                    type="date"
                    value={selectedDate === 'ALL_DATES' ? '' : selectedDate}
                    onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                    className="bg-dark-950 border border-gold-600/20 text-gray-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* Refresh Button */}
                <button
                  onClick={fetchBookings}
                  className="p-2 rounded-xl bg-dark-950 border border-gold-600/20 text-gold-400 hover:border-gold-500 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Оновити</span>
                </button>
              </div>

              {/* Status Tabs & Search Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-3 border-t border-gold-600/10">
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-gold-400 font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Статус:</span>
                  </span>

                  {[
                    { key: 'ALL', label: 'Всі' },
                    { key: 'PENDING', label: 'Очікує' },
                    { key: 'CONFIRMED', label: 'Підтверджено' },
                    { key: 'COMPLETED', label: 'Виконано' },
                    { key: 'CANCELLED', label: 'Скасовано' },
                  ].map((st) => (
                    <button
                      key={st.key}
                      onClick={() => setSelectedStatus(st.key)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        selectedStatus === st.key
                          ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Пошук клієнта або телефону..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-950 border border-gold-600/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-dark-900 border border-gold-600/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-dark-950 border-b border-gold-600/20 text-gold-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Час / Дата</th>
                      <th className="py-3.5 px-4">Клієнт</th>
                      <th className="py-3.5 px-4">Телефон</th>
                      <th className="py-3.5 px-4">Послуга</th>
                      <th className="py-3.5 px-4">Призначений перукар</th>
                      <th className="py-3.5 px-4">Статус</th>
                      <th className="py-3.5 px-4 text-right">Дії</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-600/10">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-500">
                          Завантаження списку записів...
                        </td>
                      </tr>
                    ) : filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-500">
                          Записів за обраними критеріями не знайдено.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-dark-950/60 transition-colors">
                          {/* Date & Time */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gold-400" />
                              <span>{b.timeSlot}</span>
                            </div>
                            <span className="text-[11px] text-gray-400 block mt-0.5">
                              {b.date}
                            </span>
                          </td>

                          {/* Client Name */}
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-gold-400" />
                              <span>{b.clientName}</span>
                            </div>
                            {b.comment && (
                              <span className="text-[10px] text-gold-400/80 block mt-0.5 truncate max-w-[150px]">
                                💬 {b.comment}
                              </span>
                            )}
                          </td>

                          {/* Phone Link */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <a
                              href={`tel:${b.clientPhone}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-600/10 border border-gold-600/30 text-gold-400 hover:bg-gold-600/20 font-medium transition-colors"
                              title="Подзвонити клієнту"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{b.clientPhone}</span>
                            </a>
                          </td>

                          {/* Service Name & Price */}
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-white block">
                              {b.service?.name || 'Послуга'}
                            </span>
                            <span className="text-[11px] text-gold-400 font-semibold block">
                              {b.service?.price}
                            </span>
                          </td>

                          {/* Master Dropdown Selector */}
                          <td className="py-3.5 px-4 min-w-[160px]">
                            <Select
                              size="small"
                              value={b.masterId || ''}
                              onChange={(e) => handleAssignMaster(b.id, e.target.value)}
                              displayEmpty
                              sx={{
                                fontSize: '12px',
                                color: '#ffffff',
                                backgroundColor: '#0c0c0e',
                                '.MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(197, 154, 119, 0.2)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#c59a77',
                                },
                                '.MuiSvgIcon-root': { color: '#c59a77' },
                              }}
                            >
                              <MenuItem value="" sx={{ fontSize: '12px' }}>
                                <em>Оберіть перукаря</em>
                              </MenuItem>
                              {masters.map((m) => (
                                <MenuItem key={m.id} value={m.id} sx={{ fontSize: '12px' }}>
                                  {m.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </td>

                          {/* Status Chip */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {getStatusChip(b.status)}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status === 'PENDING' && (
                                <button
                                  onClick={() => handleQuickStatusChange(b.id, 'CONFIRMED')}
                                  className="p-1.5 rounded-lg bg-emerald-900/30 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60 transition-colors"
                                  title="Підтвердити запис"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {b.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleQuickStatusChange(b.id, 'CANCELLED')}
                                  className="p-1.5 rounded-lg bg-red-900/30 border border-red-500/40 text-red-400 hover:bg-red-900/60 transition-colors"
                                  title="Скасувати запис"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setActiveBooking(b);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-gold-600/10 border border-gold-600/30 text-gold-400 hover:bg-gold-600/20 transition-colors"
                                title="Деталі та редагування"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: FINANCIAL & REVENUE MANAGEMENT */}
        {activeTab === 1 && <FinanceTab />}

      </main>

      {/* Edit Details Dialog Modal */}
      <BookingDetailModal
        open={isModalOpen}
        booking={activeBooking}
        masters={masters}
        onClose={() => {
          setIsModalOpen(false);
          setActiveBooking(null);
        }}
        onSave={handleSaveModalUpdates}
      />
    </div>
  );
};

export default AdminDashboardPage;
