import { describe, expect, it } from 'vitest';
import { buildCheckoutPayload } from './checkout';

describe('buildCheckoutPayload', () => {
  it('builds backend-safe payload from cart items', () => {
    const payload = buildCheckoutPayload({ customer_name: 'Ahmed', payment_method: 'vodafone_cash', payment_reference: 'VC-1' }, [
      { variant: { id: 7 }, quantity: 2 },
    ]);

    expect(payload).toEqual({
      customer_name: 'Ahmed',
      payment_method: 'vodafone_cash',
      payment_reference: 'VC-1',
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
});
