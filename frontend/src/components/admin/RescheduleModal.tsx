import React, { useState, useEffect } from 'react';
import { adminApi, AdminBookingItem, MasterItem } from '../../api/adminApi';
import { bookingsApi, AvailableMaster, SlotItem } from '../../api/servicesApi';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarMonth,
  AccessTime,
} from '@mui/icons-material';
import {
  User,
  Phone,
  Scissors,
  Clock,
  Sparkles,
} from 'lucide-react';
import dayjs from 'dayjs';

interface RescheduleModalProps {
  open: boolean;
  booking: AdminBookingItem | null;
  masters: MasterItem[];
  onClose: () => void;
  onRescheduleSuccess: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  open,
  booking,
  masters,
  onClose,
  onRescheduleSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  );
  const [selectedMasterId, setSelectedMasterId] = useState<string>('ANY');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const [loadingMasters, setLoadingMasters] = useState(false);
  const [workingMasters, setWorkingMasters] = useState<AvailableMaster[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsData, setSlotsData] = useState<SlotItem[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setSelectedDate(booking.date || dayjs().format('YYYY-MM-DD'));
      setSelectedMasterId(booking.masterId || 'ANY');
      setSelectedTimeSlot(booking.timeSlot || '');
      setComment(booking.comment || '');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [booking, open]);

  // Fetch working masters for the date
  useEffect(() => {
    if (open && selectedDate) {
      fetchWorkingMasters(selectedDate);
    }
  }, [open, selectedDate]);

  // Fetch available slots for date + master
  useEffect(() => {
    if (open && selectedDate) {
      fetchSlots(selectedDate, selectedMasterId);
    }
  }, [open, selectedDate, selectedMasterId]);

  const fetchWorkingMasters = async (dateStr: string) => {
    setLoadingMasters(true);
    try {
      const data = await bookingsApi.getAvailableMasters(dateStr);
      setWorkingMasters(data || []);
    } catch (err) {
      console.error('Error fetching working masters:', err);
      setWorkingMasters([]);
    } finally {
      setLoadingMasters(false);
    }
  };

  const fetchSlots = async (dateStr: string, masterId?: string) => {
    setLoadingSlots(true);
    setErrorMsg(null);
    try {
      const res = await bookingsApi.getAvailableSlots(
        dateStr,
        masterId === 'ANY' ? undefined : masterId,
        booking?.serviceId
      );
      setSlotsData(res.availableSlots || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Не вдалося завантажити вільні слоти');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    if (!selectedDate) {
      setErrorMsg('Будь ласка, оберіть нову дату');
      return;
    }

    if (!selectedTimeSlot) {
      setErrorMsg('Будь ласка, оберіть новий час (слот)');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await adminApi.rescheduleBooking(booking.id, {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        masterId: selectedMasterId === 'ANY' ? undefined : selectedMasterId,
        comment: comment.trim() || undefined,
      });

      setSuccessMsg('Час запису успішно перенесено!');
      onRescheduleSuccess();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Помилка при збереженні нового часу'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) return null;

  const workingMasterIds = new Set(workingMasters.map((m) => m.id));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#141418',
          border: '1px solid rgba(197, 154, 119, 0.3)',
          borderRadius: '16px',
          color: '#FFFFFF',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        },
      }}
    >
      <form onSubmit={handleSave}>
        {/* Modal Header */}
        <DialogTitle className="border-b border-gold-600/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-600/20 border border-gold-600/40 flex items-center justify-center text-gold-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                Перенесення запису клієнта
              </h3>
              <p className="text-xs text-gold-400">Зміна дати, часу та майстра</p>
            </div>
          </div>
          <IconButton onClick={onClose} style={{ color: '#9CA3AF' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="p-6 space-y-6">
          {errorMsg && (
            <Alert severity="error" className="bg-red-950/80 border border-red-500/40 text-red-200">
              {errorMsg}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200">
              {successMsg}
            </Alert>
          )}

          {/* Current Booking Overview Card */}
          <div className="bg-dark-900 border border-gold-600/30 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block mb-0.5 font-semibold">Клієнт:</span>
              <span className="text-white font-bold text-sm flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-gold-400" />
                {booking.clientName}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block mb-0.5 font-semibold">Телефон:</span>
              <span className="text-gold-400 font-mono flex items-center gap-1 font-medium">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                {booking.clientPhone}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block mb-0.5 font-semibold">Послуга:</span>
              <span className="text-white font-semibold flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-gold-400" />
                {booking.service?.name || 'Послуга'} ({booking.service?.price})
              </span>
            </div>

            <div>
              <span className="text-gray-400 block mb-0.5 font-semibold">Поточний час:</span>
              <span className="text-amber-400 font-bold bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded inline-block">
                {booking.date ? dayjs(booking.date).format('DD.MM.YYYY') : ''}, {booking.timeSlot}
              </span>
            </div>
          </div>

          {/* New Date & Master Picker Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Date Picker */}
            <div className="bg-dark-900 p-4 rounded-xl border border-gold-600/20 space-y-2">
              <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold flex items-center gap-1.5">
                <CalendarMonth className="w-4 h-4 text-gold-400" />
                <span>Нова дата візиту</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-dark-950 border border-gold-600/30 rounded-xl px-3 py-2.5 text-white focus:border-gold-400 focus:outline-none text-sm"
              />
            </div>

            {/* Master Picker */}
            <div className="bg-dark-900 p-4 rounded-xl border border-gold-600/20 space-y-2">
              <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-gold-400" />
                <span>Призначений майстер</span>
              </label>
              <Select
                fullWidth
                size="small"
                value={selectedMasterId}
                onChange={(e) => setSelectedMasterId(e.target.value)}
                sx={{
                  fontSize: '13px',
                  color: '#ffffff',
                  backgroundColor: '#0c0c0e',
                  borderRadius: '12px',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(197, 154, 119, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#c59a77',
                  },
                  '.MuiSvgIcon-root': { color: '#c59a77' },
                }}
              >
                <MenuItem value="ANY" sx={{ fontSize: '13px' }}>
                  <span className="flex items-center gap-1.5 text-gold-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Будь-який вільний майстер
                  </span>
                </MenuItem>
                {masters.map((m) => {
                  const isWorking = workingMasterIds.has(m.id);
                  return (
                    <MenuItem key={m.id} value={m.id} sx={{ fontSize: '13px' }}>
                      <span className="flex items-center justify-between w-full">
                        <span>{m.name}</span>
                        {isWorking ? (
                          <span className="text-[10px] text-emerald-400 ml-2 font-semibold">
                            ✓ Працює в цей день
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500 ml-2">
                            (Вихідний)
                          </span>
                        )}
                      </span>
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>

          {/* Available Slots Grid */}
          <div className="bg-dark-900 p-5 rounded-xl border border-gold-600/20 space-y-3">
            <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold flex items-center gap-1.5">
              <AccessTime className="w-4 h-4 text-gold-400" />
              <span>
                Оберіть новий час (слот) на {dayjs(selectedDate).format('DD.MM.YYYY')}
              </span>
            </label>

            {loadingSlots ? (
              <div className="flex items-center justify-center py-8 gap-2 text-xs text-gray-400">
                <CircularProgress size={22} style={{ color: '#C59A77' }} />
                <span>Оновлення доступних слотів...</span>
              </div>
            ) : slotsData.length === 0 ? (
              <Alert severity="warning" className="bg-amber-950/40 border border-amber-500/30 text-amber-200">
                На обрану дату немає вільних слотів або майстер не має робочої зміни.
              </Alert>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 max-h-[200px] overflow-y-auto pr-1">
                {slotsData.map((slot) => {
                  const isSelected = selectedTimeSlot === slot.timeSlot;
                  return (
                    <button
                      key={slot.timeSlot}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedTimeSlot(slot.timeSlot)}
                      className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-gold-gradient text-dark-950 border-transparent shadow-gold-sm scale-105'
                          : !slot.isAvailable
                          ? 'bg-dark-950/40 text-gray-600 border-gray-800 cursor-not-allowed line-through opacity-50'
                          : 'bg-dark-950 text-gray-200 border-gold-600/20 hover:border-gold-400 hover:text-white'
                      }`}
                    >
                      {slot.timeSlot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Comment / Reason Field */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-1.5">
              Примітка / Причина перенесення (необов'язково)
            </label>
            <input
              type="text"
              placeholder="напр. Перенесено на прохання клієнта"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-dark-950 border border-gold-600/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
        </DialogContent>

        <DialogActions className="border-t border-gold-600/20 px-6 py-4">
          <Button onClick={onClose} style={{ color: '#9CA3AF' }}>
            Скасувати
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            variant="contained"
            className="bg-gold-gradient text-dark-950 font-bold px-6 py-2.5 rounded-xl shadow-gold-sm"
          >
            {submitting ? 'Збереження...' : 'Зберегти новий час'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RescheduleModal;
