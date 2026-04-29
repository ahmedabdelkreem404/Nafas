import { createElement, type ElementType, type PropsWithChildren } from 'react';
import { useReveal, type RevealVariant } from '../hooks/useReveal';

type RevealProps = PropsWithChildren<{
  as?: ElementType;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}>;

export default function Reveal({ as = 'div', children, className = '', delay = 0, variant = 'fade-up' }: RevealProps) {
  const { ref } = useReveal<HTMLElement>(variant);

  return createElement(
    as,
    {
      ref,
      className: `reveal ${className}`.trim(),
      style: { ['--delay' as string]: `${delay}ms` },
    },
    children,
  );
}
