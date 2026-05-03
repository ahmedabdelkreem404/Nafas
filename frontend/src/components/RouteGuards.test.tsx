import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './RouteGuards';

vi.mock('../api/authApi', () => ({
  authApi: {
    me: vi.fn(() => Promise.resolve({ data: { role: 'admin' } })),
  },
}));

describe('ProtectedRoute', () => {
  beforeEach(() => localStorage.clear());

  it('redirects when no token exists', () => {
    render(<MemoryRouter><ProtectedRoute><div>Secret</div></ProtectedRoute></MemoryRouter>);
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('renders admin content after verifying the admin token', async () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
    render(<MemoryRouter><ProtectedRoute isAdmin><div>Admin Secret</div></ProtectedRoute></MemoryRouter>);
    expect(await screen.findByText('Admin Secret')).toBeInTheDocument();
  });
});
