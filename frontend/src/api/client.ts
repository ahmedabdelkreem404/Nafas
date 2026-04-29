import axios from 'axios';
import { getSessionKey } from '../utils/session';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const skipAuth = config.headers['X-Skip-Auth'] === '1';
  if (!skipAuth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  delete config.headers['X-Skip-Auth'];
  config.headers['X-Session-Key'] = getSessionKey();
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const nextPath = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
      if (window.location.pathname !== nextPath) {
        window.location.href = nextPath;
      }
    }

    return Promise.reject({
      status,
      message: error.response?.data?.message || error.response?.data?.error || error.message,
      errors: error.response?.data?.errors || null,
      raw: error,
    });
  }
);

export default client;
