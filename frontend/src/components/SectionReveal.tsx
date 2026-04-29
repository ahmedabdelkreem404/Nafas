import { Children, isValidElement, type HTMLAttributes, useEffect, useRef, useState } from 'react';

type RevealVariant = 'fadeUp' | 'fadeIn' | 'scaleIn' | 'blurIn';
type RevealElement = 'div' | 'section' | 'article' | 'aside';

type SectionRevealProps = HTMLAttributes<HTMLElement> & {
  as?: RevealElement;
  delay?: number;
  once?: boolean;
  staggerChildren?: boolean;
  staggerMs?: number;
  threshold?: number;
  variant?: RevealVariant;
};

const revealVariantMap = {
  fadeUp: 'fade-up',
  fadeIn: 'fade-in',
  scaleIn: 'scale-in',
  blurIn: 'blur-in',
} as const;

export default function SectionReveal({
  as = 'div',
  children,
  className = '',
  delay = 0,
  once = true,
  staggerChildren = false,
  staggerMs = 80,
  threshold = 0.16,
  variant = 'fadeUp',
  ...props
}: SectionRevealProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const revealAttr = revealVariantMap[variant];
  const Component = as;

  useEffect(() => {
    const node = elementRef.current;
    if (!node) {
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    let revealed = false;
    const reveal = () => {
      revealed = true;
      setVisible(true);
    };

    const fallbackTimer = window.setTimeout(() => {
      if (!revealed) {
        setVisible(true);
      }
    }, 1200);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        reveal();
        if (once) {
          observer.unobserve(entry.target);
        }
      } else if (!once) {
        setVisible(false);
      }
    }, { threshold });

    observer.observe(node);
    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [once, threshold]);

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        elementRef.current = node;
      }}
      className={`reveal reveal--${variant} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      data-reveal={revealAttr}
      style={{ ['--delay' as string]: `${delay}ms` }}
      {...props}
    >
      {staggerChildren
        ? Children.toArray(children).map((child, index) => (
            <div
              key={isValidElement(child) && child.key != null ? child.key : index}
              className={`reveal ${visible ? 'is-visible' : ''}`}
              data-reveal={revealAttr}
              style={{ ['--delay' as string]: `${delay + (index * staggerMs)}ms` }}
            >
              {child}
            </div>
          ))
        : children}
    </Component>
  );
}
