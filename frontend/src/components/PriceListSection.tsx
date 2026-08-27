import React, { useState } from 'react';
import { ServiceCategory } from '../types';
import { Clock, CheckCircle2, Scissors, UserCheck, Baby } from 'lucide-react';

interface PriceListSectionProps {
  categories: ServiceCategory[];
  onSelectService: (serviceId: string) => void;
}

export const PriceListSection: React.FC<PriceListSectionProps> = ({
  categories,
  onSelectService,
}) => {
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'kids'>('men');

  const activeCategory = categories.find((cat) => cat.id === activeTab) || categories[0];

  const categoryIcons = {
    men: <UserCheck className="w-5 h-5" />,
    women: <Scissors className="w-5 h-5" />,
    kids: <Baby className="w-5 h-5" />,
  };

  return (
    <section id="services" className="py-24 bg-dark-900/60 relative">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block">
            Каталог та вартість
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Послуги Перукарні «Лелея»
          </h2>
          <div className="w-24 h-1 bg-gold-gradient mx-auto mb-6 rounded-full" />
          <p className="text-gray-400 text-base sm:text-lg font-light">
            Оберіть необхідну послугу та забронюйте зручний час у майстра прямо зараз.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-dark-850 border border-gold-600/20 max-w-full overflow-x-auto">
            {categories.map((cat) => {
              const isActive = cat.id === activeTab;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-gold-gradient text-dark-950 font-bold shadow-gold-sm'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800/50'
                  }`}
                >
                  {categoryIcons[cat.id]}
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services List Display */}
        {activeCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCategory.items.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-gold-600/20 glass-card-hover group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-serif font-semibold text-white group-hover:text-gold-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold font-serif text-gold-400 bg-gold-600/10 border border-gold-600/30 px-3 py-1 rounded-lg shrink-0">
                      {item.price}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <span>Тривалість: {item.durationMinutes} хв</span>
                  </div>

                  <button
                    onClick={() => onSelectService(item.id)}
                    className="bg-gold-600/15 hover:bg-gold-gradient text-gold-300 hover:text-dark-950 border border-gold-600/40 hover:border-transparent px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 group-hover:shadow-gold-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Записатися</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
