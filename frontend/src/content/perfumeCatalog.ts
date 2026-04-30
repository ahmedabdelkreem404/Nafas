const PRODUCT_ROOT = '/assets/products';
const STOCK_ROOT = '/assets/stock/optimized';

export type CatalogEntry = {
  accent: 'amber' | 'copper' | 'gold' | 'rose';
  categoryAr: string;
  categoryEn: string;
  code: string;
  genderAr: string;
  genderEn: string;
  localMedia: string[];
  longevityAr: string;
  longevityEn: string;
  moodAr: string;
  moodEn: string;
  nameAr: string;
  nameEn: string;
  notesAr: string[];
  notesEn: string[];
  personalityAr: string;
  personalityEn: string;
  projectionAr: string;
  projectionEn: string;
  seasonAr: string;
  seasonEn: string;
  slug: string;
  storyAr: string;
  storyEn: string;
  strengthAr: string;
  strengthEn: string;
  tagsAr: string[];
  tagsEn: string[];
};

export const launchSlugs = ['sharara', 'madar', 'athar', 'barq', 'nada', 'ghayma'] as const;
export type LaunchSlug = (typeof launchSlugs)[number];

export const perfumeCatalog: Record<LaunchSlug, CatalogEntry> = {
  sharara: {
    accent: 'gold',
    categoryAr: 'رجالي يومي فريش',
    categoryEn: 'Fresh daily men',
    code: 'NFS-001',
    genderAr: 'رجالي',
    genderEn: 'Men',
    localMedia: [`${PRODUCT_ROOT}/sharara-visual.webp`, `${STOCK_ROOT}/shop-perfume-black.webp`, `${STOCK_ROOT}/product-perfume-closeup.webp`],
    longevityAr: 'طويل بصورة واقعية',
    longevityEn: 'Realistically long',
    moodAr: 'فريش، حار، داكن، مسكي',
    moodEn: 'Fresh, spicy, dark, musky',
    nameAr: 'شرارة',
    nameEn: 'Sharara',
    notesAr: ['حمضيات باردة', 'توابل نظيفة', 'خشب داكن', 'مسك'],
    notesEn: ['Cool citrus', 'Clean spice', 'Dark woods', 'Musk'],
    personalityAr: 'العطر الرجالي الرئيسي للإطلاق: بداية حادة ثم أثر مسكي داكن ومضبوط.',
    personalityEn: 'The main men launch scent: a sharp opening followed by a controlled dark musky trail.',
    projectionAr: 'واضح ومضبوط',
    projectionEn: 'Clear and controlled',
    seasonAr: 'كل المواسم، أفضل مساء وفي الجو المعتدل',
    seasonEn: 'All seasons, best evening and mild weather',
    slug: 'sharara',
    storyAr: 'شرارة يفتح الكولكشن بحضور رجالي واثق، فريش في البداية ثم أعمق وأكثر مسكية.',
    storyEn: 'Sharara opens the collection with confident men presence: fresh at first, then deeper and muskier.',
    strengthAr: 'قوي لكن مصقول',
    strengthEn: 'Strong yet polished',
    tagsAr: ['الكل', 'رجالي', 'يومي', 'فريش', 'غامق', 'مسكي', 'هدايا', 'تستر'],
    tagsEn: ['All', 'Men', 'Daily', 'Fresh', 'Dark', 'Musky', 'Gifts', 'Tester'],
  },
  madar: {
    accent: 'amber',
    categoryAr: 'رجالي يومي فريش',
    categoryEn: 'Fresh daily men',
    code: 'NFS-002',
    genderAr: 'رجالي',
    genderEn: 'Men',
    localMedia: [`${PRODUCT_ROOT}/madar-visual.webp`, `${STOCK_ROOT}/hero-perfume-dark.webp`, `${STOCK_ROOT}/shop-perfume-black.webp`],
    longevityAr: 'متوسط متزن',
    longevityEn: 'Balanced medium',
    moodAr: 'فريش، خشبي، رياضي، يومي',
    moodEn: 'Fresh, woody, sporty, daily',
    nameAr: 'مدار',
    nameEn: 'Madar',
    notesAr: ['جريب فروت', 'لافندر', 'خشب نظيف', 'مسك بارد'],
    notesEn: ['Grapefruit', 'Lavender', 'Clean woods', 'Cool musk'],
    personalityAr: 'فريش خشبي رياضي، اختيار يومي سهل للعمل والحركة.',
    personalityEn: 'A fresh woody sporty scent, easy for work and daily movement.',
    projectionAr: 'هادئ لكنه ملحوظ',
    projectionEn: 'Quiet but noticeable',
    seasonAr: 'الصيف والربيع والنهار',
    seasonEn: 'Summer, spring, daytime',
    slug: 'madar',
    storyAr: 'مدار مصمم للاستخدام اليومي: نظيف، مرتب، ويدور مع اليوم بدون ثقل.',
    storyEn: 'Madar is designed for daily use: clean, composed, and easy through the day.',
    strengthAr: 'يومي وواضح',
    strengthEn: 'Daily and clear',
    tagsAr: ['الكل', 'رجالي', 'يومي', 'فريش', 'خشبي', 'تستر'],
    tagsEn: ['All', 'Men', 'Daily', 'Fresh', 'Woody', 'Tester'],
  },
  athar: {
    accent: 'gold',
    categoryAr: 'رجالي غامق قوي',
    categoryEn: 'Strong dark men',
    code: 'NFS-003',
    genderAr: 'رجالي',
    genderEn: 'Men',
    localMedia: [`${PRODUCT_ROOT}/athar-visual.webp`, `${STOCK_ROOT}/product-perfume-closeup.webp`, `${STOCK_ROOT}/hero-perfume-dark.webp`],
    longevityAr: 'طويل وواضح',
    longevityEn: 'Long and clear',
    moodAr: 'غامق، فريش، خشبي، قوي',
    moodEn: 'Dark, fresh, woody, strong',
    nameAr: 'أثر',
    nameEn: 'Athar',
    notesAr: ['افتتاحية داكنة', 'خشب', 'لمسة جلدية', 'مسك'],
    notesEn: ['Dark opening', 'Woods', 'Soft leather nuance', 'Musk'],
    personalityAr: 'داكن فريش خشبي، قوي وطويل الانطباع بدون وعود مبالغ فيها.',
    personalityEn: 'Dark fresh woody, strong and memorable without exaggerated claims.',
    projectionAr: 'قوي لكن غير مزعج',
    projectionEn: 'Strong but not harsh',
    seasonAr: 'الخريف والشتاء والمساء',
    seasonEn: 'Autumn, winter, evening',
    slug: 'athar',
    storyAr: 'أثر عطر حضور ورصانة، مناسب لمن يريد رائحة رجالية أعمق وأطول ذاكرة.',
    storyEn: 'Athar is presence and composure, for someone who wants a deeper masculine memory.',
    strengthAr: 'ثابت وواثق',
    strengthEn: 'Steady and confident',
    tagsAr: ['الكل', 'رجالي', 'مساء', 'غامق', 'خشبي', 'هدايا'],
    tagsEn: ['All', 'Men', 'Evening', 'Dark', 'Woody', 'Gifts'],
  },
  barq: {
    accent: 'copper',
    categoryAr: 'رجالي غامق قوي',
    categoryEn: 'Strong dark men',
    code: 'NFS-004',
    genderAr: 'رجالي',
    genderEn: 'Men',
    localMedia: [`${STOCK_ROOT}/shop-perfume-black.webp`, `${PRODUCT_ROOT}/barq-visual.webp`, `${STOCK_ROOT}/hero-perfume-dark.webp`],
    longevityAr: 'متوسط إلى طويل',
    longevityEn: 'Medium to long',
    moodAr: 'فريش، حار، قهوة، لامع',
    moodEn: 'Fresh, spicy, coffee, bright',
    nameAr: 'برق',
    nameEn: 'Barq',
    notesAr: ['قهوة خفيفة', 'حبهان', 'لافندر', 'عنبر'],
    notesEn: ['Light coffee', 'Cardamom', 'Lavender', 'Amber'],
    personalityAr: 'قهوة فريش حارة تلمع من أول رشة ثم تهدأ بدفء محسوب.',
    personalityEn: 'Fresh spicy coffee that flashes from the first spray, then settles warm.',
    projectionAr: 'بداية واضحة ثم متزنة',
    projectionEn: 'Clear opening, then balanced',
    seasonAr: 'الخريف والجو المعتدل',
    seasonEn: 'Autumn and mild weather',
    slug: 'barq',
    storyAr: 'برق يقدم القهوة بطريقة فريش وليست شتوية ثقيلة، مناسب للخروج والمساء.',
    storyEn: 'Barq presents coffee in a fresher way, not a heavy winter-only scent.',
    strengthAr: 'لافت في البداية',
    strengthEn: 'Noticeable from the start',
    tagsAr: ['الكل', 'رجالي', 'مساء', 'فريش', 'قهوة', 'غامق', 'تستر'],
    tagsEn: ['All', 'Men', 'Evening', 'Fresh', 'Coffee', 'Dark', 'Tester'],
  },
  nada: {
    accent: 'rose',
    categoryAr: 'حريمي فريش يومي',
    categoryEn: 'Fresh daily women',
    code: 'NFS-005',
    genderAr: 'حريمي',
    genderEn: 'Women',
    localMedia: [`${PRODUCT_ROOT}/nada-visual.webp`, `${STOCK_ROOT}/shop-perfume-luxury.webp`, `${STOCK_ROOT}/hero-perfume-fabric.webp`],
    longevityAr: 'متوسط ناعم',
    longevityEn: 'Soft medium',
    moodAr: 'فريش، فاكهي، نظيف، أنثوي',
    moodEn: 'Fresh, fruity, clean, feminine',
    nameAr: 'ندى',
    nameEn: 'Nada',
    notesAr: ['فاكهة ناعمة', 'زهور بيضاء', 'مسك نظيف', 'خشب خفيف'],
    notesEn: ['Soft fruit', 'White flowers', 'Clean musk', 'Light woods'],
    personalityAr: 'فريش فاكهي نظيف وأنثوي، مناسب للاستخدام اليومي والهدايا الهادئة.',
    personalityEn: 'Fresh, fruity, clean, and feminine for daily use and soft gifting.',
    projectionAr: 'ناعم ومحبوب',
    projectionEn: 'Soft and likable',
    seasonAr: 'الربيع والصيف والنهار',
    seasonEn: 'Spring, summer, daytime',
    slug: 'nada',
    storyAr: 'ندى هو الجانب الأنثوي اليومي من نفس: فاكهة ناعمة وقلب نظيف وحضور مريح.',
    storyEn: 'Nada is the daily feminine side of Nafas: soft fruit, clean heart, and comfortable presence.',
    strengthAr: 'خفيف ومشرق',
    strengthEn: 'Light and radiant',
    tagsAr: ['الكل', 'حريمي', 'يومي', 'فريش', 'فاكهي', 'هدايا'],
    tagsEn: ['All', 'Women', 'Daily', 'Fresh', 'Fruity', 'Gifts'],
  },
  ghayma: {
    accent: 'rose',
    categoryAr: 'حريمي هدايا ناعم',
    categoryEn: 'Soft women gifting',
    code: 'NFS-006',
    genderAr: 'حريمي',
    genderEn: 'Women',
    localMedia: [`${PRODUCT_ROOT}/ghayma-visual.webp`, `${STOCK_ROOT}/hero-perfume-fabric.webp`, `${STOCK_ROOT}/shop-perfume-luxury.webp`],
    longevityAr: 'متوسط مريح',
    longevityEn: 'Comfortable medium',
    moodAr: 'ناعم، فاكهي، مسكي، هدية',
    moodEn: 'Soft, fruity, musky, giftable',
    nameAr: 'غيمة',
    nameEn: 'Ghayma',
    notesAr: ['خوخ ناعم', 'زهور خفيفة', 'مسك', 'فانيليا شفافة'],
    notesEn: ['Soft peach', 'Light florals', 'Musk', 'Transparent vanilla'],
    personalityAr: 'ناعمة فاكهية مسكية، سهلة كهدية ومناسبة لمن يحب الروائح الهادئة.',
    personalityEn: 'Soft fruity musky, easy to gift and suited to gentle scent lovers.',
    projectionAr: 'قريب وحريري',
    projectionEn: 'Close and silky',
    seasonAr: 'كل المواسم والهدايا',
    seasonEn: 'All seasons and gifting',
    slug: 'ghayma',
    storyAr: 'غيمة لا تدخل بصوت عال؛ هي هدوء فاكهي مسكي يصلح للهدايا واللحظات الناعمة.',
    storyEn: 'Ghayma does not enter loudly; it is fruity musky softness for gifting and gentle moments.',
    strengthAr: 'ناعم ومتزن',
    strengthEn: 'Soft and balanced',
    tagsAr: ['الكل', 'حريمي', 'هدايا', 'فاكهي', 'مسكي', 'تستر'],
    tagsEn: ['All', 'Women', 'Gifts', 'Fruity', 'Musky', 'Tester'],
  },
};

