import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import { AUTOPLAY_INTERVAL_MS } from '../constants';
import { wrapIndex } from '../utils/carousel';

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useHighlightsCarousel(length: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion());
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => setActiveIndex(wrapIndex(index, length)), [length]);
  const next = useCallback(() => setActiveIndex((current) => wrapIndex(current + 1, length)), [length]);
  const previous = useCallback(() => setActiveIndex((current) => wrapIndex(current - 1, length)), [length]);
  const togglePlay = () => setIsPlaying((current) => !current);

  useEffect(() => {
    if (!isPlaying || length <= 1 || prefersReducedMotion()) {
      return undefined;
    }

    const interval = window.setInterval(next, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [isPlaying, length, next]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 42) {
      return;
    }

    if (delta < 0) {
      next();
    } else {
      previous();
    }
  };

  return {
    activeIndex,
    goTo,
    handleKeyDown,
    handleTouchEnd,
    handleTouchStart,
    isPlaying,
    next,
    previous,
    togglePlay,
  };
}
