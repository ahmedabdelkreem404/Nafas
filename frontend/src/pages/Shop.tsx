import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCachedProducts } from '../cache/productCache';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { buildSearchableText } from '../content/perfumeCatalog';
import { useLocale } from '../context/LocaleContext';
import { useEngagement } from '../hooks/useEngagement';
import type { Product } from '../types/store';

const filterKeys = ['all', 'men', 'women', 'daily', 'occasion', 'fresh', 'dark', 'coffee', 'gifts', 'samples'] as const;
const sortKeys = ['favorite', 'rating', 'views', 'newest', 'price-asc', 'price-desc'] as const;

export default function Shop() {
  const { locale } = useLocale();
  const { getProductMetrics, getScore, getTopProductSlug } = useEngagement();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState((searchParams.get('q') || '').trim().toLowerCase());
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
  const [sortBy, setSortBy] = useState<(typeof sortKeys)[number]>((searchParams.get('sort') as (typeof sortKeys)[number]) || 'favorite');

  useEffect(() => {
    getCachedProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setFilter(searchParams.get('filter') || 'all');
    setSortBy((searchParams.get('sort') as (typeof sortKeys)[number]) || 'favorite');
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (debouncedQuery) nextParams.set('q', query.trim());
    else nextParams.delete('q');

    if (filter && filter !== 'all') nextParams.set('filter', filter);
    else nextParams.delete('filter');

    if (sortBy !== 'favorite') nextParams.set('sort', sortBy);
    else nextParams.delete('sort');

    const current = searchParams.toString();
    const next = nextParams.toString();
    if (current !== next) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [debouncedQuery, filter, query, searchParams, setSearchParams, sortBy]);

  const filteredProducts = useMemo(() => (
    [...products]
      .filter((product) => {
        const searchable = buildSearchableText(product);
        const filterAliases: Record<string, string[]> = {
          coffee: ['coffee', 'قهوة'],
          daily: ['daily', 'يومي'],
          dark: ['dark', 'غامق'],
          fresh: ['fresh', 'فريش'],
          gifts: ['gift', 'gifts', 'هدية', 'هدايا'],
          men: ['men', 'رجالي'],
          occasion: ['occasion', 'evening', 'مناسبة', 'مناسبات', 'مساء'],
          samples: ['sample', 'samples', 'tester', 'testers', 'عينات', 'تستر', 'تجربة'],
          women: ['women', 'حريمي', 'نسائي'],
        };
        const aliases = filterAliases[filter] || [filter];
        return (!debouncedQuery || searchable.includes(debouncedQuery)) && (filter === 'all' || aliases.some((alias) => searchable.includes(alias.toLowerCase())));
      })
      .sort((left, right) => {
        const leftMetrics = getProductMetrics(left);
        const rightMetrics = getProductMetrics(right);
        const leftPrice = Number(left.variants[0]?.retail_price || 0);
        const rightPrice = Number(right.variants[0]?.retail_price || 0);

        switch (sortBy) {
          case 'rating':
            return rightMetrics.ratingAverage - leftMetrics.ratingAverage;
          case 'views':
            return rightMetrics.views - leftMetrics.views;
          case 'newest':
            return right.id - left.id;
          case 'price-asc':
            return leftPrice - rightPrice;
          case 'price-desc':
            return rightPrice - leftPrice;
          default:
            return getScore(right) - getScore(left);
        }
      })
  ), [debouncedQuery, filter, getProductMetrics, getScore, products, sortBy]);

  const topSlug = getTopProductSlug(filteredProducts);

  const chipLabel = (key: string) => {
    const map: Record<string, { ar: string; en: string }> = {
      all: { ar: 'الكل', en: 'All' },
      daily: { ar: 'يومي', en: 'Daily' },
      dark: { ar: 'غامق', en: 'Dark' },
      occasion: { ar: 'مناسبات', en: 'Occasions' },
      samples: { ar: 'عينات', en: 'Samples' },
      men: { ar: 'رجالي', en: 'Men' },
      women: { ar: 'نسائي', en: 'Women' },
      fresh: { ar: 'فريش', en: 'Fresh' },
      musky: { ar: 'مسكي', en: 'Musky' },
      coffee: { ar: 'قهوة', en: 'Coffee' },
      woody: { ar: 'خشبي', en: 'Woody' },
      testers: { ar: 'تسترات', en: 'Testers' },
      gifts: { ar: 'هدايا', en: 'Gifts' },
      favorite: { ar: 'الأكثر إعجابًا', en: 'Most loved' },
      rating: { ar: 'الأعلى تقييمًا', en: 'Top rated' },
      views: { ar: 'الأكثر مشاهدة', en: 'Most viewed' },
      newest: { ar: 'الأحدث', en: 'Newest' },
      'price-asc': { ar: 'السعر ↑', en: 'Price ↑' },
      'price-desc': { ar: 'السعر ↓', en: 'Price ↓' },
    };
    return map[key][locale];
  };

  return (
    <div className="page-shop">
      <Reveal className="n-container page-head">
        <small>{locale === 'ar' ? 'الكتالوج' : 'Catalogue'}</small>
        <h1>{locale === 'ar' ? 'روائح تُقرأ بهدوء وتُختار بقصد' : 'Scents to read calmly and choose with intent'}</h1>
        <p>{locale === 'ar' ? 'كتالوج فاخر قابل للمسح السريع، لكنه لا يتسرع أبدًا.' : 'A premium catalogue that stays scannable without ever feeling rushed.'}</p>
      </Reveal>

      <div className="toolbar">
        <div className="n-container toolbar__inner">
          <label className="search-pill">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === 'ar' ? 'ابحث بالاسم أو النوتات أو القصة' : 'Search by name, notes, or story'} />
          </label>

          <div className="chip-row">
            {filterKeys.map((key) => (
              <button key={key} type="button" className={`chip ${filter === key ? 'is-active' : ''}`} onClick={() => setFilter(key)}>
                {chipLabel(key)}
              </button>
            ))}
          </div>

          <div className="chip-row chip-row--sort">
            {sortKeys.map((key) => (
              <button key={key} type="button" className={`chip ${sortBy === key ? 'is-active' : ''}`} onClick={() => setSortBy(key)}>
                {chipLabel(key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Reveal className="n-container n-section">
        {filteredProducts.length ? (
          <div className="product-grid product-grid--shop atelier-grid atelier-grid--shop">
            {filteredProducts.map((product) => <ProductCard key={product.slug} product={product} crowned={product.slug === topSlug} />)}
          </div>
        ) : (
          <div className="empty-panel">{locale === 'ar' ? 'لا توجد نتائج الآن. جرّب كلمة بحث أخرى أو غيّر الفلاتر.' : 'No results right now. Try another phrase or adjust the filters.'}</div>
        )}
      </Reveal>
    </div>
  );
}
