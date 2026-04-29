import type { Locale, StoredUser } from '../types/store';

export const getStoredUser = (): StoredUser | null => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null') as StoredUser | null;
  } catch {
    return null;
  }
};

export const getUserFirstName = (locale: Locale): string => {
  const user = getStoredUser();
  if (!user?.name) {
    return locale === 'ar' ? '' : '';
  }

  return user.name.split(/\s+/).filter(Boolean)[0] || '';
};

export const isAuthenticated = (): boolean => Boolean(localStorage.getItem('token'));

export const storeAuthSession = (token: string, user: StoredUser) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
