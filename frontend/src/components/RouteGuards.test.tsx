import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './RouteGuards';

describe('ProtectedRoute', () => {
  beforeEach(() => localStorage.clear());

  it('redirects when no token exists', () => {
    render(<MemoryRouter><ProtectedRoute><div>Secret</div></ProtectedRoute></MemoryRouter>);
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('renders admin content for admin user', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
    render(<MemoryRouter><ProtectedRoute isAdmin><div>Admin Secret</div></ProtectedRoute></MemoryRouter>);
    expect(screen.getByText('Admin Secret')).toBeInTheDocument();
  });
});
