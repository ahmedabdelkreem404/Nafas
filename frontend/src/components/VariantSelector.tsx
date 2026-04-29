import React from 'react';
import type { Locale } from '../context/LocaleContext';
import { formatCurrency } from '../utils/format';

function getVariantTypeLabel(variant: any, locale: Locale) {
  const label = String(variant?.label || '').toLowerCase();

  if (label.includes('tester') || label.includes('sample') || variant?.size_ml === 3) {
    return locale === 'ar' ? 'تجربة' : 'Tester';
  }

  return locale === 'ar' ? 'الحجم الكامل' : 'Full size';
}

type VariantSelectorProps = {
  locale: Locale;
  onChange: (variantId: number | string) => void;
  selectedId?: number | string | null;
  variants: any[];
};

const VariantSelector: React.FC<VariantSelectorProps> = ({
  locale,
  onChange,
  selectedId,
  variants,
}) => (
  <div className="variant-selector">
    {variants.map((variant, index) => {
      const id = variant.id ?? index;
      const isSelected = selectedId === id;
      const isDisabled = variant.in_stock === false;

      return (
        <button
          key={String(id)}
          type="button"
          className={`variant-selector__option ${isSelected ? 'is-selected' : ''} ${isDisabled ? 'is-disabled' : ''}`}
          disabled={isDisabled}
          onClick={() => onChange(id)}
        >
          <div className="variant-selector__topline">
            <small>{getVariantTypeLabel(variant, locale)}</small>
            <span className={`stock-pill stock-pill--inline ${isDisabled ? 'is-out' : 'is-in'}`}>
              {isDisabled ? (locale === 'ar' ? 'غير متوفر' : 'Out of stock') : (locale === 'ar' ? 'متوفر' : 'In stock')}
            </span>
          </div>

          <div className="variant-selector__meta">
            <strong>{variant.label || (variant.size_ml ? `${variant.size_ml}ml` : locale === 'ar' ? 'الحجم' : 'Size')}</strong>
            <span>{formatCurrency(variant.retail_price, locale)}</span>
          </div>
        </button>
      );
    })}
  </div>
);

export default VariantSelector;
