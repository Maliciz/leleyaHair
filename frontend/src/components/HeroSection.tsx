import React from 'react';
import { Calendar, Clock, MapPin, Phone, Star, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="./salon_hero.jpg"
          alt="Перукарня Лелея Інтер'єр"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125 scale-105 transform transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-dark-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-600/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Rating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/80 border border-gold-600/30 backdrop-blur-md mb-6 animate-fade-in">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current text-gold-400" />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-300">
            Преміум якість &bull; 4.9 на Google Maps
          </span>
        </div>

        {/* Title & Slogan */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-wide leading-tight mb-4">
          Перукарня <span className="text-gold-gradient font-serif">«Лелея»</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto mb-8 leading-relaxed">
          Втілення вашого стилю та елегантності у кожній деталі. Професійні чоловічі, жіночі та дитячі стрижки у м. Вишневе.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 px-8 py-4 rounded-xl font-bold text-base tracking-wide shadow-gold-glow transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 group"
          >
            <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Записатися онлайн</span>
          </button>

          <a
            href="#services"
            className="w-full sm:w-auto bg-dark-900/80 hover:bg-dark-800 text-white border border-gold-600/30 hover:border-gold-500 px-8 py-4 rounded-xl font-medium text-base transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span>Переглянути послуги</span>
          </a>
        </div>

        {/* Quick Contact Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-4 flex items-center gap-3 border border-gold-600/20 text-left">
            <div className="w-10 h-10 rounded-lg bg-gold-600/10 border border-gold-600/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Графік роботи</p>
              <p className="text-sm font-medium text-white">Щодня з 09:00 до 20:00</p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 flex items-center gap-3 border border-gold-600/20 text-left">
            <div className="w-10 h-10 rounded-lg bg-gold-600/10 border border-gold-600/30 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Локація</p>
              <p className="text-sm font-medium text-white">м. Вишневе, вул. Лесі Українки, 66</p>
            </div>
          </div>

          <a
            href="tel:+380756973616"
            className="glass-card rounded-xl p-4 flex items-center gap-3 border border-gold-600/20 text-left hover:border-gold-500 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-gold-600/10 border border-gold-600/30 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-black transition-colors">
              <Phone className="w-5 h-5 text-gold-400 group-hover:text-black" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Контактний телефон</p>
              <p className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors">
                +38 (075) 697 36 16
              </p>
            </div>
          </a>
        </div>

      </div>
    </section>
  );
};
