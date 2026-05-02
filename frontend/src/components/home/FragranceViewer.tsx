import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LandingFragrance, LandingSizeOption } from '../../content/nafasLanding';
import { LANDING_WHATSAPP_URL } from '../../content/nafasLanding';
import { useLocale } from '../../context/LocaleContext';
import type { Product } from '../../types/store';
import { formatCurrency } from '../../utils/format';

type FragranceViewerProps = {
  fragrances: LandingFragrance[];
  productsBySlug: Record<string, Product | undefined>;
};

type ViewerFacet = 'scent' | 'notes' | 'bottle' | 'sizes' | 'gift' | 'usage';

function getStartingVariant(product?: Product) {
  if (!product?.variants?.length) {
    return undefined;
  }

  const sorted = [...product.variants].sort((a, b) => a.retail_price - b.retail_price);
  return sorted[0];
}

function getViewerSizes(product: Product | undefined, fallbackSizes: LandingSizeOption[]) {
  if (product?.variants?.length) {
    return product.variants.map((variant) => ({
      id: String(variant.id),
      label: variant.label,
      labelAr: variant.label,
      price: variant.retail_price,
    }));
  }

  return fallbackSizes;
}

export default function FragranceViewer({ fragrances, productsBySlug }: FragranceViewerProps) {
  const { locale } = useLocale();
  const [activeId, setActiveId] = useState(fragrances[0]?.id ?? 'sharara');
  const [displayedId, setDisplayedId] = useState(fragrances[0]?.id ?? 'sharara');
  const [activeSizeId, setActiveSizeId] = useState<string | null>(null);
  const [activeFacet, setActiveFacet] = useState<ViewerFacet>('scent');
  const [phase, setPhase] = useState<'steady' | 'exiting' | 'entering'>('steady');

  useEffect(() => {
    if (activeId === displayedId) {
      return undefined;
    }

    setPhase('exiting');
    const swapTimer = window.setTimeout(() => {
      setDisplayedId(activeId);
      setPhase('entering');
    }, 160);
    const settleTimer = window.setTimeout(() => {
      setPhase('steady');
    }, 520);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(settleTimer);
    };
  }, [activeId, displayedId]);

  const fragrance = useMemo(
    () => fragrances.find((entry) => entry.id === displayedId) ?? fragrances[0],
    [displayedId, fragrances],
  );

  const linkedProduct = productsBySlug[fragrance.slug];
  const sizes = useMemo(() => getViewerSizes(linkedProduct, fragrance.sizes), [fragrance.sizes, linkedProduct]);
  const selectedSize = useMemo(() => {
    if (!sizes.length) {
      return null;
    }

    return sizes.find((size) => size.id === activeSizeId) ?? sizes[0];
  }, [activeSizeId, sizes]);

  const startingVariant = getStartingVariant(linkedProduct);
  const startingPrice = selectedSize?.price ?? startingVariant?.retail_price ?? 0;

  const facets = [
    { id: 'scent', ar: 'الرائحة', en: 'Scent' },
    { id: 'notes', ar: 'النوتات', en: 'Notes' },
    { id: 'bottle', ar: 'العبوة', en: 'Bottle' },
    { id: 'sizes', ar: 'المقاسات', en: 'Sizes' },
    { id: 'gift', ar: 'الهدية', en: 'Gift' },
    { id: 'usage', ar: 'الاستخدام', en: 'Usage' },
  ] as const;

  const scentSummary = {
    sharara: {
      titleAr: 'شرارة',
      title: 'Sharara',
      lineAr: 'أول رشة تلفت، وأثر يفضل.',
      line: 'First spray, lasting impression.',
    },
    ghayma: {
      titleAr: 'غيمة',
      title: 'Ghayma',
      lineAr: 'نعومة تتعلق في الذاكرة.',
      line: 'Softness that stays in memory.',
    },
    Nada: {
      titleAr: 'ندى',
      title: 'Nada',
      lineAr: 'قهوة دافية… وحضور مايتنسيش.',
      line: 'Warm coffee. Unforgettable presence.',
    },
    Madar: {
      titleAr: 'مدار',
      title: 'Madar',
      lineAr: 'هادئ… لكنه بيسيب أثر.',
      line: 'Quiet, but never unnoticed.',
    },
  } as const;

  const scentCopy = scentSummary[fragrance.id as keyof typeof scentSummary];

  const viewerDetails = {
    scent: {
      title: locale === 'ar' ? 'شخصية الرائحة' : 'Scent personality',
      body: locale === 'ar' ? fragrance.personalityAr : fragrance.personality,
      meta: [
        {
          label: locale === 'ar' ? 'المود' : 'Mood',
          value: (locale === 'ar' ? fragrance.moodAr : fragrance.mood).join(' / '),
        },
        {
          label: locale === 'ar' ? 'الحضور' : 'Presence',
          value: locale === 'ar' ? fragrance.strengthAr : fragrance.strength,
        },
      ],
    },
    notes: {
      title: locale === 'ar' ? 'افتتاحية، قلب، وقاعدة' : 'Opening, heart, and base',
      body: locale === 'ar'
        ? `${fragrance.topNotesAr.join('، ')} • ${fragrance.heartNotesAr.join('، ')} • ${fragrance.baseNotesAr.join('، ')}`
        : `${fragrance.topNotes.join(', ')} • ${fragrance.heartNotes.join(', ')} • ${fragrance.baseNotes.join(', ')}`,
      meta: [
        {
          label: locale === 'ar' ? 'الافتتاحية' : 'Opening',
          value: (locale === 'ar' ? fragrance.topNotesAr : fragrance.topNotes).join(' / '),
        },
        {
          label: locale === 'ar' ? 'القاعدة' : 'Base',
          value: (locale === 'ar' ? fragrance.baseNotesAr : fragrance.baseNotes).join(' / '),
        },
      ],
    },
    bottle: {
      title: locale === 'ar' ? 'عبوة نظيفة وواضحة' : 'A clean, composed bottle',
      body: locale === 'ar' ? fragrance.designAr : fragrance.design,
      meta: [
        {
          label: locale === 'ar' ? 'اللمسة' : 'Finish',
          value: locale === 'ar' ? fragrance.designAr : fragrance.design,
        },
        {
          label: locale === 'ar' ? 'الهوية' : 'Identity',
          value: scentCopy ? (locale === 'ar' ? scentCopy.titleAr : scentCopy.title) : fragrance.name,
        },
      ],
    },
    sizes: {
      title: locale === 'ar' ? 'المقاسات المتاحة' : 'Available sizes',
      body: locale === 'ar'
        ? 'ابدأ بتستر، ثم تحرّك للحجم المناسب لك عندما تثبت الرائحة.'
        : 'Start with a tester, then move to the size that feels right once the scent settles with you.',
      meta: sizes.slice(0, 2).map((size) => ({
        label: locale === 'ar' ? size.labelAr : size.label,
        value: formatCurrency(size.price, locale),
      })),
    },
    gift: {
      title: locale === 'ar' ? 'جاهز كهدية' : 'Gift-ready',
      body: locale === 'ar'
        ? 'اختيار هادئ ومهندم للتجربة، للتقديم، ولمن يريد يبدأ بثقة.'
        : 'A calm, polished choice for discovery, gifting, and first-time selection.',
      meta: [
        {
          label: locale === 'ar' ? 'مناسب لـ' : 'Best for',
          value: locale === 'ar' ? 'الهدايا، الـ Discovery Set، والبداية الأولى' : 'Gifting, discovery sets, and a guided first pick',
        },
      ],
    },
    usage: {
      title: locale === 'ar' ? 'متى تلبسه؟' : 'When does it fit best?',
      body: locale === 'ar' ? fragrance.usageAr : fragrance.usage,
      meta: [
        {
          label: locale === 'ar' ? 'أفضل وقت' : 'Best for',
          value: locale === 'ar' ? fragrance.usageAr : fragrance.usage,
        },
      ],
    },
  } satisfies Record<ViewerFacet, { title: string; body: string; meta: Array<{ label: string; value: string }> }>;

  const handleSelectorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = fragrances.findIndex((item) => item.id === activeId);

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = locale === 'ar'
        ? (currentIndex - 1 + fragrances.length) % fragrances.length
        : (currentIndex + 1) % fragrances.length;
      setActiveId(fragrances[nextIndex].id);
      setActiveSizeId(null);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const nextIndex = locale === 'ar'
        ? (currentIndex + 1) % fragrances.length
        : (currentIndex - 1 + fragrances.length) % fragrances.length;
      setActiveId(fragrances[nextIndex].id);
      setActiveSizeId(null);
    }
  };

  return (
    <section className="nlp-section nlp-section--viewer" aria-labelledby="viewer-title">
      <div className="n-container">
        <div className="nlp-section-head nlp-section-head--wide">
          <div>
            <p className="nlp-eyebrow">{locale === 'ar' ? 'الزجاجة الأقرب لك' : 'Your closer look'}</p>
            <h2 id="viewer-title">{locale === 'ar' ? 'خذ نظرة أقرب.' : 'Take a closer look.'}</h2>
          </div>
        </div>

        <div className={`nlp-viewer nlp-viewer--${fragrance.id}`}>
          <div
            className="nlp-viewer__selector"
            role="tablist"
            aria-label={locale === 'ar' ? 'اختيار الرائحة' : 'Choose a fragrance'}
            onKeyDown={handleSelectorKeyDown}
          >
            {fragrances.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className={`nlp-viewer__pill ${item.id === activeId ? 'is-active' : ''}`}
                aria-selected={item.id === activeId}
                onClick={() => {
                  setActiveId(item.id);
                  setActiveSizeId(null);
                }}
              >
                <span>{locale === 'ar' ? item.nameAr : item.name}</span>
              </button>
            ))}
          </div>

          <div className="nlp-viewer__shell">
            <aside className="nlp-viewer__facets" aria-label={locale === 'ar' ? 'تفاصيل العرض' : 'Viewer details'}>
              {facets.map((facet) => (
                <button
                  key={facet.id}
                  type="button"
                  className={`nlp-viewer__facet ${activeFacet === facet.id ? 'is-active' : ''}`}
                  onClick={() => setActiveFacet(facet.id)}
                >
                  {locale === 'ar' ? facet.ar : facet.en}
                </button>
              ))}
            </aside>

            <div className="nlp-viewer__grid">
              <div className="nlp-viewer__stage-shell">
                <div className={`nlp-viewer__stage nlp-viewer__stage--${phase}`}>
                  <img
                    src={fragrance.poster}
                    alt=""
                    aria-hidden="true"
                    className="nlp-viewer__backdrop"
                    loading="eager"
                    decoding="async"
                  />
                  <img
                    src={fragrance.texture}
                    alt=""
                    aria-hidden="true"
                    className="nlp-viewer__texture"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="nlp-viewer__stage-noise" aria-hidden="true" />
                  <div className={`nlp-viewer__bottle-card nlp-viewer__bottle-card--${phase}`}>
                    <div className="nlp-viewer__bottle-aura" />
                    <div className="nlp-viewer__glass-shadow" aria-hidden="true" />
                    <img
                      key={fragrance.id}
                      src={fragrance.image}
                      alt={locale === 'ar' ? `زجاجة ${fragrance.nameAr}` : `${fragrance.name} bottle`}
                      className="nlp-viewer__bottle"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className={`nlp-viewer__caption nlp-viewer__caption--${phase}`}>
                    <span>{fragrance.code}</span>
                    <strong>{locale === 'ar' ? scentCopy.lineAr : scentCopy.line}</strong>
                  </div>
                  <div className="nlp-viewer__mood-strip" aria-hidden="true">
                    {(locale === 'ar' ? fragrance.moodAr : fragrance.mood).map((tag) => (
                      <span key={`${fragrance.id}-${tag}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`nlp-viewer__panel nlp-viewer__panel--${phase}`}>
                <div className="nlp-viewer__identity">
                  <span className="nlp-eyebrow">{fragrance.code}</span>
                  <h3>{locale === 'ar' ? scentCopy.titleAr : scentCopy.title}</h3>
                  <p className="nlp-viewer__line">{locale === 'ar' ? scentCopy.lineAr : scentCopy.line}</p>
                </div>

                <div className="nlp-viewer__detail">
                  <h4>{viewerDetails[activeFacet].title}</h4>
                  <p>{viewerDetails[activeFacet].body}</p>
                </div>

                <div className="nlp-viewer__specs">
                  {viewerDetails[activeFacet].meta.map((item) => (
                    <div key={`${activeFacet}-${item.label}`}>
                      <small>{item.label}</small>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="nlp-viewer__sizes">
                  <p className="nlp-viewer__sizes-title">{locale === 'ar' ? 'اختر الحجم' : 'Choose size'}</p>
                  <div className="nlp-viewer__sizes-grid">
                    {sizes.map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        className={`nlp-size-chip ${selectedSize?.id === size.id ? 'is-active' : ''}`}
                        onClick={() => setActiveSizeId(size.id)}
                      >
                        <span>{locale === 'ar' ? size.labelAr : size.label}</span>
                        <strong>{formatCurrency(size.price, locale)}</strong>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="nlp-viewer__footer">
                  <div className="nlp-viewer__price">
                    <span>{locale === 'ar' ? 'يبدأ من' : 'Starts from'}</span>
                    <strong>{formatCurrency(startingPrice, locale)}</strong>
                  </div>
                  <div className="nlp-viewer__cta-row">
                    <Link className="n-btn n-btn--primary" to={`/products/${fragrance.slug}`}>
                      {locale === 'ar' ? 'اكتشف هذه الرائحة' : 'Explore this scent'}
                    </Link>
                    <a
                      className="n-btn n-btn--ghost"
                      href={`${LANDING_WHATSAPP_URL}?text=${encodeURIComponent(locale === 'ar' ? `أريد تجربة تستر ${scentCopy.titleAr}` : `I want to try ${scentCopy.title} as tester`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {locale === 'ar' ? 'جرّبها كتستر' : 'Try as tester'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

