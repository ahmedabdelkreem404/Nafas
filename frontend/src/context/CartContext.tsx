/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { publicApi } from '../api/publicApi';
import type { CartItem, Product, Variant } from '../types/store';
import { extractResponseData, toProduct } from '../utils/products';

type AddToCartResult = {
  product: Product;
  quantity: number;
  variant: Variant;
};

type CartContextValue = {
  addToCart: (product: Product, variant: Variant, quantity?: number) => Promise<AddToCartResult>;
  clearCart: () => Promise<void>;
  closeCart: () => void;
  error: string;
  isOpen: boolean;
  items: CartItem[];
  loading: boolean;
  openCart: () => void;
  reload: () => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  total: number;
  totalCount: number;
  toggleCart: () => void;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
};

type CartApiItem = {
  id?: number;
  quantity?: number;
  variant?: Variant & { product?: unknown };
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'nafas_cart';

function normalizeGuestItems(payload: CartItem[]) {
  return payload.map((item) => ({
    cart_item_id: item.id,
    product: item.product,
    product_variant_id: item.variant?.id,
    quantity: item.quantity,
    variant: item.variant,
  }));
}

function mapCartItems(payload: CartApiItem[]): CartItem[] {
  return payload.map((item, index) => ({
    id: Number(item.id ?? Date.now() + index),
    product: item.variant?.product ? toProduct(item.variant.product) : null,
    quantity: Number(item.quantity ?? 1),
    variant: item.variant as Variant,
  }));
}

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const syncGuestStorage = useCallback((nextItems: CartItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeGuestItems(nextItems)));
  }, []);

  const setNormalizedItems = useCallback((responseData: unknown) => {
    const payload = extractResponseData<{ items?: CartApiItem[] }>(responseData) || (responseData as { items?: CartApiItem[] });
    const nextItems = mapCartItems(payload?.items || []);
    setItems(nextItems);
    syncGuestStorage(nextItems);
  }, [syncGuestStorage]);

  const loadGuestCart = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setItems([]);
        return;
      }

      const parsed = JSON.parse(saved) as Array<{
        cart_item_id?: number;
        quantity?: number;
        product?: unknown;
        variant?: Variant;
      }>;

      const nextItems = parsed.map((item, index) => ({
        id: Number(item.cart_item_id ?? Date.now() + index),
        product: item.product ? toProduct(item.product) : null,
        quantity: Number(item.quantity ?? 1),
        variant: item.variant as Variant,
      }));

      setItems(nextItems);
    } catch {
      setItems([]);
    }
  }, []);

  const loadCart = useCallback(async () => {
    setLoading(true);

    try {
      const response = await publicApi.getCart();
      setNormalizedItems(response.data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'تعذر تحميل السلة');
      loadGuestCart();
    } finally {
      setLoading(false);
    }
  }, [loadGuestCart, setNormalizedItems]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (sessionStorage.getItem('nafas:open-cart') !== '1') {
      return;
    }

    setIsOpen(true);
    sessionStorage.removeItem('nafas:open-cart');
  }, []);

  const addToCart = useCallback(async (product: Product, variant: Variant, quantity = 1) => {
    const response = await publicApi.addCartItem({ quantity, variant_id: variant.id });
    setNormalizedItems(response.data);
    setError('');
    setIsOpen(true);
    return { product, quantity, variant };
  }, [setNormalizedItems]);

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    await publicApi.updateCartItem(cartItemId, quantity);
    await loadCart();
  }, [loadCart]);

  const removeFromCart = useCallback(async (cartItemId: number) => {
    await publicApi.removeCartItem(cartItemId);
    await loadCart();
  }, [loadCart]);

  const clearCart = useCallback(async () => {
    try {
      await publicApi.clearCart();
    } finally {
      setItems([]);
      syncGuestStorage([]);
    }
  }, [syncGuestStorage]);

  const value = useMemo<CartContextValue>(() => ({
    addToCart,
    clearCart,
    closeCart: () => setIsOpen(false),
    error,
    isOpen,
    items,
    loading,
    openCart: () => setIsOpen(true),
    reload: loadCart,
    removeFromCart,
    total: items.reduce((sum, item) => sum + ((item.variant?.retail_price || 0) * item.quantity), 0),
    totalCount: items.reduce((sum, item) => sum + item.quantity, 0),
    toggleCart: () => setIsOpen((current) => !current),
    updateQuantity,
  }), [addToCart, clearCart, error, isOpen, items, loadCart, loading, removeFromCart, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }

  return context;
}
