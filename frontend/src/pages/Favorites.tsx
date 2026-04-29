import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLocale } from '../context/LocaleContext';
import { useEngagement } from '../hooks/useEngagement';

export default function Favorites() {
  const { locale } = useLocale();
  const { favoriteProducts, getScore } = useEngagement();
  const items = [...favoriteProducts].sort((a, b) => getScore(b) - getScore(a));

  return (
    <div className="n-container n-section">
      <div className="page-head page-head--compact">
        <small>{locale === 'ar' ? 'المفضلة' : 'Favorites'}</small>
        <h1>{locale === 'ar' ? 'روائحك المحفوظة' : 'Your saved fragrances'}</h1>
      </div>
      {items.length ? <div className="product-grid product-grid--shop atelier-grid atelier-grid--shop">{items.map((product) => <ProductCard key={product.slug} product={product} />)}</div> : (
        <div className="empty-panel">
          <p>{locale === 'ar' ? 'لا توجد منتجات مفضلة بعد.' : 'No favorite products yet.'}</p>
          <Link to="/shop" className="n-btn n-btn--primary">{locale === 'ar' ? 'اذهب إلى المتجر' : 'Go to shop'}</Link>
        </div>
      )}
    </div>
  );
}
