import type { CSSProperties } from 'react';
import { SECTION_LABELS } from '../constants';
import { useCinematicHeroCarousel } from '../hooks/useCinematicHeroCarousel';
import type { Scent } from '../types';
import BottleVisual from './BottleVisual';
import HeroCarouselControls from './HeroCarouselControls';

type CinematicHeroSectionProps = {
  scents: Scent[];
};

export default function CinematicHeroSection({ scents }: CinematicHeroSectionProps) {
  const carousel = useCinematicHeroCarousel(scents.length);
  const activeScent = scents[carousel.activeIndex] ?? scents[0];

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
      className="anh-section anh-cinematic-hero"
      data-section={SECTION_LABELS.cinematic}
      data-proof="cinematic-scents"
      data-phase={carousel.phase}
      data-active-scent={activeScent.id}
      data-autoplay={carousel.isPlaying ? 'on' : 'off'}
      data-reduced-motion={carousel.isReducedMotion ? 'true' : 'false'}
      data-scent={activeScent.id}
      aria-labelledby="cinematic-title"
      aria-roledescription="carousel"
      aria-label="عطور نفَس الرئيسية"
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
      <div className="anh-hero-scene__bg" aria-hidden="true" />
      <div className="anh-hero-scene__depth-left" aria-hidden="true" />
      <div className="anh-hero-scene__depth-right" aria-hidden="true" />
      <div className="anh-hero-scene__pedestal" aria-hidden="true" />
      <div className="anh-hero-scene__mist" aria-hidden="true" />
      <div className="anh-hero-scene__brand-flash" aria-hidden="true">نفَس</div>

      <div className="anh-container anh-cinematic-hero__inner">
        <div className="anh-cinematic-hero__title-panel">
          <div className="anh-cinematic-hero__title-stack" key={`${activeScent.id}-title`}>
            <p className="anh-kicker">Nafas eau de parfum</p>
            <h2 id="cinematic-title">{activeScent.nameAr}</h2>
            <p className="anh-cinematic-hero__latin">{activeScent.name}</p>
          </div>
        </div>

        <div className="anh-cinematic-hero__stage" aria-hidden="true">
          <div className="anh-cinematic-hero__halo" />
          {scents.map((scent, index) => {
            const isActive = index === carousel.activeIndex;
            const isPrevious = index === carousel.previousIndex && carousel.phase !== 'idle';

            return (
              <BottleVisual
                key={scent.id}
                scent={scent}
                className={`anh-cinematic-hero__bottle ${isActive ? 'is-active' : ''} ${isPrevious ? 'is-previous' : ''}`}
              />
            );
          })}
        </div>

        <div className="anh-cinematic-hero__copy-panel" aria-live="polite">
          <div className="anh-cinematic-hero__copy-stack" key={`${activeScent.id}-copy`}>
            <p className="anh-kicker">Signature scent</p>
            <p className="anh-cinematic-hero__line">{activeScent.line}</p>
            <p className="anh-cinematic-hero__description">{activeScent.heroDescription}</p>
            <p className="anh-cinematic-hero__mood">{activeScent.mood}</p>
            <div className="anh-actions">
              <a className="anh-button anh-button--primary" href="#choose">اكتشف المجموعة</a>
              <a className="anh-button anh-button--secondary" href="#tester-path">اطلب تستر</a>
            </div>
          </div>
        </div>
      </div>

      <HeroCarouselControls
        activeIndex={carousel.activeIndex}
        isPlaying={carousel.isPlaying}
        isReducedMotion={carousel.isReducedMotion}
        onNext={() => carousel.next()}
        onPrevious={() => carousel.previous()}
        onSelect={(index) => carousel.goTo(index)}
        onTogglePlay={carousel.togglePlay}
        scents={scents}
      />
    </section>
  );
}
