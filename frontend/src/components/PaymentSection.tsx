import React, { useState } from 'react';
import { CreditCard, Copy, Check, QrCode, ShieldCheck, Banknote } from 'lucide-react';

export const PaymentSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const iban = 'UA 4432 2001 0000 0260 0838';

  const handleCopy = () => {
    navigator.clipboard.writeText(iban.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="payment" className="py-20 bg-dark-900/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-gold-600/30 relative overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-600/15 border border-gold-600/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                <Banknote className="w-4 h-4" />
                <span>Безготівковий розрахунок</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                Оплата послуг за реквізитами (IBAN)
              </h2>

              <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
                Ви можете зручно оплатити послуги через будь-який банківський додаток (Monobank, Приват24, Sense, PUMB тощо) за офіційним рахунком IBAN.
              </p>

              {/* IBAN Card Box */}
              <div className="bg-dark-950/90 p-5 rounded-2xl border border-gold-600/40 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <span>Офіційний рахунок IBAN</span>
                  <span className="text-gold-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ФОП / Оплата послуг
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                  <span className="font-mono text-lg sm:text-xl font-bold text-gold-400 tracking-wider">
                    {iban}
                  </span>

                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shrink-0 ${
                      copied
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-gold-gradient text-dark-950 border-transparent hover:scale-105 shadow-gold-sm'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Скопійовано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Скопіювати IBAN</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-800 text-xs text-gray-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>
                    Призначення платежу:{' '}
                    <strong className="text-white">оплата за послуги</strong>
                  </span>
                  <span>Отримувач: Перукарня «Лелея»</span>
                </div>
              </div>
            </div>

            {/* Right QR Code Placeholder */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-dark-950 rounded-2xl border border-gold-600/20 text-center">
              <div className="w-40 h-40 bg-white p-3 rounded-xl shadow-lg border border-gold-400 flex items-center justify-center mb-4 relative group">
                {/* SVG Stylized QR code */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                  <rect x="0" y="0" width="30" height="30" rx="3" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  
                  <rect x="70" y="0" width="30" height="30" rx="3" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />

                  <rect x="0" y="70" width="30" height="30" rx="3" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />

                  <rect x="35" y="10" width="10" height="10" />
                  <rect x="50" y="15" width="10" height="20" />
                  <rect x="35" y="35" width="30" height="10" />
                  <rect x="10" y="35" width="20" height="10" />
                  <rect x="70" y="40" width="20" height="20" />
                  <rect x="40" y="55" width="20" height="15" />
                  <rect x="70" y="70" width="15" height="15" />
                  <rect x="50" y="75" width="15" height="20" />
                  <rect x="35" y="80" width="10" height="15" />
                </svg>
              </div>

              <div className="flex items-center gap-2 text-gold-400 font-medium text-xs mb-1">
                <QrCode className="w-4 h-4" />
                <span>Швидка оплата за QR-кодом</span>
              </div>
              <p className="text-[11px] text-gray-400 max-w-xs">
                Відскануйте QR-код сканером банківського додатка для швидкої оплати.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
