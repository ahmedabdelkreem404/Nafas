import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCachedProducts } from '../cache/productCache';
import { PerfumeMoodCard, TrustBatchBlock } from '../components/sensory/SensoryPrimitives';
import { launchSlugs } from '../content/perfumeCatalog';
import { useLocale } from '../context/LocaleContext';
import type { Product } from '../types/store';

export default function Home() {
  const { locale } = useLocale();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getCachedProducts().then((items) => {
      setProducts(items.filter((product) => launchSlugs.includes(product.slug as any)));
    }).catch(() => setProducts([]));
  }, []);

  return (
    <section className="n-container n-section sensory-home-bridge">
        <div className="page-head page-head--compact">
          <small>{locale === 'ar' ? 'دار نفس' : 'Maison Nafas'}</small>
          <h1>{locale === 'ar' ? 'كل نفس... بيحكي عنك' : 'Every breath tells your story.'}</h1>
          <p>{locale === 'ar' ? 'ادخل الكولكشن من الإحساس أولاً: اكتشف عطرك، جرّب العينات، أو تسوق الست روائح.' : 'Enter the collection through feeling first: find your scent, try samples, or shop all six.'}</p>
          <div className="hero-actions">
            <Link to="/scent-finder" className="n-btn n-btn--primary">{locale === 'ar' ? 'اكتشف عطرك' : 'Find your scent'}</Link>
            <Link to="/discovery-set" className="n-btn n-btn--ghost">{locale === 'ar' ? 'اطلب مجموعة التجربة' : 'Order Discovery Set'}</Link>
            <Link to="/shop" className="n-btn n-btn--ghost">{locale === 'ar' ? 'تسوق الكولكشن' : 'Shop collection'}</Link>
          </div>
        </div>

        <div className="section-head">
          <div>
            <small>{locale === 'ar' ? 'الكولكشن الكامل' : 'Full collection'}</small>
            <h2>{locale === 'ar' ? 'ست روائح، كل واحدة لها عالم.' : 'Six scents, each with its own world.'}</h2>
          </div>
        </div>

        <div className="product-grid product-grid--shop atelier-grid atelier-grid--shop">
          {products.map((product) => <PerfumeMoodCard key={product.slug} locale={locale} product={product} />)}
        </div>

        <div className="sensory-home-commercial">
          <Link to="/discovery-set" className="scent-story-block">
            <small>{locale === 'ar' ? 'جرّب قبل ما تختار' : 'Try first'}</small>
            <h2>{locale === 'ar' ? 'مجموعة التجربة واضحة من أول زيارة.' : 'Discovery Set is a real path from day one.'}</h2>
            <p>{locale === 'ar' ? 'ست عينات تساعدك تلبس كل عطر في يومك قبل اختيار الزجاجة.' : 'Six samples help you wear each perfume before choosing a bottle.'}</p>
          </Link>
          <Link to="/gift-boxes" className="scent-story-block">
            <small>{locale === 'ar' ? 'الهدايا' : 'Gifting'}</small>
            <h2>{locale === 'ar' ? 'اختيارات هدايا هادئة وواضحة.' : 'Calm, clear gift edits.'}</h2>
            <p>{locale === 'ar' ? 'ترشيحات رجالية وناعمة ومجموعة تجربة لمن لا يعرف الذوق بدقة.' : 'Men, soft, and safe discovery edits for different recipients.'}</p>
          </Link>
        </div>

        <TrustBatchBlock locale={locale} />
    </section>
  );
}
