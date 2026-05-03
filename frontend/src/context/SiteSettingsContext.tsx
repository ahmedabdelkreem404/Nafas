/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { publicApi } from '../api/publicApi';
import { BRAND_ICON, BRAND_LOGO, WHATSAPP_SUPPORT_URL } from '../utils/brand';

type SiteSettings = Record<string, string | number | boolean | null | undefined>;

type SiteSettingsValue = {
  getSetting: (key: string, fallback?: string) => string;
  settings: SiteSettings;
};

const fallbackSettings: SiteSettings = {
  brand_name_ar: 'دار نفَس',
  brand_name_en: 'Maison Nafas',
  brand_subtitle_ar: 'دار عطرية عربية',
  brand_subtitle_en: 'Arabic perfume house',
  footer_title_ar: 'دار نفَس',
  footer_title_en: 'Maison Nafas',
  footer_brand_ar: 'دار عطرية عربية تبدأ بالتجربة الهادئة: تستر أولاً، اختيار أوضح، ووعود واقعية تناسب العطر الحقيقي.',
  footer_brand_en: 'An Arabic perfume house built around calm discovery: try first, choose clearly, and expect realistic fragrance performance.',
  footer_note_ar: 'تختلف مدة ثبات وفوحان العطر حسب البشرة، الطقس، وطريقة الاستخدام. نركز على تجربة واضحة ومريحة بدون مبالغات.',
  footer_note_en: 'Longevity and projection vary by skin, weather, and use. Nafas keeps claims realistic and focused on a clear wearing experience.',
  icon_url: BRAND_ICON,
  logo_url: BRAND_LOGO,
  whatsapp_url: WHATSAPP_SUPPORT_URL,
};

const SiteSettingsContext = createContext<SiteSettingsValue | null>(null);

export const SiteSettingsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);

  useEffect(() => {
    let active = true;
    publicApi.getSiteSettings()
      .then((response) => {
        if (!active) return;
        setSettings({ ...fallbackSettings, ...(response.data?.data || {}) });
      })
      .catch(() => setSettings(fallbackSettings));

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<SiteSettingsValue>(() => ({
    getSetting: (key, fallback = '') => {
      const value = settings[key];
      if (value === null || value === undefined || value === '') return fallback;
      return String(value);
    },
    settings,
  }), [settings]);

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
};

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    return {
      getSetting: (key: string, fallback = '') => String(fallbackSettings[key] || fallback),
      settings: fallbackSettings,
    };
  }

  return context;
}
