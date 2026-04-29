import { ArrowUpRight, Boxes, FlaskConical, Gift, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createLandingAnimations } from '../animations/nafasLandingAnimations';
import { getCachedProducts } from '../cache/productCache';
import HighlightsGallery from '../components/HighlightsGallery';
import FragranceViewer from '../components/home/FragranceViewer';
import JourneyStory from '../components/home/JourneyStory';
import ScentQuiz from '../components/home/ScentQuiz';
import SectionReveal from '../components/SectionReveal';
import {
  LANDING_WHATSAPP_URL,
  landingBetterTogether,
  landingExploreCards,
  landingFlowSteps,
  landingFragrances,
  landingHighlights,
  landingMedia,
  landingStoryChapters,
  landingWhyCards,
} from '../content/nafasLanding';
import { useLocale } from '../context/LocaleContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import type { Product } from '../types/store';
import { formatCurrency } from '../utils/format';

const whyIcons = [FlaskConical, Sparkles, Gift, ShieldCheck, MessageCircle, Boxes];

const fragranceCopy = {
  sharara: {
    lineAr: 'أول رشة تلفت، وأثر يفضل.',
    line: 'First spray, lasting impression.',
  },
  ghayma: {
    lineAr: 'نعومة تتعلق في الذاكرة.',
    line: 'Softness that stays in memory.',
  },
  dafwa: {
    lineAr: 'قهوة دافية… وحضور مايتنسيش.',
    line: 'Warm coffee. Unforgettable presence.',
  },
  zell: {
    lineAr: 'هادئ… لكنه بيسيب أثر.',
    line: 'Quiet, but never unnoticed.',
  },
} as const;

function getMinimumPrice(product?: Product) {
  if (!product?.variants?.length) {
    return null;
  }

  return [...product.variants].sort((a, b) => a.retail_price - b.retail_price)[0]?.retail_price ?? null;
}

