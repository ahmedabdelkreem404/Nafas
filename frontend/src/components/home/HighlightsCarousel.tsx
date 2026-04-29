import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LandingHighlight } from '../../content/nafasLanding';
import { useLocale } from '../../context/LocaleContext';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type HighlightsCarouselProps = {
  items: LandingHighlight[];
};

const AUTOPLAY_MS = 5000;

export default function HighlightsCarousel({ items }: HighlightsCarouselProps) {
  const { locale } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!reducedMotion);
  const [progress, setProgress] = useState(0);
  const [hasCompletedCycle, setHasCompletedCycle] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    setIsPlaying(!reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const update = () => setViewportWidth(node.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || reducedMotion || items.length <= 1) {
      setProgress(0);
      return undefined;
    }

    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const nextProgress = Math.min(1, elapsed / AUTOPLAY_MS);
      setProgress(nextProgress);

      if (elapsed >= AUTOPLAY_MS) {
        const nextIndex = activeIndex + 1;

        if (nextIndex >= items.length) {
          setActiveIndex(0);
          setHasCompletedCycle(true);
          setIsPlaying(false);
          setProgress(0);
          return;
        }

        setActiveIndex(nextIndex);
        setProgress(0);
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, isPlaying, items.length, reducedMotion]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setProgress(0);
    setHasCompletedCycle(false);
  }, []);

  const stepBy = useCallback((delta: number) => {
    setActiveIndex((currentIndex) => (currentIndex + delta + items.length) % items.length);
    setProgress(0);
    setHasCompletedCycle(false);
  }, [items.length]);

  const isCompact = viewportWidth > 0 && viewportWidth < 768;
  const slideWidth = viewportWidth > 0
    ? (isCompact ? Math.min(viewportWidth * 0.88, 356) : Math.min(viewportWidth * 0.86, 1240))
    : 1240;
  const slideGap = isCompact ? 14 : 28;
  const trackOffset = viewportWidth > 0
    ? ((viewportWidth - slideWidth) / 2) - (activeIndex * (slideWidth + slideGap))
    : 0;

  const announceText = locale === 'ar'
    ? `الشريحة الحالية ${activeIndex + 1} من ${items.length}: ${items[activeIndex]?.titleAr}`
    : `Current slide ${activeIndex + 1} of ${items.length}: ${items[activeIndex]?.title}`;

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) {
      return;
    }

    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 40) {
      return;
    }

    stepBy(delta < 0 ? 1 : -1);
  };

  const onGalleryKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepBy(locale === 'ar' ? -1 : 1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepBy(locale === 'ar' ? 1 : -1);
    }

    if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      goTo(items.length - 1);
    }
  };

  const replay = () => {
    goTo(0);
    if (!reducedMotion) {
      setIsPlaying(true);
    }
  };

  return (
    <section className="nlp-section nlp-section--highlights" aria-labelledby="highlights-title">
      <div className="n-container">
        <div className="nlp-section-head nlp-section-head--wide">
          <div>
            <p className="nlp-eyebrow">{locale === 'ar' ? 'من أول رشة' : 'From the first spray'}</p>
            <h2 id="highlights-title">{locale === 'ar' ? 'اكتشف النفَس من أول رشة.' : 'Get the highlights.'}</h2>
          </div>
        </div>

        <div className="sr-only" aria-live="polite">{announceText}</div>

        <div className="nlp-highlights">
          <div
            ref={viewportRef}
            className="nlp-highlights__viewport"
            tabIndex={0}
            onKeyDown={onGalleryKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-label={locale === 'ar' ? 'معرض مميزات Nafas' : 'Nafas highlights gallery'}
          >
            <div
              className="nlp-highlights__track"
              style={{
                transform: `translate3d(${trackOffset}px, 0, 0)`,
                ['--nlp-slide-width' as string]: `${slideWidth}px`,
                ['--nlp-slide-gap' as string]: `${slideGap}px`,
              }}
            >
              {items.map((item, index) => (
                <article
                  key={item.id}
                  id={`highlight-slide-${item.id}`}
                  className={`nlp-highlight-card nlp-highlight-card--${item.id} ${index === activeIndex ? 'is-active' : ''}`}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  aria-hidden={index !== activeIndex}
                  aria-roledescription="slide"
                  aria-label={
                    locale === 'ar'
                      ? `${item.titleAr} — ${index + 1} من ${items.length}`
                      : `${item.title} — ${index + 1} of ${items.length}`
                  }
                >
                  <div className="nlp-highlight-card__body">
                    <span className="nlp-highlight-card__index">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{locale === 'ar' ? item.titleAr : item.title}</h3>
                    <p>{locale === 'ar' ? item.captionAr : item.caption}</p>
                  </div>

                  <div className="nlp-highlight-card__media">
                    <div className="nlp-highlight-card__atmosphere" aria-hidden="true">
                      <span className="nlp-highlight-card__glow nlp-highlight-card__glow--one" />
                      <span className="nlp-highlight-card__glow nlp-highlight-card__glow--two" />
                    </div>
                    <div className="nlp-highlight-card__stage">
                      <img
                        src={item.image}
                        alt={locale === 'ar' ? item.titleAr : item.title}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="nlp-highlight-card__visual"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="nlp-highlights__dock" onKeyDown={onGalleryKeyDown}>
            <button
              type="button"
              className="nlp-icon-button"
              onClick={() => stepBy(locale === 'ar' ? 1 : -1)}
              aria-label={locale === 'ar' ? 'الشريحة السابقة' : 'Previous highlight'}
            >
              {locale === 'ar' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div
              className="nlp-highlights__dots"
              role="tablist"
              aria-label={locale === 'ar' ? 'التنقل بين المميزات' : 'Highlights navigation'}
            >
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  className={`nlp-dot ${index === activeIndex ? 'is-active' : ''}`}
                  aria-selected={index === activeIndex}
                  aria-controls={`highlight-slide-${item.id}`}
                  aria-label={locale === 'ar' ? `عرض ${item.titleAr}` : `Show ${item.title}`}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={() => goTo(index)}
                >
                  {index === activeIndex ? <span style={{ transform: `scaleX(${progress || 0.08})` }} /> : null}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="nlp-icon-button"
              onClick={() => {
                if (hasCompletedCycle) {
                  replay();
                  return;
                }

                if (!reducedMotion) {
                  setIsPlaying((value) => !value);
                }
              }}
              aria-label={
                hasCompletedCycle
                  ? (locale === 'ar' ? 'إعادة العرض' : 'Replay highlights')
                  : isPlaying
                    ? (locale === 'ar' ? 'إيقاف التشغيل التلقائي' : 'Pause autoplay')
                    : (locale === 'ar' ? 'تشغيل التشغيل التلقائي' : 'Play autoplay')
              }
              disabled={reducedMotion && !hasCompletedCycle}
            >
              {hasCompletedCycle ? <RotateCcw size={16} /> : isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              type="button"
              className="nlp-icon-button"
              onClick={() => stepBy(locale === 'ar' ? -1 : 1)}
              aria-label={locale === 'ar' ? 'الشريحة التالية' : 'Next highlight'}
            >
              {locale === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
