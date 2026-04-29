import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LocaleProvider } from '../context/LocaleContext';
import ProductDetail from './ProductDetail';

vi.mock('../api/publicApi', () => ({
  publicApi: {
    getProduct: vi.fn().mockResolvedValue({
      data: {
        data: {
          name_ar: 'شرارة',
          name_en: 'Sharara',
          slug: 'sharara',
          story: 'story',
          story_en: 'story',
          personality_ar: 'tagline',
          personality_en: 'tagline',
          notes_ar: ['A', 'B', 'C', 'D', 'E'],
          notes_en: ['A', 'B', 'C', 'D', 'E'],
          variants: [
            { id: 1, in_stock: true, label: '25ml', retail_price: 100, size_ml: 25, type: 'retail' },
            { id: 2, in_stock: true, label: '50ml', retail_price: 150, size_ml: 50, type: 'retail' },
          ],
        },
      },
    }),
    getProducts: vi.fn().mockResolvedValue({ data: { data: [] } }),
  },
}));

vi.mock('../hooks/useCart', () => ({
  useCart: () => ({ addToCart: vi.fn(), openCart: vi.fn() }),
}));

vi.mock('../hooks/useEngagement', () => ({
  useEngagement: () => ({
    addReply: vi.fn(),
    addReview: vi.fn(),
    getProductMetrics: vi.fn(() => ({ favorites: 0, isFavorited: false, ratingAverage: 0, reviewCount: 0, views: 0 })),
    getReviews: vi.fn(() => []),
    getTopProductSlug: vi.fn(() => null),
    isFavorited: vi.fn(() => false),
    registerView: vi.fn(),
    toggleFavorite: vi.fn(),
    voteReply: vi.fn(),
    voteReview: vi.fn(),
  }),
}));

describe('ProductDetail', () => {
  it('updates selected variant pricing', async () => {
    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={['/products/sharara']}>
          <Routes>
            <Route path="/products/:slug" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </LocaleProvider>,
    );

    await waitFor(() => expect(screen.getByRole('heading', { name: 'شرارة' })).toBeInTheDocument());
    expect(screen.getAllByText(/١٠٠/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('50ml'));

    expect(screen.getAllByText(/١٥٠/).length).toBeGreaterThan(0);
  });
});
