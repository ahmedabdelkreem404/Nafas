import client from './client';

export const publicApi = {
  getProducts: (params?: Record<string, string>) => client.get('/products', { params }),
  getProduct: (slug: string) => client.get(`/products/${slug}`),
  getProductReviews: (slug: string, params?: Record<string, string | number>) => client.get(`/products/${slug}/reviews`, { params }),
  createProductReview: (slug: string, payload: { author_name: string; body: string; rating: number }) => client.post(`/products/${slug}/reviews`, payload),
  getReviewReplies: (reviewId: number | string) => client.get(`/reviews/${reviewId}/replies`),
  createReviewReply: (reviewId: number | string, payload: { author_name: string; body: string }) => client.post(`/reviews/${reviewId}/replies`, payload),
  voteReview: (reviewId: number | string, type: 'like' | 'dislike') => client.post(`/reviews/${reviewId}/vote`, { type }),
  getCategories: () => client.get('/categories'),
  getHomeContent: () => client.get('/home'),
  getPage: (slug: string) => client.get(`/pages/${slug}`),
  validateCart: (items: Array<{ variant_id: number; quantity: number }>) => client.post('/cart/validate', { items }),
  checkout: (payload: unknown) => client.post('/checkout', payload),
  getCart: () => client.get('/cart'),
  addCartItem: (payload: { variant_id: number; quantity: number }) => client.post('/cart/items', payload),
  updateCartItem: (cartItemId: number, quantity: number) => client.patch(`/cart/items/${cartItemId}`, { quantity }),
  removeCartItem: (cartItemId: number) => client.delete(`/cart/items/${cartItemId}`),
  clearCart: () => client.delete('/cart/clear'),
  mergeCart: (items: Array<{ variant_id: number; quantity: number }>) => client.post('/cart/merge', { items }),
  getOrderConfirmation: (
    orderNumber: string,
    params?: { phone?: string; email?: string },
    options?: { skipAuth?: boolean },
  ) =>
    client.get(`/orders/confirmation/${orderNumber}`, {
      params,
      headers: options?.skipAuth ? { 'X-Skip-Auth': '1' } : undefined,
    }),
  contact: (payload: unknown) => client.post('/contact', payload),
  wholesale: (payload: unknown) => client.post('/wholesale-inquiry', payload),
};
