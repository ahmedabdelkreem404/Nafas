import { describe, expect, it } from 'vitest';
import { buildCheckoutPayload, validatePaymentProof } from './checkout';

describe('buildCheckoutPayload', () => {
  it('builds backend-safe payload from cart items', () => {
    const payload = buildCheckoutPayload({ customer_name: 'Ahmed', payment_method: 'vodafone_cash', payment_reference: 'VC-1', coupon_code: 'NAFAS10' }, [
      { variant: { id: 7 }, quantity: 2 },
    ]);

    expect(payload).toEqual({
      customer_name: 'Ahmed',
      payment_method: 'vodafone_cash',
      payment_reference: 'VC-1',
      coupon_code: 'NAFAS10',
      items: [{ variant_id: 7, quantity: 2 }],
    });
  });

  it('allows cash on delivery without a payment reference', () => {
    const payload = buildCheckoutPayload({ customer_name: 'Ahmed', payment_method: 'cash_on_delivery' }, [
      { variant: { id: 8 }, quantity: 1 },
    ]);

    expect(payload).toMatchObject({
      payment_method: 'cash_on_delivery',
      items: [{ variant_id: 8, quantity: 1 }],
    });
    expect(payload).not.toHaveProperty('payment_reference');
  });

  it('builds multipart payload when a payment proof is attached', () => {
    const proof = new File(['proof'], 'proof.webp', { type: 'image/webp' });
    const payload = buildCheckoutPayload({
      customer_name: 'Ahmed',
      payment_method: 'instapay',
      payment_proof: proof,
      payment_reference: 'IP-1',
      coupon_code: 'GIFT',
    }, [
      { variant: { id: 9 }, quantity: 1 },
    ]);

    expect(payload).toBeInstanceOf(FormData);
    expect((payload as FormData).get('payment_method')).toBe('instapay');
    expect((payload as FormData).get('coupon_code')).toBe('GIFT');
    expect((payload as FormData).get('items[0][variant_id]')).toBe('9');
    expect((payload as FormData).get('payment_proof')).toBe(proof);
  });

  it('validates manual payment proof file type and size', () => {
    expect(validatePaymentProof(new File(['ok'], 'proof.png', { type: 'image/png' }))).toBe('');
    expect(validatePaymentProof(new File(['bad'], 'proof.txt', { type: 'text/plain' }))).toContain('JPG');

    const oversized = new File([new Uint8Array((3 * 1024 * 1024) + 1)], 'proof.jpg', { type: 'image/jpeg' });
    expect(validatePaymentProof(oversized)).toContain('3MB');
  });
});
