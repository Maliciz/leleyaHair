import React, { useState, useEffect } from 'react';
import { adminApi, MasterItem } from '../../api/adminApi';
import {
  UserPlus,
  Scissors,
  CheckCircle,
  XCircle,
  Mail,
  Lock,
  Phone,
  User,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Alert,
  Switch,
} from '@mui/material';

export const MastersTab: React.FC = () => {
  const [masters, setMasters] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchMasters = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getMastersList();
      setMasters(data);
    } catch (err) {
      console.error('Failed to fetch masters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);

  const handleOpenModal = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Будь ласка, заповніть всі обов\'язкові поля (Ім\'я, Email, Пароль)');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await adminApi.createMaster({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim() || undefined,
      });

      setSuccessMsg('Акаунт перукаря успішно створено!');
      fetchMasters();
      setTimeout(() => {
        handleCloseModal();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || 'Помилка при створенні акаунту перукаря'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await adminApi.toggleMasterStatus(id);
      fetchMasters();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="bg-dark-900 border border-gold-600/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-gold-400" />
            <span>Управління майстрами та перукарями</span>
          </h2>
          <p className="text-xs text-gold-500 mt-1">
            Додавайте нові акаунти перукарів та керуйте їх доступом до системи
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMasters}
            className="p-2.5 rounded-xl bg-dark-950 border border-gold-600/20 text-gold-400 hover:border-gold-500 transition-colors flex items-center gap-2 text-xs font-medium"
            title="Оновити список"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Оновити</span>
          </button>

          <button
            onClick={handleOpenModal}
            className="px-5 py-2.5 rounded-xl bg-gold-gradient text-dark-950 font-bold text-xs hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-sm flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Додати перукаря</span>
          </button>
        </div>
      </div>

      {/* Masters Table */}
      <div className="bg-dark-900 border border-gold-600/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-dark-950 border-b border-gold-600/20 text-gold-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Перукар</th>
                <th className="py-3.5 px-4">Email / Логін</th>
                <th className="py-3.5 px-4">Роль</th>
                <th className="py-3.5 px-4">Статус доступу</th>
                <th className="py-3.5 px-4 text-right">Перемикач</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-600/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Завантаження майстрів...
                  </td>
                </tr>
              ) : masters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    Перукарів не знайдено. Натисніть «+ Додати перукаря», щоб створити акаунт.
                  </td>
                </tr>
              ) : (
                masters.map((m) => (
                  <tr key={m.id} className="hover:bg-dark-950/60 transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gold-600/20 border border-gold-600/40 flex items-center justify-center text-gold-400 font-bold font-serif text-sm">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-white block">{m.name}</span>
                          <span className="text-[10px] text-gray-500 block">ID: {m.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Mail className="w-3.5 h-3.5 text-gold-400" />
                        <span>{m.user?.email || 'Не вказано'}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-900/30 text-purple-300 border border-purple-500/30">
                        <Scissors className="w-3 h-3" />
                        <span>Перукар (BARBER)</span>
                      </span>
                    </td>

                    {/* Status Chip */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {m.isActive ? (
                        <Chip
                          icon={<CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                          label="Активний"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          icon={<XCircle className="w-3.5 h-3.5 text-red-400" />}
                          label="Неактивний"
                          color="error"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </td>

                    {/* Toggle Switch */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[11px] text-gray-400">
                          {m.isActive ? 'Доступ дозволено' : 'Заблоковано'}
                        </span>
                        <Switch
                          checked={m.isActive}
                          onChange={() => handleToggleStatus(m.id)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#c59a77',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#c59a77',
                            },
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Barber Dialog Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#141418',
            border: '1px solid rgba(197, 154, 119, 0.3)',
            borderRadius: '16px',
            color: '#FFFFFF',
          },
        }}
      >
        <form onSubmit={handleCreateMaster}>
          <DialogTitle className="border-b border-gold-600/20 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold-400">
              <UserPlus className="w-5 h-5" />
              <span className="font-serif text-xl font-bold text-white">
                Реєстрація нового перукаря
              </span>
            </div>
          </DialogTitle>

          <DialogContent className="p-6 space-y-4">
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

            <div>
              <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-1.5">
                ПІБ / Ім'я перукаря *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
                <input
                  type="text"
                  required
                  placeholder="напр. Богдан Шевченко"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-950 border border-gold-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-1.5">
                Email (Логін для входу) *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="bohdan@leleya.ua"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-950 border border-gold-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-1.5">
                Пароль для входу *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-950 border border-gold-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gold-500 font-bold mb-1.5">
                Номер телефону (необов'язково)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
                <input
                  type="text"
                  placeholder="+380XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-950 border border-gold-600/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </DialogContent>

          <DialogActions className="border-t border-gold-600/20 px-6 py-4">
            <Button onClick={handleCloseModal} style={{ color: '#9CA3AF' }}>
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              variant="contained"
              className="bg-gold-gradient text-dark-950 font-bold px-6 py-2.5 rounded-xl"
            >
              {submitting ? 'Створення...' : 'Створити акаунт'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default MastersTab;
