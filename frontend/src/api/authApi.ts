import client from './client';

export const authApi = {
  login: (payload: { email: string; password: string }) => client.post('/auth/login', payload),
  register: (payload: { name: string; email: string; password: string }) => client.post('/auth/register', payload),
  googleAuth: (idToken: string) => client.post('/auth/google', { id_token: idToken }),
  logout: () => client.post('/auth/logout'),
  me: () => client.get('/me'),
  myOrders: () => client.get('/me/orders'),
  myOrder: (id: number | string) => client.get(`/me/orders/${id}`),
  orderByNumber: (orderNumber: string, params?: { phone?: string; email?: string }) =>
    client.get(`/orders/confirmation/${orderNumber}`, { params }),
};
