import React, { useState, useEffect } from 'react';
import { Phone, Clock, MapPin, Calendar, Menu, X, Instagram } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
        ? 'bg-dark-950/90 backdrop-blur-md py-3 border-b border-gold-600/20 shadow-lg'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-gold-600/40 p-0.5 flex items-center justify-center bg-dark-900 group-hover:border-gold-500 transition-colors shadow-gold-sm">
              <img src="./leleya_logo.png" alt="ЛЕЛЕЯ Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white group-hover:text-gold-400 transition-colors">
                ЛЕЛЕЯ
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-gold-600 font-semibold -mt-1">
                Перукарня
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <a href="#hero" className="hover:text-gold-400 transition-colors">
              Головна
            </a>
            <a href="#services" className="hover:text-gold-400 transition-colors">
              Послуги та ціни
            </a>
            <a href="#portfolio" className="hover:text-gold-400 transition-colors flex items-center gap-1">
              <span>Галерея</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-gold-600/20 text-gold-400 rounded-full border border-gold-600/30">Insta</span>
            </a>
            <a href="#reviews" className="hover:text-gold-400 transition-colors">
              Відгуки
            </a>
            <a href="#payment" className="hover:text-gold-400 transition-colors">
              Оплата
            </a>
            <a href="#contacts" className="hover:text-gold-400 transition-colors">
              Контакти
            </a>
          </nav>

          {/* Quick Contact & Action CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <a
              href="tel:+380756973616"
              className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-gold-500" />
              <span>+38 (075) 697 36 16</span>
            </a>

            <button
              onClick={() => onOpenBooking()}
              className="bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide shadow-gold-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Записатися онлайн</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => onOpenBooking()}
              className="bg-gold-gradient text-dark-950 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Запис</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900/95 backdrop-blur-xl border-b border-gold-600/20 px-4 pt-4 pb-6 mt-2 space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-medium">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-gold-400"
            >
              Головна
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-gold-400"
            >
              Послуги та ціни
            </a>
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-gold-400 flex items-center gap-2"
            >
              <span>Галерея & Instagram</span>
              <Instagram className="w-4 h-4 text-pink-400" />
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-gold-400"
            >
              Відгуки
            </a>
            <a
              href="#payment"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-gold-400"
            >
              Оплата
            </a>
            <a
              href="#contacts"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-gold-400"
            >
              Контакти
            </a>
          </nav>
          <div className="pt-4 border-t border-gray-800 space-y-3">
            <a
              href="tel:+380756973616"
              className="flex items-center gap-2 text-sm font-medium text-gold-400"
            >
              <Phone className="w-4 h-4" />
              <span>+38 (075) 697 36 16</span>
            </a>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5 text-gold-500" />
              <span>Щодня з 09:00 до 20:00</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              <span>м. Вишневе, вул. Лесі Українки, 66</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
