import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpLeft, ShieldCheck, Sparkles, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicApi } from '../api/publicApi';
import ProductMedia from '../components/ProductMedia';
import ScrollIndicator from '../components/ScrollIndicator';
import SectionReveal from '../components/SectionReveal';
import Hero3DScene from '../components/Hero3DScene';
import BottleAssemblyScroll from '../components/BottleAssemblyScroll';
import { enrichProduct } from '../content/perfumeCatalog';
import { useLocale } from '../context/LocaleContext';
import { should3DBeEnabled, prefersReducedMotion } from '../utils/performance';
import {
  FRAGRANCE_SPRAY_MOMENT,
  HERO_POSTER,
  HERO_VIDEO_MP4,
  HERO_VIDEO_WEBM,
  JOURNEY_POSTER,
  JOURNEY_VIDEO_MP4,
  JOURNEY_VIDEO_WEBM,
  PRODUCT_PERFUME_CLOSEUP,
} from '../utils/brand';
import { formatCurrency } from '../utils/format';

const preferredSlugs = ['sharara', 'ghayma', 'dafwa', 'zell', 'madar', 'nada'];
const homepageSignatureMedia: Record<string, string> = {
  sharara: '/assets/products/sharara-visual.webp',
  ghayma: '/assets/products/ghayma-visual.webp',
  dafwa: PRODUCT_PERFUME_CLOSEUP,
  zell: '/assets/products/zell-visual.webp',
};

