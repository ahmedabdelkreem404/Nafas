import { describe, expect, it } from 'vitest';
import { buildWhatsappUrl } from './whatsapp';

describe('buildWhatsappUrl', () => {
  it('adds text with the correct query separator', () => {
    expect(buildWhatsappUrl('مرحبا', 'https://wa.me/1')).toBe('https://wa.me/1?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7');
    expect(buildWhatsappUrl('hello', 'https://wa.me/1?app_absent=0')).toBe('https://wa.me/1?app_absent=0&text=hello');
  });

  it('replaces an existing text parameter instead of duplicating it', () => {
    expect(buildWhatsappUrl('new text', 'https://wa.me/1?text=old')).toBe('https://wa.me/1?text=new%20text');
  });
});
