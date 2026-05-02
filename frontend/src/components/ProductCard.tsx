import { Check, Heart, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { useEngagement } from '../hooks/useEngagement';
import type { Product } from '../types/store';
import { formatCurrency, formatNumber, formatViewCountLabel } from '../utils/format';
import { getPrimaryVariant } from '../utils/products';
import ProductMedia from './ProductMedia';

export default function ProductCard({ product, crowned = false }: { product: Product; crowned?: boolean }) {
  const { locale } = useLocale();
  const { addToCart, openCart } = useCart();
  const { getProductMetrics, toggleFavorite } = useEngagement();
  const [added, setAdded] = useState(false);
  const metrics = getProductMetrics(product);
  const variant = useMemo(() => getPrimaryVariant(product), [product]);
  const outOfStock = !variant?.in_stock;
  const isDiscovery = product.slug === 'discovery-set';
  const isGiftBox = product.slug.includes('gift-box');
  const badgeLabel = isDiscovery
    ? (locale === 'ar' ? 'مجموعة التجربة' : 'Discovery Set')
    : isGiftBox
      ? (locale === 'ar' ? 'بوكس هدية' : 'Gift Box')
      : (locale === 'ar' ? product.gender_ar || product.gender_en || '' : product.gender_en || product.gender_ar || '');

  const handleAdd = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!variant || outOfStock) return;
    await addToCart(product, variant, 1);
    openCart();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className={`product-card ncard ${outOfStock ? 'is-out' : ''}`}
      data-accent={product.accent || 'gold'}
      aria-label={locale === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar}
    >
      <span className="product-card__crown">{crowned ? '✦ ' : ''}{badgeLabel}</span>
      <button
        type="button"
        className={`product-card__fav ${metrics.isFavorited ? 'is-active' : ''}`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleFavorite(product);
        }}
        aria-label={locale === 'ar' ? 'أضف للمفضلة' : 'Add to favorites'}
      >
        <Heart size={16} />
        <span>{formatNumber(metrics.favorites, locale)}</span>
      </button>

      <div className="product-card__media ncard__media">
        <ProductMedia product={product} alt={locale === 'ar' ? product.name_ar : product.name_en} className="product-card__image ncard__img" />
        <span className="product-card__views">{formatViewCountLabel(metrics.views, locale)}</span>
        {outOfStock ? <span className="product-card__out">{locale === 'ar' ? 'نفد المخزون' : 'Out of stock'}</span> : null}
      </div>

      <div className="product-card__body ncard__body">
        <h3 className="ncard__name">{locale === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar}</h3>
        <p className="ncard__desc">{locale === 'ar' ? product.personality_ar : product.personality_en}</p>
        <div className="product-card__foot ncard__footer">
          <strong>{variant ? formatCurrency(variant.retail_price, locale) : '-'}</strong>
          <button type="button" className={`product-card__add ${added ? 'is-added' : ''}`} onClick={handleAdd} disabled={outOfStock}>
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
            <span>{added ? (locale === 'ar' ? 'تمت' : 'Added') : (locale === 'ar' ? 'أضف' : 'Add')}</span>
            <i />
            <i />
            <i />
          </button>
        </div>
      </div>
    </Link>
  );
}
