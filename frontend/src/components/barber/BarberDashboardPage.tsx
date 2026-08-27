import React, { useState, useEffect } from 'react';
import {
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CheckCircle,
  CalendarMonth,
  AttachMoney,
  ContentCut,
  Logout,
  Notes as NotesIcon,
  Refresh,
  EventAvailable,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { barberApi, BarberBooking, BarberEarnings } from '../../api/barberApi';

export const BarberDashboardPage: React.FC = () => {
  const userStr = localStorage.getItem('leleya_admin_user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Earnings & Stats State
  const [period, setPeriod] = useState<'today' | 'month' | 'all'>('today');
  const [earnings, setEarnings] = useState<BarberEarnings | null>(null);
  const [loadingEarnings, setLoadingEarnings] = useState(false);

  // Schedule State
  const [scheduleDates, setScheduleDates] = useState<string[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('YYYY-MM'));

  // Appointments State
  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'all'>('today');
  const [bookings, setBookings] = useState<BarberBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Error Banner
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchEarnings(period);
    fetchSchedule();
    fetchBookings(dateFilter);
  }, []);

  const fetchEarnings = async (p: 'today' | 'month' | 'all') => {
    setLoadingEarnings(true);
    try {
      const data = await barberApi.getEarnings(p);
      setEarnings(data);
    } catch (e: any) {
      console.error('Error fetching earnings', e);
    } finally {
      setLoadingEarnings(false);
    }
  };

  const fetchSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const dates = await barberApi.getMySchedule();
      setScheduleDates(dates);
    } catch (e: any) {
      console.error('Error fetching schedule', e);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const fetchBookings = async (filter: 'today' | 'tomorrow' | 'all') => {
    setLoadingBookings(true);
    setErrorMsg(null);
    try {
      let reqDate: string | undefined = undefined;
      if (filter === 'today') {
        reqDate = dayjs().format('YYYY-MM-DD');
      } else if (filter === 'tomorrow') {
        reqDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
      }
      const data = await barberApi.getMyBookings(reqDate);
      setBookings(data);
    } catch (e: any) {
      setErrorMsg(e.message || 'Не вдалося завантажити записи');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handlePeriodChange = (newPeriod: 'today' | 'month' | 'all') => {
    setPeriod(newPeriod);
    fetchEarnings(newPeriod);
  };

  const handleDateFilterChange = (filter: 'today' | 'tomorrow' | 'all') => {
    setDateFilter(filter);
    fetchBookings(filter);
  };

  const handleToggleWorkDate = async (dateStr: string) => {
    try {
      await barberApi.toggleWorkDate(dateStr);
      await fetchSchedule();
    } catch (e: any) {
      alert(e.message || 'Не вдалося оновити графік');
    }
  };

  const handleCompleteBooking = async (id: string) => {
    setCompletingId(id);
    try {
      await barberApi.markBookingCompleted(id);
      // Refresh bookings & earnings instantly
      await Promise.all([fetchBookings(dateFilter), fetchEarnings(period)]);
    } catch (e: any) {
      alert(e.message || 'Помилка при завершенні стрижки');
    } finally {
      setCompletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('leleya_admin_token');
    localStorage.removeItem('leleya_admin_user');
    window.location.hash = '#/admin/login';
  };

  // Generate calendar days for selected month
  const daysInMonth = dayjs(selectedMonth).daysInMonth();
  const startOfMonthDay = dayjs(selectedMonth).startOf('month').day(); // 0 is Sunday
  const offset = startOfMonthDay === 0 ? 6 : startOfMonthDay - 1; // Align to Monday

  const calendarDays: Array<{ dateStr: string; dayNum: number } | null> = [];
  for (let i = 0; i < offset; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = dayjs(selectedMonth).date(d).format('YYYY-MM-DD');
    calendarDays.push({ dateStr, dayNum: d });
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans selection:bg-gold-500 selection:text-dark-950 pb-16">
      
      {/* Top Navbar Header */}
      <header className="bg-dark-900/90 backdrop-blur-md border-b border-gold-600/20 sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-600/40 p-0.5 flex items-center justify-center bg-dark-850 shadow-gold-sm">
              <ContentCut className="text-gold-400" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white">
                Кабінет Майстра — Перукарня «Лелея»
              </h1>
              <p className="text-xs text-gold-500 font-medium">
                Вітаємо, {user?.name || 'Майстер'}! 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs text-gray-400 bg-dark-850 px-3 py-1.5 rounded-lg border border-gray-800">
              {user?.email}
            </span>
            <Button
              variant="outlined"
              size="small"
              onClick={handleLogout}
              startIcon={<Logout />}
              style={{
                borderColor: 'rgba(197, 154, 119, 0.4)',
                color: '#C59A77',
                borderRadius: '8px',
              }}
            >
              Вийти
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Global Error Banner */}
        {errorMsg && (
          <Alert severity="error" className="bg-red-950/80 border border-red-500/40 text-red-200">
            {errorMsg}
          </Alert>
        )}

        {/* SECTION 1: TOP SUMMARY & EARNINGS WIDGET */}
        <section className="bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold block mb-1">
                Фінансова статистика
              </span>
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <AttachMoney className="text-gold-400" />
                <span>Заробіток та Виручка</span>
              </h2>
            </div>

            {/* Period Toggle Controls */}
            <div className="inline-flex p-1 bg-dark-950 rounded-xl border border-gold-600/20">
              <button
                onClick={() => handlePeriodChange('today')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  period === 'today'
                    ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Сьогодні
              </button>
              <button
                onClick={() => handlePeriodChange('month')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  period === 'month'
                    ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Цей місяць
              </button>
              <button
                onClick={() => handlePeriodChange('all')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  period === 'all'
                    ? 'bg-gold-gradient text-dark-950 shadow-gold-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                За весь час
              </button>
            </div>
          </div>

          {loadingEarnings ? (
            <div className="flex justify-center py-8">
              <CircularProgress style={{ color: '#C59A77' }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Barber Payout Card (40%) */}
              <div className="bg-dark-950/80 border border-gold-600/40 rounded-xl p-5 relative group hover:border-gold-400 transition-all">
                <span className="text-xs text-gold-500 font-semibold block mb-1">
                  Ваш дохід (40% від стрижок)
                </span>
                <span className="text-3xl font-serif font-bold text-gold-300 block">
                  {earnings?.barberPayout || 0} <span className="text-lg">грн</span>
                </span>
                <p className="text-[11px] text-gray-400 mt-2">
                  Зараховано за виконані замовлення
                </p>
              </div>

              {/* Completed Cuts Count */}
              <div className="bg-dark-950/80 border border-gold-600/20 rounded-xl p-5">
                <span className="text-xs text-gray-400 font-semibold block mb-1">
                  Виконано стрижок
                </span>
                <span className="text-3xl font-serif font-bold text-white block">
                  {earnings?.totalCompletedCount || 0}
                </span>
                <p className="text-[11px] text-gray-400 mt-2">
                  Обслуговано клієнтів
                </p>
              </div>

              {/* Total Salon Revenue */}
              <div className="bg-dark-950/80 border border-gold-600/20 rounded-xl p-5">
                <span className="text-xs text-gray-400 font-semibold block mb-1">
                  Загальна виручка послуг
                </span>
                <span className="text-3xl font-serif font-bold text-gray-200 block">
                  {earnings?.totalRevenue || 0} <span className="text-lg">грн</span>
                </span>
                <p className="text-[11px] text-gray-400 mt-2">
                  Повна вартість обслуговування
                </p>
              </div>

            </div>
          )}
        </section>

        {/* SECTION 2: INTERACTIVE WORK SCHEDULE CALENDAR & APPOINTMENTS LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: WORK SCHEDULE CALENDAR (5 cols) */}
          <div className="lg:col-span-5 bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <CalendarMonth className="text-gold-400" />
                <span>Мій графік виходів</span>
              </h3>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-dark-950 border border-gold-600/30 rounded-lg px-2.5 py-1 text-xs text-gold-400 focus:outline-none"
              />
            </div>
            
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Натисніть на дату, щоб позначити або скасувати свій робочий день у салоні.
            </p>

            {loadingSchedule ? (
              <div className="flex justify-center py-12">
                <CircularProgress style={{ color: '#C59A77' }} size={28} />
              </div>
            ) : (
              <div>
                {/* Weekday Labels */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gold-500 mb-2">
                  <span>Пн</span>
                  <span>Вт</span>
                  <span>Ср</span>
                  <span>Чт</span>
                  <span>Пт</span>
                  <span>Сб</span>
                  <span>Нд</span>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarDays.map((item, idx) => {
                    if (!item) {
                      return <div key={`empty-${idx}`} className="h-10 rounded-lg bg-transparent" />;
                    }

                    const isScheduled = scheduleDates.includes(item.dateStr);
                    const isToday = item.dateStr === dayjs().format('YYYY-MM-DD');

                    return (
                      <button
                        key={item.dateStr}
                        onClick={() => handleToggleWorkDate(item.dateStr)}
                        className={`h-10 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center border ${
                          isScheduled
                            ? 'bg-gold-gradient text-dark-950 border-transparent shadow-gold-sm font-extrabold'
                            : isToday
                            ? 'bg-dark-850 text-gold-400 border-gold-500/50'
                            : 'bg-dark-950 text-gray-300 border-gray-800/80 hover:border-gold-600/40 hover:text-white'
                        }`}
                      >
                        <span>{item.dayNum}</span>
                        {isScheduled && (
                          <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-dark-950" />
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-500 inline-block" />
                    <span>Обрані зміни ({scheduleDates.length})</span>
                  </span>
                  <span>Своєчасне оновлення графіку</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: APPOINTMENTS LIST (7 cols) */}
          <div className="lg:col-span-7 bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              
              {/* Header & Date Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <EventAvailable className="text-gold-400" />
                  <span>Список моїх записів</span>
                </h3>

                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1 bg-dark-950 rounded-xl border border-gold-600/20">
                    <button
                      onClick={() => handleDateFilterChange('today')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        dateFilter === 'today'
                          ? 'bg-gold-gradient text-dark-950'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Сьогодні
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('tomorrow')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        dateFilter === 'tomorrow'
                          ? 'bg-gold-gradient text-dark-950'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Завтра
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        dateFilter === 'all'
                          ? 'bg-gold-gradient text-dark-950'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Всі
                    </button>
                  </div>

                  <IconButton
                    size="small"
                    onClick={() => fetchBookings(dateFilter)}
                    style={{ color: '#C59A77' }}
                  >
                    <Refresh fontSize="small" />
                  </IconButton>
                </div>
              </div>

              {/* Bookings Display */}
              {loadingBookings ? (
                <div className="flex justify-center py-16">
                  <CircularProgress style={{ color: '#C59A77' }} />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-dark-950/60 rounded-xl border border-gray-800">
                  <ContentCut className="w-12 h-12 text-gold-600/30 mx-auto mb-3" />
                  <p className="text-gray-300 font-medium text-base mb-1">
                    Записів на цей період поки немає
                  </p>
                  <p className="text-xs text-gray-500">
                    Очікуйте нових бронювань від клієнтів або виберіть іншу дату
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {bookings.map((item) => {
                    const priceVal = item.service?.priceValue || 0;
                    const barberEarn = Math.round(priceVal * 0.40);
                    const isCompleted = item.status === 'COMPLETED';

                    return (
                      <div
                        key={item.id}
                        className={`p-5 rounded-xl border transition-all ${
                          isCompleted
                            ? 'bg-dark-950/60 border-emerald-500/30'
                            : 'bg-dark-950 border-gold-600/20 hover:border-gold-600/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-800">
                          
                          {/* Time & Service */}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gold-400 font-serif font-bold text-lg">
                                ⏱ {item.timeSlot}
                              </span>
                              <span className="text-xs text-gray-400">({item.date})</span>
                            </div>
                            <h4 className="text-white font-semibold text-base">
                              {item.service?.name || 'Послуга перукарні'}
                            </h4>
                          </div>

                          {/* Price & Master Payout */}
                          <div className="text-left sm:text-right">
                            <span className="text-gray-300 text-sm font-semibold block">
                              Вартість: {item.service?.price || `${priceVal} грн`}
                            </span>
                            <span className="text-emerald-400 text-xs font-bold block">
                              Дохід майстра: +{barberEarn} грн (40%)
                            </span>
                          </div>

                        </div>

                        {/* Client Info & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          <div>
                            <p className="text-sm font-medium text-white">{item.clientName}</p>
                            <a
                              href={`tel:${item.clientPhone}`}
                              className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 mt-0.5"
                            >
                              <PhoneIcon style={{ fontSize: 13 }} />
                              <span>{item.clientPhone}</span>
                            </a>
                            {item.comment && (
                              <p className="text-xs text-gray-400 italic mt-1 flex items-center gap-1">
                                <NotesIcon style={{ fontSize: 13 }} />
                                <span>"{item.comment}"</span>
                              </p>
                            )}
                          </div>

                          {/* Complete Action Button */}
                          <div>
                            {isCompleted ? (
                              <Chip
                                label="Виконано ✓"
                                color="success"
                                size="small"
                                style={{ fontWeight: 'bold' }}
                              />
                            ) : (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                disabled={completingId === item.id}
                                onClick={() => handleCompleteBooking(item.id)}
                                startIcon={
                                  completingId === item.id ? (
                                    <CircularProgress size={14} color="inherit" />
                                  ) : (
                                    <CheckCircle />
                                  )
                                }
                                style={{
                                  backgroundColor: '#16A34A',
                                  color: '#FFFFFF',
                                  fontWeight: 'bold',
                                  borderRadius: '8px',
                                }}
                              >
                                {completingId === item.id ? 'Зачекайте...' : 'Позначити як виконано'}
                              </Button>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

        </div>

      </main>

    </div>
  );
};

export default BarberDashboardPage;
