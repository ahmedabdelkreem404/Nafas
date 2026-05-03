import { ArrowUpLeft, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi } from '../api/publicApi';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { buildSearchableText } from '../content/perfumeCatalog';
import { useLocale } from '../context/LocaleContext';
import type { Product } from '../types/store';
import { toProducts } from '../utils/products';

type PublicCatalog = {
  banner_image_url?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  image_url?: string | null;
  name_ar: string;
  name_en: string;
  slug: string;
};

export default function CatalogPage() {
  const { slug = '' } = useParams();
  const { locale } = useLocale();
  const [catalog, setCatalog] = useState<PublicCatalog | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      publicApi.getCatalog(slug),
      publicApi.getCatalogProducts(slug),
    ])
      .then(([catalogResponse, productsResponse]) => {
        setCatalog(catalogResponse.data?.data || null);
        setProducts(toProducts(productsResponse.data?.data || []));
      })
      .catch((err) => {
        setError(err.message || (locale === 'ar' ? 'تعذر تحميل الكتالوج.' : 'Unable to load this catalog.'));
        setCatalog(null);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [locale, slug]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;

    return products.filter((product) => buildSearchableText(product).includes(normalizedQuery));
  }, [products, query]);

  const title = locale === 'ar' ? catalog?.name_ar : catalog?.name_en;
  const description = locale === 'ar' ? catalog?.description_ar : catalog?.description_en;
  const heroImage = catalog?.banner_image_url || catalog?.image_url || '';

  return (
    <div className="catalog-page">
      <Reveal className="n-container catalog-hero">
        <div className="catalog-hero__copy">
          <Link className="catalog-back-link" to="/shop">
            <ArrowUpLeft size={16} />
            {locale === 'ar' ? 'رجوع للمتجر' : 'Back to shop'}
          </Link>
          <small>{locale === 'ar' ? 'كتالوج نفَس' : 'Nafas catalog'}</small>
          <h1>{loading ? (locale === 'ar' ? 'تحميل الكتالوج...' : 'Loading catalog...') : title}</h1>
          <p>{description || (locale === 'ar' ? 'مجموعة عطرية قابلة للتعديل من لوحة التحكم.' : 'A curated catalog managed from the dashboard.')}</p>
        </div>

        <div className="catalog-hero__media" aria-hidden="true">
          {heroImage ? <img src={heroImage} alt="" /> : <div className="catalog-hero__glow" />}
        </div>
      </Reveal>

      <div className="toolbar">
        <div className="n-container toolbar__inner">
          <label className="search-pill">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === 'ar' ? 'ابحث داخل هذا الكتالوج' : 'Search inside this catalog'}
            />
          </label>
          <Link className="chip" to={`/shop?catalog=${slug}`}>
            {locale === 'ar' ? 'عرض في المتجر' : 'Open in shop'}
          </Link>
        </div>
      </div>

      <Reveal className="n-container n-section">
        {error ? (
          <div className="empty-panel">{error}</div>
        ) : loading ? (
          <div className="empty-panel">{locale === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading products...'}</div>
        ) : filteredProducts.length ? (
          <div className="product-grid product-grid--shop atelier-grid atelier-grid--shop">
            {filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        ) : (
          <div className="empty-panel">
            {locale === 'ar' ? 'لا توجد منتجات ظاهرة في هذا الكتالوج الآن.' : 'No visible products in this catalog yet.'}
          </div>
        )}
      </Reveal>
    </div>
  );
}
