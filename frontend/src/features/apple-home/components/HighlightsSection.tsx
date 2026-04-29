import { Pause, Play } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, highlightCopy, text } from '../data/appleHomeCopy';
import { useHighlightsCarousel } from '../hooks/useHighlightsCarousel';
import type { Highlight, Scent } from '../types';
import BottleVisual from './BottleVisual';

type HighlightsSectionProps = {
  highlights: Highlight[];
  scents: Scent[];
};

export default function HighlightsSection({ highlights, scents }: HighlightsSectionProps) {
  const { locale } = useLocale();
  const carousel = useHighlightsCarousel(highlights.length);
  const findScent = (id: Highlight['id']) => scents.find((scent) => scent.id === id);
  const copy = appleHomeCopy.highlights;

  return (
    <section className="anh-section anh-highlights" data-section={SECTION_LABELS.highlights} aria-labelledby="highlights-title" data-proof="highlights">
      <div className="anh-container">
        <div className="anh-section-head">
          <p className="anh-kicker">{text(copy.kicker, locale)}</p>
          <h2 id="highlights-title">{text(copy.title, locale)}</h2>
        </div>

        <div
          className="anh-highlight-shell"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={text(copy.carousel, locale)}
          onKeyDown={carousel.handleKeyDown}
          onTouchStart={carousel.handleTouchStart}
          onTouchEnd={carousel.handleTouchEnd}
        >
          <div className="anh-highlight-track" style={{ '--active-index': carousel.activeIndex } as CSSProperties}>
            {highlights.map((item, index) => {
              const scent = findScent(item.id);
              const itemCopy = highlightCopy[item.id];

              return (
                <article
                  key={item.id}
                  className={`anh-highlight-card anh-highlight-card--${item.tone} ${index === carousel.activeIndex ? 'is-active' : ''}`}
                  aria-hidden={index !== carousel.activeIndex}
                  data-active={index === carousel.activeIndex ? 'true' : 'false'}
                >
                  <div className="anh-highlight-card__copy">
                    <span>{text(itemCopy.eyebrow, locale)}</span>
                    <h3>{text(itemCopy.title, locale)}</h3>
                    <p>{text(itemCopy.copy, locale)}</p>
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

        <div className="anh-carousel-dock" aria-label={text(copy.controls, locale)}>
          <button
            type="button"
            className="anh-dock-button"
            onClick={carousel.togglePlay}
            aria-label={carousel.isPlaying ? text(appleHomeCopy.ritual.pause, locale) : text(appleHomeCopy.ritual.play, locale)}
          >
            {carousel.isPlaying ? (
              <Pause aria-hidden="true" size={18} strokeWidth={2} />
            ) : (
              <Play aria-hidden="true" size={18} strokeWidth={2} />
            )}
          </button>
          <div className="anh-dots" role="tablist" aria-label={text(copy.slides, locale)}>
            {highlights.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === carousel.activeIndex ? 'is-active' : ''}
                onClick={() => carousel.goTo(index)}
                aria-label={`${text(appleHomeCopy.ritual.select, locale)} ${text(highlightCopy[item.id].title, locale)}`}
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
