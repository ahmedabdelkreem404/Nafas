import React, { useEffect, useState } from 'react';
import type { Locale } from '../context/LocaleContext';
import { formatCurrency } from '../utils/format';
import ProductMedia from './ProductMedia';
import QuantitySelector from './QuantitySelector';

type CartItemProps = {
  compact?: boolean;
  item: any;
  locale: Locale;
  onQuantityChange?: (nextQuantity: number) => void;
  onRemove?: () => void;
  removeLabel: string;
  stockLabel: {
    in: string;
    out: string;
  };
};

const CartItem: React.FC<CartItemProps> = ({
  compact = false,
  item,
  locale,
  onQuantityChange,
  onRemove,
  removeLabel,
  stockLabel,
}) => {
  const [confirming, setConfirming] = useState(false);
  const productName = locale === 'ar' ? item.product?.name_ar || item.product?.name_en : item.product?.name_en || item.product?.name_ar;
  const variantLabel = item.variant?.label || (item.variant?.size_ml ? `${item.variant.size_ml}${locale === 'ar' ? ' مل' : 'ml'}` : '—');

  useEffect(() => {
    if (!confirming) {
      return;
    }

    const timer = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  return (
    <article className={`cart-item-card ${compact ? 'is-compact' : ''}`}>
      <div className="cart-item-card__media">
        <ProductMedia product={item.product} alt={productName} className="cart-item-card__image" />
      </div>

      <div className="cart-item-card__content">
        <div className="cart-item-card__header">
          <div className="cart-item-card__title-group">
            <strong>{productName}</strong>
            <span>{variantLabel}</span>
          </div>
          <span className={`stock-pill ${item.variant?.in_stock ? 'is-in' : 'is-out'}`}>
            {item.variant?.in_stock ? stockLabel.in : stockLabel.out}
          </span>
        </div>

        <div className="cart-item-card__footer">
          {onQuantityChange ? (
            <QuantitySelector
              decrementLabel={locale === 'ar' ? 'تقليل الكمية' : 'Decrease quantity'}
              incrementLabel={locale === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
              onChange={onQuantityChange}
              value={item.quantity}
            />
          ) : (
            <span className="cart-item-card__quantity">{item.quantity} ×</span>
          )}

          <strong className="cart-item-card__price">{formatCurrency((item.variant?.retail_price || 0) * item.quantity, locale)}</strong>
        </div>

        {onRemove ? (
          <>
            <button type="button" className="cart-item-card__remove" onClick={() => setConfirming(true)}>
              {removeLabel}
            </button>
            <div className={`inline-confirm ${confirming ? 'is-open' : ''}`}>
              <span>{locale === 'ar' ? 'إزالة هذا المنتج؟' : 'Remove this item?'}</span>
              <button type="button" className="text-button" onClick={onRemove}>{locale === 'ar' ? 'نعم' : 'Yes'}</button>
              <button type="button" className="text-button" onClick={() => setConfirming(false)}>{locale === 'ar' ? 'لا' : 'No'}</button>
            </div>
          </>
        ) : null}
      </div>
    </article>
  );
};

export default CartItem;
