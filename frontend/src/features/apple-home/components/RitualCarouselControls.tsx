import { Pause, Play } from 'lucide-react';
import { useLocale } from '../../../context/LocaleContext';
import { appleHomeCopy, scentCopy, text } from '../data/appleHomeCopy';
import type { Scent } from '../types';

type RitualCarouselControlsProps = {
  activeIndex: number;
  isPlaying: boolean;
  isReducedMotion: boolean;
  onSelect: (index: number) => void;
  onTogglePlay: () => void;
  scents: Scent[];
};

export default function RitualCarouselControls({
  activeIndex,
  isPlaying,
  isReducedMotion,
  onSelect,
  onTogglePlay,
  scents,
}: RitualCarouselControlsProps) {
  const { locale } = useLocale();
  const copy = appleHomeCopy.ritual;
  const playLabel = isReducedMotion
    ? (locale === 'ar' ? 'العرض التلقائي متوقف مع تقليل الحركة' : 'Autoplay is disabled while reduced motion is active')
    : (isPlaying ? text(copy.pause, locale) : text(copy.play, locale));

  return (
    <div className="anh-ritual-cinematic__controls anh-carousel-dock" aria-label={text(copy.aria, locale)}>
      <button
        type="button"
        className="anh-dock-button anh-ritual-control anh-ritual-control--play"
        onClick={onTogglePlay}
        aria-label={playLabel}
        aria-pressed={!isPlaying}
        disabled={isReducedMotion}
        data-testid="cinematic-ritual-play-toggle"
      >
        {isPlaying ? (
          <Pause aria-hidden="true" size={18} strokeWidth={2} />
        ) : (
          <Play aria-hidden="true" size={18} strokeWidth={2} />
        )}
      </button>

      <div className="anh-dots anh-ritual-dots" role="tablist" aria-label={text(copy.aria, locale)}>
        {scents.map((scent, index) => (
          // Dots are intentionally compact; the full product name stays available to assistive tech.
          <button
            key={scent.id}
            type="button"
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => onSelect(index)}
            role="tab"
            aria-label={`${text(copy.select, locale)} ${text(scentCopy[scent.id].name, locale)}`}
            aria-selected={index === activeIndex}
            data-testid={`cinematic-ritual-dot-${index}`}
          >
            <span className="anh-sr-only">{text(scentCopy[scent.id].name, locale)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
