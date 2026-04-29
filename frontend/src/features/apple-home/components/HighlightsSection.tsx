import { Pause, Play } from 'lucide-react';
import { SECTION_LABELS } from '../constants';
import { useHighlightsCarousel } from '../hooks/useHighlightsCarousel';
import type { Highlight, Scent } from '../types';
import BottleVisual from './BottleVisual';

type HighlightsSectionProps = {
  highlights: Highlight[];
  scents: Scent[];
};

export default function HighlightsSection({ highlights, scents }: HighlightsSectionProps) {
  const carousel = useHighlightsCarousel(highlights.length);
  const findScent = (id: Highlight['id']) => scents.find((scent) => scent.id === id);

  return (
    <section className="anh-section anh-highlights" data-section={SECTION_LABELS.highlights} aria-labelledby="highlights-title" data-proof="highlights">
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
          onKeyDown={carousel.handleKeyDown}
          onTouchStart={carousel.handleTouchStart}
          onTouchEnd={carousel.handleTouchEnd}
        >
          <div className="anh-highlight-track" style={{ transform: `translateX(${-carousel.activeIndex * 84}%)` }}>
            {highlights.map((item, index) => {
              const scent = findScent(item.id);

              return (
                <article
                  key={item.id}
                  className={`anh-highlight-card anh-highlight-card--${item.tone} ${index === carousel.activeIndex ? 'is-active' : ''}`}
                  aria-hidden={index !== carousel.activeIndex}
                  data-active={index === carousel.activeIndex ? 'true' : 'false'}
                >
                  <div className="anh-highlight-card__copy">
                    <span>{item.eyebrow}</span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                  {scent ? (
                    <BottleVisual scent={scent} className="anh-highlight-bottle" />
                  ) : (
                    <img src={item.image} alt="" loading="lazy" decoding="async" />
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <div className="anh-carousel-dock" aria-label="Carousel controls">
          <button
            type="button"
            className="anh-dock-button"
            onClick={carousel.togglePlay}
            aria-label={carousel.isPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل العرض التلقائي'}
          >
            {carousel.isPlaying ? (
              <Pause aria-hidden="true" size={18} strokeWidth={2} />
            ) : (
              <Play aria-hidden="true" size={18} strokeWidth={2} />
            )}
          </button>
          <div className="anh-dots" role="tablist" aria-label="Highlight slides">
            {highlights.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === carousel.activeIndex ? 'is-active' : ''}
                onClick={() => carousel.goTo(index)}
                aria-label={`اعرض ${item.title}`}
                aria-selected={index === carousel.activeIndex}
                role="tab"
                data-testid={`highlight-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
