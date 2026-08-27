import React from 'react';
import { ReviewItem } from '../types';
import { Star, MessageSquare, ExternalLink, Quote } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  return (
    <section id="reviews" className="py-24 bg-dark-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block">
            Відгуки та рейтинг
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Що кажуть наші клієнти
          </h2>
          <div className="w-24 h-1 bg-gold-gradient mx-auto mb-6 rounded-full" />
          <p className="text-gray-400 text-base sm:text-lg font-light">
            Нам довіряють сотні задоволених відвідувачів у м. Вишневе. Оцініть і ви рівень сервісу та майстерності.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="glass-card rounded-2xl p-6 border border-gold-600/20 glass-card-hover flex flex-col justify-between relative"
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-gold-600/10" />

              <div>
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  {review.avatarUrl ? (
                    <img
                      src={review.avatarUrl}
                      alt={review.authorName}
                      className="w-12 h-12 rounded-full object-cover border border-gold-600/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gold-600/20 border border-gold-600/40 flex items-center justify-center font-bold text-gold-400">
                      {review.authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white text-base">{review.authorName}</h3>
                    <span className="text-xs text-gold-500 font-medium">
                      Послуга: {review.serviceUsed}
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-gold-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-300 leading-relaxed italic mb-4">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-500 flex justify-between items-center">
                <span>Перевірений відгук Google Maps</span>
                <span>{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button to Google Maps Review Form */}
        <div className="text-center">
          <a
            href="https://maps.google.com/?q=Перукарня+Лелея+Вишневе+Лесі+Українки+66"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-dark-900 hover:bg-dark-850 text-gold-400 hover:text-gold-300 border border-gold-600/40 hover:border-gold-400 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-gold-sm hover:scale-105"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Залишити відгук на Google Maps</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

      </div>
    </section>
  );
};
