import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, isAdmin = false }: { children: ReactNode; isAdmin?: boolean }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}') as { is_admin?: boolean; role?: string };
  const adminRoles = ['admin', 'super_admin', 'content_manager', 'inventory_manager', 'order_manager'];

  if (!token) {
    return <Navigate to={isAdmin ? '/admin/login' : '/login'} replace />;
  }

  if (isAdmin && !(user.is_admin || adminRoles.includes(String(user.role || '')))) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
