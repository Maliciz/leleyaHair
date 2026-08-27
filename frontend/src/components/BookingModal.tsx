import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarMonth,
  AccessTime,
  Person,
  Phone as PhoneIcon,
  Notes as NotesIcon,
  CheckCircle,
  ContentCut,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import confetti from 'canvas-confetti';
import { ServiceCategory, ServiceItem, BookingConfirmation } from '../types';
import { getAvailableSlots, submitBooking } from '../api/servicesApi';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  initialServiceId?: string;
}

const steps = ['Вибір послуги', 'Дата та час', 'Ваші дані', 'Підтвердження'];

export const BookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  categories,
  initialServiceId,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<'men' | 'women' | 'kids'>('men');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+380');
  const [notes, setNotes] = useState('');

  // API State
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  // Pre-select service if initialServiceId is passed
  useEffect(() => {
    if (initialServiceId && categories.length > 0) {
      for (const cat of categories) {
        const found = cat.items.find((item) => item.id === initialServiceId);
        if (found) {
          setSelectedCategory(cat.id);
          setSelectedService(found);
          break;
        }
      }
    } else if (categories.length > 0 && !selectedService) {
      setSelectedService(categories[0].items[0] || null);
    }
  }, [initialServiceId, categories]);

  // Fetch available slots when step 1 active or date changes
  useEffect(() => {
    if (activeStep === 1 && selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [activeStep, selectedDate]);

  const fetchSlots = async (dateStr: string) => {
    setLoadingSlots(true);
    setErrorMsg(null);
    try {
      const data = await getAvailableSlots(dateStr);
      setAvailableSlots(data.availableSlots || []);
      setBookedSlots(data.bookedSlots || []);
      
      // Reset selected slot if no longer available
      if (selectedTimeSlot && !data.availableSlots.includes(selectedTimeSlot)) {
        setSelectedTimeSlot('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Не вдалося завантажити вільні слоти');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedService) {
      setErrorMsg('Будь ласка, оберіть послугу');
      return;
    }
    if (activeStep === 1) {
      if (!selectedDate) {
        setErrorMsg('Будь ласка, оберіть дату');
        return;
      }
      if (!selectedTimeSlot) {
        setErrorMsg('Будь ласка, оберіть час прийому');
        return;
      }
    }
    if (activeStep === 2) {
      if (!clientName.trim()) {
        setErrorMsg('Будь ласка, введіть ваші імʼя та прізвище');
        return;
      }
      const cleanPhone = clientPhone.replace(/\s+/g, '');
      if (!/^\+380\d{9}$/.test(cleanPhone)) {
        setErrorMsg('Телефон має відповідати формату +380XXXXXXXXX (12 цифр)');
        return;
      }
    }

    setErrorMsg(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setActiveStep((prev) => prev - 1);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+380')) {
      val = '+380';
    }
    // Only allow digits after +380
    const suffix = val.slice(4).replace(/\D/g, '').slice(0, 9);
    setClientPhone(`+380${suffix}`);
  };

  const handleSubmit = async () => {
    if (!selectedService) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await submitBooking({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        serviceId: selectedService.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: notes.trim(),
      });

      setConfirmation(res);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C59A77', '#E5C158', '#FFFFFF'],
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Помилка створення запису');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setActiveStep(0);
    setConfirmation(null);
    setErrorMsg(null);
    setSelectedTimeSlot('');
    onClose();
  };

  const allItemsForCategory =
    categories.find((c) => c.id === selectedCategory)?.items || [];

  return (
    <Dialog
      open={open}
      onClose={resetAndClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#141418',
          border: '1px solid rgba(197, 154, 119, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          color: '#FFFFFF',
        },
      }}
    >
      {/* Header Title */}
      <DialogTitle className="flex items-center justify-between border-b border-gold-600/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-600/20 border border-gold-600/40 flex items-center justify-center text-gold-400">
            <ContentCut fontSize="small" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
              Онлайн-Запис
            </h3>
            <p className="text-xs text-gold-500 font-medium">Перукарня «Лелея»</p>
          </div>
        </div>
        <IconButton onClick={resetAndClose} style={{ color: '#9CA3AF' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="p-6">
        
        {/* Stepper Progress */}
        {!confirmation && (
          <div className="mb-8 mt-2">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <Alert severity="error" className="mb-6 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200">
            {errorMsg}
          </Alert>
        )}

        {/* STEP 1: SELECT CATEGORY & SERVICE */}
        {activeStep === 0 && !confirmation && (
          <div>
            <h4 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
              <span>1. Оберіть категорію та послугу</span>
            </h4>

            {/* Category selection tabs */}
            <div className="flex gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const first = cat.items[0];
                    if (first) setSelectedService(first);
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gold-gradient text-dark-950 border-transparent shadow-gold-sm'
                      : 'bg-dark-900 border-gold-600/20 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Service Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {allItemsForCategory.map((item) => {
                const isSelected = selectedService?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedService(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gold-600/20 border-gold-400 shadow-gold-sm'
                        : 'bg-dark-900/80 border-gray-800 hover:border-gold-600/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold text-base ${isSelected ? 'text-gold-300' : 'text-white'}`}>
                        {item.name}
                      </span>
                      <span className="text-gold-400 font-bold text-sm bg-gold-600/10 px-2 py-0.5 rounded">
                        {item.price}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-400 mb-2 leading-relaxed">{item.description}</p>
                    )}
                    <span className="text-[11px] text-gray-500 block">
                      ⏱ Тривалість: {item.durationMinutes} хв
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE & TIME SLOT */}
        {activeStep === 1 && !confirmation && (
          <div>
            <h4 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
              <CalendarMonth className="text-gold-400" />
              <span>2. Оберіть дату та час прийому</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date Input */}
              <div className="md:col-span-1 bg-dark-900 p-4 rounded-xl border border-gold-600/20">
                <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-2">
                  Дата візиту
                </label>
                <input
                  type="date"
                  min={dayjs().format('YYYY-MM-DD')}
                  max={dayjs().add(30, 'day').format('YYYY-MM-DD')}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-dark-950 border border-gold-600/30 rounded-lg p-3 text-white focus:border-gold-400 focus:outline-none text-sm"
                />
                <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
                  Режим роботи салонa: <br />
                  <strong className="text-white">Щодня з 09:00 до 20:00</strong>
                </p>
              </div>

              {/* Time Slots Grid */}
              <div className="md:col-span-2 bg-dark-900 p-4 rounded-xl border border-gold-600/20">
                <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-3 flex items-center gap-1.5">
                  <AccessTime fontSize="small" />
                  <span>Вільний час на {dayjs(selectedDate).format('DD.MM.YYYY')}</span>
                </label>

                {loadingSlots ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CircularProgress style={{ color: '#C59A77' }} size={32} />
                    <span className="text-xs text-gray-400 mt-2">Завантаження слотів...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <Alert severity="warning" className="bg-amber-950/40 border border-amber-500/30 text-amber-200">
                    На цю дату немає вільних слотів. Будь ласка, оберіть інший день.
                  </Alert>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-gold-gradient text-dark-950 border-transparent shadow-gold-sm scale-105'
                              : 'bg-dark-950 text-gray-200 border-gold-600/20 hover:border-gold-400 hover:text-white'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CLIENT DETAILS */}
        {activeStep === 2 && !confirmation && (
          <div>
            <h4 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
              <Person className="text-gold-400" />
              <span>3. Введіть контактні дані</span>
            </h4>

            <div className="space-y-4 max-w-lg mx-auto bg-dark-900 p-6 rounded-xl border border-gold-600/20">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-1">
                  Прізвище та імʼя *
                </label>
                <div className="relative">
                  <TextField
                    fullWidth
                    placeholder="напр. Олександр Коваленко"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-1">
                  Номер телефону (+380...) *
                </label>
                <TextField
                  fullWidth
                  placeholder="+380XXXXXXXXX"
                  value={clientPhone}
                  onChange={handlePhoneChange}
                  variant="outlined"
                  size="small"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-1">
                  Коментар / Побажання (необов'язково)
                </label>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Особливості стрижки, зауваження для майстра..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  variant="outlined"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {activeStep === 3 && !confirmation && (
          <div>
            <h4 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="text-gold-400" />
              <span>4. Перевірте деталі запису</span>
            </h4>

            <div className="bg-dark-900 rounded-xl p-6 border border-gold-600/30 max-w-lg mx-auto space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Послуга</span>
                <span className="text-white font-serif font-bold text-base">{selectedService?.name}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Вартість</span>
                <span className="text-gold-400 font-bold text-base">{selectedService?.price}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Дата та час</span>
                <span className="text-white font-medium">
                  {dayjs(selectedDate).format('DD.MM.YYYY')} о {selectedTimeSlot}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Клієнт</span>
                <span className="text-white font-medium">{clientName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Телефон</span>
                <span className="text-gold-400 font-mono text-sm">{clientPhone}</span>
              </div>

              {notes && (
                <div className="pt-2 text-xs text-gray-400 border-t border-gray-800">
                  <span className="font-semibold text-gray-300">Примітка:</span> {notes}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP SUCCESS CONFIRMATION MODAL STATE */}
        {confirmation && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-gold-600/20 border-2 border-gold-400 rounded-full flex items-center justify-center mx-auto mb-4 text-gold-400 shadow-gold-glow animate-bounce">
              <CheckCircle style={{ fontSize: 48 }} />
            </div>

            <h3 className="text-3xl font-serif font-bold text-white mb-2">
              Ваш запис успішно підтверджено!
            </h3>
            <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
              Дякуємо, що обрали перукарню «Лелея». Чекаємо на вас за адресою: <br />
              <strong className="text-gold-400">м. Вишневе, вул. Лесі Українки, 66</strong>
            </p>

            <div className="bg-dark-900 border border-gold-600/30 rounded-xl p-4 max-w-sm mx-auto mb-6 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Номер запису:</span>
                <span className="text-gold-400 font-mono font-bold">{confirmation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Послуга:</span>
                <span className="text-white font-semibold">{confirmation.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Час візиту:</span>
                <span className="text-white font-medium">
                  {dayjs(confirmation.date).format('DD.MM.YYYY')} о {confirmation.timeSlot}
                </span>
              </div>
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={resetAndClose}
              className="bg-gold-gradient text-dark-950 font-bold px-8 py-3 rounded-xl"
            >
              Зрозуміло, закрити
            </Button>
          </div>
        )}

      </DialogContent>

      {/* Navigation Buttons Footer */}
      {!confirmation && (
        <div className="flex items-center justify-between border-t border-gold-600/20 px-6 py-4 bg-dark-950 rounded-b-16">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
            style={{ color: activeStep === 0 ? '#4B5563' : '#C59A77' }}
          >
            Назад
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
              className="bg-gold-gradient text-dark-950 font-bold"
            >
              Далі
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
              className="bg-gold-gradient text-dark-950 font-bold px-6"
            >
              {submitting ? 'Підтвердження...' : 'Підтвердити запис'}
            </Button>
          )}
        </div>
      )}
    </Dialog>
  );
};
