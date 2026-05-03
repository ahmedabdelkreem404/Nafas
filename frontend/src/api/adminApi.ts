import client from './client';

const readCache = new Map<string, { expiresAt: number; promise: Promise<any> }>();

function cachedGet(key: string, url: string, ttlMs = 5000) {
  const now = Date.now();
  const cached = readCache.get(key);
  if (cached && now < cached.expiresAt) {
    return cached.promise;
  }

  const promise = client.get(url);
  readCache.set(key, { expiresAt: now + ttlMs, promise });
  return promise;
}

export const adminApi = {
  getDashboard: () => cachedGet('dashboard', '/admin/dashboard'),
  analytics: {
    sales: () => cachedGet('analytics:sales', '/admin/analytics/sales'),
    products: () => cachedGet('analytics:products', '/admin/analytics/products'),
  },
  products: {
    list: (params?: Record<string, string>) => client.get('/admin/products', { params }),
    get: (id: number | string) => client.get(`/admin/products/${id}`),
    create: (data: unknown) => client.post('/admin/products', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/products/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/products/${id}`),
    variants: (productId: number | string) => client.get(`/admin/products/${productId}/variants`),
    createVariant: (productId: number | string, data: unknown) => client.post(`/admin/products/${productId}/variants`, data),
    updateVariant: (variantId: number | string, data: unknown) => client.patch(`/admin/variants/${variantId}`, data),
    deleteVariant: (variantId: number | string) => client.delete(`/admin/variants/${variantId}`),
    media: (productId: number | string) => client.get(`/admin/products/${productId}/media`),
    createMedia: (productId: number | string, data: unknown) => client.post(`/admin/products/${productId}/media`, data),
    updateMedia: (mediaId: number | string, data: unknown) => client.patch(`/admin/media/${mediaId}`, data),
    deleteMedia: (mediaId: number | string) => client.delete(`/admin/media/${mediaId}`),
  },
  homeSections: {
    list: () => client.get('/admin/home-sections'),
    get: (id: number | string) => client.get(`/admin/home-sections/${id}`),
    create: (data: unknown) => client.post('/admin/home-sections', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/home-sections/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/home-sections/${id}`),
    createItem: (sectionId: number | string, data: unknown) => client.post(`/admin/home-sections/${sectionId}/items`, data),
    updateItem: (id: number | string, data: unknown) => client.patch(`/admin/home-section-items/${id}`, data),
    deleteItem: (id: number | string) => client.delete(`/admin/home-section-items/${id}`),
  },
  catalogs: {
    list: () => client.get('/admin/catalogs'),
    listSafe: () => client.get('/admin/catalogs', { headers: { 'X-Skip-Redirect': '1' } }),
    get: (id: number | string) => client.get(`/admin/catalogs/${id}`),
    create: (data: unknown) => client.post('/admin/catalogs', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/catalogs/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/catalogs/${id}`),
    attachProduct: (catalogId: number | string, data: unknown) => client.post(`/admin/catalogs/${catalogId}/products`, data),
    updateProduct: (pivotId: number | string, data: unknown) => client.patch(`/admin/catalog-products/${pivotId}`, data),
    detachProduct: (pivotId: number | string) => client.delete(`/admin/catalog-products/${pivotId}`),
  },
  orders: {
    list: () => client.get('/admin/orders'),
    get: (id: number | string) => client.get(`/admin/orders/${id}`),
    update: (id: number | string, data: unknown) => client.patch(`/admin/orders/${id}`, data),
    updateStatus: (id: number | string, status: string, notes?: string) => client.patch(`/admin/orders/${id}/status`, { status, notes }),
    reviewPayment: (id: number | string, data: unknown) => client.patch(`/admin/orders/${id}/payment-review`, data),
    downloadPaymentProof: (id: number | string) => client.get(`/admin/orders/${id}/payment-proof`, { responseType: 'blob' }),
  },
  formulas: {
    list: () => client.get('/admin/formulas'),
    get: (id: number | string) => client.get(`/admin/formulas/${id}`),
    create: (data: unknown) => client.post('/admin/formulas', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/formulas/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/formulas/${id}`),
    items: (formulaId: number | string) => client.get(`/admin/formulas/${formulaId}/items`),
    createItem: (formulaId: number | string, data: unknown) => client.post(`/admin/formulas/${formulaId}/items`, data),
    updateItem: (id: number | string, data: unknown) => client.patch(`/admin/items/${id}`, data),
    deleteItem: (id: number | string) => client.delete(`/admin/items/${id}`),
  },
  batches: {
    list: () => client.get('/admin/batches'),
    get: (id: number | string) => client.get(`/admin/batches/${id}`),
    create: (data: unknown) => client.post('/admin/batches', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/batches/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/batches/${id}`),
  },
  inventory: {
    lowStock: () => client.get('/admin/inventory/low-stock'),
    movements: () => client.get('/admin/inventory/movements'),
    adjust: (data: unknown) => client.post('/admin/inventory/adjustments', data),
  },
  customers: {
    list: () => client.get('/admin/customers'),
    get: (id: number | string) => client.get(`/admin/customers/${id}`),
    create: (data: unknown) => client.post('/admin/customers', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/customers/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/customers/${id}`),
  },
  coupons: {
    list: () => client.get('/admin/coupons'),
    create: (data: unknown) => client.post('/admin/coupons', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/coupons/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/coupons/${id}`),
  },
  pages: {
    list: () => client.get('/admin/pages'),
    create: (data: unknown) => client.post('/admin/pages', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/pages/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/pages/${id}`),
    sections: (pageId: number | string) => client.get(`/admin/pages/${pageId}/sections`),
    createSection: (pageId: number | string, data: unknown) => client.post(`/admin/pages/${pageId}/sections`, data),
    updateSection: (id: number | string, data: unknown) => client.patch(`/admin/sections/${id}`, data),
    deleteSection: (id: number | string) => client.delete(`/admin/sections/${id}`),
  },
  settings: {
    list: () => client.get('/admin/settings'),
    create: (data: unknown) => client.post('/admin/settings', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/settings/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/settings/${id}`),
  },
  quality: {
    list: () => client.get('/admin/quality-checks'),
    create: (data: unknown) => client.post('/admin/quality-checks', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/quality-checks/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/quality-checks/${id}`),
  },
  ingredients: {
    list: () => client.get('/admin/ingredients'),
    create: (data: unknown) => client.post('/admin/ingredients', data),
    update: (id: number | string, data: unknown) => client.patch(`/admin/ingredients/${id}`, data),
    delete: (id: number | string) => client.delete(`/admin/ingredients/${id}`),
  },
};
