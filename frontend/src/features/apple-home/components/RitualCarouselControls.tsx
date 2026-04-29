import { Pause, Play } from 'lucide-react';
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
  return (
    <div className="anh-ritual-cinematic__controls anh-carousel-dock" aria-label="تحكم طقس عطور نفَس">
      <button
        type="button"
        className="anh-dock-button anh-ritual-control anh-ritual-control--play"
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

      <div className="anh-dots anh-ritual-dots" role="tablist" aria-label="اختيار عطر طقس نفَس">
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
    </div>
  );
}
