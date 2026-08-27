import React from 'react';

interface ProtectedBarberRouteProps {
  children: React.ReactNode;
}

export const ProtectedBarberRoute: React.FC<ProtectedBarberRouteProps> = ({ children }) => {
  const token = localStorage.getItem('leleya_admin_token');
  const userStr = localStorage.getItem('leleya_admin_user');

  if (!token || !userStr) {
    window.location.hash = '#/admin/login';
    return null;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== 'BARBER' && user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      window.location.hash = '#/admin/login';
      return null;
    }
  } catch (e) {
    window.location.hash = '#/admin/login';
    return null;
  }

  return <>{children}</>;
};

export default ProtectedBarberRoute;
