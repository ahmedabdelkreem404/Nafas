import type { Product, Variant } from '../types/store';
import { WHATSAPP_SUPPORT_URL } from './brand';
import { formatCurrency } from './format';

export function buildWhatsAppUrl(message: string, baseUrl = WHATSAPP_SUPPORT_URL) {
  const trimmedBaseUrl = String(baseUrl || '').trim();

  if (!trimmedBaseUrl) {
    return '';
  }

  const encodedMessage = encodeURIComponent(message);

  if (/[?&]text=/.test(trimmedBaseUrl)) {
    return trimmedBaseUrl.replace(/([?&]text=)[^&]*/, `$1${encodedMessage}`);
  }

  const separator = trimmedBaseUrl.includes('?') ? '&' : '?';
  return `${trimmedBaseUrl}${separator}text=${encodedMessage}`;
}

type ProductWhatsAppMessageInput = {
  locale: 'ar' | 'en';
  product: Product;
  quantity: number;
  variant: Variant;
  path?: string;
};

export function buildProductWhatsAppMessage({
  locale,
  path,
  product,
  quantity,
  variant,
}: ProductWhatsAppMessageInput) {
  const productName = locale === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar;
  const variantLabel = variant.label || (variant.size_ml ? `${variant.size_ml}ml` : '');
  const price = formatCurrency(variant.retail_price, locale);
  const quantityText = locale === 'ar' ? `الكمية: ${quantity}` : `Quantity: ${quantity}`;
  const pathText = path ? (locale === 'ar' ? ` الرابط: ${path}` : ` Link: ${path}`) : '';

  if (locale === 'ar') {
    return `أهلًا، عايز أسأل عن عطر ${productName} - مقاس ${variantLabel} بسعر ${price}. ${quantityText}.${pathText}`;
  }

  return `Hello, I want to ask about ${productName} - ${variantLabel} for ${price}. ${quantityText}.${pathText}`;
}

export function buildProductWhatsAppUrl(input: ProductWhatsAppMessageInput, baseUrl = WHATSAPP_SUPPORT_URL) {
  return buildWhatsAppUrl(buildProductWhatsAppMessage(input), baseUrl);
}
