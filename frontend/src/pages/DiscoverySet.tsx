import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCachedProduct } from '../cache/productCache';
import { launchSlugs, perfumeCatalog } from '../content/perfumeCatalog';
import { localDiscoveryProduct } from '../content/localProducts';
import { useCart } from '../hooks/useCart';
import { useLocale } from '../context/LocaleContext';
import type { Product } from '../types/store';
import { formatCurrency } from '../utils/format';
import { getPrimaryVariant } from '../utils/products';
import { ProductWorldHero, TrustBatchBlock } from '../components/sensory/SensoryPrimitives';

export default function DiscoverySet() {
  const { locale } = useLocale();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product>(localDiscoveryProduct);
  const variant = getPrimaryVariant(product);

  useEffect(() => {
    getCachedProduct('discovery-set').then(setProduct).catch(() => setProduct(localDiscoveryProduct));
  }, []);

  const handleAdd = async () => {
    if (variant) await addToCart(product, variant, 1);
  };

  return (
    <div className="n-container n-section discovery-page">
      <ProductWorldHero locale={locale} product={product}>
        <small>{locale === 'ar' ? 'جرّب قبل ما تختار' : 'Try before choosing'}</small>
        <h1>{locale === 'ar' ? 'مجموعة التجربة من نفس' : 'Nafas Discovery Set'}</h1>
        <p>{locale === 'ar' ? 'ست عينات من كولكشن نفس: شرارة، مدار، أثر، برق، ندى، وغيمة. ارتدي كل رائحة في يومك ثم اختار الزجاجة بثقة.' : 'Six samples from the Nafas collection. Wear each scent through your day, then choose with confidence.'}</p>
        <strong>{variant ? formatCurrency(variant.retail_price, locale) : ''}</strong>
        <div className="hero-actions">
          <button type="button" className="n-btn n-btn--primary" onClick={handleAdd}>{locale === 'ar' ? 'أضف مجموعة التجربة' : 'Add Discovery Set'}</button>
          <Link to="/scent-finder" className="n-btn n-btn--ghost">{locale === 'ar' ? 'اكتشف عطرك' : 'Open Scent Finder'}</Link>
        </div>
      </ProductWorldHero>

      <section className="n-section discovery-scents">
        <div className="section-head">
          <div>
            <small>{locale === 'ar' ? 'الست روائح' : 'Six scents'}</small>
            <h2>{locale === 'ar' ? 'كل مود في عينة صغيرة.' : 'Every mood in a small sample.'}</h2>
          </div>
        </div>
        <div className="discovery-scent-grid">
          {launchSlugs.map((slug) => {
            const scent = perfumeCatalog[slug];
            return (
              <Link key={slug} to={`/products/${slug}`} className="discovery-scent" data-accent={scent.accent}>
                <strong>{locale === 'ar' ? scent.nameAr : scent.nameEn}</strong>
                <span>{locale === 'ar' ? scent.moodAr : scent.moodEn}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <TrustBatchBlock locale={locale} />
    </div>
  );
}
