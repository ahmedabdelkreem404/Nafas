import { describe, expect, it } from 'vitest';
import { buildProductWhatsAppMessage, buildProductWhatsAppUrl, buildWhatsAppUrl } from './whatsapp';
import type { Product, Variant } from '../types/store';

const product = {
  id: 1,
  name_ar: 'شرارة',
  name_en: 'Sharara',
  personality_ar: '',
  personality_en: '',
  slug: 'sharara',
  story: '',
  story_en: '',
  notes_ar: [],
  notes_en: [],
  variants: [],
} as Product;

const variant = {
  id: 11,
  in_stock: true,
  label: '50ml',
  retail_price: 319,
  size_ml: 50,
  type: 'retail',
} as Variant;

describe('WhatsApp helpers', () => {
  it('adds encoded text to a base WhatsApp URL', () => {
    expect(buildWhatsAppUrl('أهلًا شرارة', 'https://wa.me/201000000000')).toBe(
      'https://wa.me/201000000000?text=%D8%A3%D9%87%D9%84%D9%8B%D8%A7%20%D8%B4%D8%B1%D8%A7%D8%B1%D8%A9',
    );
  });

  it('builds product-aware Arabic messages', () => {
    const message = buildProductWhatsAppMessage({
      locale: 'ar',
      path: '/products/sharara',
      product,
      quantity: 2,
      variant,
    });

    expect(message).toContain('شرارة');
    expect(message).toContain('50ml');
    expect(message).toMatch(/319|٣١٩/);
    expect(message).toContain('الكمية: 2');
    expect(message).toContain('/products/sharara');
  });

  it('returns an encoded product-aware URL', () => {
    const url = buildProductWhatsAppUrl({
      locale: 'ar',
      path: '/products/sharara',
      product,
      quantity: 1,
      variant,
    }, 'https://wa.me/201000000000?source=product');

    expect(url).toContain('https://wa.me/201000000000?source=product&text=');
    expect(decodeURIComponent(url)).toContain('شرارة');
  });
});
