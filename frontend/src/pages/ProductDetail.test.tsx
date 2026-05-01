import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { publicApi } from '../api/publicApi';
import { invalidateCache } from '../cache/productCache';
import { LocaleProvider } from '../context/LocaleContext';
import ProductDetail from './ProductDetail';

const { productPayload } = vi.hoisted(() => ({
  productPayload: {
    name_ar: 'Sharara AR',
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
}));

vi.mock('../api/publicApi', () => ({
  publicApi: {
    getProduct: vi.fn().mockResolvedValue({ data: { data: productPayload } }),
    getProducts: vi.fn().mockResolvedValue({ data: { data: [productPayload] } }),
    getProductReviews: vi.fn().mockResolvedValue({ data: { data: [] } }),
    getReviewReplies: vi.fn().mockResolvedValue({ data: { data: [] } }),
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

function renderProductDetail() {
  render(
    <LocaleProvider>
      <MemoryRouter initialEntries={['/products/sharara']}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    </LocaleProvider>,
  );
}

describe('ProductDetail', () => {
  it('updates selected variant state', async () => {
    invalidateCache();
    renderProductDetail();

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Sharara AR' })).toBeInTheDocument());

    const nextVariant = screen.getByRole('button', { name: /50ml/ });
    fireEvent.click(nextVariant);

    await waitFor(() => expect(nextVariant).toHaveClass('is-active'));
  });

  it('renders the local Nafas product fallback when the API is temporarily unavailable', async () => {
    invalidateCache();
    vi.mocked(publicApi.getProduct).mockRejectedValueOnce(new Error('offline'));
    vi.mocked(publicApi.getProducts).mockRejectedValueOnce(new Error('offline'));

    renderProductDetail();

    await waitFor(() => expect(screen.getByText('Sharara')).toBeInTheDocument());
    expect(screen.queryByText('Unable to load this fragrance.')).not.toBeInTheDocument();
    expect(screen.getByText('30ml Retail')).toBeInTheDocument();
  });
});
