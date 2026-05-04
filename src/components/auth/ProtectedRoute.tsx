import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, type = 'admin' }: { children: React.ReactNode, type?: 'admin' | 'staff' }) {
  const isAdminAuth = localStorage.getItem('admin_auth') === 'true';
  const isStaffAuth = localStorage.getItem('staff_auth') === 'true';
  
  const isAuth = type === 'admin' ? isAdminAuth : (isStaffAuth || isAdminAuth);

  if (!isAuth) {
    return <Navigate to={type === 'admin' ? '/admin-login' : '/staff-login'} replace />;
  }

  return <>{children}</>;
}
