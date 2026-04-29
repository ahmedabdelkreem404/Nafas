import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LocaleProvider } from '../context/LocaleContext';
import ContentPage from './ContentPage';

vi.mock('../api/publicApi', () => ({
  publicApi: {
    getPage: vi.fn().mockRejectedValue(new Error('offline')),
  },
}));

describe('ContentPage', () => {
  it('renders local Arabic fallback content for faq', async () => {
    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={['/faq']}>
          <ContentPage />
        </MemoryRouter>
      </LocaleProvider>,
    );

    expect(await screen.findByRole('heading', { level: 1, name: 'هل يمكنني اختيار حجم مناسب للتجربة؟' })).toBeInTheDocument();
    expect(screen.getByText(/إجابات واضحة وسريعة/)).toBeInTheDocument();
  });
});
