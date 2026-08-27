import React from 'react';
import AdminLoginPage from './AdminLoginPage';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const token = localStorage.getItem('leleya_admin_token');

  if (!token) {
    return <AdminLoginPage />;
  }

  return <>{children}</>;
};
