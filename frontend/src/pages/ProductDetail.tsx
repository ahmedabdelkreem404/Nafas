import { Gift, Heart, Minus, MoonStar, Plus, Shield, Snowflake, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCachedProduct, getCachedProducts } from '../cache/productCache';
import ProductCard from '../components/ProductCard';
import ProductGallery from '../components/ProductGallery';
import ProductReviews from '../components/ProductReviews';
import Reveal from '../components/Reveal';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { useEngagement } from '../hooks/useEngagement';
import type { Product } from '../types/store';
import { HAS_WHATSAPP_SUPPORT, WHATSAPP_SUPPORT_URL } from '../utils/brand';
import { formatCurrency, formatNumber } from '../utils/format';
import { getPrimaryVariant } from '../utils/products';

function getMeterScore(label?: string) {
  const value = String(label || '').toLowerCase();

  if (/طويل جدًا|very long|beast|intense/.test(value)) return 9;
  if (/طويل|long|extended|strong/.test(value)) return 7;
  if (/متوسط|moderate|medium|balanced/.test(value)) return 5;
  if (/خفيف|soft|light|close/.test(value)) return 3;
  return 6;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + (radius * Math.cos(angleInRadians)),
    y: cy + (radius * Math.sin(angleInRadians)),
  };
}

