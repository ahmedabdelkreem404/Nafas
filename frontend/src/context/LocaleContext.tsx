/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Locale = 'ar' | 'en';

type LocaleContextValue = {
  dir: 'rtl' | 'ltr';
  isArabic: boolean;
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
  toggleLocale: () => void;
};

const STORAGE_KEY = 'nafas_locale';
const LocaleContext = createContext<LocaleContextValue | null>(null);

function sanitizeLocale(value: string | null): Locale | null {
  return value === 'ar' || value === 'en' ? value : null;
}

function readLocaleFromLocation() {
  if (typeof window === 'undefined') {
    return null;
  }

  return sanitizeLocale(new URLSearchParams(window.location.search).get('lang'));
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'ar';
  }

  return readLocaleFromLocation() ?? sanitizeLocale(window.localStorage.getItem(STORAGE_KEY)) ?? 'ar';
}

function applyDocumentLocale(locale: Locale) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
  document.body.dir = dir;
  document.body.dataset.locale = locale;
}

export const LocaleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, locale);
    applyDocumentLocale(locale);
  }, [locale]);

  useEffect(() => {
    const handlePopState = () => {
      const nextLocale = readLocaleFromLocation();
      if (nextLocale) {
        setLocaleState(nextLocale);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((currentLocale) => (currentLocale === 'ar' ? 'en' : 'ar'));
  }, []);

  const value = useMemo<LocaleContextValue>(() => ({
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    isArabic: locale === 'ar',
    locale,
    setLocale,
    toggleLocale,
  }), [locale, setLocale, toggleLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider.');
  }

  return context;
}
