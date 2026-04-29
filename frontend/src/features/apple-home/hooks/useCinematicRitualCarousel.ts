import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AUTOPLAY_INTERVAL_MS } from '../constants';
import { wrapIndex } from '../utils/carousel';

export type CinematicRitualPhase = 'idle' | 'transitioning-out' | 'switching' | 'transitioning-in';

const TRANSITION_OUT_MS = 320;
const SWITCH_MS = 520;
const TRANSITION_TOTAL_MS = 1180;

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useCinematicRitualCarousel(length: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<CinematicRitualPhase>('idle');
  const [isReducedMotion, setIsReducedMotion] = useState(prefersReducedMotion);
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion());
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setIsReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }
    };

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const goTo = useCallback((index: number, userInitiated = true) => {
    const nextIndex = wrapIndex(index, length);

    if (length <= 1 || nextIndex === activeIndex || phase !== 'idle') {
      return;
    }

    if (userInitiated) {
      setIsPlaying(false);
    }

    clearTimers();
    setPreviousIndex(activeIndex);

    if (isReducedMotion) {
      setActiveIndex(nextIndex);
      setPreviousIndex(null);
      setPhase('idle');
      return;
    }

    setPhase('transitioning-out');
    timers.current = [
      window.setTimeout(() => {
        setActiveIndex(nextIndex);
        setPhase('switching');
      }, TRANSITION_OUT_MS),
      window.setTimeout(() => {
        setPhase('transitioning-in');
      }, SWITCH_MS),
      window.setTimeout(() => {
        setPreviousIndex(null);
        setPhase('idle');
      }, TRANSITION_TOTAL_MS),
    ];
  }, [activeIndex, clearTimers, isReducedMotion, length, phase]);

  const next = useCallback((userInitiated = true) => {
    goTo(activeIndex + 1, userInitiated);
  }, [activeIndex, goTo]);

  const previous = useCallback((userInitiated = true) => {
    goTo(activeIndex - 1, userInitiated);
  }, [activeIndex, goTo]);

  const togglePlay = () => {
    if (isReducedMotion) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying((current) => !current);
  };

  const isTemporarilyPaused = isHoverPaused || isFocusPaused;

  useEffect(() => {
    if (!isPlaying || isReducedMotion || isTemporarilyPaused || phase !== 'idle' || length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => next(false), AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [isPlaying, isReducedMotion, isTemporarilyPaused, length, next, phase]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    }
  };

  return {
    activeIndex,
    goTo,
    handleKeyDown,
    isPlaying,
    isReducedMotion,
    next,
    phase,
    previous,
    previousIndex,
    setIsFocusPaused,
    setIsHoverPaused,
    togglePlay,
  };
}
