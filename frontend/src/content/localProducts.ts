import type { Product, Variant } from '../types/store';
import { enrichProduct, launchSlugs, perfumeCatalog, type CatalogSlug, type LaunchSlug } from './perfumeCatalog';

const variants: Record<LaunchSlug, Variant[]> = {
  sharara: [
    { id: 900101, in_stock: true, label: '3ml Tester', retail_price: 149, size_ml: 3, type: 'tester' },
    { id: 900102, in_stock: true, label: '25ml Retail', retail_price: 899, size_ml: 25, type: 'retail' },
    { id: 900103, in_stock: true, label: '50ml Retail', retail_price: 1499, size_ml: 50, type: 'retail' },
    { id: 900104, in_stock: true, label: '100ml Retail', retail_price: 2499, size_ml: 100, type: 'retail' },
  ],
  madar: [
    { id: 900201, in_stock: true, label: '10ml Tester', retail_price: 229, size_ml: 10, type: 'tester' },
    { id: 900202, in_stock: true, label: '50ml Retail', retail_price: 1399, size_ml: 50, type: 'retail' },
  ],
  athar: [
    { id: 900301, in_stock: true, label: '25ml Retail', retail_price: 959, size_ml: 25, type: 'retail' },
    { id: 900302, in_stock: true, label: '50ml Retail', retail_price: 1599, size_ml: 50, type: 'retail' },
  ],
  barq: [
    { id: 900401, in_stock: true, label: '5ml Tester', retail_price: 179, size_ml: 5, type: 'tester' },
    { id: 900402, in_stock: true, label: '50ml Retail', retail_price: 1549, size_ml: 50, type: 'retail' },
  ],
  nada: [
    { id: 900501, in_stock: true, label: '30ml Retail', retail_price: 1099, size_ml: 30, type: 'retail' },
    { id: 900502, in_stock: true, label: '50ml Retail', retail_price: 1450, size_ml: 50, type: 'retail' },
  ],
  ghayma: [
    { id: 900601, in_stock: true, label: '4ml Oil Ball', retail_price: 299, size_ml: 4, type: 'tester' },
    { id: 900602, in_stock: true, label: '50ml Retail', retail_price: 1599, size_ml: 50, type: 'retail' },
  ],
};

const discoveryVariants: Variant[] = [
  { id: 900701, in_stock: true, label: '6 x 3ml Samples', retail_price: 149, size_ml: 18, type: 'tester' },
];

function buildLocalProduct(slug: CatalogSlug, index: number): Product {
  const entry = perfumeCatalog[slug];
  return enrichProduct({
    id: 9000 + index + 1,
    code: entry.code,
    slug,
    name_ar: entry.nameAr,
    name_en: entry.nameEn,
    gender: entry.genderEn,
    story: entry.storyAr,
    story_en: entry.storyEn,
    personality: entry.moodEn,
    marketing_line_ar: entry.personalityAr,
    marketing_line_en: entry.personalityEn,
    scent_notes: entry.notesEn.join(', '),
    rating_average: 4.7,
    review_count: 8,
    reviews_count: 8,
    media: [],
    variants: slug === 'discovery-set' ? discoveryVariants : variants[slug as LaunchSlug],
  }) as Product;
}

export const localCoreProducts: Product[] = launchSlugs.map(buildLocalProduct);
export const localDiscoveryProduct: Product = buildLocalProduct('discovery-set', 6);

export function getLocalCoreProduct(slug: string): Product | null {
  return localCoreProducts.find((product) => product.slug === slug) || (slug === 'discovery-set' ? localDiscoveryProduct : null);
}
