import type { CSSProperties } from 'react';
import { SECTION_LABELS } from '../constants';
import { appleHomeCopy, scentCopy, text } from '../data/appleHomeCopy';
import { useCinematicRitualCarousel } from '../hooks/useCinematicRitualCarousel';
import type { Scent } from '../types';
import { useLocale } from '../../../context/LocaleContext';
import BottleVisual from './BottleVisual';
import RitualCarouselControls from './RitualCarouselControls';

type CinematicRitualSectionProps = {
  scents: Scent[];
};

export default function CinematicRitualSection({ scents }: CinematicRitualSectionProps) {
  const { locale } = useLocale();
  const carousel = useCinematicRitualCarousel(scents.length);
  const activeScent = scents[carousel.activeIndex] ?? scents[0];
  const activeCopy = scentCopy[activeScent.id];
  const copy = appleHomeCopy.ritual;

  const sceneStyle = {
    '--scene-accent': activeScent.accent,
    '--scene-bg-start': activeScent.scene.bgStart,
    '--scene-bg-end': activeScent.scene.bgEnd,
    '--scene-depth-left': activeScent.scene.depthLeft,
    '--scene-depth-right': activeScent.scene.depthRight,
    '--scene-mist': activeScent.scene.mist,
    '--scene-surface': activeScent.scene.surface,
    '--scene-flash': activeScent.scene.flash,
  } as CSSProperties;

  return (
    <section
      className="anh-ritual anh-ritual--cinematic"
      data-section={SECTION_LABELS.ritual}
      data-proof="ritual"
      data-phase={carousel.phase}
      data-active-scent={activeScent.id}
      data-autoplay={carousel.isPlaying ? 'on' : 'off'}
      data-reduced-motion={carousel.isReducedMotion ? 'true' : 'false'}
      data-scent={activeScent.id}
      aria-labelledby="ritual-title"
      aria-roledescription="carousel"
      aria-label={text(copy.aria, locale)}
      onKeyDown={carousel.handleKeyDown}
      onMouseEnter={() => carousel.setIsHoverPaused(true)}
      onMouseLeave={() => carousel.setIsHoverPaused(false)}
      onFocusCapture={() => carousel.setIsFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          carousel.setIsFocusPaused(false);
        }
      }}
      style={sceneStyle}
      tabIndex={0}
    >
      <div className="anh-ritual-scene__bg" aria-hidden="true" />
      <div className="anh-ritual-scene__depth-left" aria-hidden="true" />
      <div className="anh-ritual-scene__depth-right" aria-hidden="true" />
      <div className="anh-ritual-scene__pedestal" aria-hidden="true" />
      <div className="anh-ritual-scene__mist" aria-hidden="true" />
      <div className="anh-ritual-scene__brand-flash" aria-hidden="true">نفَس</div>

      <div className="anh-container anh-ritual-cinematic__inner">
        <div className="anh-ritual-cinematic__title-panel">
          <div className="anh-ritual-cinematic__title-stack" key={`${activeScent.id}-title`}>
            <p className="anh-kicker">{text(copy.kicker, locale)}</p>
            <h2 id="ritual-title">{text(activeCopy.name, locale)}</h2>
            <p className="anh-ritual-cinematic__latin">{activeScent.name}</p>
          </div>
        </div>

        <div className="anh-ritual-cinematic__stage" aria-hidden="true">
          <div className="anh-ritual-cinematic__halo" />
          {scents.map((scent, index) => {
            const isActive = index === carousel.activeIndex;
            const isPrevious = index === carousel.previousIndex && carousel.phase !== 'idle';

            return (
              <BottleVisual
                key={scent.id}
                scent={scent}
                className={`anh-ritual-cinematic__bottle ${isActive ? 'is-active' : ''} ${isPrevious ? 'is-previous' : ''}`}
              />
            );
          })}
        </div>

        <div className="anh-ritual-cinematic__copy-panel" aria-live="polite">
          <div className="anh-ritual-cinematic__copy-stack" key={`${activeScent.id}-copy`}>
            <p className="anh-kicker">{text(copy.moment, locale)}</p>
            <p className="anh-ritual-cinematic__line">{text(activeCopy.line, locale)}</p>
            <p className="anh-ritual-cinematic__description">{text(activeCopy.heroDescription, locale)}</p>
            <p className="anh-ritual-cinematic__mood">{text(activeCopy.mood, locale)}</p>
            <div className="anh-actions">
              <a className="anh-button anh-button--primary" href="#choose">{text(copy.primaryCta, locale)}</a>
              <a className="anh-button anh-button--secondary" href="#tester-path">{text(copy.secondaryCta, locale)}</a>
            </div>
          </div>
        </div>
      </div>

      <RitualCarouselControls
        activeIndex={carousel.activeIndex}
        isPlaying={carousel.isPlaying}
        isReducedMotion={carousel.isReducedMotion}
        onSelect={(index) => carousel.goTo(index)}
        onTogglePlay={carousel.togglePlay}
        scents={scents}
      />
    </section>
  );
}
