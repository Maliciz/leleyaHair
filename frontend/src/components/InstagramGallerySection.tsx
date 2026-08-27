import React, { useState } from 'react';
import { INSTAGRAM_POSTS, InstagramPost } from '../data/instagramPosts';
import { Instagram, Heart, ExternalLink, Scissors, User, Calendar, Sparkles, X } from 'lucide-react';
import { Dialog, DialogContent, IconButton } from '@mui/material';

export const InstagramGallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Всі');
  const [activePost, setActivePost] = useState<InstagramPost | null>(null);

  const categories = ['Всі', 'Чоловічі', 'Жіночі', 'Дитячі', 'Фарбування'];

  const filteredPosts = INSTAGRAM_POSTS.filter((post) => {
    if (selectedCategory === 'Всі') return true;
    return post.category === selectedCategory;
  });

  return (
    <section id="portfolio" className="py-20 bg-dark-950 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-bold px-3 py-1 rounded-full bg-gold-600/10 border border-gold-600/30 inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>ПОРТФОЛІО ТА НАШІ РОБОТИ</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide">
            Галерея стрижок & <span className="text-gold-400">Instagram</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            Надихайтеся реальними роботами наших майстрів та обирайте свій ідеальний стиль для наступного візиту.
          </p>
        </div>

        {/* Instagram Banner Profile Card */}
        <div className="bg-dark-900/90 border border-gold-600/30 rounded-3xl p-6 md:p-8 mb-12 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg">
                <img
                  src="./leleya_logo.png"
                  alt="ЛЕЛЕЯ Logo"
                  className="w-full h-full object-cover rounded-full border-2 border-dark-950"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-purple-600 to-pink-500 p-1.5 rounded-full text-white shadow-md">
                <Instagram className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">@leleya.hair</h3>
                <span className="bg-gold-500/20 text-gold-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-gold-500/40">
                  Офіційний акаунт
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Перукарня «Лелея» • м. Вишневе, вул. Лесі Українки, 66
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-300 font-medium">
                <span><b>8</b> дописів</span>
                <span>•</span>
                <span className="text-gold-400"><b>100%</b> задоволених клієнтів</span>
              </div>
            </div>
          </div>

          <a
            href="https://www.instagram.com/leleya.hair/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 group"
          >
            <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Підписатися в Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gold-gradient text-dark-950 shadow-gold-sm scale-105'
                  : 'bg-dark-900 border border-gold-600/20 text-gray-300 hover:border-gold-500 hover:text-white'
              }`}
            >
              {cat === 'Всі' ? 'Всі роботи' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group relative bg-dark-900 rounded-2xl overflow-hidden border border-gold-600/20 hover:border-gold-500/60 shadow-xl cursor-pointer transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Image with zoom effect */}
              <div className="aspect-square w-full overflow-hidden relative">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-lg bg-dark-950/80 backdrop-blur-md border border-gold-600/30 text-[10px] font-bold text-gold-400">
                    {post.category}
                  </span>
                </div>

                {/* Likes Counter Overlay */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 rounded-lg bg-dark-950/80 backdrop-blur-md border border-red-500/30 text-[10px] font-bold text-rose-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{post.likesCount}</span>
                  </span>
                </div>

                {/* Full Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gold-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gold-500" />
                        <span>Майстер: {post.masterName || 'ЛЕЛЕЯ'}</span>
                      </span>
                      <Instagram className="w-4 h-4 text-pink-400" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-white leading-tight">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-300 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="pt-2 flex items-center gap-1 text-xs text-gold-400 font-bold">
                      <span>Натисніть для деталей</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Title Bar */}
              <div className="p-4 border-t border-gold-600/10 flex items-center justify-between bg-dark-900/90">
                <div>
                  <h4 className="font-serif text-sm font-bold text-white truncate max-w-[170px]">
                    {post.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Scissors className="w-3 h-3 text-gold-500" />
                    <span>{post.masterName}</span>
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-dark-950 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Post Detail Lightbox Modal */}
      {activePost && (
        <Dialog
          open={!!activePost}
          onClose={() => setActivePost(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: '#0C0C0E',
              color: '#FFFFFF',
              border: '1px solid rgba(197, 154, 119, 0.4)',
              borderRadius: '24px',
              overflow: 'hidden',
            },
          }}
        >
          <div className="relative flex flex-col md:flex-row max-h-[85vh]">
            
            {/* Close Button */}
            <IconButton
              onClick={() => setActivePost(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 50,
                backgroundColor: 'rgba(12, 12, 14, 0.8)',
                color: '#FFFFFF',
                border: '1px solid rgba(197, 154, 119, 0.3)',
              }}
            >
              <X className="w-5 h-5" />
            </IconButton>

            {/* Left Image View */}
            <div className="w-full md:w-1/2 bg-black flex items-center justify-center">
              <img
                src={activePost.imageUrl}
                alt={activePost.title}
                className="w-full h-full max-h-[500px] object-cover"
              />
            </div>

            {/* Right Information & Comments Drawer */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Master & Instagram Header */}
                <div className="flex items-center justify-between border-b border-gold-600/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-gold-500/40 p-0.5">
                      <img src="./leleya_logo.png" alt="ЛЕЛЕЯ" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-white">Перукарня «Лелея»</h4>
                      <span className="text-xs text-gold-400">Майстер: {activePost.masterName}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-gold-600/10 border border-gold-600/30 text-xs font-bold text-gold-400">
                    {activePost.category}
                  </span>
                </div>

                {/* Post Content */}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">
                    {activePost.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {activePost.description}
                  </p>
                </div>

                {/* Metadata details */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <Heart className="w-4 h-4 fill-rose-500" />
                    <span>{activePost.likesCount} вподобань</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    <span>{activePost.date}</span>
                  </span>
                </div>
              </div>

              {/* Direct Instagram Link Button */}
              <div className="pt-4 border-t border-gold-600/20 space-y-3">
                <a
                  href={activePost.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Переглянути допис в Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <p className="text-[11px] text-center text-gray-500">
                  Офіційна сторінка перукарні: @leleya.hair
                </p>
              </div>

            </div>

          </div>
        </Dialog>
      )}
    </section>
  );
};

export default InstagramGallerySection;
