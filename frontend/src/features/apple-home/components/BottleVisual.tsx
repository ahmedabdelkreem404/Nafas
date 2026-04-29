import type { CSSProperties } from 'react';
import type { Scent } from '../types';

type BottleVisualProps = {
  scent: Scent;
  className?: string;
};

export default function BottleVisual({ scent, className = '' }: BottleVisualProps) {
  return (
    <div
      className={`anh-bottle-visual anh-bottle-visual--${scent.id} ${className}`}
      style={{ '--accent': scent.accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className="anh-bottle-visual__cap" />
      <span className="anh-bottle-visual__neck" />
      <span className="anh-bottle-visual__body">
        <span className="anh-bottle-visual__shine" />
        <span className="anh-bottle-visual__label">
          <small>Nafas</small>
          <strong>{scent.name}</strong>
        </span>
      </span>
      <span className="anh-bottle-visual__shadow" />
    </div>
  );
}
