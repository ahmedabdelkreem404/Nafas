import type { Product } from '../types/store';
import { getProductMediaSources } from '../utils/products';

type ProductMediaProps = {
  alt: string;
  className?: string;
  decoding?: 'async' | 'auto' | 'sync';
  fetchPriority?: 'auto' | 'high' | 'low';
  loading?: 'eager' | 'lazy';
  product?: Product | null;
  src?: string;
};

export default function ProductMedia({
  alt,
  className = '',
  decoding = 'async',
  fetchPriority = 'auto',
  loading = 'lazy',
  product,
  src,
}: ProductMediaProps) {
  const fallback = product ? getProductMediaSources(product)[0] : '';
  return (
    <img
      src={src || fallback || '/assets/stock/optimized/product-perfume-closeup.webp'}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
    />
  );
}
