import { publicApi } from '../api/publicApi';
import type { Product } from '../types/store';
import { extractResponseData, toProduct, toProducts } from '../utils/products';

type CacheEntry = {
  data: Product[];
  fetchedAt: number;
};

const TTL = 5 * 60 * 1000;

let cache: CacheEntry | null = null;
let inflight: Promise<Product[]> | null = null;

export async function getCachedProducts(): Promise<Product[]> {
  const now = Date.now();

  if (cache && now - cache.fetchedAt < TTL) {
    return cache.data;
  }

  if (inflight) {
    return inflight;
  }

  inflight = publicApi.getProducts()
    .then((response) => {
      const data = extractResponseData<unknown[]>(response.data);
      const products = toProducts(data || []);
      cache = { data: products, fetchedAt: Date.now() };
      inflight = null;
      return products;
    })
    .catch((error) => {
      inflight = null;
      throw error;
    });

  return inflight;
}

export async function getCachedProduct(slug: string): Promise<Product> {
  const now = Date.now();
  const list = cache && now - cache.fetchedAt < TTL ? cache.data : null;
  const found = list?.find((product) => product.slug === slug);

  if (found) {
    return found;
  }

  const response = await publicApi.getProduct(slug);
  const product = extractResponseData<unknown>(response.data);
  return toProduct(product);
}

export function invalidateCache() {
  cache = null;
  inflight = null;
}
