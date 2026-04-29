import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import '../styles/apple-nafas-home.css';

const WHATSAPP_URL = 'https://wa.me/200000000000';

type ScentId = 'sharara' | 'ghayma' | 'dafwa' | 'zell';

type Scent = {
  id: ScentId;
  name: string;
  nameAr: string;
  line: string;
  mood: string;
  accent: string;
  aura: string;
  bestFor: string;
  notes: string;
  bottle: string;
  sizes: string;
  gift: string;
  usage: string;
  image: string;
};

type Highlight = {
  id: string;
  title: string;
  eyebrow: string;
  copy: string;
  image: string;
  tone: string;
};

function BottleVisual({ scent, className = '' }: { scent: Scent; className?: string }) {
  return (
    <div
      className={`anh-bottle-visual anh-bottle-visual--${scent.id} ${className}`}
      style={{ '--accent': scent.accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className="anh-bottle-visual__cap" />
      <span className="anh-bottle-visual__neck" />
      <span className="anh-bottle-visual__body">
        <span className="anh-bottle-visual__shine" />
        <span className="anh-bottle-visual__label">
          <small>Nafas</small>
          <strong>{scent.name}</strong>
        </span>
      </span>
      <span className="anh-bottle-visual__shadow" />
    </div>
  );
}

const scents: Scent[] = [
  {
    id: 'sharara',
    name: 'Sharara',
    nameAr: 'شرارة',
    line: 'أول رشة تلفت، وأثر يفضل.',
    mood: 'Fresh / Spicy / Musky',
    accent: '#b86d3b',
    aura: 'black + copper / amber',
    bestFor: 'حضور واضح من أول لحظة.',
    notes: 'برغموت، فلفل وردي، زعفران، مسك داكن.',
    bottle: 'أسود مطفي مع دفء نحاسي.',
    sizes: 'Tester، سفر، وزجاجة كاملة.',
    gift: 'اختيار قوي لشخص يحب الروائح اللافتة.',
    usage: 'نهار جريء أو بداية مساء.',
    image: '/assets/products/sharara-visual.webp',
  },
  {
    id: 'ghayma',
    name: 'Ghayma',
    nameAr: 'غيمة',
    line: 'نعومة تتعلق في الذاكرة.',
    mood: 'Soft / Fruity / Floral / Musky',
    accent: '#c99788',
    aura: 'off-white + rose gold',
    bestFor: 'هدية هادئة أو يوم ناعم.',
    notes: 'كمثرى، حمضيات ناعمة، زهور بيضاء، مسك نظيف.',
    bottle: 'أوف وايت مع لمسة روز جولد.',
    sizes: 'ابدأ بتستر ثم اختار الحجم المناسب.',
    gift: 'الأقرب للهدايا الهادئة والأنيقة.',
    usage: 'نهار، مكتب، ومساء خفيف.',
    image: '/assets/products/ghayma-visual.webp',
  },
  {
    id: 'dafwa',
    name: 'Dafwa',
    nameAr: 'دفوة',
    line: 'قهوة دافية… وحضور مايتنسيش.',
    mood: 'Warm / Coffee / Sweet / Oriental',
    accent: '#b88a48',
    aura: 'mocha + gold',
    bestFor: 'مساء دافئ ولحظات خاصة.',
    notes: 'قهوة محمصة، كراميل داكن، فانيلا، عنبر.',
    bottle: 'موكا عميق مع تفاصيل ذهبية.',
    sizes: 'اختيارات تستر وزجاجات للروتين اليومي.',
    gift: 'لمن يحب الدفء والحلاوة المتزنة.',
    usage: 'المساء، الشتاء، واللحظات القريبة.',
    image: '/assets/products/dafwa-visual.webp',
  },
  {
    id: 'zell',
    name: 'Zell',
    nameAr: 'ظلّ',
    line: 'هادئ… لكنه بيسيب أثر.',
    mood: 'Woody / Dark / Musky',
    accent: '#8e969b',
    aura: 'charcoal + silver',
    bestFor: 'عمق هادئ بدون ضوضاء.',
    notes: 'بهار جاف، خشب كشميري، سوسن هادئ، مسك.',
    bottle: 'فحمي مع لمسة فضية مضبوطة.',
    sizes: 'تستر أولاً ثم الحجم الذي يشبهك.',
    gift: 'اختيار راق لمن يحب الغموض الهادئ.',
    usage: 'مساء هادئ أو أناقة يومية.',
    image: '/assets/products/zell-visual.webp',
  },
];

const highlights: Highlight[] = [
  {
    id: 'sharara',
    title: 'شرارة',
    eyebrow: 'Fresh spice',
    copy: 'رشة أولى واضحة، دفء نحاسي، وأثر مسكي داكن.',
    image: scents[0].image,
    tone: 'copper',
  },
  {
    id: 'ghayma',
    title: 'غيمة',
    eyebrow: 'Soft memory',
    copy: 'نعومة فاكهية وزهور بيضاء، خفيفة لكنها لا تمر مرور الكرام.',
    image: scents[1].image,
    tone: 'rose',
  },
  {
    id: 'dafwa',
    title: 'دفوة',
    eyebrow: 'Coffee warmth',
    copy: 'قهوة، حلاوة، وعنبر دافئ لمساء له إيقاع أبطأ.',
    image: scents[2].image,
    tone: 'mocha',
  },
  {
    id: 'zell',
    title: 'ظلّ',
    eyebrow: 'Quiet depth',
    copy: 'خشب داكن ومسك قريب. هادئ، مركز، واثق.',
    image: scents[3].image,
    tone: 'silver',
  },
  {
    id: 'discovery',
    title: 'Discovery Mini',
    eyebrow: 'Try first',
    copy: 'جرّب الأربع حالات مزاجية قبل ما تختار زجاجتك.',
    image: '/assets/stock/optimized/hero-perfume-fabric.webp',
    tone: 'cream',
  },
  {
    id: 'gift',
    title: 'Gift Set',
    eyebrow: 'Ready to give',
    copy: 'تقديم هادئ وراقي لرائحة تشبه صاحبها.',
    image: '/assets/stock/optimized/fragrance-spray-moment.webp',
    tone: 'gift',
  },
  {
    id: 'quality',
    title: 'Quality Ritual',
    eyebrow: 'Checked in batches',
    copy: 'مراجعة للصفاء، الرش، والتقديم قبل وصول التجربة لك.',
    image: '/assets/stock/optimized/product-perfume-closeup.webp',
    tone: 'quality',
  },
];

const viewerTabs = [
  { id: 'scent', label: 'الرائحة' },
  { id: 'notes', label: 'النوتات' },
  { id: 'bottle', label: 'العبوة' },
  { id: 'sizes', label: 'المقاسات' },
  { id: 'gift', label: 'الهدية' },
  { id: 'usage', label: 'الاستخدام' },
] as const;

type ViewerTab = typeof viewerTabs[number]['id'];

const chapterVisuals = [
  '/assets/stock/optimized/fragrance-spray-moment.webp',
  '/assets/stock/optimized/product-perfume-closeup.webp',
  '/assets/stock/optimized/hero-perfume-dark.webp',
];

function clampIndex(index: number, length: number) {
  return (index + length) % length;
}

function getViewerCopy(scent: Scent, tab: ViewerTab) {
  const copy: Record<ViewerTab, string> = {
    scent: `${scent.line} ${scent.mood}.`,
    notes: scent.notes,
    bottle: `${scent.bottle} الاتجاه البصري: ${scent.aura}.`,
    sizes: scent.sizes,
    gift: scent.gift,
    usage: scent.usage,
  };

  return copy[tab];
}

export default function Home() {
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedScent, setSelectedScent] = useState<ScentId>('sharara');
  const [viewerTab, setViewerTab] = useState<ViewerTab>('scent');
  const [choiceMood, setChoiceMood] = useState<ScentId | 'discovery'>('discovery');
  const touchStartX = useRef<number | null>(null);
  const activeScent = useMemo(
    () => scents.find((scent) => scent.id === selectedScent) ?? scents[0],
    [selectedScent],
  );
  const recommendedScent = choiceMood === 'discovery'
    ? 'Discovery Mini'
    : scents.find((scent) => scent.id === choiceMood)?.nameAr;

  useEffect(() => {
    document.body.classList.add('apple-nafas-home-active');
    return () => document.body.classList.remove('apple-nafas-home-active');
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveHighlight((current) => clampIndex(current + 1, highlights.length));
    }, 5200);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const goToHighlight = (index: number) => {
    setActiveHighlight(clampIndex(index, highlights.length));
  };

  const handleHighlightsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToHighlight(activeHighlight + 1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToHighlight(activeHighlight - 1);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 42) {
      return;
    }

    goToHighlight(activeHighlight + (delta < 0 ? 1 : -1));
  };

  return (
    <div className="apple-nafas-page" dir="rtl">
      <section className="anh-ribbon" aria-label="إعلان نفَس">
        <p>اكتشف مجموعة نفَس الأولى — أربع روائح، أربع حالات مزاجية، وتجربة تستر قبل الشراء.</p>
        <a href="#tester-path">اطلب Discovery Mini</a>
      </section>

      <section className="anh-section anh-hero" aria-labelledby="hero-title" data-proof="hero">
        <div className="anh-container anh-hero__inner">
          <div className="anh-hero__copy">
            <p className="anh-kicker">Nafas eau de parfum</p>
            <h1 id="hero-title">نفَس.</h1>
            <p className="anh-hero__sub">أول رشة تفضل.</p>
            <p className="anh-hero__text">عطور محلية Premium بأربع حالات مزاجية: فريش، ناعم، دافئ، وغامض.</p>
            <div className="anh-actions">
              <a className="anh-button anh-button--primary" href="#choose">اكتشف المجموعة</a>
              <a className="anh-button anh-button--secondary" href="#tester-path">اطلب تستر</a>
            </div>
          </div>

          <div className="anh-hero__stage" aria-label="زجاجات عطور نفَس الأربع">
            <div className="anh-hero__glow" />
            {scents.map((scent, index) => (
              <BottleVisual
                key={scent.id}
                scent={scent}
                className={`anh-hero__bottle anh-hero__bottle--${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="anh-section anh-highlights" aria-labelledby="highlights-title" data-proof="highlights">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">Get the highlights</p>
            <h2 id="highlights-title">اكتشف النفَس من أول رشة.</h2>
          </div>

          <div
            className="anh-highlight-shell"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Highlights carousel"
            onKeyDown={handleHighlightsKeyDown}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="anh-highlight-track"
              style={{ transform: `translateX(${-activeHighlight * 84}%)` }}
            >
              {highlights.map((item, index) => (
                <article
                  key={item.id}
                  className={`anh-highlight-card anh-highlight-card--${item.tone} ${index === activeHighlight ? 'is-active' : ''}`}
                  aria-hidden={index !== activeHighlight}
                >
                  <div className="anh-highlight-card__copy">
                    <span>{item.eyebrow}</span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                  {scents.some((scent) => scent.id === item.id) ? (
                    <BottleVisual scent={scents.find((scent) => scent.id === item.id) ?? scents[0]} className="anh-highlight-bottle" />
                  ) : (
                    <img src={item.image} alt="" loading="lazy" decoding="async" />
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className="anh-carousel-dock" aria-label="Carousel controls">
            <button
              type="button"
              className="anh-dock-button"
              onClick={() => setIsPlaying((current) => !current)}
              aria-label={isPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل العرض التلقائي'}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <div className="anh-dots" role="tablist" aria-label="Highlight slides">
              {highlights.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={index === activeHighlight ? 'is-active' : ''}
                  onClick={() => goToHighlight(index)}
                  aria-label={`اعرض ${item.title}`}
                  aria-selected={index === activeHighlight}
                  role="tab"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="anh-section anh-love" aria-labelledby="love-title">
        <div className="anh-container anh-love__inner">
          <div>
            <p className="anh-kicker">Brand moment</p>
            <h2 id="love-title">حب من أول رشة.</h2>
            <p>أربع روائح، أربع حالات مزاجية، وتجربة تستر تخليك تختار بثقة.</p>
          </div>
          <div className="anh-love__orbit" aria-hidden="true">
            {scents.map((scent) => (
              <BottleVisual key={scent.id} scent={scent} />
            ))}
          </div>
        </div>
      </section>

      <section className="anh-section anh-viewer" aria-labelledby="viewer-title" data-proof="viewer">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">Product viewer</p>
            <h2 id="viewer-title">خذ نظرة أقرب.</h2>
          </div>

          <div className="anh-viewer-panel" style={{ '--accent': activeScent.accent } as CSSProperties}>
            <div className="anh-viewer-panel__controls" aria-label="اختيار الرائحة">
              {scents.map((scent) => (
                <button
                  key={scent.id}
                  type="button"
                  className={selectedScent === scent.id ? 'is-active' : ''}
                  onClick={() => {
                    setSelectedScent(scent.id);
                    setViewerTab('scent');
                  }}
                >
                  {scent.nameAr}
                </button>
              ))}
            </div>

            <div className="anh-viewer-panel__visual">
              <div className="anh-viewer-panel__halo" />
              <BottleVisual key={activeScent.id} scent={activeScent} />
            </div>

            <div className="anh-viewer-panel__copy" aria-live="polite">
              <span>{activeScent.name}</span>
              <h3>{activeScent.nameAr}</h3>
              <p>{getViewerCopy(activeScent, viewerTab)}</p>
              <div className="anh-viewer-panel__tabs" aria-label="تفاصيل العطر">
                {viewerTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={viewerTab === tab.id ? 'is-active' : ''}
                    onClick={() => setViewerTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <a className="anh-button anh-button--primary" href="#tester-path">ابدأ بتستر</a>
            </div>
          </div>
        </div>
      </section>

      <section className="anh-section anh-chapters" aria-labelledby="chapters-title">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">Story chapters</p>
            <h2 id="chapters-title">رحلة الرشة.</h2>
          </div>
          <div className="anh-chapter-grid">
            {[
              ['الافتتاحية', 'أول لمعة من الرائحة تفتح المزاج وتحدد الاتجاه.', chapterVisuals[0]],
              ['القلب', 'بعد دقائق، الشخصية تظهر: فريش، ناعمة، دافئة، أو غامضة.', chapterVisuals[1]],
              ['الأثر', 'الجزء الذي يبقى قريباً من الجلد ويعود في الذاكرة.', chapterVisuals[2]],
            ].map(([title, copy, image], index) => (
              <article key={title} className="anh-chapter">
                <img src={image} alt="" loading="lazy" decoding="async" />
                <div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="anh-section anh-senses" aria-labelledby="senses-title">
        <div className="anh-container">
          <div className="anh-senses__stage">
            <div className="anh-senses__visual" aria-hidden="true">
              <img src="/assets/stock/optimized/shop-perfume-luxury.webp" alt="" loading="lazy" decoding="async" />
              <span className="anh-senses__mist anh-senses__mist--one" />
              <span className="anh-senses__mist anh-senses__mist--two" />
            </div>
            <div className="anh-senses__copy">
              <p className="anh-kicker">A feast for the senses</p>
              <h2 id="senses-title">وليمة للحواس.</h2>
              <article>
                <strong>الافتتاحية / Opening</strong>
                <p>نفحة أولى تلمع وتدعو للاقترب.</p>
              </article>
              <article>
                <strong>القلب / Heart</strong>
                <p>المود الحقيقي يستقر بهدوء على الجلد.</p>
              </article>
              <article>
                <strong>القاعدة / Base</strong>
                <p>مِسك، خشب، عنبر، ولمسة أخيرة تترك أثر.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="anh-section anh-flow" id="tester-path" aria-labelledby="flow-title" data-proof="tester">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">From tester to bottle</p>
            <h2 id="flow-title">ابدأ بتستر… واختار بثقة.</h2>
          </div>
          <div className="anh-flow__panel">
            <div className="anh-flow__steps">
              {['اطلب تستر', 'جربه يوم كامل', 'اختار زجاجتك', 'ارجع لنفس الريحة في أي وقت'].map((step, index) => (
                <article key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step}</h3>
                </article>
              ))}
            </div>
            <div className="anh-flow__actions">
              <a className="anh-button anh-button--primary" href={`${WHATSAPP_URL}?text=${encodeURIComponent('أريد بناء Discovery Set من Nafas')}`} target="_blank" rel="noreferrer">ابنِ Discovery Set</a>
              <a className="anh-button anh-button--secondary" href={`${WHATSAPP_URL}?text=${encodeURIComponent('أريد الطلب عبر واتساب من Nafas')}`} target="_blank" rel="noreferrer">اطلب عبر واتساب</a>
              <a className="anh-button anh-button--secondary" href="#choose">شاهد الأحجام</a>
            </div>
          </div>
        </div>
      </section>

      <section className="anh-ritual" aria-labelledby="ritual-title">
        <img src="/assets/stock/optimized/hero-perfume-dark.webp" alt="" aria-hidden="true" />
        <div>
          <p className="anh-kicker">Nafas ritual</p>
          <h2 id="ritual-title">رشة واحدة تغير اللحظة.</h2>
          <p>زجاجة، ضوء، وطبقة هادئة من الرائحة تجعل اللحظة أوضح.</p>
        </div>
      </section>

      <section className="anh-section anh-together" aria-labelledby="together-title">
        <div className="anh-container anh-together__grid">
          <div>
            <p className="anh-kicker">Better together</p>
            <h2 id="together-title">أفضل كمجموعة.</h2>
            <p>Discovery Mini للتجربة، زجاجة كاملة عندما تستقر على مودك، وGift Set لتقديم هادئ.</p>
            <a className="anh-button anh-button--primary" href="#tester-path">ابدأ بالمجموعة</a>
          </div>
          <div className="anh-together__visual" aria-hidden="true">
            <img src="/assets/stock/optimized/hero-perfume-fabric.webp" alt="" loading="lazy" decoding="async" />
            <BottleVisual scent={scents[1]} />
          </div>
        </div>
      </section>

      <section className="anh-section anh-selector" aria-labelledby="selector-title">
        <div className="anh-container">
          <div className="anh-selector__panel">
            <div>
              <p className="anh-kicker">Choosing made easy</p>
              <h2 id="selector-title">اختيار العطر أسهل.</h2>
              <p>اختار المود الأقرب لك، أو ابدأ بـ Discovery Mini لو لسه محتار.</p>
            </div>
            <div className="anh-selector__options" aria-label="اختيار المود">
              {[
                ['sharara', 'فريش ولافت'],
                ['ghayma', 'ناعم وهادي'],
                ['dafwa', 'دافئ وحلو'],
                ['zell', 'غامض وخشبي'],
                ['discovery', 'لسه محتار'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={choiceMood === id ? 'is-active' : ''}
                  onClick={() => setChoiceMood(id as ScentId | 'discovery')}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="anh-selector__result" aria-live="polite">اقتراح نفَس: <strong>{recommendedScent}</strong></p>
          </div>
        </div>
      </section>

      <section className="anh-section anh-why" aria-labelledby="why-title">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">No compromises</p>
            <h2 id="why-title">بدون تنازلات في التجربة.</h2>
          </div>
          <div className="anh-why__grid">
            {['Tester-first experience', 'Clear scent personalities', 'Premium presentation', 'Batch quality ritual', 'Easy ordering', 'Sizes for every need'].map((item) => (
              <article key={item}>
                <h3>{item}</h3>
                <p>تفصيلة واضحة تساعدك تختار بثقة وبدون زحمة.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="anh-section anh-compare" id="choose" aria-labelledby="choose-title">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">Help me choose</p>
            <h2 id="choose-title">اختار نفَسك.</h2>
          </div>
          <div className="anh-compare__grid">
            {scents.map((scent) => (
              <article key={scent.id} className="anh-compare-card" style={{ '--accent': scent.accent } as CSSProperties}>
                <div className="anh-compare-card__visual" aria-label={`زجاجة عطر ${scent.nameAr}`} role="img">
                  <BottleVisual scent={scent} />
                </div>
                <span>{scent.name}</span>
                <h3>{scent.nameAr}</h3>
                <p>{scent.line}</p>
                <dl>
                  <div>
                    <dt>Mood</dt>
                    <dd>{scent.mood}</dd>
                  </div>
                  <div>
                    <dt>Best for</dt>
                    <dd>{scent.bestFor}</dd>
                  </div>
                </dl>
                <Link className="anh-button anh-button--secondary" to={`/products/${scent.id}`}>استكشف</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="anh-section anh-explore" aria-labelledby="explore-title">
        <div className="anh-container">
          <div className="anh-section-head">
            <p className="anh-kicker">Keep exploring</p>
            <h2 id="explore-title">كمّل الرحلة.</h2>
          </div>
          <div className="anh-explore__grid">
            {[
              ['/shop', 'Shop', 'تسوق المجموعة الأساسية.'],
              ['/faq', 'FAQ', 'إجابات سريعة قبل الاختيار.'],
              ['/about', 'About Nafas', 'القصة والفلسفة خلف نفَس.'],
              [WHATSAPP_URL, 'WhatsApp', 'اسألنا أو اطلب مباشرة.'],
            ].map(([href, title, copy]) => {
              const external = href.startsWith('http');
              const className = 'anh-explore-card';
              const content = (
                <>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </>
              );

              return external ? (
                <a key={href} className={className} href={href} target="_blank" rel="noreferrer">{content}</a>
              ) : (
                <Link key={href} className={className} to={href}>{content}</Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="anh-final" aria-labelledby="final-title">
        <h2 id="final-title">نفَس قريب منك.</h2>
        <p>ابدأ بتستر صغير، ودع الرائحة تختار سرعتها.</p>
        <a className="anh-button anh-button--primary" href="#tester-path">اطلب Discovery Mini</a>
      </section>
    </div>
  );
}
