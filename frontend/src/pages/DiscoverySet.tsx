import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { getCachedProduct } from '../cache/productCache';
import { localDiscoveryProduct } from '../content/localProducts';
import { formatCurrency } from '../utils/format';
import { getPrimaryVariant } from '../utils/products';
import { useCart } from '../hooks/useCart';
import { useLocale } from '../context/LocaleContext';
import type { Product } from '../types/store';
import BottleVisual from '../features/apple-home/components/BottleVisual';
import { appleHomeCopy, scentCopy, text } from '../features/apple-home/data/appleHomeCopy';
import { scents } from '../features/apple-home/data/scents';

export default function DiscoverySet() {
  const { dir, locale } = useLocale();
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
    <div className={`apple-nafas-page apple-nafas-page--${locale} anh-commerce-page`} dir={dir} lang={locale}>
      <section className="anh-section anh-together anh-discovery-hero">
        <div className="anh-container anh-together__grid">
          <div>
            <p className="anh-kicker">{locale === 'ar' ? 'جرّب قبل ما تختار' : 'Try before choosing'}</p>
            <h1>{locale === 'ar' ? 'مجموعة التجربة من نفس' : 'Nafas Discovery Set'}</h1>
            <p>{locale === 'ar' ? 'ست عينات من كولكشن نفس: شرارة، مدار، أثر، برق، ندى، وغيمة. ارتدي كل رائحة في يومك ثم اختار الزجاجة بثقة.' : 'Six samples from Nafas. Wear each scent through your day, then choose with confidence.'}</p>
            <strong className="anh-commerce-price">{variant ? formatCurrency(variant.retail_price, locale) : ''}</strong>
            <div className="anh-actions">
              <button type="button" className="anh-button anh-button--primary" onClick={handleAdd}>{locale === 'ar' ? 'أضف مجموعة التجربة' : 'Add Discovery Set'}</button>
              <Link to="/scent-finder" className="anh-button anh-button--secondary">{locale === 'ar' ? 'اكتشف عطرك' : 'Open Scent Finder'}</Link>
            </div>
          </div>
          <div className="anh-together__visual anh-discovery-visual" aria-hidden="true">
            <img src="/assets/stock/optimized/hero-perfume-fabric.webp" alt="" loading="lazy" decoding="async" />
            <div className="anh-discovery-mini-lineup">
              {scents.map((scent) => <BottleVisual key={scent.id} scent={scent} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="anh-section anh-compare" id="discovery-scents">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">{locale === 'ar' ? 'الست روائح' : 'Six scents'}</p>
            <h2>{locale === 'ar' ? 'كل مود في عينة صغيرة.' : 'Every mood in a small sample.'}</h2>
          </div>
          <div className="anh-compare__grid">
            {scents.map((scent) => (
              <Link key={scent.id} to={`/products/${scent.id}`} className="anh-compare-card" style={{ '--accent': scent.accent } as CSSProperties}>
                <div className="anh-compare-card__visual">
                  <BottleVisual scent={scent} />
                </div>
                <span>{scent.name}</span>
                <h3>{text(scentCopy[scent.id].name, locale)}</h3>
                <p>{text(scentCopy[scent.id].line, locale)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="anh-section anh-why">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">{text(appleHomeCopy.trust.kicker, locale)}</p>
            <h2>{text(appleHomeCopy.trust.title, locale)}</h2>
          </div>
          <div className="anh-why__grid">
            <article><h3>{locale === 'ar' ? 'ست روائح كاملة' : 'All six scents'}</h3><p>{locale === 'ar' ? 'التجربة لا تختصر الكولكشن، بل تفتحه لك بهدوء.' : 'The set opens the full collection calmly.'}</p></article>
            <article><h3>{locale === 'ar' ? 'تعتيق ومراجعة' : 'Matured and checked'}</h3><p>{locale === 'ar' ? 'تعتيق 21-30 يوم ومراجعة للصفاء والرش بدون كشف تفاصيل داخلية.' : '21-30 day maturation and practical checks without internal details.'}</p></article>
            <article><h3>{locale === 'ar' ? 'قرار أوضح' : 'Clearer choice'}</h3><p>{locale === 'ar' ? 'ارتدي كل رائحة في يومك قبل اختيار الزجاجة.' : 'Wear each scent in your day before choosing a bottle.'}</p></article>
          </div>
        </div>
      </section>
    </div>
  );
}
