import { describe, expect, it } from 'vitest';
import { normalizeOrder } from './orders';

describe('normalizeOrder', () => {
  it('preserves manual payment details on orders', () => {
    const order = normalizeOrder({
      order_number: 'ORD-1',
      total_amount: 149,
      payment: {
        method: 'vodafone_cash',
        status: 'pending_review',
        reference: 'VC-123',
      },
    });

    expect(order.payment).toMatchObject({
      method: 'vodafone_cash',
      status: 'pending_review',
      reference: 'VC-123',
    });
  });
});
