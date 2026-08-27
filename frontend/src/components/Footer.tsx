import React from 'react';
import { MapPin, Phone, Clock, Instagram, ExternalLink, Calendar, Heart } from 'lucide-react';

interface FooterProps {
  onOpenBooking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer id="contacts" className="bg-dark-950 border-t border-gold-600/20 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-gold-600/40 p-0.5 flex items-center justify-center bg-dark-900 shadow-gold-sm">
                <img src="./leleya_logo.png" alt="ЛЕЛЕЯ Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="font-serif text-3xl font-bold tracking-wider text-white">
                  ЛЕЛЕЯ
                </span>
                <span className="block text-xs uppercase tracking-widest text-gold-500 font-semibold">
                  Перукарня у м. Вишневе
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-md">
              Стильна та затишна перукарня для усієї родини. Індивідуальний підхід, сучасні техніки стрижок та неперевершений сервіс.
            </p>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
                <span>м. Вишневе, вул. Лесі Українки, 66</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold-400 shrink-0" />
                <span>Щодня з 09:00 до 20:00</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                <a
                  href="tel:+380756973616"
                  className="hover:text-gold-400 font-semibold transition-colors"
                >
                  +38 (075) 697 36 16
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-gold-400 shrink-0" />
                <a
                  href="https://instagram.com/leleya.hair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 font-medium transition-colors flex items-center gap-1"
                >
                  <span>@leleya.hair</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 px-6 py-3 rounded-xl font-bold text-sm shadow-gold-sm transition-all duration-300 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Записатися зараз</span>
              </button>
            </div>
          </div>

          {/* Embedded Google Maps */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-gold-600/30 shadow-2xl min-h-[300px] relative group">
            <iframe
              title="Розташування Перукарні Лелея"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2543.142345!2d30.362145!3d50.392123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4c987654321%3A0x123456789abcdef!2sVyshneve%2C+Lesi+Ukrainky+St%2C+66!5e0!3m2!1suk!2sua!4v1700000000000!5m2!1suk!2sua"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px', filter: 'invert(90%) hue-rotate(180deg) contrast(90%)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            <a
              href="https://maps.google.com/?q=м.+Вишневе,+вул.+Лесі+Українки,+66"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-dark-900/90 text-gold-400 hover:text-gold-300 px-4 py-2 rounded-lg text-xs font-semibold border border-gold-600/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg transition-colors"
            >
              <span>Відкрити у Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Bottom copyright line with subtle staff login link */}
        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <a
              href="#/admin"
              className="text-[11px] text-zinc-500 hover:text-zinc-400 transition-colors opacity-70 hover:opacity-100 no-underline"
            >
              Вхід для персоналу
            </a>
            <span className="text-zinc-700">|</span>
            <p>© {new Date().getFullYear()} Перукарня «Лелея». Всі права захищені.</p>
          </div>
          <p className="flex items-center gap-1">
            Зроблено з <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> у м. Вишневе
          </p>
        </div>

      </div>
    </footer>
  );
};
