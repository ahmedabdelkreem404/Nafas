import { ImageIcon, Cuboid } from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import type { Product } from '../types/store';
import { getProductMediaSources } from '../utils/products';
import ProductMedia from './ProductMedia';

const Bottle3D = lazy(() => import('./Bottle3D'));

const MAX_TILT = 7;

export default function ProductGallery({ product }: { product: Product }) {
  const { locale } = useLocale();
  const sources = useMemo(() => getProductMediaSources(product), [product]);
  const [active, setActive] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [canUse3D, setCanUse3D] = useState(false);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const query = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const applyState = () => {
      const allowed = query.matches;
      setCanUse3D(allowed);
      if (!allowed) {
        setShow3D(false);
      }
    };

    applyState();
    query.addEventListener('change', applyState);
    return () => query.removeEventListener('change', applyState);
  }, []);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width) - 0.5;
    const normalizedY = ((event.clientY - rect.top) / rect.height) - 0.5;
    const rotateX = Math.max(-MAX_TILT, Math.min(MAX_TILT, normalizedY * -MAX_TILT)).toFixed(1);
    const rotateY = Math.max(-MAX_TILT, Math.min(MAX_TILT, normalizedX * MAX_TILT)).toFixed(1);
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  return (
    <div className="product-gallery editorial-gallery">
      {canUse3D ? (
        <div className="editorial-gallery__tabs">
          <button
            type="button"
            className={`editorial-gallery__tab ${!show3D ? 'is-active' : ''}`}
            onClick={() => setShow3D(false)}
          >
            <ImageIcon size={15} />
            <span>{locale === 'ar' ? 'صور' : 'Photos'}</span>
          </button>
          <button
            type="button"
            className={`editorial-gallery__tab ${show3D ? 'is-active' : ''}`}
            onClick={() => setShow3D(true)}
          >
            <Cuboid size={15} />
            <span>3D</span>
          </button>
        </div>
      ) : null}

      {show3D && canUse3D ? (
        <Suspense
          fallback={(
            <div className="product-gallery__stage editorial-gallery__stage">
              <div className="product-gallery__tilt editorial-gallery__card editorial-gallery__card--3d">
                <ProductMedia
                  product={product}
                  alt={locale === 'ar' ? product.name_ar : product.name_en}
                  className="product-gallery__image"
                  loading="eager"
                />
              </div>
            </div>
          )}
        >
          <div className="product-gallery__stage editorial-gallery__stage">
            <div className="product-gallery__tilt editorial-gallery__card editorial-gallery__card--3d">
              <Bottle3D accent={product.accent || 'gold'} height="100%" />
            </div>
          </div>
        </Suspense>
      ) : (
        <div
          className="product-gallery__stage editorial-gallery__stage"
          onMouseMove={handleMove}
          onMouseLeave={() => setTransform('rotateX(0deg) rotateY(0deg)')}
        >
          <div className="product-gallery__tilt editorial-gallery__card" style={{ transform }}>
            <img src={sources[active]} alt={locale === 'ar' ? product.name_ar : product.name_en} className="product-gallery__image" />
          </div>
          <div className="product-gallery__notes editorial-gallery__notes">
            {(locale === 'ar' ? product.notes_ar : product.notes_en).slice(0, 6).map((note, index) => (
              <span
                key={note}
                className="note-pill editorial-gallery__note"
                style={{ ['--float-time' as string]: `${3.8 + (index * 0.7)}s` }}
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="product-gallery__thumbs">
        {sources.map((source, index) => (
          <button key={source} type="button" className={`product-gallery__thumb ${active === index ? 'is-active' : ''}`} onClick={() => setActive(index)}>
            <img src={source} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
