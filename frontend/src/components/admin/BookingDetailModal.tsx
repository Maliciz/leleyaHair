import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import {
  AdminBookingItem,
  MasterItem,
} from '../../api/adminApi';
import { Phone, Calendar, Clock, User, Scissors, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface BookingDetailModalProps {
  open: boolean;
  booking: AdminBookingItem | null;
  masters: MasterItem[];
  onClose: () => void;
  onSave: (id: string, updates: { status?: string; masterId?: string; comment?: string }) => Promise<void>;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  open,
  booking,
  masters,
  onClose,
  onSave,
}) => {
  if (!booking) return null;

  const [selectedStatus, setSelectedStatus] = useState<string>(booking.status);
  const [selectedMasterId, setSelectedMasterId] = useState<string>(booking.masterId || '');
  const [comment, setComment] = useState<string>(booking.comment || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.status);
      setSelectedMasterId(booking.masterId || '');
      setComment(booking.comment || '');
    }
  }, [booking]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(booking.id, {
        status: selectedStatus,
        masterId: selectedMasterId || undefined,
        comment,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Очікує підтвердження" color="warning" size="small" />;
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#121216',
          border: '1px solid rgba(197, 154, 119, 0.3)',
          color: '#ffffff',
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle className="border-b border-gold-600/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-600/20 border border-gold-600/40 flex items-center justify-center text-gold-400">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-white">
              Деталі запису #{booking.id.slice(0, 8)}
            </h3>
            <p className="text-xs text-gray-400">Керування статусом та майстром</p>
          </div>
        </div>
        {getStatusChip(selectedStatus)}
      </DialogTitle>

      <DialogContent className="p-6 space-y-5">
        {/* Client Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-dark-950 border border-gold-600/10 text-xs">
          <div>
            <span className="text-gray-400 block mb-1">Клієнт:</span>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <User className="w-4 h-4 text-gold-400" />
              <span>{booking.clientName}</span>
            </div>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Телефон для зв'язку:</span>
            <a
              href={`tel:${booking.clientPhone}`}
              className="flex items-center gap-2 text-sm font-semibold text-gold-400 hover:underline"
            >
              <Phone className="w-4 h-4" />
              <span>{booking.clientPhone}</span>
            </a>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Послуга:</span>
            <span className="text-sm font-medium text-white">
              {booking.service?.name || 'Послуга'} ({booking.service?.price || ''})
            </span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Дата та час:</span>
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>{booking.date}</span>
              <Clock className="w-4 h-4 text-gold-400 ml-2" />
              <span>{booking.timeSlot}</span>
            </div>
          </div>
        </div>

        {/* Master Selector */}
        <FormControl fullWidth size="small" variant="outlined" sx={{ mt: 2 }}>
          <InputLabel sx={{ color: '#c59a77' }}>Призначити майстра</InputLabel>
          <Select
            value={selectedMasterId}
            onChange={(e) => setSelectedMasterId(e.target.value)}
            label="Призначити майстра"
            sx={{
              color: '#ffffff',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.3)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#c59a77' },
              '.MuiSvgIcon-root': { color: '#c59a77' },
            }}
          >
            <MenuItem value="">
              <em>Не призначено</em>
            </MenuItem>
            {masters.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Selector */}
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel sx={{ color: '#c59a77' }}>Статус запису</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Статус запису"
            sx={{
              color: '#ffffff',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.3)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#c59a77' },
              '.MuiSvgIcon-root': { color: '#c59a77' },
            }}
          >
            <MenuItem value="PENDING">Очікує підтвердження (PENDING)</MenuItem>
            <MenuItem value="CONFIRMED">Підтверджено (CONFIRMED)</MenuItem>
            <MenuItem value="COMPLETED">Виконано (COMPLETED)</MenuItem>
            <MenuItem value="CANCELLED">Скасовано (CANCELLED)</MenuItem>
          </Select>
        </FormControl>

        {/* Comment Note */}
        <div>
          <label className="block text-xs text-gray-400 mb-2 font-medium flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
            <span>Примітка або коментар клієнта:</span>
          </label>
          <TextField
            multiline
            rows={3}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Введіть нотатки про запис..."
            variant="outlined"
            sx={{
              '.MuiInputBase-input': { color: '#ffffff', fontSize: '13px' },
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.2)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#c59a77' },
            }}
          />
        </div>
      </DialogContent>

      <DialogActions className="border-t border-gold-600/20 px-6 py-4">
        <Button onClick={onClose} sx={{ color: '#9ca3af' }}>
          Скасувати
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #C59A77 0%, #D4AF37 100%)',
            color: '#0c0c0e',
            fontWeight: 'bold',
            '&:hover': {
              filter: 'brightness(1.1)',
            },
          }}
        >
          {saving ? 'Збереження...' : 'Зберегти зміни'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailModal;
