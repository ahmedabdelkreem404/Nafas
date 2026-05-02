const PRODUCT_ROOT = '/assets/products';
const STOCK_ROOT = '/assets/stock/optimized';

export type CatalogEntry = {
  accent: 'amber' | 'copper' | 'gold' | 'rose';
  categoryAr: string;
  categoryEn: string;
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

export const perfumeCatalog: Record<string, CatalogEntry> = {
  athar: {
    accent: 'gold',
    categoryAr: 'خشبي عنبري',
    categoryEn: 'Woody amber',
    genderAr: 'للجميع',
    genderEn: 'Unisex',
    localMedia: [
      `${PRODUCT_ROOT}/athar-visual.webp`,
      `${STOCK_ROOT}/product-perfume-closeup.webp`,
      `${STOCK_ROOT}/hero-perfume-dark.webp`,
    ],
    longevityAr: 'يدوم بهدوء لساعات طويلة',
    longevityEn: 'Lasts calmly for long hours',
    moodAr: 'هادئ، عميق، أنيق',
    moodEn: 'Quiet, deep, elegant',
    nameAr: 'أثر',
    nameEn: 'Athar',
    notesAr: ['خشب الأرز', 'عنبر دافئ', 'مسك ناعم'],
    notesEn: ['Cedarwood', 'Warm amber', 'Soft musk'],
    personalityAr: 'أثر هادئ يرسخ حضوره دون ضجيج.',
    personalityEn: 'A quiet trail that settles in with confidence.',
    projectionAr: 'متوازن وواضح بقرب راقٍ',
    projectionEn: 'Balanced with polished clarity',
    seasonAr: 'المساء وكل المواسم',
    seasonEn: 'Evening, all seasons',
    slug: 'athar',
    storyAr: 'طبقات خشبية دافئة مع عنبر مصقول تمنح حضورًا طويل النفس ومقنعًا من أول دقيقة.',
    storyEn: 'Warm woods and polished amber create a longer, more deliberate presence from the first minute.',
    strengthAr: 'ثابت وأنيق',
    strengthEn: 'Steady and elegant',
    tagsAr: ['الكل', 'خشبي', 'مسكي', 'هدايا'],
    tagsEn: ['All', 'Woody', 'Musky', 'Gifts'],
  },
  barq: {
    accent: 'copper',
    categoryAr: 'فريش حار',
    categoryEn: 'Fresh spicy',
    genderAr: 'رجالي',
    genderEn: 'Men',
    localMedia: [
      `${STOCK_ROOT}/shop-perfume-black.webp`,
      `${PRODUCT_ROOT}/barq-visual.webp`,
      `${STOCK_ROOT}/hero-perfume-dark.webp`,
    ],
    longevityAr: 'ثبات متوسط يميل للطول',
    longevityEn: 'Medium-long wear',
    moodAr: 'لامع، سريع، متجدد',
    moodEn: 'Bright, fast, renewed',
    nameAr: 'برق',
    nameEn: 'Barq',
    notesAr: ['حمضيات باردة', 'فلفل وردي', 'خشب جاف'],
    notesEn: ['Cold citrus', 'Pink pepper', 'Dry woods'],
    personalityAr: 'افتتاحية لامعة وسريعة تترك انطباعًا حادًا ونظيفًا.',
    personalityEn: 'A bright entrance with a cleaner, sharper impression.',
    projectionAr: 'فوحان متوسط ببداية واضحة',
    projectionEn: 'Moderate with a clear opening',
    seasonAr: 'الصباح والطقس المعتدل',
    seasonEn: 'Morning, mild weather',
    slug: 'barq',
    storyAr: 'عطر يتحرك بخفة ويصنع لحظة أولى لا تُنسى، ثم يهدأ فوق قاعدة خشبية جافة.',
    storyEn: 'It flashes in lightly, leaves a crisp first impression, then settles over a dry woody base.',
    strengthAr: 'حضور لافت في البداية',
    strengthEn: 'Noticeable from the start',
    tagsAr: ['الكل', 'فريش', 'خشبي'],
    tagsEn: ['All', 'Fresh', 'Woody'],
  },
  dafwa: {
    accent: 'copper',
    categoryAr: 'دافئ قهوي',
    categoryEn: 'Warm coffee',
    genderAr: 'للجميع',
    genderEn: 'Unisex',
    localMedia: [
      `${PRODUCT_ROOT}/dafwa-visual.webp`,
      `${STOCK_ROOT}/hero-perfume-fabric.webp`,
      `${STOCK_ROOT}/fragrance-spray-moment.webp`,
    ],
    longevityAr: 'دافئ وممتد',
    longevityEn: 'Warm and extended',
    moodAr: 'مريح، حميم، غني',
    moodEn: 'Comforting, intimate, rich',
    nameAr: 'دفوة',
    nameEn: 'Dafwa',
    notesAr: ['قهوة محمصة', 'فانيلا', 'عنبر ناعم'],
    notesEn: ['Roasted coffee', 'Vanilla', 'Soft amber'],
    personalityAr: 'دفء واضح بلمسة قهوة ناعمة أقرب لجلدك من ضجيج المكان.',
    personalityEn: 'Warm with a soft coffee signature that stays closer to skin.',
    projectionAr: 'معتدل ومريح',
    projectionEn: 'Moderate and comforting',
    seasonAr: 'المساء والشتاء',
    seasonEn: 'Evening, winter',
    slug: 'dafwa',
    storyAr: 'تكوين دافئ يلتف حولك بنعومة، ويحوّل القهوة إلى إحساس فاخر لا إلى صخب عطري.',
    storyEn: 'A warm composition that wraps around you softly, turning coffee into comfort rather than noise.',
    strengthAr: 'دافئ وواضح',
    strengthEn: 'Warm and clear',
    tagsAr: ['الكل', 'قهوة', 'هدايا'],
    tagsEn: ['All', 'Coffee', 'Gifts'],
  },
  ghayma: {
    accent: 'rose',
    categoryAr: 'نظيف قطني',
    categoryEn: 'Clean airy',
    genderAr: 'نسائي',
    genderEn: 'Women',
    localMedia: [
      `${PRODUCT_ROOT}/ghayma-visual.webp`,
      `${STOCK_ROOT}/hero-perfume-fabric.webp`,
      `${STOCK_ROOT}/shop-perfume-luxury.webp`,
    ],
    longevityAr: 'ناعم ومريح',
    longevityEn: 'Soft and comforting',
    moodAr: 'خفيف، قطني، ناعم',
    moodEn: 'Airy, cottony, soft',
    nameAr: 'غيمة',
    nameEn: 'Ghayma',
    notesAr: ['مسك نظيف', 'أزهار بيضاء', 'بودرة ناعمة'],
    notesEn: ['Clean musk', 'White florals', 'Soft powder'],
    personalityAr: 'نعومة بيضاء تتنفس بهدوء وتناسب اليوم الطويل.',
    personalityEn: 'A white softness that breathes quietly through the day.',
    projectionAr: 'قريب من الجلد',
    projectionEn: 'Close to skin',
    seasonAr: 'اليومي وكل المواسم',
    seasonEn: 'Daily, all seasons',
    slug: 'ghayma',
    storyAr: 'رائحة نظيفة ومريحة تشبه القماش الناعم بعد أول رشة، وتبقى هادئة في محيطك.',
    storyEn: 'A clean, comforting scent that feels like soft fabric and stays gentle around you.',
    strengthAr: 'ناعم ومتزن',
    strengthEn: 'Soft and balanced',
    tagsAr: ['الكل', 'نسائي', 'فريش'],
    tagsEn: ['All', 'Women', 'Fresh'],
  },
  madar: {
    accent: 'amber',
    categoryAr: 'مسكي فريش',
    categoryEn: 'Fresh musky',
    genderAr: 'رجالي',
    genderEn: 'Men',
    localMedia: [
      `${PRODUCT_ROOT}/madar-visual.webp`,
      `${STOCK_ROOT}/hero-perfume-dark.webp`,
      `${STOCK_ROOT}/shop-perfume-black.webp`,
    ],
    longevityAr: 'ثبات واضح ومتزن',
    longevityEn: 'Noticeable, balanced wear',
    moodAr: 'نظيف، واثق، يومي',
    moodEn: 'Clean, confident, daily',
    nameAr: 'مدار',
    nameEn: 'Madar',
    notesAr: ['برغموت', 'لافندر', 'مسك بارد'],
    notesEn: ['Bergamot', 'Lavender', 'Cool musk'],
    personalityAr: 'خط يومي أنيق يدور حول حضور نظيف وواثق.',
    personalityEn: 'An elegant daily line built around clean confidence.',
    projectionAr: 'فوحان هادئ لكنه ملحوظ',
    projectionEn: 'Quiet but noticeable projection',
    seasonAr: 'النهار والعمل',
    seasonEn: 'Daytime, work',
    slug: 'madar',
    storyAr: 'افتتاحية نظيفة وباردة تلتف حول مسك مصقول، وتمنحك حضورًا مرتبًا وسهل الفهم.',
    storyEn: 'A clean, cool opening wraps around polished musk for an easy, composed presence.',
    strengthAr: 'يومي وواضح',
    strengthEn: 'Daily and clear',
    tagsAr: ['الكل', 'رجالي', 'فريش', 'مسكي'],
    tagsEn: ['All', 'Men', 'Fresh', 'Musky'],
  },
  nada: {
    accent: 'rose',
    categoryAr: 'فاكهي نظيف',
    categoryEn: 'Fruity clean',
    genderAr: 'نسائي',
    genderEn: 'Women',
    localMedia: [
      `${PRODUCT_ROOT}/nada-visual.webp`,
      `${STOCK_ROOT}/shop-perfume-luxury.webp`,
      `${STOCK_ROOT}/hero-perfume-fabric.webp`,
    ],
    longevityAr: 'خفيف إلى متوسط',
    longevityEn: 'Light to medium wear',
    moodAr: 'مشرق، ناعم، يومي',
    moodEn: 'Bright, soft, daily',
    nameAr: 'ندى',
    nameEn: 'Nada',
    notesAr: ['كمثرى', 'زهر أبيض', 'مسك نظيف'],
    notesEn: ['Pear', 'White blossom', 'Clean musk'],
    personalityAr: 'رائحة مضيئة وناعمة تناسب الخطوات اليومية والهدايا الهادئة.',
    personalityEn: 'Bright and soft, ideal for daily wear and easy gifting.',
    projectionAr: 'خفيف ومحبوب',
    projectionEn: 'Light and likable',
    seasonAr: 'النهار والربيع',
    seasonEn: 'Daytime, spring',
    slug: 'nada',
    storyAr: 'فاكهية هادئة ولمسة نظيفة تقترب من الجلد برقة، وتمنح حضورًا لطيفًا من دون تعقيد.',
    storyEn: 'Soft fruit and a clean finish settle close to skin for an easy, graceful presence.',
    strengthAr: 'خفيف ومشرق',
    strengthEn: 'Light and radiant',
    tagsAr: ['الكل', 'نسائي', 'فريش', 'هدايا'],
    tagsEn: ['All', 'Women', 'Fresh', 'Gifts'],
  },
  sharara: {
    accent: 'gold',
    categoryAr: 'فريش مسكي حار',
    categoryEn: 'Fresh musky spice',
    genderAr: 'رجالي',
    genderEn: 'Men',
    localMedia: [
      `${PRODUCT_ROOT}/sharara-visual.webp`,
      `${STOCK_ROOT}/shop-perfume-black.webp`,
      `${STOCK_ROOT}/product-perfume-closeup.webp`,
    ],
    longevityAr: 'ثبات راقٍ وممتد',
    longevityEn: 'Elegant, extended wear',
    moodAr: 'جريء، مصقول، ليلي',
    moodEn: 'Bold, polished, evening-led',
    nameAr: 'شرارة',
    nameEn: 'Sharara',
    notesAr: ['فلفل أسود', 'حمضيات', 'مسك داكن'],
    notesEn: ['Black pepper', 'Citrus', 'Dark musk'],
    personalityAr: 'افتتاحية حادة ثم مسك داكن يترك أثرًا واضحًا.',
    personalityEn: 'A sharper opening followed by a darker musky trail.',
    projectionAr: 'فوحان واضح ومضبوط',
    projectionEn: 'Clear, controlled projection',
    seasonAr: 'المساء والمناسبات',
    seasonEn: 'Evening, occasions',
    slug: 'sharara',
    storyAr: 'شرارة أولى سريعة ثم قلب أنيق يثبت حضوره بثقة، مناسب لمن يريد انطباعًا واضحًا من أول رشة.',
    storyEn: 'It opens with a fast spark, then settles into an elegant heart for a confident first impression.',
    strengthAr: 'قوي لكن مصقول',
    strengthEn: 'Strong yet polished',
    tagsAr: ['الكل', 'رجالي', 'فريش', 'مسكي'],
    tagsEn: ['All', 'Men', 'Fresh', 'Musky'],
  },
  zell: {
    accent: 'amber',
    categoryAr: 'خشبي ناعم',
    categoryEn: 'Soft woody',
    genderAr: 'للجميع',
    genderEn: 'Unisex',
    localMedia: [
      `${PRODUCT_ROOT}/zell-visual.webp`,
      `${STOCK_ROOT}/shop-perfume-black.webp`,
      `${STOCK_ROOT}/hero-perfume-dark.webp`,
    ],
    longevityAr: 'متزن وهادئ',
    longevityEn: 'Balanced and calm',
    moodAr: 'غامض، قريب، ناعم',
    moodEn: 'Shadowed, close, soft',
    nameAr: 'ظلّ',
    nameEn: 'Zell',
    notesAr: ['خشب كشميري', 'سوسن', 'عنبر شفاف'],
    notesEn: ['Cashmere wood', 'Iris', 'Transparent amber'],
    personalityAr: 'حضور قريب من الجلد، أنيق وهادئ بطابع ظلّ ناعم.',
    personalityEn: 'A skin-close elegance with a softer shadowed mood.',
    projectionAr: 'هادئ وقريب',
    projectionEn: 'Quiet and intimate',
    seasonAr: 'الليل والأجواء الهادئة',
    seasonEn: 'Night, calm settings',
    slug: 'zell',
    storyAr: 'يظهر بخفة ثم يقترب أكثر، ليصنع أثرًا خاصًا يعرفه من اقترب منك فقط.',
    storyEn: 'It appears lightly, then comes closer, becoming a trail noticed by those nearest to you.',
    strengthAr: 'ناعم لكن ثابت',
    strengthEn: 'Soft but steady',
    tagsAr: ['الكل', 'خشبي', 'هدايا'],
    tagsEn: ['All', 'Woody', 'Gifts'],
  },
  'men-gift-box': {
    accent: 'copper',
    categoryAr: 'هدية رجالي',
    categoryEn: 'Men gift box',
    genderAr: 'رجالي',
    genderEn: 'Men',
    localMedia: [
      `${STOCK_ROOT}/shop-perfume-black.webp`,
      `${STOCK_ROOT}/product-perfume-closeup.webp`,
      `${STOCK_ROOT}/hero-perfume-dark.webp`,
    ],
    longevityAr: 'حسب العطر المختار',
    longevityEn: 'Varies by selected scent',
    moodAr: 'هدية، مناسبة، اختيار أسهل',
    moodEn: 'Gift, occasion, easier choice',
    nameAr: 'بوكس هدية رجالي',
    nameEn: 'Men Gift Box',
    notesAr: ['تغليف أنيق', 'عطر من نفَس', 'مناسبة جاهزة'],
    notesEn: ['Elegant packaging', 'Nafas fragrance', 'Occasion ready'],
    personalityAr: 'هدية رجالية جاهزة بتغليف أنيق واختيار واضح للمناسبات.',
    personalityEn: 'A men gift box with elegant packaging and a clear occasion-ready choice.',
    projectionAr: 'حسب العطر المختار',
    projectionEn: 'Varies by selected scent',
    seasonAr: 'كل المناسبات',
    seasonEn: 'All occasions',
    slug: 'men-gift-box',
    storyAr: 'هدية جاهزة لعطر رجالي من نفَس بتغليف أنيق، مناسبة لو عايز اختيار مرتب من غير تعقيد.',
    storyEn: 'A gift-ready men fragrance from Nafas, wrapped cleanly for an easier, polished choice.',
    strengthAr: 'هدية جاهزة',
    strengthEn: 'Gift-ready',
    tagsAr: ['الكل', 'هدايا', 'رجالي'],
    tagsEn: ['All', 'Gifts', 'Men'],
  },
  'women-gift-box': {
    accent: 'rose',
    categoryAr: 'هدية حريمي',
    categoryEn: 'Women gift box',
    genderAr: 'نسائي',
    genderEn: 'Women',
    localMedia: [
      `${STOCK_ROOT}/shop-perfume-luxury.webp`,
      `${STOCK_ROOT}/hero-perfume-fabric.webp`,
      `${STOCK_ROOT}/product-perfume-closeup.webp`,
    ],
    longevityAr: 'حسب العطر المختار',
    longevityEn: 'Varies by selected scent',
    moodAr: 'هدية، ناعمة، مناسبة',
    moodEn: 'Gift, soft, occasion',
    nameAr: 'بوكس هدية حريمي',
    nameEn: 'Women Gift Box',
    notesAr: ['تغليف أنيق', 'عطر من نفَس', 'اختيار هادئ'],
    notesEn: ['Elegant packaging', 'Nafas fragrance', 'Calm choice'],
    personalityAr: 'هدية نسائية أنيقة وسهلة لو محتار تختار عطر مناسب.',
    personalityEn: 'An elegant women gift box for easier gifting when choosing the right scent.',
    projectionAr: 'حسب العطر المختار',
    projectionEn: 'Varies by selected scent',
    seasonAr: 'كل المناسبات',
    seasonEn: 'All occasions',
    slug: 'women-gift-box',
    storyAr: 'اختيار هدية أنيق من نفَس، بتغليف مرتب ولمسة مناسبة للمناسبات.',
    storyEn: 'A polished Nafas gift choice with clean packaging and an occasion-friendly presence.',
    strengthAr: 'هدية جاهزة',
    strengthEn: 'Gift-ready',
    tagsAr: ['الكل', 'هدايا', 'نسائي'],
    tagsEn: ['All', 'Gifts', 'Women'],
  },
  'discovery-gift-box': {
    accent: 'gold',
    categoryAr: 'هدية تجربة',
    categoryEn: 'Discovery gift box',
    genderAr: 'للجميع',
    genderEn: 'Unisex',
    localMedia: [
      `${STOCK_ROOT}/shop-perfume-luxury.webp`,
      `${STOCK_ROOT}/product-perfume-closeup.webp`,
      `${STOCK_ROOT}/hero-perfume-fabric.webp`,
    ],
    longevityAr: 'حسب العطر المختار',
    longevityEn: 'Varies by scent',
    moodAr: 'اكتشاف، هدية، اختيار هادئ',
    moodEn: 'Discovery, gifting, calm choice',
    nameAr: 'بوكس التجربة',
    nameEn: 'Discovery Gift Box',
    notesAr: ['شرارة', 'مدار', 'أثر', 'برق', 'ندى', 'غيمة'],
    notesEn: ['Sharara', 'Madar', 'Athar', 'Barq', 'Nada', 'Ghayma'],
    personalityAr: 'هدية خفيفة لاكتشاف عطور نفَس الستة قبل اختيار الزجاجة.',
    personalityEn: 'A light gift for discovering the six Nafas launch scents before choosing a bottle.',
    projectionAr: 'حسب العطر المختار',
    projectionEn: 'Varies by scent',
    seasonAr: 'كل المناسبات',
    seasonEn: 'All occasions',
    slug: 'discovery-gift-box',
    storyAr: 'مجموعة تجربة مغلفة كهدية، مناسبة لو عايز تقدم إحساس الاكتشاف بدل اختيار عطر واحد.',
    storyEn: 'A discovery set wrapped as a gift, ideal when you want to offer exploration instead of choosing one scent.',
    strengthAr: 'هدية تجربة',
    strengthEn: 'Discovery gift',
    tagsAr: ['الكل', 'هدايا', 'تستر'],
    tagsEn: ['All', 'Gifts', 'Tester'],
  },
  'discovery-set': {
    accent: 'gold',
    categoryAr: 'مجموعة تجربة',
    categoryEn: 'Discovery Set',
    genderAr: 'للجميع',
    genderEn: 'Unisex',
    localMedia: [
      `${STOCK_ROOT}/shop-perfume-luxury.webp`,
      `${STOCK_ROOT}/product-perfume-closeup.webp`,
      `${STOCK_ROOT}/hero-perfume-fabric.webp`,
    ],
    longevityAr: 'حسب العطر المختار',
    longevityEn: 'Varies by scent',
    moodAr: 'اكتشاف، هدية، اختيار هادئ',
    moodEn: 'Discovery, gifting, calm choice',
    nameAr: 'مجموعة التجربة',
    nameEn: 'Discovery Set',
    notesAr: ['شرارة', 'مدار', 'أثر', 'برق', 'ندى', 'غيمة'],
    notesEn: ['Sharara', 'Madar', 'Athar', 'Barq', 'Nada', 'Ghayma'],
    personalityAr: 'ست عينات صغيرة لتجربة عطور نفَس قبل اختيار الزجاجة المناسبة.',
    personalityEn: 'Six small samples to explore Nafas before choosing a full bottle.',
    projectionAr: 'حسب العطر المختار',
    projectionEn: 'Varies by scent',
    seasonAr: 'كل المواسم',
    seasonEn: 'All seasons',
    slug: 'discovery-set',
    storyAr: 'مجموعة تجربة بسيطة تجمع عطور الإطلاق الستة في عينات صغيرة، لتجرب الرائحة على بشرتك وتختار بهدوء.',
    storyEn: 'A simple set of the six launch scents in small samples, made for trying each scent on skin before choosing calmly.',
    strengthAr: 'تجربة كاملة',
    strengthEn: 'Complete discovery',
    tagsAr: ['الكل', 'هدايا', 'تستر'],
    tagsEn: ['All', 'Gifts', 'Tester'],
  },
};

const aliases: Record<string, string> = {
  'nfs-001': 'sharara',
  'nfs-002': 'madar',
  'nfs-003': 'athar',
  'nfs-004': 'barq',
  'nfs-005': 'nada',
  'nfs-006': 'ghayma',
  'nfs-dfw-03': 'dafwa',
  'nfs-gb-disc-01': 'discovery-gift-box',
  'nfs-gb-men-01': 'men-gift-box',
  'nfs-gb-women-01': 'women-gift-box',
  'nfs-ghm-02': 'ghayma',
  'nfs-shr-01': 'sharara',
  'nfs-zll-04': 'zell',
  zall: 'zell',
  zell: 'zell',
};

function normalizeKey(value?: string) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCatalogKey(productOrSlug?: any) {
  if (typeof productOrSlug === 'string') {
    const raw = normalizeKey(productOrSlug);
    return aliases[raw] || raw;
  }

  const candidates = [
    productOrSlug?.slug,
    productOrSlug?.name_en,
    productOrSlug?.code,
  ];

  for (const candidate of candidates) {
    const raw = normalizeKey(candidate);
    const key = aliases[raw] || raw;
    if (perfumeCatalog[key]) {
      return key;
    }
  }

  return '';
}

export function getCatalogEntry(productOrSlug?: any) {
  const key = getCatalogKey(productOrSlug);
  return perfumeCatalog[key];
}

function normalizeVariant(variant: any, index: number) {
  return {
    ...variant,
    id: variant.id ?? `${variant.size_ml ?? variant.label ?? 'variant'}-${index}`,
    in_stock: variant.in_stock !== false && variant.stock_state !== 'out_of_stock',
    label: variant.label || (variant.size_ml ? `${variant.size_ml}ml` : `Size ${index + 1}`),
    retail_price: Number(variant.retail_price || variant.price || 0),
    size_ml: variant.size_ml ?? (Number(String(variant.label || '').replace(/[^\d]/g, '')) || undefined),
    type: variant.type || (variant.is_tester ? 'tester' : 'retail'),
  };
}

export function enrichProduct(product: any) {
  const entry = getCatalogEntry(product);
  const variants = (product?.variants || []).map(normalizeVariant);

  if (!entry) {
    return {
      ...product,
      local_media: [],
      variants,
    };
  }

  return {
    ...product,
    accent: product.accent || entry.accent,
    category_ar: product.category_ar || entry.categoryAr,
    category_en: product.category_en || entry.categoryEn,
    gender_ar: product.gender_ar || entry.genderAr,
    gender_en: product.gender_en || entry.genderEn,
    local_media: entry.localMedia,
    longevity_label_ar: product.longevity_label_ar || entry.longevityAr,
    longevity_label_en: product.longevity_label_en || entry.longevityEn,
    marketing_line_ar: product.marketing_line_ar || entry.personalityAr,
    marketing_line_en: product.marketing_line_en || entry.personalityEn,
    mood_ar: product.mood_ar || entry.moodAr,
    mood_en: product.mood_en || entry.moodEn,
    name_ar: product.name_ar || entry.nameAr,
    name_en: product.name_en || entry.nameEn,
    notes_ar: product.notes_ar || entry.notesAr,
    notes_en: product.notes_en || entry.notesEn,
    personality_ar: product.personality_ar || entry.personalityAr,
    personality_en: product.personality_en || entry.personalityEn,
    projection_label_ar: product.projection_label_ar || entry.projectionAr,
    projection_label_en: product.projection_label_en || entry.projectionEn,
    season_ar: product.season_ar || entry.seasonAr,
    season_en: product.season_en || entry.seasonEn,
    slug: product.slug || entry.slug,
    story: product.story || entry.storyAr,
    story_en: product.story_en || entry.storyEn,
    strength_label_ar: product.strength_label_ar || entry.strengthAr,
    strength_label_en: product.strength_label_en || entry.strengthEn,
    tags_ar: product.tags_ar || entry.tagsAr,
    tags_en: product.tags_en || entry.tagsEn,
    variants,
  };
}

export function buildSearchableText(product: any) {
  const entry = getCatalogEntry(product);

  return [
    product?.name_ar,
    product?.name_en,
    product?.category_ar,
    product?.category_en,
    product?.gender,
    product?.gender_ar,
    product?.gender_en,
    product?.personality,
    product?.personality_ar,
    product?.personality_en,
    product?.story,
    product?.story_en,
    ...(product?.variants || []).map((variant: any) => variant.label),
    ...(entry?.tagsAr || []),
    ...(entry?.tagsEn || []),
    ...(entry?.notesAr || []),
    ...(entry?.notesEn || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function getLocalProductMedia(product: any) {
  return getCatalogEntry(product)?.localMedia || [];
}
