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
});
