import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PriceListSection } from './components/PriceListSection';
import { ReviewsSection } from './components/ReviewsSection';
import { PaymentSection } from './components/PaymentSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ProtectedAdminRoute } from './components/admin/ProtectedAdminRoute';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';

export const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
    price: string;
  } | null>(null);

  // Hash-based simple router for SPA client & admin panel
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenBooking = (service?: { id: string; name: string; price: string }) => {
    if (service) {
      setSelectedService(service);
    } else {
      setSelectedService(null);
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedService(null);
  };

  // Route 1: Admin Login Page
  if (currentRoute === '#/admin/login') {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          window.location.hash = '#/admin/dashboard';
        }}
      />
    );
  }

  // Route 2: Admin Dashboard Page
  if (currentRoute.startsWith('#/admin')) {
    return (
      <ProtectedAdminRoute>
        <AdminDashboardPage />
      </ProtectedAdminRoute>
    );
  }

  // Default Route: Client SPA Web App
  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans selection:bg-gold-500 selection:text-dark-950">
      {/* Sticky Header Navbar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <main>
        <HeroSection onOpenBooking={() => handleOpenBooking()} />
        <PriceListSection onSelectService={(service: any) => handleOpenBooking(service)} />
        <ReviewsSection />
        <PaymentSection />
      </main>

      {/* Footer & Map */}
      <Footer />

      {/* Multi-Step Online Booking Modal Stepper */}
      <BookingModal
        open={isBookingOpen}
        onClose={handleCloseBooking}
        initialService={selectedService}
      />
    </div>
  );
};

export default App;
