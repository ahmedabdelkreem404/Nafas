import { useEffect } from 'react';

export function useBodyHomeClass() {
  useEffect(() => {
    document.body.classList.add('apple-nafas-home-active');
    return () => document.body.classList.remove('apple-nafas-home-active');
  }, []);
}
