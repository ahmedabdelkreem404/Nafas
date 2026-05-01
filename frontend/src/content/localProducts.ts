import type { Product, Variant } from '../types/store';
import { enrichProduct, perfumeCatalog } from './perfumeCatalog';

type CoreSlug = 'sharara' | 'madar' | 'athar' | 'barq' | 'nada' | 'ghayma' | 'discovery-set';

const coreSlugs: CoreSlug[] = ['sharara', 'madar', 'athar', 'barq', 'nada', 'ghayma', 'discovery-set'];

const coreMeta: Record<CoreSlug, { code: string; id: number }> = {
  sharara: { code: 'NFS-SHR-01', id: 9001 },
  madar: { code: 'NFS-002', id: 9002 },
  athar: { code: 'NFS-003', id: 9003 },
  barq: { code: 'NFS-004', id: 9004 },
  nada: { code: 'NFS-005', id: 9005 },
  ghayma: { code: 'NFS-GHM-02', id: 9006 },
  'discovery-set': { code: 'NFS-DS-01', id: 9007 },
};

const coreVariants: Record<CoreSlug, Variant[]> = {
  sharara: [
    { id: 900101, in_stock: true, label: '30ml Retail', retail_price: 199, size_ml: 30, type: 'retail' },
    { id: 900102, in_stock: true, label: '50ml Retail', retail_price: 319, size_ml: 50, type: 'retail' },
    { id: 900103, in_stock: true, label: '100ml Retail', retail_price: 529, size_ml: 100, type: 'retail' },
  ],
  madar: [
    { id: 900201, in_stock: true, label: '30ml Retail', retail_price: 199, size_ml: 30, type: 'retail' },
    { id: 900202, in_stock: true, label: '50ml Retail', retail_price: 319, size_ml: 50, type: 'retail' },
    { id: 900203, in_stock: true, label: '100ml Retail', retail_price: 529, size_ml: 100, type: 'retail' },
  ],
  athar: [
    { id: 900301, in_stock: true, label: '30ml Retail', retail_price: 199, size_ml: 30, type: 'retail' },
    { id: 900302, in_stock: true, label: '50ml Retail', retail_price: 319, size_ml: 50, type: 'retail' },
    { id: 900303, in_stock: true, label: '100ml Retail', retail_price: 529, size_ml: 100, type: 'retail' },
  ],
  barq: [
    { id: 900401, in_stock: true, label: '30ml Retail', retail_price: 199, size_ml: 30, type: 'retail' },
    { id: 900402, in_stock: true, label: '50ml Retail', retail_price: 319, size_ml: 50, type: 'retail' },
    { id: 900403, in_stock: true, label: '100ml Retail', retail_price: 529, size_ml: 100, type: 'retail' },
  ],
  nada: [
    { id: 900501, in_stock: true, label: '30ml Retail', retail_price: 199, size_ml: 30, type: 'retail' },
    { id: 900502, in_stock: true, label: '50ml Retail', retail_price: 299, size_ml: 50, type: 'retail' },
    { id: 900503, in_stock: true, label: '100ml Retail', retail_price: 499, size_ml: 100, type: 'retail' },
  ],
  ghayma: [
    { id: 900601, in_stock: true, label: '30ml Retail', retail_price: 199, size_ml: 30, type: 'retail' },
    { id: 900602, in_stock: true, label: '50ml Retail', retail_price: 299, size_ml: 50, type: 'retail' },
    { id: 900603, in_stock: true, label: '100ml Retail', retail_price: 499, size_ml: 100, type: 'retail' },
  ],
  'discovery-set': [
    { id: 900701, in_stock: true, label: '6 samples', retail_price: 149, size_ml: 12, type: 'tester' },
  ],
};

function buildLocalProduct(slug: CoreSlug): Product {
  const entry = perfumeCatalog[slug];

  if (!entry) {
    return enrichProduct({
      id: coreMeta[slug].id,
      code: coreMeta[slug].code,
      slug,
      name_ar: 'مجموعة التجربة',
      name_en: 'Discovery Set',
      gender: 'Unisex',
      story: 'ست عينات صغيرة لاكتشاف عطور نافَس الستة قبل اختيار الزجاجة.',
      story_en: 'Six small samples to discover the launch scents before choosing a bottle.',
      personality: 'Discovery Set',
      marketing_line_ar: 'جرّب الستة واختار نفسك بهدوء.',
      marketing_line_en: 'Try all six, then choose calmly.',
      scent_notes: 'Sharara, Madar, Athar, Barq, Nada, Ghayma',
      rating_average: 0,
      review_count: 0,
      reviews_count: 0,
      media: [],
      variants: coreVariants[slug],
    }) as Product;
  }

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
