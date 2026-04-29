import { enrichProduct, getLocalProductMedia } from '../content/perfumeCatalog';
import type { MediaItem, Product } from '../types/store';

export function toProduct(raw: unknown): Product {
  return enrichProduct(raw) as Product;
}

export function toProducts(raw: unknown): Product[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map(toProduct);
}

export function extractResponseData<T>(payload: unknown): T | null {
  if (payload && typeof payload === 'object') {
    const root = payload as Record<string, unknown>;
    if ('data' in root) {
      const nested = root.data;
      if (nested && typeof nested === 'object' && 'data' in (nested as Record<string, unknown>)) {
        return (nested as Record<string, unknown>).data as T;
      }

      return nested as T;
    }
  }

  return null;
}

export function getProductMediaSources(product: Product): string[] {
  const apiMedia = (product.media || [])
    .map((item: MediaItem) => item.url || item.src || '')
    .filter(Boolean);

  return apiMedia.length ? apiMedia : (product.local_media || getLocalProductMedia(product) || []);
}

export function getPrimaryVariant(product: Product | null | undefined) {
  if (!product || !Array.isArray(product.variants) || !product.variants.length) {
    return null;
  }

  return product.variants.find((variant) => variant.in_stock) || product.variants[0] || null;
}