const aliases: Record<string, LaunchSlug> = {
  'nfs-001': 'sharara',
  'nfs-002': 'madar',
  'nfs-003': 'athar',
  'nfs-004': 'barq',
  'nfs-005': 'nada',
  'nfs-006': 'ghayma',
};

function normalizeKey(value?: string) {
  return (value || '').toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
}

export function getCatalogKey(productOrSlug?: any) {
  if (typeof productOrSlug === 'string') {
    const raw = normalizeKey(productOrSlug);
    return aliases[raw] || raw;
  }

  for (const candidate of [productOrSlug?.slug, productOrSlug?.code, productOrSlug?.name_en]) {
    const raw = normalizeKey(candidate);
    const key = aliases[raw] || raw;
    if (key in perfumeCatalog) return key;
  }

  return '';
}

export function getCatalogEntry(productOrSlug?: any) {
  return perfumeCatalog[getCatalogKey(productOrSlug) as LaunchSlug];
}

function normalizeVariant(variant: any, index: number) {
  return {
    ...variant,
    id: variant.id ?? `${variant.size_ml ?? variant.label ?? 'variant'}-${index}`,
    in_stock: variant.in_stock !== false && variant.stock_state !== 'out_of_stock' && variant.is_active !== false,
    label: variant.label || (variant.size_ml ? `${variant.size_ml}ml` : `Size ${index + 1}`),
    retail_price: Number(variant.retail_price || variant.price || 0),
    size_ml: variant.size_ml ?? (Number(String(variant.label || '').replace(/[^\d]/g, '')) || undefined),
    type: variant.type || (variant.is_tester ? 'tester' : 'retail'),
  };
}

