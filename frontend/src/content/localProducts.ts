import type { Product, Variant } from '../types/store';
import { enrichProduct, perfumeCatalog } from './perfumeCatalog';

type CoreSlug = 'sharara' | 'ghayma' | 'dafwa' | 'zell';

const coreSlugs: CoreSlug[] = ['sharara', 'ghayma', 'dafwa', 'zell'];

const coreMeta: Record<CoreSlug, { code: string; id: number }> = {
  sharara: { code: 'NFS-SHR-01', id: 9001 },
  ghayma: { code: 'NFS-GHM-02', id: 9002 },
  dafwa: { code: 'NFS-DFW-03', id: 9003 },
  zell: { code: 'NFS-ZLL-04', id: 9004 },
};

const coreVariants: Record<CoreSlug, Variant[]> = {
  sharara: [
    { id: 900101, in_stock: true, label: '3ml Tester', retail_price: 149, size_ml: 3, type: 'tester' },
    { id: 900102, in_stock: true, label: '25ml Retail', retail_price: 899, size_ml: 25, type: 'retail' },
    { id: 900103, in_stock: true, label: '50ml Retail', retail_price: 1499, size_ml: 50, type: 'retail' },
    { id: 900104, in_stock: true, label: '100ml Retail', retail_price: 2499, size_ml: 100, type: 'retail' },
  ],
  ghayma: [
    { id: 900201, in_stock: true, label: '4.5ml Ball Oil', retail_price: 299, size_ml: 4, type: 'tester' },
    { id: 900202, in_stock: true, label: '50ml Retail', retail_price: 1599, size_ml: 50, type: 'retail' },
  ],
  dafwa: [
    { id: 900301, in_stock: true, label: '25ml Retail', retail_price: 929, size_ml: 25, type: 'retail' },
    { id: 900302, in_stock: true, label: '50ml Retail', retail_price: 1500, size_ml: 50, type: 'retail' },
  ],
  zell: [
    { id: 900401, in_stock: true, label: '10ml Tester', retail_price: 239, size_ml: 10, type: 'tester' },
    { id: 900402, in_stock: true, label: '50ml Retail', retail_price: 1500, size_ml: 50, type: 'retail' },
  ],
};

function buildLocalProduct(slug: CoreSlug): Product {
  const entry = perfumeCatalog[slug];

  return enrichProduct({
    id: coreMeta[slug].id,
    code: coreMeta[slug].code,
    slug,
    name_ar: entry.nameAr,
    name_en: entry.nameEn,
    gender: entry.genderEn,
    story: entry.storyAr,
    story_en: entry.storyEn,
    personality: entry.personalityEn,
    marketing_line_ar: entry.personalityAr,
    marketing_line_en: entry.personalityEn,
    scent_notes: entry.notesEn.join(', '),
    rating_average: 0,
    review_count: 0,
    reviews_count: 0,
    media: [],
    variants: coreVariants[slug],
  }) as Product;
}

export const localCoreProducts: Product[] = coreSlugs.map(buildLocalProduct);

export function getLocalCoreProduct(slug: string): Product | null {
  return localCoreProducts.find((product) => product.slug === slug) || null;
}
