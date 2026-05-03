import client from './client';

function isLocalStorefrontRuntime() {
  return import.meta.env.DEV
    && typeof window !== 'undefined'
    && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
}

function shouldUseRemoteAuth() {
  return Boolean(import.meta.env.VITE_API_BASE_URL) || !isLocalStorefrontRuntime();
}

function localBackendUnavailable() {
  return Promise.reject({
    message: 'Laravel API is not connected. Set VITE_API_BASE_URL=http://127.0.0.1:8001/api or start the backend integration.',
    status: 0,
  });
}

function remoteRequest<T>(request: () => Promise<T>) {
  return shouldUseRemoteAuth() ? request() : localBackendUnavailable();
}

export const authApi = {
  login: (payload: { email: string; password: string }) => remoteRequest(() => client.post('/auth/login', payload)),
  register: (payload: { name: string; email: string; password: string }) => remoteRequest(() => client.post('/auth/register', payload)),
  googleAuth: (idToken: string) => remoteRequest(() => client.post('/auth/google', { id_token: idToken })),
  logout: () => remoteRequest(() => client.post('/auth/logout')),
  me: () => remoteRequest(() => client.get('/me')),
  myOrders: () => remoteRequest(() => client.get('/me/orders')),
  myOrder: (id: number | string) => remoteRequest(() => client.get(`/me/orders/${id}`)),
  orderByNumber: (orderNumber: string, params?: { phone?: string; email?: string }) =>
    client.get(`/orders/confirmation/${orderNumber}`, { params }),
};