export function enrichProduct(product: any) {
  const entry = getCatalogEntry(product);
  const variants = (product?.variants || []).map(normalizeVariant);

  if (!entry) return { ...product, local_media: [], variants };

  return {
    ...product,
    accent: product.accent || entry.accent,
    category_ar: entry.categoryAr,
    category_en: entry.categoryEn,
    code: product.code || entry.code,
    gender_ar: entry.genderAr,
    gender_en: entry.genderEn,
    local_media: entry.localMedia,
    longevity_label_ar: entry.longevityAr,
    longevity_label_en: entry.longevityEn,
    marketing_line_ar: product.marketing_line_ar || entry.personalityAr,
    marketing_line_en: product.marketing_line_en || entry.personalityEn,
    mood_ar: entry.moodAr,
    mood_en: entry.moodEn,
    name_ar: product.name_ar || entry.nameAr,
    name_en: product.name_en || entry.nameEn,
    notes_ar: entry.notesAr,
    notes_en: entry.notesEn,
    personality_ar: entry.personalityAr,
    personality_en: entry.personalityEn,
    projection_label_ar: entry.projectionAr,
    projection_label_en: entry.projectionEn,
    season_ar: entry.seasonAr,
    season_en: entry.seasonEn,
    slug: entry.slug,
    story: product.story || entry.storyAr,
    story_en: product.story_en || entry.storyEn,
    strength_label_ar: entry.strengthAr,
    strength_label_en: entry.strengthEn,
    tags_ar: entry.tagsAr,
    tags_en: entry.tagsEn,
    variants,
  };
}

export function buildSearchableText(product: any) {
  const entry = getCatalogEntry(product);
  return [
    product?.name_ar,
    product?.name_en,
    product?.code,
    product?.gender,
    entry?.categoryAr,
    entry?.categoryEn,
    entry?.moodAr,
    entry?.moodEn,
    ...(product?.variants || []).map((variant: any) => variant.label),
    ...(entry?.tagsAr || []),
    ...(entry?.tagsEn || []),
    ...(entry?.notesAr || []),
    ...(entry?.notesEn || []),
  ].filter(Boolean).join(' ').toLowerCase();
}

export function getLocalProductMedia(product: any) {
  return getCatalogEntry(product)?.localMedia || [];
}
