import React, { useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { Lock, Mail, AlertCircle, Scissors, ArrowLeft } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('manager@leleya.ua');
  const [password, setPassword] = useState('manager123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await adminApi.login({ email, password });
      localStorage.setItem('leleya_admin_token', res.accessToken);
      localStorage.setItem('leleya_admin_user', JSON.stringify(res.user));

      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        if (res.user.role === 'BARBER') {
          window.location.hash = '#/barber/dashboard';
        } else {
          window.location.hash = '#/admin/dashboard';
        }
        window.location.reload();
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          'Невірна комбінація пошти та паролю. Перевірте введені дані.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      <a
        href="#"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-gray-400 hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Повернутися на сайт перукарні</span>
      </a>

      <div className="w-full max-w-md bg-dark-900 border border-gold-600/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full border border-gold-600/50 p-1 mb-4 flex items-center justify-center bg-dark-950 shadow-gold-sm">
            <img src="./leleya_logo.png" alt="ЛЕЛЕЯ Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-wide text-white">
            Портал Персоналу
          </h2>
          <p className="text-xs text-gold-400 mt-1 uppercase tracking-widest font-semibold">
            Перукарня «Лелея»
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-gray-300 mb-2 font-medium">
              Електронна пошта
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@leleya.ua або anastasia@leleya.ua"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-950 border border-gold-600/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-2 font-medium">
              Пароль доступу
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-950 border border-gold-600/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gold-gradient text-dark-950 font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Авторизація...</span>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>Увійти в кабінет</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials hint */}
        <div className="mt-8 pt-4 border-t border-gold-600/10 text-center text-xs text-gray-400 space-y-1">
          <p>👑 Менеджер: <strong className="text-white">manager@leleya.ua</strong> / <strong className="text-white">manager123</strong></p>
          <p>✂️ Перукар: <strong className="text-white">anastasia@leleya.ua</strong> / <strong className="text-white">barber123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
