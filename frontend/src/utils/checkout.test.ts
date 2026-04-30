import { describe, expect, it } from 'vitest';
import { buildCheckoutPayload } from './checkout';

describe('buildCheckoutPayload', () => {
  it('builds backend-safe payload from cart items', () => {
    const payload = buildCheckoutPayload({ customer_name: 'Ahmed' }, [
      { variant: { id: 7 }, quantity: 2 },
    ]);

    expect(payload).toEqual({
      customer_name: 'Ahmed',
      items: [{ variant_id: 7, quantity: 2 }],
    });
  });

  it('maps visible payment labels to backend payment methods', () => {
    expect(buildCheckoutPayload({ payment_method: 'cod' }, [])).toMatchObject({
      payment_method: 'cash_on_delivery',
    });
    expect(buildCheckoutPayload({ payment_method: 'vodafone_cash', payment_reference: 'VF-1' }, [])).toMatchObject({
      payment_method: 'vodafone_cash',
      payment_reference: 'VF-1',
    });
  });
});
