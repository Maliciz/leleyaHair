import React, { useState } from 'react';
import { ReviewItem } from '../types';
import { Star, MessageSquare, ExternalLink, Quote } from 'lucide-react';

interface ReviewsSectionProps {
  reviews?: ReviewItem[];
}

export const GOOGLE_REVIEWS: ReviewItem[] = [
  {
    id: '1',
    authorName: 'Світлана Ковальчук',
    avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s40-c',
    rating: 5,
    date: 'місяць тому',
    comment: 'Чудова перукарня! Дуже затишна атмосфера, майстри справжні професіонали своєї справи. Стрижкою дуже задоволена, обов\'язково повернуся ще!',
    serviceUsed: 'Жіноча стрижка',
  },
  {
    id: '2',
    authorName: 'Олександр Мельник',
    avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s40-c',
    rating: 5,
    date: '2 місяці тому',
    comment: 'Швидко, якісно та за приємними цінами. Чоловіча стрижка та борода зроблені на найвищому рівні. Рекомендую всім у Вишневому!',
    serviceUsed: 'Чоловіча стрижка + Борода',
  },
  {
    id: '3',
    authorName: 'Юлия Лабун',
    avatarUrl: 'https://lh3.googleusercontent.com/a-/ALV-UjWzbDKLd4eiecB4xRAOoImQC4S7YBw6PtZUOexCymn34t2rI18K=w36-h36-p-rp-mo-br100',
    rating: 5,
    date: '3 тижні тому',
    comment: 'Затишно, працює спеціаліст. Дуже задоволена 👍 …',
    serviceUsed: 'Перукарські послуги',
  },
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews = GOOGLE_REVIEWS }) => {
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});

  const handleAvatarError = (id: string) => {
    setFailedAvatars((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="reviews" className="py-24 bg-dark-950 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-2 block">
            Відгуки Google Maps
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="glass-card rounded-2xl p-6 border border-gold-600/20 glass-card-hover flex flex-col justify-between relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-gold-600/10" />

              <div>
                {/* Author Avatar & Name */}
                <div className="flex items-center gap-3 mb-4">
                  {review.avatarUrl && !failedAvatars[review.id] ? (
                    <img
                      src={review.avatarUrl}
                      alt={review.authorName}
                      onError={() => handleAvatarError(review.id)}
                      className="w-11 h-11 rounded-full object-cover border border-gold-600/40 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gold-600/20 border border-gold-600/40 flex items-center justify-center font-bold text-gold-400 shrink-0">
                      {review.authorName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm truncate">{review.authorName}</h3>
                    {review.serviceUsed && (
                      <span className="text-[11px] text-gold-500 font-medium block truncate">
                        {review.serviceUsed}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-gold-400" />
                  ))}
                </div>

                {/* Review Content */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic mb-4">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-800/80 text-[11px] text-gray-500 flex justify-between items-center">
                <span className="text-gray-400">Google Maps Review</span>
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

export default ReviewsSection;
