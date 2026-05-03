import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home from './Home';

const mocks = vi.hoisted(() => ({
  getHomepage: vi.fn(),
  appleHome: vi.fn(),
}));

vi.mock('../api/publicApi', () => ({
  publicApi: {
    getHomepage: mocks.getHomepage,
  },
}));

vi.mock('../features/apple-home/AppleNafasHome', () => ({
  default: (props: { cmsData?: unknown }) => {
    mocks.appleHome(props);
    const text = props.cmsData ? 'api-homepage' : 'fallback-homepage';
    return <div>{text}</div>;
  },
}));

vi.mock('../styles/apple-nafas-home.css', () => ({}));

describe('Home', () => {
  it('renders the static Apple homepage fallback when the homepage API fails', async () => {
    mocks.getHomepage.mockRejectedValueOnce(new Error('offline'));

    render(<Home />);

    expect(await screen.findByText('fallback-homepage')).toBeInTheDocument();
  });

  it('passes API-driven homepage data into AppleNafasHome', async () => {
    mocks.getHomepage.mockResolvedValueOnce({
      data: {
        sections: [{ section_key: 'hero', title_ar: 'عنوان من لوحة التحكم' }],
      },
    });

    render(<Home />);

    await waitFor(() => expect(screen.getByText('api-homepage')).toBeInTheDocument());
    expect(mocks.appleHome).toHaveBeenLastCalledWith(expect.objectContaining({
      cmsData: expect.objectContaining({
        sections: [expect.objectContaining({ title_ar: 'عنوان من لوحة التحكم' })],
      }),
    }));
  });
});