export default function Home() {
  const { locale } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allowHeroVideo, setAllowHeroVideo] = useState(false);

  useEffect(() => {
    getCachedProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const update = () => setAllowHeroVideo(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const context = createLandingAnimations(root, reducedMotion);
    return () => context.revert();
  }, [reducedMotion]);

  const productsBySlug = useMemo(() => {
    return products.reduce<Record<string, Product>>((accumulator, product) => {
      accumulator[product.slug] = product;
      return accumulator;
    }, {});
  }, [products]);

  const collection = useMemo(() => {
    return landingFragrances.map((item) => ({
      ...item,
      product: productsBySlug[item.slug],
      startsFromPrice: getMinimumPrice(productsBySlug[item.slug]) ?? item.sizes[0]?.price ?? 0,
      displayLine: fragranceCopy[item.id as keyof typeof fragranceCopy],
    }));
  }, [productsBySlug]);

  const heroFragrance = collection[0];
  const emotionalSet = collection.slice(0, 4);

  const sensoryChapters = [
    {
      id: 'opening',
      labelAr: 'الافتتاحية',
      label: 'Opening',
      bodyAr: 'نسمة أولى تفتح المزاج: حمضيات ناعمة، بهارات خفيفة، أو قهوة دافية تسبق الحضور.',
      body: 'The opening breath sets the mood with soft citrus, spice, or warm coffee before the body arrives.',
    },
    {
      id: 'heart',
      labelAr: 'القلب',
      label: 'Heart',
      bodyAr: 'هنا تظهر شخصية الرائحة بوضوح: ناعم، دافئ، غامض، أو فريش يثبت على الجلد.',
      body: 'The heart is where the fragrance settles into its character: soft, warm, dark, or bright on skin.',
    },
    {
      id: 'base',
      labelAr: 'القاعدة',
      label: 'Base',
      bodyAr: 'القاعدة هي الأثر الذي يبقى: مسك، أخشاب، عنبر، ولمسة أخيرة ترجع في الذاكرة.',
      body: 'The base is the part that lingers: musk, woods, amber, and the last trace people remember.',
    },
  ];

  const exploreCards = [
    ...landingExploreCards,
    {
      id: 'contact',
      title: 'Talk to Nafas',
      titleAr: 'تواصل مع Nafas',
      body: 'Ask for guidance, build your discovery set, or order directly on WhatsApp.',
      bodyAr: 'اسأل، ابنِ Discovery Set، أو اطلب مباشرة عبر واتساب.',
      href: LANDING_WHATSAPP_URL,
      external: true,
    },
  ].slice(0, 4);

  return (
    <div className="page-home nlp" ref={rootRef}>
      <section className="nlp-ribbon" data-ribbon>
        <div className="n-container nlp-ribbon__inner">
          <p>
            {locale === 'ar'
              ? 'اكتشف مجموعة نفَس الأولى — أربع روائح، أربع حالات مزاجية، وتجربة تستر قبل الشراء.'
              : 'Discover the first Nafas collection — four scents, four moods, and a tester-first experience.'}
          </p>
          <a href="#tester-path" className="nlp-ribbon__cta">
            {locale === 'ar' ? 'اطلب Discovery Mini' : 'Order Discovery Mini'}
          </a>
        </div>
      </section>

      <section className="nlp-hero" data-landing-hero>
        <div className="nlp-hero__media" data-hero-visual>
          {allowHeroVideo && !reducedMotion ? (
            <video
              className="nlp-hero__video"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={landingMedia.heroPoster}
            >
              <source src={landingMedia.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              className="nlp-hero__poster"
              src={landingMedia.heroPoster}
              alt={locale === 'ar' ? 'مشهد افتتاحي لعطر نفَس' : 'Nafas hero composition'}
              loading="eager"
              decoding="async"
            />
          )}
          <div className="nlp-hero__scrim" />
        </div>

        <div className="n-container nlp-hero__content hero__grid" data-hero-content>
          <div className="nlp-hero__copy">
            <h1 data-hero-headline>{locale === 'ar' ? 'نفَس.' : 'Nafas.'}</h1>
            <p className="nlp-hero__subtitle" data-hero-copy>
              {locale === 'ar' ? 'أول رشة تفضل.' : 'The first spray stays with you.'}
            </p>
            <p className="nlp-hero__support">
              {locale === 'ar'
                ? 'عطور محلية Premium بأربع حالات مزاجية: فريش، ناعم، دافئ، وغامض.'
                : 'Premium local perfumes in four clear moods: fresh, soft, warm, and dark.'}
            </p>
            <div className="nlp-hero__cta-row">
              <a href="#comparison" className="n-btn n-btn--primary" data-hero-cta>
                {locale === 'ar' ? 'اكتشف المجموعة' : 'Explore the collection'}
              </a>
              <a href="#tester-path" className="n-btn n-btn--ghost" data-hero-cta>
                {locale === 'ar' ? 'اطلب تستر' : 'Order a tester'}
              </a>
            </div>
          </div>

          <div className="nlp-hero__product-panel">
            <article className={`nlp-hero-card nlp-hero-card--${heroFragrance.id}`}>
              <div className="nlp-hero-card__media">
                <img
                  src={heroFragrance.image}
                  alt={locale === 'ar' ? heroFragrance.nameAr : heroFragrance.name}
                  loading="eager"
                  decoding="async"
                  className="nlp-hero-card__fallback"
                />
              </div>
              <div className="nlp-hero-card__body">
                <span className="nlp-hero-card__code">{heroFragrance.code}</span>
                <h2>{locale === 'ar' ? heroFragrance.nameAr : heroFragrance.name}</h2>
                <p>{locale === 'ar' ? heroFragrance.displayLine.lineAr : heroFragrance.displayLine.line}</p>
                <div className="nlp-hero-card__tags">
                  {(locale === 'ar' ? heroFragrance.moodAr : heroFragrance.mood).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="nlp-hero-card__footer">
                  <strong>{locale === 'ar' ? 'يبدأ من' : 'Starts from'} {formatCurrency(heroFragrance.startsFromPrice, locale)}</strong>
                  <Link to={`/products/${heroFragrance.slug}`} className="nlp-inline-link">
                    {locale === 'ar' ? 'شاهد التفاصيل' : 'View details'}
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <HighlightsGallery items={landingHighlights} />

      <SectionReveal as="section" className="nlp-section nlp-section--emotion">
        <div className="n-container">
          <div className="nlp-emotion">
            <div className="nlp-emotion__copy">
              <p className="nlp-eyebrow">{locale === 'ar' ? 'لحظة العلامة' : 'The emotional moment'}</p>
              <h2>{locale === 'ar' ? 'حب من أول رشة.' : 'Love at first spray.'}</h2>
              <p>
                {locale === 'ar'
                  ? 'أربع روائح، أربع حالات مزاجية، وتجربة تستر تخليك تختار بثقة.'
                  : 'Four scents, four moods, and a tester-first path that helps you choose with confidence.'}
              </p>
            </div>

            <div className="nlp-emotion__scene" aria-hidden="true">
              {emotionalSet.map((item, index) => (
                <figure
                  key={item.id}
                  className={`nlp-emotion__frame nlp-emotion__frame--${index + 1}`}
                >
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <FragranceViewer fragrances={landingFragrances} productsBySlug={productsBySlug} />

      <JourneyStory chapters={landingStoryChapters} />

      <SectionReveal as="section" className="nlp-section nlp-section--senses">
        <div className="n-container">
          <div className="nlp-section-head nlp-section-head--wide">
            <div>
              <p className="nlp-eyebrow">{locale === 'ar' ? 'طبقات الرائحة' : 'Layered perfume structure'}</p>
              <h2>{locale === 'ar' ? 'وليمة للحواس.' : 'A feast for the senses.'}</h2>
              <p>{locale === 'ar' ? 'افتتاحية، قلب، وقاعدة في مشهد حسي واحد كبير، بدل تكديس كروت صغيرة.' : 'Opening, heart, and base told inside one large sensory composition instead of a stack of small cards.'}</p>
            </div>
          </div>

          <div className="nlp-senses-stage">
            <div className="nlp-senses-stage__visual" aria-hidden="true">
              <img src={landingMedia.mistTexture} alt="" loading="lazy" decoding="async" />
              <div className="nlp-senses-stage__mist nlp-senses-stage__mist--one" />
              <div className="nlp-senses-stage__mist nlp-senses-stage__mist--two" />
              <div className="nlp-senses-stage__bottles">
                {collection.slice(0, 4).map((item) => (
                  <img key={item.id} src={item.image} alt="" loading="lazy" decoding="async" />
                ))}
              </div>
            </div>

            <div className="nlp-senses-stage__chapters">
              {sensoryChapters.map((chapter, index) => (
                <article key={chapter.id} className="nlp-senses-stage__chapter">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{locale === 'ar' ? chapter.labelAr : chapter.label}</h3>
                  <p>{locale === 'ar' ? chapter.bodyAr : chapter.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="nlp-section nlp-section--flow" id="tester-path">
        <div className="n-container">
          <div className="nlp-section-head nlp-section-head--wide">
            <div>
              <p className="nlp-eyebrow">{locale === 'ar' ? 'من التستر للزجاجة' : 'From tester to bottle'}</p>
              <h2>{locale === 'ar' ? 'ابدأ بتستر… واختار بثقة.' : 'Start with a tester. Choose with confidence.'}</h2>
              <p>{locale === 'ar' ? 'الخطوات والـ CTA هنا لازم يبانوا كرحلة واحدة مترابطة، مش عناصر منفصلة.' : 'The steps and calls to action stay visually connected so the path feels deliberate, not scattered.'}</p>
            </div>
          </div>

          <div className="nlp-flow">
            <div className="nlp-flow__steps">
              {landingFlowSteps.map((step, index) => (
                <article key={step.id} className="nlp-flow__step">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{locale === 'ar' ? step.titleAr : step.title}</h3>
                </article>
              ))}
            </div>

            <div className="nlp-flow__actions">
              <a className="n-btn n-btn--primary" href={`${LANDING_WHATSAPP_URL}?text=${encodeURIComponent(locale === 'ar' ? 'أريد بناء Discovery Set من Nafas' : 'I want to build my Nafas Discovery Set')}`} target="_blank" rel="noreferrer">
                {locale === 'ar' ? 'ابنِ Discovery Set' : 'Build Discovery Set'}
              </a>
              <a className="n-btn n-btn--ghost" href={`${LANDING_WHATSAPP_URL}?text=${encodeURIComponent(locale === 'ar' ? 'أريد الطلب عبر واتساب من Nafas' : 'I want to order from Nafas on WhatsApp')}`} target="_blank" rel="noreferrer">
                {locale === 'ar' ? 'اطلب عبر واتساب' : 'Order on WhatsApp'}
              </a>
              <a className="n-btn n-btn--ghost" href="#comparison">
                {locale === 'ar' ? 'شاهد الأحجام' : 'View sizes'}
              </a>
            </div>
          </div>
        </div>
      </SectionReveal>

      <section className="nlp-section nlp-section--ritual" data-ritual-section>
        <div className="nlp-ritual" data-ritual-media>
          <img src={landingMedia.mistTexture} alt="" aria-hidden="true" />
          <div className="nlp-ritual__overlay" />
          <div className="n-container nlp-ritual__copy" data-ritual-copy>
            <p className="nlp-eyebrow">{locale === 'ar' ? 'طقس نفَس' : 'The Nafas ritual'}</p>
            <h2>{locale === 'ar' ? 'رشة واحدة تغير اللحظة.' : 'One spray can change the moment.'}</h2>
            <p>
              {locale === 'ar'
                ? 'مشهد واسع ومظلم قليلًا، لكنه يظل هادئًا ومقصودًا: زجاجة، ضوء، وأثر يعلق.'
                : 'One dramatic full-bleed moment: bottle, light, and a trace that lingers.'}
            </p>
          </div>
        </div>
      </section>

      <SectionReveal as="section" className="nlp-section nlp-section--collection">
        <div className="n-container">
          <div className="nlp-section-head nlp-section-head--wide">
            <div>
              <p className="nlp-eyebrow">{locale === 'ar' ? 'أفضل كمجموعة' : 'Better together'}</p>
              <h2>{locale === 'ar' ? 'أفضل كمجموعة.' : landingBetterTogether.title}</h2>
              <p>{locale === 'ar' ? 'Discovery Mini، زجاجة كاملة، Gift Set، وأربع مودات تخدم نفس الرحلة.' : landingBetterTogether.body}</p>
            </div>
          </div>

          <div className="nlp-better">
            <div className="nlp-better__copy">
              <div className="nlp-better__bullets">
                {(locale === 'ar' ? ['Discovery Mini للتجربة الأولى', 'زجاجة كاملة لما تختار مودك', 'Gift Set للتقديم الهادئ', 'أربع مودات في مجموعة واحدة'] : ['Discovery Mini for the first impression', 'A full bottle once one mood becomes yours', 'Gift Set presentation for a refined first gift', 'Four moods in one composed collection']).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <a className="n-btn n-btn--primary" href={`${LANDING_WHATSAPP_URL}?text=${encodeURIComponent(locale === 'ar' ? 'أريد Discovery Mini من Nafas' : 'I want the Nafas Discovery Mini')}`} target="_blank" rel="noreferrer">
                {locale === 'ar' ? 'ابدأ بـ Discovery Mini' : 'Start with Discovery Mini'}
              </a>
            </div>

            <div className="nlp-better__visual" aria-hidden="true">
              <figure className="nlp-better__frame nlp-better__frame--main">
                <img src={landingMedia.discoveryImage} alt="" loading="lazy" decoding="async" />
              </figure>
              <figure className="nlp-better__frame nlp-better__frame--gift">
                <img src={landingMedia.giftSetImage} alt="" loading="lazy" decoding="async" />
              </figure>
              <figure className="nlp-better__frame nlp-better__frame--accent">
                <img src={collection[1].image} alt="" loading="lazy" decoding="async" />
              </figure>
            </div>
          </div>
        </div>
      </SectionReveal>

      <ScentQuiz />

      <SectionReveal as="section" className="nlp-section nlp-section--trust">
        <div className="n-container">
          <div className="nlp-section-head nlp-section-head--wide">
            <div>
              <p className="nlp-eyebrow">{locale === 'ar' ? 'بدون تنازلات' : 'No compromises'}</p>
              <h2>{locale === 'ar' ? 'بدون تنازلات في التجربة.' : 'No compromises in the experience.'}</h2>
              <p>{locale === 'ar' ? 'نقاط الثقة هنا واضحة ومباشرة: تستر أولًا، شخصيات واضحة، تقديم نظيف، وطلب سهل.' : 'Trust comes from clear scent personalities, tester-first discovery, polished presentation, and easy ordering.'}</p>
            </div>
          </div>

          <div className="nlp-why-grid">
            {landingWhyCards.map((card, index) => {
              const Icon = whyIcons[index];

              return (
                <article key={card.id} className="nlp-why-card">
                  <div className="nlp-why-card__icon">
                    <Icon size={18} />
                  </div>
                  <h3>{locale === 'ar' ? card.titleAr : card.title}</h3>
                  <p>{locale === 'ar' ? card.bodyAr : card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="nlp-section nlp-section--comparison" id="comparison">
        <div className="n-container">
          <div className="nlp-section-head nlp-section-head--wide">
            <div>
              <p className="nlp-eyebrow">{locale === 'ar' ? 'ساعدني أختار' : 'Help me choose'}</p>
              <h2>{locale === 'ar' ? 'اختار نفَسك.' : 'Choose your Nafas.'}</h2>
              <p>{locale === 'ar' ? 'أربع روائح فقط، مقارنة واضحة، وإرشاد مباشر بدل زحمة كتالوج.' : 'Four scents only, presented as a clear comparison instead of a crowded catalog.'}</p>
            </div>
          </div>

          <div className="nlp-collection-grid">
            {collection.map((item) => (
              <article
                key={item.id}
                className={`nlp-collection-card nlp-collection-card--${item.id}`}
                data-accent={item.accent}
              >
                <div className="nlp-collection-card__media">
                  <img src={item.image} alt={locale === 'ar' ? item.nameAr : item.name} loading="lazy" decoding="async" />
                </div>
                <div className="nlp-collection-card__body">
                  <div className="nlp-collection-card__head">
                    <div>
                      <span>{item.code}</span>
                      <h3>{locale === 'ar' ? item.nameAr : item.name}</h3>
                    </div>
                    <p className="nlp-collection-card__line">{locale === 'ar' ? item.displayLine.lineAr : item.displayLine.line}</p>
                  </div>
                  <div className="nlp-collection-card__tags">
                    {(locale === 'ar' ? item.moodAr : item.mood).map((tag) => (
                      <small key={`${item.id}-${tag}`}>{tag}</small>
                    ))}
                  </div>
                  <div className="nlp-collection-card__meta">
                    <div>
                      <label>{locale === 'ar' ? 'مناسب لـ' : 'Best for'}</label>
                      <strong>{locale === 'ar' ? item.usageAr : item.usage}</strong>
                    </div>
                    <div>
                      <label>{locale === 'ar' ? 'يبدأ من' : 'Starts from'}</label>
                      <strong>{formatCurrency(item.startsFromPrice, locale)}</strong>
                    </div>
                  </div>
                  <div className="nlp-collection-card__footer">
                    <Link to={`/products/${item.slug}`} className="n-btn n-btn--primary">
                      {locale === 'ar' ? 'استكشف' : 'Explore'}
                    </Link>
                    <a className="nlp-inline-link" href={`${LANDING_WHATSAPP_URL}?text=${encodeURIComponent(locale === 'ar' ? `أريد تجربة ${item.nameAr}` : `I want to try ${item.name}`)}`} target="_blank" rel="noreferrer">
                      {locale === 'ar' ? 'اطلب عبر واتساب' : 'Order on WhatsApp'} <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="nlp-section nlp-section--explore">
        <div className="n-container">
          <div className="nlp-section-head nlp-section-head--wide">
            <div>
              <p className="nlp-eyebrow">{locale === 'ar' ? 'أكمل المشوار' : 'Keep exploring'}</p>
              <h2>{locale === 'ar' ? 'خطوة أخيرة قبل القرار.' : 'One more step before you decide.'}</h2>
            </div>
          </div>

          <div className="nlp-explore-grid">
            {exploreCards.map((card, index) => {
              const content = (
                <>
                  <div className="nlp-explore-card__overlay" />
                  <div className="nlp-explore-card__copy">
                    <h3>{locale === 'ar' ? card.titleAr : card.title}</h3>
                    <p>{locale === 'ar' ? card.bodyAr : card.body}</p>
                  </div>
                </>
              );

              if (card.external) {
                return (
                  <a
                    key={card.id}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`nlp-explore-card nlp-explore-card--${index + 1}`}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={card.id} to={card.href} className={`nlp-explore-card nlp-explore-card--${index + 1}`}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
