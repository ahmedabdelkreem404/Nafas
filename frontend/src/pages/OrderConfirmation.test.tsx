import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LocaleProvider } from '../context/LocaleContext';
import OrderConfirmation from './OrderConfirmation';

vi.mock('../api/publicApi', () => ({
  publicApi: {
    getOrderConfirmation: vi.fn().mockResolvedValue({
      data: {
        order_number: 'ORD-1',
        items: [],
        status: 'pending',
        total: 100,
      },
    }),
  },
}));

describe('OrderConfirmation', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('requests safe order lookup', async () => {
    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={['/order-confirmation/ORD-1']}>
          <Routes>
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          </Routes>
        </MemoryRouter>
      </LocaleProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText('رقم الهاتف'), { target: { value: '0100' } });
    fireEvent.click(screen.getByText('عرض الطلب'));

    await waitFor(() => expect(screen.getByText(/ORD-1/)).toBeInTheDocument());
  });

  it('shows manual payment details from cached checkout order', async () => {
    sessionStorage.setItem('order_ORD-MANUAL', JSON.stringify({
      order_number: 'ORD-MANUAL',
      items: [],
      status: 'pending',
      total_amount: 149,
      payment: {
        method: 'vodafone_cash',
        status: 'pending_review',
        reference: 'VC-123',
      },
    }));

    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={['/order-confirmation/ORD-MANUAL']}>
          <Routes>
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          </Routes>
        </MemoryRouter>
      </LocaleProvider>,
    );

    await waitFor(() => expect(screen.getByText('ORD-MANUAL')).toBeInTheDocument());
    expect(screen.getByText('فودافون كاش')).toBeInTheDocument();
    expect(screen.getByText('VC-123')).toBeInTheDocument();
    expect(screen.getByText('تحت مراجعة الدفع')).toBeInTheDocument();
    expect(screen.getByText('تم استلام طلبك، وسيتم مراجعة التحويل يدويًا ثم تأكيد الطلب.')).toBeInTheDocument();
  });
});
