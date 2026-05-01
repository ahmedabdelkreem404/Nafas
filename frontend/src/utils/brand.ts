const BRAND_ROOT = '/assets/brand';
const GENERATED_ROOT = '/assets/generated';
const HERO_ROOT = '/assets/hero';
const JOURNEY_ROOT = '/assets/journey';
const PRODUCT_ROOT = '/assets/products';
const STOCK_ROOT = '/assets/stock/optimized';

export const BRAND_LOGO = `${BRAND_ROOT}/nafas-logo.webp`;
export const BRAND_LOGO_FALLBACK = `${BRAND_ROOT}/nafas-logo.png`;
export const BRAND_ICON = `${BRAND_ROOT}/nafas-icon.webp`;
export const BRAND_ICON_FALLBACK = `${BRAND_ROOT}/nafas-icon.png`;
export const BRAND_LOADER = `${BRAND_ROOT}/nafas-loader.png`;

export const HERO_BG = `${GENERATED_ROOT}/hero-bg-luxury.svg`;
export const HERO_POSTER = `${HERO_ROOT}/nafas-hero-poster.webp`;
export const HERO_VIDEO_MP4 = `${HERO_ROOT}/nafas-hero.mp4`;
export const HERO_VIDEO_WEBM = `${HERO_ROOT}/nafas-hero.webm`;
export const MIST_LAYER_ASSET = `${GENERATED_ROOT}/mist-layer.svg`;
export const GOLD_NOISE_ASSET = `${GENERATED_ROOT}/gold-noise.svg`;
export const BOTTLE_SILHOUETTE_ASSET = `${GENERATED_ROOT}/bottle-silhouette.svg`;

export const JOURNEY_VIDEO_WEBM = `${JOURNEY_ROOT}/journey-perfume-sequence.webm`;
export const JOURNEY_VIDEO_MP4 = `${JOURNEY_ROOT}/journey-perfume-sequence.mp4`;
export const JOURNEY_POSTER = `${JOURNEY_ROOT}/journey-poster.webp`;

export const HERO_STOCK_DARK = `${STOCK_ROOT}/hero-perfume-dark.webp`;
export const HERO_STOCK_FABRIC = `${STOCK_ROOT}/hero-perfume-fabric.webp`;
export const SHOP_PERFUME_BLACK = `${STOCK_ROOT}/shop-perfume-black.webp`;
export const SHOP_PERFUME_LUXURY = `${STOCK_ROOT}/shop-perfume-luxury.webp`;
export const PRODUCT_PERFUME_CLOSEUP = `${STOCK_ROOT}/product-perfume-closeup.webp`;
export const FRAGRANCE_SPRAY_MOMENT = `${STOCK_ROOT}/fragrance-spray-moment.webp`;
export const WHATSAPP_SUPPORT_URL = String(import.meta.env.VITE_WHATSAPP_URL || '').trim();
export const HAS_WHATSAPP_SUPPORT = WHATSAPP_SUPPORT_URL.startsWith('https://wa.me/') || WHATSAPP_SUPPORT_URL.startsWith('https://api.whatsapp.com/');

const productVisuals: Record<string, string> = {
  athar: `${PRODUCT_ROOT}/athar-visual.webp`,
  barq: SHOP_PERFUME_BLACK,
  dafwa: `${PRODUCT_ROOT}/dafwa-visual.webp`,
  ghayma: `${PRODUCT_ROOT}/ghayma-visual.webp`,
  madar: `${PRODUCT_ROOT}/madar-visual.webp`,
  nada: `${PRODUCT_ROOT}/nada-visual.webp`,
  sharara: `${PRODUCT_ROOT}/sharara-visual.webp`,
  zell: `${PRODUCT_ROOT}/zell-visual.webp`,
};

const aliases: Record<string, keyof typeof productVisuals> = {
  'nfs-001': 'sharara',
  'nfs-002': 'madar',
  'nfs-003': 'athar',
  'nfs-004': 'barq',
  'nfs-005': 'nada',
  'nfs-006': 'ghayma',
  'nfs-dfw-03': 'dafwa',
  'nfs-ghm-02': 'ghayma',
  'nfs-shr-01': 'sharara',
  'nfs-zll-04': 'zell',
  zall: 'zell',
};

function slugify(value?: string) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductVisualPath(product?: any) {
  const candidates = [
    slugify(product?.slug),
    slugify(product?.name_en),
    slugify(product?.code),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const key = aliases[candidate] || candidate;
    if (productVisuals[key]) {
      return productVisuals[key];
    }
  }

  return PRODUCT_PERFUME_CLOSEUP || HERO_POSTER;
}

export function getProductStockMediaSet(product?: any) {
  const key = aliases[slugify(product?.slug)] || slugify(product?.slug);
  const library: Record<string, string[]> = {
    athar: [PRODUCT_PERFUME_CLOSEUP, HERO_STOCK_DARK, HERO_STOCK_FABRIC],
    barq: [SHOP_PERFUME_BLACK, HERO_STOCK_DARK, PRODUCT_PERFUME_CLOSEUP],
    dafwa: [HERO_STOCK_FABRIC, PRODUCT_PERFUME_CLOSEUP, FRAGRANCE_SPRAY_MOMENT],
    ghayma: [SHOP_PERFUME_LUXURY, HERO_STOCK_FABRIC, PRODUCT_PERFUME_CLOSEUP],
    madar: [HERO_STOCK_DARK, SHOP_PERFUME_BLACK, PRODUCT_PERFUME_CLOSEUP],
    nada: [SHOP_PERFUME_LUXURY, HERO_STOCK_FABRIC, PRODUCT_PERFUME_CLOSEUP],
    sharara: [SHOP_PERFUME_BLACK, PRODUCT_PERFUME_CLOSEUP, HERO_STOCK_DARK],
    zell: [HERO_STOCK_DARK, SHOP_PERFUME_BLACK, PRODUCT_PERFUME_CLOSEUP],
  };

  return library[key] || [PRODUCT_PERFUME_CLOSEUP, HERO_STOCK_DARK];
}

export function getProductPrimaryMedia(product?: any) {
  const media = product?.media || product?.product_media || [];
  const preferred = media.find((entry: any) => {
    const raw = String(entry?.url || entry?.src || '').toLowerCase();
    return raw && !/(spray|mist|smoke)/.test(raw);
  }) || media[0];

  if (preferred?.url || preferred?.src) {
    return preferred.url || preferred.src;
  }

  if (product?.local_media?.[0]) {
    return product.local_media[0];
  }

  if (product?.fallback_image_url) {
    return product.fallback_image_url;
  }

  return getProductVisualPath(product);
}
