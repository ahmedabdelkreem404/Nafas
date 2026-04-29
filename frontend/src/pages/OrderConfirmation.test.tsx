import React from 'react';
import { describe, expect, it, vi } from 'vitest';
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
});
