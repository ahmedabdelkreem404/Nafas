import { useEffect, useState } from 'react';

type LoaderPhase = 'drawing' | 'breathing' | 'fading' | 'hidden';

export default function BrandLoader() {
  const shouldSkip = typeof window !== 'undefined'
    && window.sessionStorage.getItem('nafas:disable-loader') === '1';
  const [phase, setPhase] = useState<LoaderPhase>(shouldSkip ? 'hidden' : 'drawing');

  useEffect(() => {
    if (shouldSkip) {
      return undefined;
    }

    const isAutomated = typeof navigator !== 'undefined' && navigator.webdriver;
    const drawingMs = isAutomated ? 120 : 1400;
    const breathingMs = isAutomated ? 180 : 2200;
    const fadingMs = isAutomated ? 260 : 2800;

    const t1 = window.setTimeout(() => setPhase('breathing'), drawingMs);
    const t2 = window.setTimeout(() => setPhase('fading'), breathingMs);
    const t3 = window.setTimeout(() => setPhase('hidden'), fadingMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [shouldSkip]);

  if (phase === 'hidden') {
    return null;
  }

  return (
    <div
      className="brand-loader"
      aria-hidden="true"
      style={{
        opacity: phase === 'fading' ? 0 : 1,
        transition: phase === 'fading' ? 'opacity 600ms ease' : 'none',
      }}
    >
      <div className="brand-loader__glow" />
      <svg
        className={`brand-loader__word brand-loader__word--${phase}`}
        viewBox="0 0 340 130"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="نفَس"
      >
        <text
          x="50%"
          y="56%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Noto Naskh Arabic', serif"
          fontSize="88"
          fontWeight="700"
          fill="none"
          stroke="#e4c070"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="brand-loader__text"
        >
          نفَس
        </text>
      </svg>
    </div>
  );
}
