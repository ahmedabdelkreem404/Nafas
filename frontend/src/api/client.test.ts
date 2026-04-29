import { describe, expect, it, vi } from 'vitest';

vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com');

describe('api client env', async () => {
  it('uses VITE_API_BASE_URL', async () => {
    const module = await import('./client');
    expect(module.client.defaults.baseURL).toBe('https://api.example.com');
  });
});
