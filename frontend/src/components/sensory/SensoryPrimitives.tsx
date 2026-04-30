import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import ProductMedia from '../ProductMedia';
import type { Product } from '../../types/store';
import { formatCurrency } from '../../utils/format';
import { getPrimaryVariant } from '../../utils/products';

type Locale = 'ar' | 'en';

export function ScentAura({ accent = 'gold', children, className = '' }: { accent?: string; children?: ReactNode; className?: string }) {
  return (
    <div className={`scent-aura scent-aura--${accent} ${className}`} data-accent={accent}>
      <span className="scent-aura__mist" aria-hidden="true" />
      <span className="scent-aura__light" aria-hidden="true" />
      {children}
    </div>
  );
}

export function SensoryMetric({ label, value, tone = 'gold' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="sensory-metric" data-tone={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function ScentStoryBlock({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="scent-story-block">
      <small>{eyebrow}</small>
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  );
}

export function PerfumeMoodCard({ locale, product }: { locale: Locale; product: Product }) {
  const variant = getPrimaryVariant(product);
  const tags = locale === 'ar' ? product.tags_ar || [] : product.tags_en || [];

  return (
    <Link to={`/products/${product.slug}`} className="perfume-mood-card" data-accent={product.accent || 'gold'}>
      <div className="perfume-mood-card__media">
        <ScentAura accent={product.accent || 'gold'}>
          <ProductMedia product={product} alt={locale === 'ar' ? product.name_ar : product.name_en} />
        </ScentAura>
      </div>
      <div className="perfume-mood-card__body">
        <small>{locale === 'ar' ? product.name_en : product.name_ar}</small>
        <h3>{locale === 'ar' ? product.name_ar : product.name_en}</h3>
        <p>{locale === 'ar' ? product.personality_ar : product.personality_en}</p>
        <div className="mood-chip-row">
          {tags.slice(1, 4).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="perfume-mood-card__foot">
          <strong>{variant ? formatCurrency(variant.retail_price, locale) : ''}</strong>
          <span>{locale === 'ar' ? 'استكشف' : 'Explore'}</span>
        </div>
      </div>
    </Link>
  );
}

export function ProductWorldHero({ locale, product, children }: { locale: Locale; product: Product; children: ReactNode }) {
  return (
    <section className="product-world-hero" data-accent={product.accent || 'gold'}>
      <ScentAura accent={product.accent || 'gold'} className="product-world-hero__visual">
        <ProductMedia product={product} alt={locale === 'ar' ? product.name_ar : product.name_en} />
      </ScentAura>
      <div className="product-world-hero__copy">{children}</div>
    </section>
  );
}

export function DiscoverySetCTA({ locale }: { locale: Locale }) {
  return (
    <section className="discovery-set-cta">
      <div>
        <small>{locale === 'ar' ? 'جرّب قبل ما تختار' : 'Try before choosing'}</small>
        <h2>{locale === 'ar' ? 'مش متأكد؟ جرّب الكولكشن الأول.' : 'Not sure yet? Start with the collection.'}</h2>
        <p>{locale === 'ar' ? 'ست عينات صغيرة تساعدك تلبس كل عطر في يومك قبل قرار الزجاجة.' : 'Six small samples help you wear each scent before choosing a full bottle.'}</p>
      </div>
      <Link to="/discovery-set" className="n-btn n-btn--primary">{locale === 'ar' ? 'اطلب مجموعة التجربة' : 'Order Discovery Set'}</Link>
    </section>
  );
}

export function TrustBatchBlock({ locale }: { locale: Locale }) {
  return (
    <section className="trust-batch-block">
      <SensoryMetric label={locale === 'ar' ? 'تركيز مصقول' : 'Polished concentration'} value={locale === 'ar' ? '24%' : '24%'} />
      <SensoryMetric label={locale === 'ar' ? 'تعتيق هادئ' : 'Quiet maturation'} value={locale === 'ar' ? '21-30 يوم' : '21-30 days'} tone="copper" />
      <SensoryMetric label={locale === 'ar' ? 'مراجعة دفعات' : 'Batch discipline'} value={locale === 'ar' ? 'بدون كشف داخلي' : 'No internal formulas'} tone="dark" />
    </section>
  );
}
