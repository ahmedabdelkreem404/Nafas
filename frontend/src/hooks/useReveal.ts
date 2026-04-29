import { useEffect, useRef, useState } from 'react';

export type RevealVariant = 'fade-up' | 'fade-in' | 'scale-in' | 'blur-in';

export function useReveal<T extends HTMLElement>(variant: RevealVariant = 'fade-up') {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    node.dataset.reveal = variant;

    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      setVisible(true);
      node.classList.add('is-visible');
      return;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setVisible(true);
        node.classList.add('is-visible');
        observer.disconnect();
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [variant]);

  return { ref, visible };
}
