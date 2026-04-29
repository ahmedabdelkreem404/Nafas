import type { Locale } from '../context/LocaleContext';

const EASTERN_ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export const formatCurrency = (value?: number | string | null, locale: Locale = 'ar') => {
  const numeric = Number(value || 0);

  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    currency: 'EGP',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(numeric);
};

export const formatDate = (value?: string | number | Date | null, locale: Locale = 'ar') => {
  if (!value) {
    return locale === 'ar' ? '—' : '—';
  }

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
};

export const formatStatus = (value?: string | null, locale: Locale = 'ar') => {
  const map = {
    active: { ar: 'نشط', en: 'Active' },
    approved: { ar: 'معتمد', en: 'Approved' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
    confirmed: { ar: 'مؤكد', en: 'Confirmed' },
    delivered: { ar: 'تم التسليم', en: 'Delivered' },
    draft: { ar: 'مسودة', en: 'Draft' },
    inactive: { ar: 'غير نشط', en: 'Inactive' },
    pending: { ar: 'قيد المراجعة', en: 'Pending review' },
    preparing: { ar: 'جارٍ التحضير', en: 'Preparing' },
    preparing_dispatch: { ar: 'قيد التجهيز للشحن', en: 'Preparing for dispatch' },
    refunded: { ar: 'مسترد', en: 'Refunded' },
    rejected: { ar: 'مرفوض', en: 'Rejected' },
    shipped: { ar: 'تم الشحن', en: 'Shipped' },
  } as const;

  const key = value as keyof typeof map;
  return map[key]?.[locale] || value || '—';
};

export const toEasternArabicNumerals = (value: number | string) =>
  String(value).replace(/\d/g, (digit) => EASTERN_ARABIC_DIGITS[Number(digit)]);

export const formatNumber = (value?: number | string | null, locale: Locale = 'ar') => {
  const numeric = Number(value ?? 0);
  if (Number.isNaN(numeric)) {
    return locale === 'ar' ? '٠' : '0';
  }

  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(numeric);
};

export const formatViewCountLabel = (value: number, locale: Locale = 'ar') =>
  locale === 'ar' ? `👁 ${formatNumber(value, locale)} مشاهدة` : `👁 ${formatNumber(value, locale)} views`;

export const formatRelativeTime = (value?: string | number | Date | null, locale: Locale = 'ar') => {
  if (!value) {
    return locale === 'ar' ? 'الآن' : 'Now';
  }

  const date = new Date(value);
  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);
  const formatter = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-EG' : 'en', { numeric: 'auto' });

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, seconds] of units) {
    if (absSeconds >= seconds || unit === 'second') {
      return formatter.format(Math.round(diffInSeconds / seconds), unit);
    }
  }

  return locale === 'ar' ? 'الآن' : 'Now';
};
