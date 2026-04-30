import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useLocale } from '../../../context/LocaleContext';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, scentCopy, text } from '../data/appleHomeCopy';
import { useHighlightsCarousel } from '../hooks/useHighlightsCarousel';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';

type HeroSectionProps = {
  scents: Scent[];
};

export default function HeroSection({ scents }: HeroSectionProps) {
  const { locale } = useLocale();
  const carousel = useHighlightsCarousel(scents.length);
  const featuredScent = scents[carousel.activeIndex] ?? scents[0];
  const copy = appleHomeCopy.ritual;
  const localizedScent = scentCopy[featuredScent.id];
  const heroStyle = {
    '--scene-accent': featuredScent.accent,
    '--scene-bg-start': featuredScent.scene.bgStart,
    '--scene-bg-end': featuredScent.scene.bgEnd,
    '--scene-depth-left': featuredScent.scene.depthLeft,
    '--scene-depth-right': featuredScent.scene.depthRight,
    '--scene-mist': featuredScent.scene.mist,
    '--scene-surface': featuredScent.scene.surface,
  } as CSSProperties;

  return (
    <section
      className="anh-section anh-hero anh-landing-hero anh-landing-hero--carousel"
      data-section={SECTION_LABELS.hero}
      aria-labelledby="hero-title"
      data-proof="hero"
      style={heroStyle}
    >
      <div className="anh-landing-hero__media" aria-hidden="true">
        <div className="anh-landing-hero__veil" />
        <div className="anh-landing-hero__fabric anh-landing-hero__fabric--left" />
        <div className="anh-landing-hero__fabric anh-landing-hero__fabric--right" />
        <div className="anh-landing-hero__frame">
          <div className="anh-landing-hero__light" />
          <div className="anh-landing-hero__shelf" />
          <BottleVisual scent={featuredScent} className="anh-landing-hero__bottle" />
        </div>
      </div>

      <div className="anh-container anh-landing-hero__content">
        <div className="anh-landing-hero__copy">
          <p className="anh-kicker">{text(copy.moment, locale)}</p>
          <h2>{text(localizedScent.line, locale)}</h2>
          <p className="anh-landing-hero__lead">{text(localizedScent.heroDescription, locale)}</p>
          <div className="anh-actions">
            <a className="anh-button anh-button--primary" href="#choose">{text(copy.primaryCta, locale)}</a>
            <a className="anh-button anh-button--secondary" href="/discovery-set">{text(copy.secondaryCta, locale)}</a>
          </div>
        </div>

        <div className="anh-landing-hero__caption">
          <span>{text(copy.kicker, locale)}</span>
          <h1 id="hero-title">{text(localizedScent.name, locale)}</h1>
          <strong>{featuredScent.name}</strong>
        </div>
      </div>

      <button
        type="button"
        className="anh-hero-arrow anh-hero-arrow--prev"
        onClick={carousel.previous}
        aria-label={locale === 'ar' ? 'العطر السابق' : 'Previous scent'}
      >
        <ChevronRight aria-hidden="true" size={18} strokeWidth={2} />
      </button>
      <button
        type="button"
        className="anh-hero-arrow anh-hero-arrow--next"
        onClick={carousel.next}
        aria-label={locale === 'ar' ? 'العطر التالي' : 'Next scent'}
      >
        <ChevronLeft aria-hidden="true" size={18} strokeWidth={2} />
      </button>

      <div className="anh-carousel-dock anh-hero-dock" aria-label={locale === 'ar' ? 'أدوات عرض العطور' : 'Scent carousel controls'}>
        <button
          type="button"
          className="anh-dock-button"
          onClick={carousel.togglePlay}
          aria-label={carousel.isPlaying ? text(copy.pause, locale) : text(copy.play, locale)}
        >
          {carousel.isPlaying ? (
            <Pause aria-hidden="true" size={18} strokeWidth={2} />
          ) : (
            <Play aria-hidden="true" size={18} strokeWidth={2} />
          )}
        </button>
        <div className="anh-dots" role="tablist" aria-label={locale === 'ar' ? 'شرائح العطور' : 'Scent slides'}>
          {scents.map((scent, index) => (
            <button
              key={scent.id}
              type="button"
              className={index === carousel.activeIndex ? 'is-active' : ''}
              onClick={() => carousel.goTo(index)}
              aria-label={`${text(copy.select, locale)} ${text(scentCopy[scent.id].name, locale)}`}
              aria-selected={index === carousel.activeIndex}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
