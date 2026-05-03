import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { clearAuthSession, getStoredUser, storeAuthSession } from '../utils/auth';

const adminRoles = ['admin', 'super_admin', 'content_manager', 'inventory_manager', 'order_manager'];

function isAdminUser(user: { is_admin?: boolean; role?: string } | null | undefined) {
  return Boolean(user?.is_admin || adminRoles.includes(String(user?.role || '')));
}

function RouteLoading() {
  return <div className="n-container n-section"><div className="empty-panel">Nafas...</div></div>;
}

export function ProtectedRoute({ children, isAdmin = false }: { children: ReactNode; isAdmin?: boolean }) {
  const token = localStorage.getItem('token');
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>(() => {
    if (!token) return 'denied';
    return isAdmin ? 'checking' : 'allowed';
  });

  useEffect(() => {
    let active = true;

    if (!token) {
      setStatus('denied');
      return () => { active = false; };
    }

    if (!isAdmin) {
      setStatus('allowed');
      return () => { active = false; };
    }

    setStatus('checking');
    authApi.me()
      .then((response) => {
        if (!active) return;
        const user = response.data;
        if (isAdminUser(user)) {
          storeAuthSession(token, user);
          setStatus('allowed');
          return;
        }
        clearAuthSession();
        setStatus('denied');
      })
      .catch(() => {
        if (!active) return;
        clearAuthSession();
        setStatus('denied');
      });

    return () => {
      active = false;
    };
  }, [isAdmin, token]);

  if (!token) {
    return <Navigate to={isAdmin ? '/admin/login' : '/login'} replace />;
  }

  if (isAdmin && !isAdminUser(getStoredUser()) && status === 'allowed') {
    return <Navigate to="/admin/login" replace />;
  }

  if (status === 'checking') {
    return <RouteLoading />;
  }

  if (status === 'denied') {
    return <Navigate to={isAdmin ? '/admin/login' : '/login'} replace />;
  }

  return <>{children}</>;
}
