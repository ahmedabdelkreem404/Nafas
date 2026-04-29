import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { Scent } from '../types';

type RitualCarouselControlsProps = {
  activeIndex: number;
  isPlaying: boolean;
  isReducedMotion: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
  onTogglePlay: () => void;
  scents: Scent[];
};

export default function RitualCarouselControls({
  activeIndex,
  isPlaying,
  isReducedMotion,
  onNext,
  onPrevious,
  onSelect,
  onTogglePlay,
  scents,
}: RitualCarouselControlsProps) {
  return (
    <div className="anh-ritual-cinematic__controls" aria-label="تحكم طقس عطور نفَس">
      <button
        type="button"
        className="anh-ritual-control anh-ritual-control--arrow"
        onClick={onPrevious}
        aria-label="العطر السابق"
        data-testid="cinematic-ritual-prev"
      >
        <ChevronRight aria-hidden="true" size={19} strokeWidth={1.9} />
      </button>

      <div className="anh-ritual-dots" role="tablist" aria-label="اختيار عطر طقس نفَس">
        {scents.map((scent, index) => (
          <button
            key={scent.id}
            type="button"
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => onSelect(index)}
            role="tab"
            aria-label={`اعرض ${scent.nameAr}`}
            aria-selected={index === activeIndex}
            data-testid={`cinematic-ritual-dot-${index}`}
          >
            <span className="anh-sr-only">{scent.nameAr}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="anh-ritual-control anh-ritual-control--arrow"
        onClick={onNext}
        aria-label="العطر التالي"
        data-testid="cinematic-ritual-next"
      >
        <ChevronLeft aria-hidden="true" size={19} strokeWidth={1.9} />
      </button>

      <button
        type="button"
        className="anh-ritual-control anh-ritual-control--play"
        onClick={onTogglePlay}
        aria-label={isReducedMotion ? 'التشغيل التلقائي متوقف مع تقليل الحركة' : isPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل العرض التلقائي'}
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
    </div>
  );
}