const HomeEnhanced: React.FC = () => {
  const { locale } = useLocale();
  const [products, setProducts] = useState<any[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    publicApi.getProducts()
      .then((response) => setProducts((response.data.data || []).map(enrichProduct)))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const shouldEnable3D = should3DBeEnabled();
    const hasReducedMotion = prefersReducedMotion();
    
    setReducedMotion(hasReducedMotion);
    setShow3D(shouldEnable3D);

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      const hasReducedMotion = mediaQuery.matches;
      setReducedMotion(hasReducedMotion);
      setShow3D(should3DBeEnabled());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const collectionProducts = useMemo(() => {
    const ordered = preferredSlugs
      .map((slug) => products.find((product) => product.slug === slug))
      .filter(Boolean);

    const fallback = products.filter((product) => !preferredSlugs.includes(product.slug));
    return [...ordered, ...fallback].slice(0, 4);
  }, [products]);

  const promiseItems = [
    {
      body:
        locale === 'ar'
          ? 'صياغات متوازنة بين الافتتاح الهادئ والقلب الواضح والأثر الطويل.'
          : 'Balanced compositions between a quiet opening, a clear heart, and a long trail.',
      icon: Sparkles,
      title: locale === 'ar' ? 'صياغة مدروسة' : 'Thoughtful composition',
    },
    {
      body:
        locale === 'ar'
          ? 'صور أوضح، خامات أهدأ، ومسار شراء يشرح العطر بدون زحام.'
          : 'Clearer visuals, calmer materials, and a buying flow that explains the scent without clutter.',
      icon: ShieldCheck,
      title: locale === 'ar' ? 'وضوح فاخر' : 'Luxurious clarity',
    },
    {
      body:
        locale === 'ar'
          ? 'تجربة عربية أولًا تبدو طبيعية على الهاتف وسطح المكتب.'
          : 'An Arabic-first experience that feels intentional on mobile and desktop alike.',
      icon: Wind,
      title: locale === 'ar' ? 'حضور هادئ' : 'Quiet presence',
    },
  ];

  const heroCopy =
    locale === 'ar'
      ? {
          ctaPrimary: 'اكتشف العطور',
          ctaSecondary: 'اطلب الآن',
          heading: 'نفَس... أول رشة تكمل حضورك',
          microline: 'نفَس — جوهر الحضور',
          subtitle: 'قصة عطرية تبدأ من السكون وتترك أثرًا',
        }
      : {
          ctaPrimary: 'Discover perfumes',
          ctaSecondary: 'Order now',
          heading: 'Nafas — the first spray that completes your presence',
          microline: 'Nafas — The Essence of Presence',
          subtitle: 'A fragrance story that starts quietly and leaves a trail',
        };

  const ritualStages =
    locale === 'ar'
      ? ['العبوة تبدأ صامتة', 'الضوء يكشف الزجاج', 'أول نفَس يخرج', 'الأثر يفضل حولك']
      : ['The bottle begins in silence', 'Light reveals the glass', 'The first breath is released', 'The trail stays around you'];

  return (
    <div className="nafas-home nafas-homepage nafas-home-enhanced">
      {/* Hero with 3D Scene */}
      <section className="nafas-home-hero nafas-home-hero--3d">
        {show3D ? (
          <div className="nafas-home-hero__3d-scene">
            <Hero3DScene autoRotate={true} />
            <div className="nafas-home-hero__3d-overlay" />
          </div>
        ) : (
          <div className="nafas-home-hero__media-shell" aria-hidden="true">
            {!reducedMotion ? (
              <video
                className="nafas-home-hero__media"
                autoPlay
                loop
                muted
                playsInline
                poster={HERO_POSTER}
              >
                <source src={HERO_VIDEO_WEBM} type="video/webm" />
                <source src={HERO_VIDEO_MP4} type="video/mp4" />
              </video>
            ) : null}
            <img
              alt=""
              className={`nafas-home-hero__media nafas-home-hero__media--fallback ${reducedMotion ? 'is-visible' : ''}`}
              src={HERO_POSTER}
            />
            <div className="nafas-home-hero__veil" />
            <div className="nafas-home-hero__mist nafas-home-hero__mist--one" />
            <div className="nafas-home-hero__mist nafas-home-hero__mist--two" />
          </div>
        )}

        <div className="container-wide nafas-home-hero__content">
          <SectionReveal className="nafas-home-hero__copy" variant="blurIn">
            <span className="section-kicker">{heroCopy.microline}</span>
            <h1>{heroCopy.heading}</h1>
            <p>{heroCopy.subtitle}</p>
            <div className="nafas-home-hero__actions">
              <Link to="/shop" className="ui-button ui-button--primary ui-button--lg">{heroCopy.ctaPrimary}</Link>
              <Link to="/shop" className="ui-button ui-button--ghost ui-button--lg">{heroCopy.ctaSecondary}</Link>
            </div>
          </SectionReveal>

          <ScrollIndicator label={locale === 'ar' ? 'اكتشف العالم' : 'Discover the world'} />
        </div>
      </section>

      {/* 3D Bottle Assembly Section */}
      {show3D && (
        <BottleAssemblyScroll />
      )}

      <SectionReveal className="nafas-section home-ritual" variant="fadeUp">
        <div className="container-wide home-ritual__layout">
          <div className="home-ritual__media">
            {!reducedMotion ? (
              <video
                className="home-ritual__visual"
                autoPlay
                loop
                muted
                playsInline
                poster={JOURNEY_POSTER}
              >
                <source src={JOURNEY_VIDEO_WEBM} type="video/webm" />
                <source src={JOURNEY_VIDEO_MP4} type="video/mp4" />
              </video>
            ) : (
              <img src={JOURNEY_POSTER} alt={locale === 'ar' ? 'طقس العطر' : 'Fragrance ritual'} className="home-ritual__visual" />
            )}
            <div className="home-ritual__mist" />
          </div>

          <div className="home-ritual__copy">
            <span className="section-kicker">{locale === 'ar' ? 'طقس العطر' : 'Fragrance ritual'}</span>
            <h2>{locale === 'ar' ? 'رحلة تبدأ بصمت الزجاجة وتنتهي بأثر يبقى' : 'A ritual that begins in silence and ends in a lingering trail'}</h2>
            <p>
              {locale === 'ar'
                ? 'ضوء يمر على الزجاج، نفَس أول يخرج، ثم أثر يهدأ حولك.'
                : 'Light across the glass, the first breath released, then a trail that settles around you.'}
            </p>

            <div className="home-ritual__stages">
              {ritualStages.map((stage, index) => (
                <article key={stage} className="home-ritual__stage">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{stage}</strong>
                </article>
              ))}
            </div>

            <Link to="/shop" className="ui-button ui-button--primary ui-button--lg home-ritual__cta">
              {locale === 'ar' ? 'اكتشف العطور' : 'Discover perfumes'}
            </Link>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="nafas-section home-signature" variant="fadeUp">
        <div className="container-wide">
          <div className="section-head home-signature__head">
            <div>
              <span className="section-kicker">{locale === 'ar' ? 'التوقيعات' : 'Signature collection'}</span>
              <h2>{locale === 'ar' ? 'أربع زجاجات تفتح عالم نفَس' : 'Four bottles that open the Nafas world'}</h2>
            </div>
            <Link to="/shop" className="ui-button ui-button--ghost ui-button--sm">
              {locale === 'ar' ? 'تسوّق المجموعة' : 'Shop collection'}
            </Link>
          </div>

          <div className="home-signature__grid">
            {collectionProducts.map((product) => {
              const primaryName = locale === 'ar' ? product.name_ar || product.name_en : product.name_en || product.name_ar;
              const secondaryName = locale === 'ar' ? product.name_en : product.name_ar;
              const personality = locale === 'ar' ? product.personality_ar || product.story : product.personality_en || product.story_en || product.story;
              const firstVariant = product.variants?.[0];
              const mediaSrc = homepageSignatureMedia[product.slug] || undefined;

              return (
                <article key={product.id || product.slug} className={`home-signature-card home-signature-card--${product.slug}`}>
                  <Link
                    to={`/products/${product.slug}`}
                    className="home-signature-card__link"
                    aria-label={locale === 'ar' ? `فتح ${primaryName}` : `Open ${primaryName}`}
                  />
                  <div className="home-signature-card__media">
                    <ProductMedia product={product} src={mediaSrc} alt={primaryName} className="home-signature-card__image" loading="eager" />
                  </div>
                  <div className="home-signature-card__body">
                    <h3>{primaryName}</h3>
                    <p className="home-signature-card__secondary">{secondaryName}</p>
                    <p className="home-signature-card__personality">{personality}</p>
                    <div className="home-signature-card__footer">
                      <div className="home-signature-card__price">
                        <small>{locale === 'ar' ? 'يبدأ من' : 'Starts at'}</small>
                        <strong>{firstVariant ? formatCurrency(firstVariant.retail_price, locale) : '—'}</strong>
                      </div>
                      <Link to={`/products/${product.slug}`} className="ui-button ui-button--primary ui-button--sm">
                        {locale === 'ar' ? 'اكتشف العطر' : 'Discover scent'}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="nafas-section home-promise" variant="fadeUp">
        <div className="container-wide">
          <div className="section-head home-promise__head">
            <span className="section-kicker">{locale === 'ar' ? 'لماذا نفَس' : 'Why Nafas'}</span>
            <h2>{locale === 'ar' ? 'فخامة أهدأ وقرار أوضح' : 'Calmer luxury, clearer decisions'}</h2>
          </div>
          <div className="home-promise__grid">
            {promiseItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="home-promise__card">
                  <Icon size={18} />
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="nafas-section home-discovery" variant="scaleIn">
        <div className="container-wide home-discovery__panel">
          <div className="home-discovery__media">
            <img src={FRAGRANCE_SPRAY_MOMENT} alt={locale === 'ar' ? 'لحظة الرشة الأولى' : 'The first spray moment'} className="home-discovery__image" />
            <div className="home-discovery__mist" />
          </div>
          <div className="home-discovery__copy">
            <span className="section-kicker">{locale === 'ar' ? 'دعوة الاكتشاف' : 'Discovery invitation'}</span>
            <h2>{locale === 'ar' ? 'ابدأ بتستر يقرّبك من الأثر' : 'Begin with a tester that brings you closer to the trail'}</h2>
            <p>
              {locale === 'ar'
                ? 'إن لم تكن قد جرّبت نفَس بعد، ابدأ بنسخة أصغر، راقب الافتتاح، ثم اختر الزجاجة التي تكمل حضورك.'
                : 'If this is your first encounter with Nafas, begin smaller, follow the opening, then choose the bottle that completes your presence.'}
            </p>
            <div className="home-discovery__actions">
              <Link to="/shop" className="ui-button ui-button--primary ui-button--lg">
                {locale === 'ar' ? 'استكشف التستر' : 'Explore testers'}
              </Link>
              <Link to="/shop" className="ui-button ui-button--ghost ui-button--lg">
                {locale === 'ar' ? 'تسوّق المجموعة' : 'Shop collection'}
              </Link>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="nafas-section home-final-cta" variant="fadeUp">
        <div className="container-wide home-final-cta__panel">
          <div className="home-final-cta__glow" aria-hidden="true" />
          <div className="home-final-cta__copy">
            <span className="section-kicker">{locale === 'ar' ? 'جاهز الآن' : 'Ready now'}</span>
            <h2>{locale === 'ar' ? 'ادخل المتجر واختر أثرَك القادم' : 'Enter the shop and choose your next trail'}</h2>
          </div>
          <Link to="/shop" className="ui-button ui-button--primary ui-button--lg home-final-cta__button">
            {locale === 'ar' ? 'اذهب إلى المتجر' : 'Go to shop'}
            <ArrowUpLeft size={16} />
          </Link>
        </div>
      </SectionReveal>
    </div>
  );
};

export default HomeEnhanced;
