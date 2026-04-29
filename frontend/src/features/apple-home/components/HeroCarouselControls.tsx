import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { Scent } from '../types';

type HeroCarouselControlsProps = {
  activeIndex: number;
  isPlaying: boolean;
  isReducedMotion: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
  onTogglePlay: () => void;
  scents: Scent[];
};

export default function HeroCarouselControls({
  activeIndex,
  isPlaying,
  isReducedMotion,
  onNext,
  onPrevious,
  onSelect,
  onTogglePlay,
  scents,
}: HeroCarouselControlsProps) {
  return (
    <div className="anh-cinematic-hero__controls" aria-label="تحكم عرض عطور نفَس">
      <button
        type="button"
        className="anh-hero-control anh-hero-control--arrow"
        onClick={onPrevious}
        aria-label="العطر السابق"
        data-testid="cinematic-hero-prev"
      >
        <ChevronRight aria-hidden="true" size={19} strokeWidth={1.9} />
      </button>

      <div className="anh-hero-dots" role="tablist" aria-label="اختيار عطر نفَس">
        {scents.map((scent, index) => (
          <button
            key={scent.id}
            type="button"
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => onSelect(index)}
            role="tab"
            aria-label={`اعرض ${scent.nameAr}`}
            aria-selected={index === activeIndex}
            data-testid={`cinematic-hero-dot-${index}`}
          >
            <span className="anh-sr-only">{scent.nameAr}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="anh-hero-control anh-hero-control--arrow"
        onClick={onNext}
        aria-label="العطر التالي"
        data-testid="cinematic-hero-next"
      >
        <ChevronLeft aria-hidden="true" size={19} strokeWidth={1.9} />
      </button>

      <button
        type="button"
        className="anh-hero-control anh-hero-control--play"
        onClick={onTogglePlay}
        aria-label={isReducedMotion ? 'التشغيل التلقائي متوقف مع تقليل الحركة' : isPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل العرض التلقائي'}
        aria-pressed={!isPlaying}
        disabled={isReducedMotion}
        data-testid="cinematic-hero-play-toggle"
      >
        {isPlaying ? (
          <Pause aria-hidden="true" size={18} strokeWidth={2} />
        ) : (
          <Play aria-hidden="true" size={18} strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
