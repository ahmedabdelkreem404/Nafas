import React from 'react';
import { Badge, Card, cx } from '../ui';

export const ProductVisual: React.FC<{ nameAr?: string; nameEn?: string; accent?: 'gold' | 'rose' | 'copper'; className?: string }> = ({ nameAr, nameEn, accent = 'gold', className }) => (
  <div className={cx('product-card__visual', className)}>
    <div className="mist-overlay" />
    <span className="product-card__monogram">{nameEn?.[0] || 'N'}</span>
    <div className="product-card__cap" style={{ background: accent === 'rose' ? 'linear-gradient(180deg, #f2d6df, #c88f9f)' : accent === 'copper' ? 'linear-gradient(180deg, #deb08c, #b16a39)' : undefined }} />
    <div className="product-card__bottle" />
    <div style={{ position: 'absolute', insetInline: '1rem', insetBlockEnd: '1rem', zIndex: 2 }}>
      <Badge tone={accent === 'rose' ? 'rose' : 'gold'}>{nameAr}</Badge>
    </div>
  </div>
);

export const ProductCard: React.FC<{
  product: any;
  action?: React.ReactNode;
}> = ({ product, action }) => {
  const firstVariant = product.variants?.[0];
  const accent = product.gender?.toLowerCase().includes('women') ? 'rose' : product.personality?.toLowerCase().includes('coffee') ? 'copper' : 'gold';
  return (
    <Card className="product-card" tone="strong">
      <ProductVisual nameAr={product.name_ar} nameEn={product.name_en} accent={accent as any} />
      <div className="stack" style={{ gap: '0.75rem' }}>
        <div className="product-card__meta">
          <div className="stack" style={{ gap: '0.2rem' }}>
            <strong style={{ fontSize: '1.2rem' }}>{product.name_ar}</strong>
            <span className="copy-muted" style={{ fontSize: '0.88rem' }}>{product.name_en}</span>
          </div>
          {firstVariant ? <Badge tone={firstVariant.in_stock ? 'success' : 'danger'}>{firstVariant.in_stock ? 'متوفر' : 'نفد'}</Badge> : null}
        </div>
        <p className="copy-muted" style={{ minHeight: '3.2rem', margin: 0 }}>{product.personality || product.story}</p>
        <div className="product-card__meta">
          <div className="stack" style={{ gap: '0.15rem' }}>
            <span className="copy-muted" style={{ fontSize: '0.78rem' }}>يبدأ من</span>
            <strong>{firstVariant ? new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(firstVariant.retail_price) : '—'}</strong>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'end', gap: '0.45rem' }}>
            {(product.variants || []).slice(0, 3).map((variant: any) => <Badge tone="muted" key={variant.id}>{variant.label || `${variant.size_ml} مل`}</Badge>)}
          </div>
        </div>
        {action}
      </div>
    </Card>
  );
};

export default ProductCard;