function describeSegment(cx: number, cy: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(cx, cy, outerRadius, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

function ScentWheel({ locale, notes }: { locale: 'ar' | 'en'; notes: string[] }) {
  const grouped = useMemo(() => {
    const top = notes.slice(0, 2);
    const heart = notes.slice(2, 4);
    const base = notes.slice(4).length ? notes.slice(4) : notes.slice(-2);

    return [
      { color: 'rgba(228,192,112,0.58)', label: locale === 'ar' ? 'المقدمة' : 'Top notes', notes: top, radii: [108, 146] as const },
      { color: 'rgba(190,114,34,0.55)', label: locale === 'ar' ? 'القلب' : 'Heart notes', notes: heart, radii: [72, 104] as const },
      { color: 'rgba(166,124,46,0.55)', label: locale === 'ar' ? 'القاعدة' : 'Base notes', notes: base, radii: [40, 68] as const },
    ].filter((ring) => ring.notes.length);
  }, [locale, notes]);

  const [activeNote, setActiveNote] = useState(grouped[0]?.notes[0] || '');

  useEffect(() => {
    setActiveNote(grouped[0]?.notes[0] || '');
  }, [grouped]);

  return (
    <div className="scent-wheel">
      <div className="scent-wheel__visual">
        <svg viewBox="0 0 320 320" className="scent-wheel__svg" role="img" aria-label={locale === 'ar' ? 'عجلة الرائحة' : 'Scent wheel'}>
          {grouped.map((ring) => {
            const step = 360 / ring.notes.length;
            return ring.notes.map((note, index) => {
              const start = (index * step) + 2;
              const end = ((index + 1) * step) - 2;
              return (
                <path
                  key={`${ring.label}-${note}-${index}`}
                  d={describeSegment(160, 160, ring.radii[0], ring.radii[1], start, end)}
                  fill={ring.color}
                  className={`scent-wheel__segment ${activeNote === note ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveNote(note)}
                />
              );
            });
          })}
        </svg>

        <div className="scent-wheel__tooltip">
          <small>{locale === 'ar' ? 'النوتة الحالية' : 'Active note'}</small>
          <strong>{activeNote}</strong>
        </div>
      </div>

      <div className="scent-wheel__legend">
        {grouped.map((ring) => (
          <div key={ring.label} className="scent-wheel__legend-row">
            <small>{ring.label}</small>
            <span>{ring.notes.join(' · ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const { locale } = useLocale();
  const { addToCart, openCart } = useCart();
  const { getProductMetrics, registerView, toggleFavorite } = useEngagement();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [priceFlip, setPriceFlip] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySaved, setNotifySaved] = useState(false);

  useEffect(() => {
    Promise.all([getCachedProduct(slug), getCachedProducts()])
      .then(([nextProduct, nextProducts]) => {
        setProduct(nextProduct);
        setProducts(nextProducts);
        setSelectedVariantId(getPrimaryVariant(nextProduct)?.id || null);
        if (nextProduct) {
          registerView(nextProduct);
        }
      })
      .catch(() => {
        setProduct(null);
        setProducts([]);
      });
  }, [registerView, slug]);

  const related = useMemo(() => products.filter((item) => item.slug !== slug).slice(0, 3), [products, slug]);
  const metrics = product ? getProductMetrics(product) : null;

  const selectedVariant = useMemo(() => {
    if (!product) {
      return null;
    }

    return product.variants.find((variant) => variant.id === selectedVariantId) || getPrimaryVariant(product);
  }, [product, selectedVariantId]);

  const allOutOfStock = (product?.variants || []).length > 0 && (product?.variants || []).every((variant) => !variant.in_stock);
  const activeNotes = locale === 'ar' ? product?.notes_ar || [] : product?.notes_en || [];
  const topNotes = activeNotes.slice(0, 2);
  const heartNotes = activeNotes.slice(2, 4);
  const baseNotes = activeNotes.slice(4).length ? activeNotes.slice(4) : activeNotes.slice(-2);
  const moodTags = locale === 'ar' ? product?.tags_ar || [] : product?.tags_en || [];
  const longevityScore = getMeterScore(locale === 'ar' ? product?.longevity_label_ar || product?.longevity_label : product?.longevity_label_en || product?.longevity_label);
  const projectionScore = getMeterScore(locale === 'ar' ? product?.projection_label_ar || product?.projection_label : product?.projection_label_en || product?.projection_label);

  useEffect(() => {
    if (!selectedVariantId) {
      return undefined;
    }

    setPriceFlip(true);
    const timer = window.setTimeout(() => setPriceFlip(false), 350);
    return () => window.clearTimeout(timer);
  }, [selectedVariantId]);

  if (!product || !selectedVariant) {
    return (
      <div className="n-container n-section">
        <div className="empty-panel">{locale === 'ar' ? 'تعذّر تحميل العطر.' : 'Unable to load this fragrance.'}</div>
      </div>
    );
  }

  const saveStockNotify = () => {
    if (!notifyEmail.trim()) {
      return;
    }

    const key = `nafas_stock_notify_${product.slug}`;
    const next = Array.from(new Set([
      ...(JSON.parse(localStorage.getItem(key) || '[]') as string[]),
      notifyEmail.trim(),
    ]));

    localStorage.setItem(key, JSON.stringify(next));
    setNotifySaved(true);
    setNotifyEmail('');
  };

  return (
    <div className="page-product editorial-product" data-accent={product.accent || 'gold'}>
      <div className="n-container product-detail product-detail--top">
        <div className="product-detail__media">
          <ProductGallery product={product} />
        </div>

        <div className="product-detail__story">
          <Reveal className="identity-card">
            <small>{locale === 'ar' ? `${product.category_ar || ''} · ${product.gender_ar || ''}` : `${product.category_en || ''} · ${product.gender_en || ''}`}</small>
            <h1>{locale === 'ar' ? product.name_ar : product.name_en}</h1>
            <p className="identity-card__sub">{locale === 'ar' ? product.name_en : product.name_ar}</p>
            <i />
            <p className="identity-card__tag">{locale === 'ar' ? product.personality_ar : product.personality_en}</p>

            {moodTags.length ? (
              <div className="mood-tags">
                {moodTags.map((tag) => (
                  <Link key={tag} to={`/shop?filter=${encodeURIComponent(tag)}`} className="mood-tag">
                    {tag}
                  </Link>
                ))}
              </div>
            ) : null}

            <button
              type="button"
              className={`favorite-inline ${metrics?.isFavorited ? 'is-active' : ''}`}
              onClick={() => toggleFavorite(product)}
            >
              <Heart size={16} />
              <span>{locale === 'ar' ? 'المفضلة' : 'Favorite'}</span>
            </button>
          </Reveal>

          <Reveal className="stats-bar" delay={80}>
            <span>👁 {formatNumber(metrics?.views || 0, locale)} {locale === 'ar' ? 'مشاهدة' : 'views'}</span>
            <span>❤ {formatNumber(metrics?.favorites || 0, locale)}</span>
            <span>⭐ {(metrics?.ratingAverage || 0).toFixed(1)} ({formatNumber(metrics?.reviewCount || 0, locale)} {locale === 'ar' ? 'تقييم' : 'reviews'})</span>
          </Reveal>

          <Reveal className={`story-card ${expanded ? 'is-open' : ''}`} delay={120}>
            <h2>{locale === 'ar' ? 'القصة' : 'Story'}</h2>
            <div className="story-card__text">
              <p>{locale === 'ar' ? product.story : product.story_en}</p>
            </div>
            <button type="button" className="text-button" onClick={() => setExpanded((current) => !current)}>
              {expanded
                ? (locale === 'ar' ? 'إغلاق القصة' : 'Collapse story')
                : (locale === 'ar' ? 'اقرأ القصة كاملة' : 'Read the full story')}
            </button>
          </Reveal>

          <Reveal className="variant-card" delay={160}>
            <h2>{locale === 'ar' ? 'الأحجام' : 'Variants'}</h2>
            <div className="variant-grid">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={`variant-pill ${selectedVariantId === variant.id ? 'is-active' : ''} ${!variant.in_stock ? 'is-out' : ''}`}
                  onClick={() => setSelectedVariantId(variant.id)}
                  disabled={!variant.in_stock}
                >
                  <span>{variant.label}</span>
                  <small>{formatCurrency(variant.retail_price, locale)}</small>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal className="purchase-card" delay={200}>
            <div className="price-qty">
              <strong className={`price-flip ${priceFlip ? 'is-flipping' : ''}`}>{formatCurrency(selectedVariant.retail_price, locale)}</strong>

              <div className="qty-pill">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                  <Minus size={16} />
                </button>
                <span>{formatNumber(quantity, locale)}</span>
                <button type="button" onClick={() => setQuantity((current) => current + 1)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {allOutOfStock ? (
              <>
                <div className="stock-banner">{locale === 'ar' ? 'سيُتاح قريبًا' : 'Available again soon'}</div>
                <button type="button" className="n-btn n-btn--ghost n-btn--full" onClick={() => setNotifyOpen((current) => !current)}>
                  {locale === 'ar' ? 'أبلغني عند التوفر' : 'Notify me when available'}
                </button>
                {notifyOpen ? (
                  <div className="notify-stock">
                    <input
                      value={notifyEmail}
                      onChange={(event) => setNotifyEmail(event.target.value)}
                      type="email"
                      placeholder={locale === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                    />
                    <button type="button" className="n-btn n-btn--primary" onClick={saveStockNotify}>
                      {locale === 'ar' ? 'حفظ التنبيه' : 'Save alert'}
                    </button>
                    {notifySaved ? <small>{locale === 'ar' ? 'تم حفظ طلب التنبيه محليًا.' : 'Alert saved locally.'}</small> : null}
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="n-btn n-btn--primary n-btn--full"
                  onClick={async () => {
                    await addToCart(product, selectedVariant, quantity);
                    openCart();
                  }}
                >
                  {locale === 'ar' ? 'أضف إلى السلة' : 'Add to cart'}
                </button>

                {HAS_WHATSAPP_SUPPORT ? (
                  <a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noreferrer" className="n-btn n-btn--ghost n-btn--full">
                    {locale === 'ar' ? 'استفسر عبر واتساب' : 'Ask on WhatsApp'}
                  </a>
                ) : null}
              </>
            )}

            <div className="trust-line">
              <Shield size={16} />
              <span>{locale === 'ar' ? 'صياغة موثوقة وتجهيز هادئ للطلب' : 'Trusted composition and calm order handling'}</span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="n-container n-section product-sensory">
        <Reveal className="notes-profile product-sensory__wheel" delay={240}>
          <div className="notes-profile__wheel">
            <ScentWheel locale={locale} notes={activeNotes} />
          </div>
          <div className="notes-profile__cards">
            <article><small>TOP</small><p>{topNotes.join(' · ')}</p></article>
            <article><small>HEART</small><p>{heartNotes.join(' · ')}</p></article>
            <article><small>BASE</small><p>{baseNotes.join(' · ')}</p></article>
          </div>
        </Reveal>

        <div className="product-sensory__aside">
          <Reveal className="meter-card" delay={280}>
            <div className="meter-row">
              <span>{locale === 'ar' ? 'الثبات' : 'Longevity'}</span>
              <div className="meter-bar"><b style={{ ['--bar-scale' as string]: String(longevityScore / 10) }} /></div>
              <strong>{longevityScore}/10</strong>
            </div>
            <div className="meter-row">
              <span>{locale === 'ar' ? 'الفوحان' : 'Projection'}</span>
              <div className="meter-bar"><b style={{ ['--bar-scale' as string]: String(projectionScore / 10) }} /></div>
              <strong>{projectionScore}/10</strong>
            </div>
          </Reveal>

          <Reveal className="who-card" delay={320}>
            <small>{locale === 'ar' ? 'مناسب لـ:' : 'Who is this for?'}</small>
            <div className="who-tags">
              <span className="who-tag"><Users size={14} /> {locale === 'ar' ? product.gender_ar || 'للجميع' : product.gender_en || 'Everyone'}</span>
              <span className="who-tag"><MoonStar size={14} /> {locale === 'ar' ? product.mood_ar || 'المساء' : product.mood_en || 'Evening mood'}</span>
              <span className="who-tag"><Snowflake size={14} /> {locale === 'ar' ? product.season_ar || 'الشتاء' : product.season_en || 'Cool weather'}</span>
              <span className="who-tag"><Gift size={14} /> {locale === 'ar' ? 'هدية مثالية' : 'Ideal gift'}</span>
            </div>
          </Reveal>
        </div>
      </div>

      {!allOutOfStock ? (
        <div className="n-container mobile-buybar">
          <strong>{formatCurrency(selectedVariant.retail_price, locale)}</strong>
          <button
            type="button"
            className="n-btn n-btn--primary"
            onClick={async () => {
              await addToCart(product, selectedVariant, quantity);
              openCart();
            }}
          >
            {locale === 'ar' ? 'أضف للسلة' : 'Add to cart'}
          </button>
        </div>
      ) : null}

      <div className="n-container n-section product-reviews-section">
        <ProductReviews productSlug={product.slug} />
      </div>

      <Reveal className="n-container n-section">
        <div className="section-head">
          <div>
            <small>{locale === 'ar' ? 'روائح قريبة' : 'Kindred scents'}</small>
            <h2>{locale === 'ar' ? 'امتدادات لنفس المزاج' : 'Extensions of the same mood'}</h2>
          </div>
          <Link to="/shop" className="inline-link">{locale === 'ar' ? 'العودة للمتجر' : 'Back to shop'}</Link>
        </div>

        <div className="product-grid product-grid--three nh__cards">
          {related.map((item) => <ProductCard key={item.slug} product={item} />)}
        </div>
      </Reveal>
    </div>
  );
}
