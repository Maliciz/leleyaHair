import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme } from './theme/muiTheme';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PriceListSection } from './components/PriceListSection';
import { BookingModal } from './components/BookingModal';
import { ReviewsSection } from './components/ReviewsSection';
import { PaymentSection } from './components/PaymentSection';
import { Footer } from './components/Footer';

import { ServiceCategory, ReviewItem } from './types';
import { getServices, getReviews } from './api/servicesApi';

// Fallback initial data for instant initial rendering
const fallbackCategories: ServiceCategory[] = [
  {
    id: 'men',
    title: 'Чоловічі стрижки',
    description: 'Професійні чоловічі стрижки, моделювання бороди та догляд',
    items: [
      { id: 'm1', name: '«Під нуль»', price: '150 грн', priceValue: 150, durationMinutes: 30, description: 'Стрижка машинкою без насадок по всій голові', category: 'men' },
      { id: 'm2', name: '«Під нуль» + шейвер', price: '250 грн', priceValue: 250, durationMinutes: 30, description: 'Ідеально гладенька стрижка з обробкою електробритвою (шейвером)', category: 'men' },
      { id: 'm3', name: 'Одна насадка', price: '200 грн', priceValue: 200, durationMinutes: 30, description: 'Рівномірна стрижка однією обраною довжиною', category: 'men' },
      { id: 'm4', name: 'Декілька насадок', price: '250 грн', priceValue: 250, durationMinutes: 45, description: 'Класична стрижка з плавним переходом (Fade/Fade taper)', category: 'men' },
      { id: 'm5', name: 'Насадка + ножиці', price: '300 грн', priceValue: 300, durationMinutes: 45, description: 'Комбінована стрижка з індивідуальною опрацюванням форми ножицями', category: 'men' },
      { id: 'm6', name: 'Подовжена стрижка', price: '350 грн', priceValue: 350, durationMinutes: 60, description: 'Стрижка середнього та довгого волосся модельної форми', category: 'men' },
      { id: 'm7', name: 'Борода', price: '200 грн', priceValue: 200, durationMinutes: 30, description: 'Оформлення та контуринг бороди (з шейвером +50 грн)', category: 'men' },
    ],
  },
  {
    id: 'women',
    title: 'Жіночі стрижки',
    description: 'Елегантні жіночі стрижки будь-якої складності та довжини',
    items: [
      { id: 'w1', name: 'Чубчик', price: '150 грн', priceValue: 150, durationMinutes: 30, description: 'Стрижка або корекція формоутворення чубчика', category: 'women' },
      { id: 'w2', name: 'Кінчики', price: '300 грн', priceValue: 300, durationMinutes: 45, description: 'Оновлення зрізу волосся та видалення посічених кінчиків', category: 'women' },
      { id: 'w3', name: 'Жіноча коротка', price: '350 грн', priceValue: 350, durationMinutes: 45, description: 'Модельна стрижка на коротке волосся (Піксі, Боб)', category: 'women' },
      { id: 'w4', name: '2 довжина', price: '350–400 грн', priceValue: 350, durationMinutes: 60, description: 'Стрижка волосся до плечей з укладанням', category: 'women' },
      { id: 'w5', name: '3, 4 довжина', price: '400–450 грн', priceValue: 400, durationMinutes: 60, description: 'Стрижка довгого та дуже довгого волосся', category: 'women' },
    ],
  },
  {
    id: 'kids',
    title: 'Дитячі стрижки',
    description: 'Дбайливі стрижки для найменших відвідувачів у комфортній атмосфері',
    items: [
      { id: 'k1', name: 'Дитяча стрижка', price: '300 грн', priceValue: 300, durationMinutes: 30, description: 'Класична стрижка для дітей до 12 років', category: 'kids' },
      { id: 'k2', name: 'Дитяча модельна', price: '350 грн', priceValue: 350, durationMinutes: 45, description: 'Стильна модельна стрижка з візерунками або складним фасоном', category: 'kids' },
    ],
  },
];

const fallbackReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    authorName: 'Олександр Коваленко',
    rating: 5,
    comment: 'Чудовий салон! Стригся у майстра на «Під нуль + шейвер». Ідеальна гладкість, все дуже охайно та професійно. Особливо порадувала дружня атмосфера та кава!',
    date: '2026-08-15',
    serviceUsed: '«Під нуль» + шейвер',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'rev-2',
    authorName: 'Марія Мельник',
    rating: 5,
    comment: 'Приходила на стрижку кінчиків та догляд. Майстер врахувала всі побажання, волосся виглядає доглянутим та живим. Лелея — мій новий улюблений салон у Вишневому!',
    date: '2026-08-20',
    serviceUsed: 'Кінчики',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'rev-3',
    authorName: 'Дмитро Шевченко',
    rating: 5,
    comment: 'Робив подовжену стрижку та стрижку бороди. Результат супер! Контури бороди рівні, стрижка ідеальна. Ціни дуже помірні для такої високої якості.',
    date: '2026-08-22',
    serviceUsed: 'Подовжена стрижка + Борода',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'rev-4',
    authorName: 'Олена Бойко',
    rating: 5,
    comment: 'Приводила сина на дитячу модельну стрижку. Майстер швидко знайшла підхід до дитини, дитина в захваті, стрижка стильна. Дякуємо!',
    date: '2026-08-25',
    serviceUsed: 'Дитяча модельна',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
  },
];

export const App: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>(fallbackCategories);
  const [reviews, setReviews] = useState<ReviewItem[]>(fallbackReviews);
  
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch live data from NestJS API
    getServices()
      .then((data) => {
        if (data && data.length > 0) setCategories(data);
      })
      .catch((err) => console.log('Using fallback services catalog:', err.message));

    getReviews()
      .then((data) => {
        if (data && data.length > 0) setReviews(data);
      })
      .catch((err) => console.log('Using fallback reviews list:', err.message));
  }, []);

  const handleOpenBooking = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
    setSelectedServiceId(undefined);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col font-sans">
        <Navbar onOpenBooking={handleOpenBooking} />
        
        <main className="flex-grow">
          <HeroSection onOpenBooking={() => handleOpenBooking()} />
          
          <PriceListSection
            categories={categories}
            onSelectService={(serviceId) => handleOpenBooking(serviceId)}
          />

          <ReviewsSection reviews={reviews} />

          <PaymentSection />
        </main>

        <Footer onOpenBooking={() => handleOpenBooking()} />

        <BookingModal
          open={bookingModalOpen}
          onClose={handleCloseBooking}
          categories={categories}
          initialServiceId={selectedServiceId}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
