export type LandingSizeOption = {
  id: string;
  label: string;
  labelAr: string;
  price: number;
};

export type LandingFragrance = {
  id: string;
  slug: string;
  code: string;
  name: string;
  nameAr: string;
  line: string;
  lineAr: string;
  personality: string;
  personalityAr: string;
  usage: string;
  usageAr: string;
  strength: string;
  strengthAr: string;
  design: string;
  designAr: string;
  accent: 'gold' | 'amber' | 'copper' | 'rose';
  image: string;
  poster: string;
  texture: string;
  mood: string[];
  moodAr: string[];
  topNotes: string[];
  topNotesAr: string[];
  heartNotes: string[];
  heartNotesAr: string[];
  baseNotes: string[];
  baseNotesAr: string[];
  sizes: LandingSizeOption[];
  ctaLabel: string;
  ctaLabelAr: string;
};

export type LandingHighlight = {
  id: string;
  title: string;
  titleAr: string;
  caption: string;
  captionAr: string;
  image: string;
};

export type LandingWhyCard = {
  id: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
};

export type LandingStoryChapter = {
  id: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  visualLabel: string;
  visualLabelAr: string;
};

export type LandingChoiceCard = {
  id: string;
  fragranceId: LandingFragrance['id'] | 'discovery';
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  cta: string;
  ctaAr: string;
};

export type LandingExploreCard = {
  id: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  href: string;
  external?: boolean;
};

const heroVideo = '/assets/hero/nafas-hero.mp4';
const heroPoster = '/assets/hero/nafas-hero-poster.webp';
const mistTexture = '/assets/stock/optimized/hero-perfume-dark.webp';
const discoveryImage = '/assets/stock/optimized/hero-perfume-fabric.webp';
const giftSetImage = '/assets/stock/optimized/fragrance-spray-moment.webp';
const viewerPoster = '/assets/stock/optimized/product-perfume-closeup.webp';
const landingNoiseTexture = '/assets/generated/gold-noise.svg';

export const LANDING_WHATSAPP_URL = 'https://wa.me/200000000000';

const commonSizes: LandingSizeOption[] = [
  { id: 'ball-oil', label: 'Ball oil 4.5ml', labelAr: 'زيت رول 4.5 مل', price: 69 },
  { id: 'tester-5', label: 'Tester 5ml', labelAr: 'تستر 5 مل', price: 39 },
  { id: 'tester-10', label: 'Tester 10ml', labelAr: 'تستر 10 مل', price: 69 },
  { id: 'popular-25', label: 'Popular 25ml', labelAr: '25 مل شعبي', price: 169 },
  { id: 'branded-30', label: 'Branded 30ml', labelAr: '30 مل براندد', price: 299 },
  { id: 'popular-40', label: 'Popular 40ml', labelAr: '40 مل شعبي', price: 229 },
  { id: 'branded-50', label: 'Branded 50ml', labelAr: '50 مل براندد', price: 449 },
  { id: 'branded-100', label: 'Branded 100ml', labelAr: '100 مل براندد', price: 799 },
];

export const landingFragrances: LandingFragrance[] = [
  {
    id: 'sharara',
    slug: 'sharara',
    code: 'NFS-SHR-01',
    name: 'Sharara',
    nameAr: 'شرارة',
    line: 'First spray, lasting impression.',
    lineAr: 'أول رشة تلفت، وأثر يفضل.',
    personality: 'Fresh, spicy, and musky with a darker finish.',
    personalityAr: 'فريش، حار، ومسكي بطابع أغمق في النهاية.',
    usage: 'Daywear and early evening.',
    usageAr: 'للنهار وبداية المساء.',
    strength: 'Medium-to-high presence with a clear trail.',
    strengthAr: 'حضور متوسط إلى قوي مع أثر واضح.',
    design: 'Matte black with copper and amber warmth.',
    designAr: 'أسود مطفي مع نحاسي ولمعة عنبر.',
    accent: 'copper',
    image: '/assets/products/sharara-visual.webp',
    poster: viewerPoster,
    texture: landingNoiseTexture,
    mood: ['Fresh', 'Spicy', 'Musky'],
    moodAr: ['فريش', 'حار', 'مسكي'],
    topNotes: ['Bergamot', 'Pink pepper'],
    topNotesAr: ['برغموت', 'فلفل وردي'],
    heartNotes: ['Saffron', 'Soft herbs'],
    heartNotesAr: ['زعفران', 'أعشاب ناعمة'],
    baseNotes: ['Dark musk', 'Warm woods'],
    baseNotesAr: ['مسك داكن', 'أخشاب دافئة'],
    sizes: commonSizes,
    ctaLabel: 'Try Sharara',
    ctaLabelAr: 'جرّب شرارة',
  },
  {
    id: 'ghayma',
    slug: 'ghayma',
    code: 'NFS-GHM-02',
    name: 'Ghayma',
    nameAr: 'غيمة',
    line: 'Softness that stays in memory.',
    lineAr: 'نعومة تتعلق في الذاكرة.',
    personality: 'Soft, fruity, floral, and musky.',
    personalityAr: 'ناعم، فاكهي، زهري، ومسكي.',
    usage: 'Daytime, gifting, and calm evenings.',
    usageAr: 'للنهار، للهدايا، وللمساء الهادئ.',
    strength: 'Soft-to-medium presence with elegant longevity.',
    strengthAr: 'حضور هادئ إلى متوسط مع ثبات أنيق.',
    design: 'Off-white glass with rose-gold accents.',
    designAr: 'أوف وايت مع لمسات روز جولد.',
    accent: 'rose',
    image: '/assets/products/ghayma-visual.webp',
    poster: viewerPoster,
    texture: landingNoiseTexture,
    mood: ['Soft', 'Fruity', 'Floral', 'Musky'],
    moodAr: ['ناعم', 'فاكهي', 'زهري', 'مسكي'],
    topNotes: ['Pear', 'Soft citrus'],
    topNotesAr: ['كمثرى', 'حمضيات ناعمة'],
    heartNotes: ['White florals', 'Cotton petals'],
    heartNotesAr: ['زهور بيضاء', 'بتلات قطنية'],
    baseNotes: ['Clean musk', 'Powdered warmth'],
    baseNotesAr: ['مسك نظيف', 'دفء بودري'],
    sizes: commonSizes,
    ctaLabel: 'Try Ghayma',
    ctaLabelAr: 'جرّب غيمة',
  },
  {
    id: 'Nada',
    slug: 'Nada',
    code: 'NFS-DFW-03',
    name: 'Nada',
    nameAr: 'ندى',
    line: 'Warm coffee. Unforgettable presence.',
    lineAr: 'قهوة دافية… وحضور مايتنسيش.',
    personality: 'Warm coffee, sweet depth, and oriental character.',
    personalityAr: 'قهوة دافية، عمق حلو، وطابع شرقي.',
    usage: 'Evenings, cooler weather, and special moments.',
    usageAr: 'للمساء، الأجواء الباردة، واللحظات الخاصة.',
    strength: 'Medium-to-high presence with rich depth.',
    strengthAr: 'حضور متوسط إلى قوي مع عمق واضح.',
    design: 'Mocha brown with warm gold details.',
    designAr: 'موكا بني مع تفاصيل ذهبية دافئة.',
    accent: 'amber',
    image: '/assets/products/Nada-visual.webp',
    poster: viewerPoster,
    texture: landingNoiseTexture,
    mood: ['Warm', 'Coffee', 'Sweet', 'Oriental'],
    moodAr: ['دافئ', 'قهوة', 'حلو', 'شرقي'],
    topNotes: ['Roasted coffee', 'Dark caramel'],
    topNotesAr: ['قهوة محمصة', 'كراميل داكن'],
    heartNotes: ['Vanilla', 'Sweet resin'],
    heartNotesAr: ['فانيلا', 'راتنج حلو'],
    baseNotes: ['Amber', 'Velvet woods'],
    baseNotesAr: ['عنبر', 'أخشاب مخملية'],
    sizes: commonSizes,
    ctaLabel: 'Try Nada',
    ctaLabelAr: 'جرّب ندى',
  },
  {
    id: 'Madar',
    slug: 'Madar',
    code: 'NFS-ZLL-04',
    name: 'Madar',
    nameAr: 'مدار',
    line: 'Quiet, but never unnoticed.',
    lineAr: 'هادئ… لكنه بيسيب أثر.',
    personality: 'Woody, dark, and musky with calm depth.',
    personalityAr: 'خشبي، غامض، ومسكي بعمق هادئ.',
    usage: 'Quiet evenings and elegant daily wear.',
    usageAr: 'للمساء الهادئ والأناقة اليومية.',
    strength: 'Medium presence with a lingering close trail.',
    strengthAr: 'حضور متوسط مع أثر قريب يدوم.',
    design: 'Charcoal glass with silver restraint.',
    designAr: 'فحمي داكن مع لمسة فضية هادئة.',
    accent: 'gold',
    image: '/assets/products/Madar-visual.webp',
    poster: viewerPoster,
    texture: landingNoiseTexture,
    mood: ['Woody', 'Dark', 'Musky'],
    moodAr: ['خشبي', 'غامض', 'مسكي'],
    topNotes: ['Dry spice', 'Cool air'],
    topNotesAr: ['بهار جاف', 'نسمة باردة'],
    heartNotes: ['Cashmere wood', 'Calm iris'],
    heartNotesAr: ['خشب كشميري', 'سوسن هادئ'],
    baseNotes: ['Quiet musk', 'Shadow amber'],
    baseNotesAr: ['مسك هادئ', 'عنبر ناعم'],
    sizes: commonSizes,
    ctaLabel: 'Try Madar',
    ctaLabelAr: 'جرّب مدار',
  },
];

export const landingHighlights: LandingHighlight[] = [
  {
    id: 'sharara',
    title: 'Sharara',
    titleAr: 'شرارة',
    caption: 'Fresh spice, dark musk, and a first spray that gets noticed.',
    captionAr: 'فريش حار بطابع مسكي داكن… أول رشة تلفت.',
    image: landingFragrances[0].image,
  },
  {
    id: 'ghayma',
    title: 'Ghayma',
    titleAr: 'غيمة',
    caption: 'Soft fruity musk made for gifts, calm days, and elegant memories.',
    captionAr: 'فاكهي ناعم ومسكي… هدية هادية تتعلق في الذاكرة.',
    image: landingFragrances[1].image,
  },
  {
    id: 'Nada',
    title: 'Nada',
    titleAr: 'ندى',
    caption: 'Warm coffee, sweet depth, and a night scent with quiet fire.',
    captionAr: 'قهوة دافية بطابع حلو وشرقي… لليل واللحظات الخاصة.',
    image: landingFragrances[2].image,
  },
  {
    id: 'Madar',
    title: 'Madar',
    titleAr: 'مدار',
    caption: 'Dark woods and calm musk for people who prefer quiet depth.',
    captionAr: 'خشبي داكن وهادئ… عمق من غير دوشة.',
    image: landingFragrances[3].image,
  },
  {
    id: 'discovery',
    title: 'Discovery Mini',
    titleAr: 'Discovery Mini',
    caption: 'Try the six launch scents before choosing your full bottle.',
    captionAr: 'جرّب الست روائح قبل ما تختار زجاجتك.',
    image: discoveryImage,
  },
  {
    id: 'gift-set',
    title: 'Gift Set',
    titleAr: 'Gift Set',
    caption: 'A premium gift with a scent for every personality.',
    captionAr: 'هدية Premium… كل ريحة فيها شخصية.',
    image: giftSetImage,
  },
  {
    id: 'quality-ritual',
    title: 'Quality Ritual',
    titleAr: 'طقس الجودة',
    caption: 'Every batch is checked for clarity, spray behavior, and presentation.',
    captionAr: 'كل باتش يتراجع في الصفاء، الرش، والتقديم العام.',
    image: '/assets/stock/optimized/product-perfume-closeup.webp',
  },
];

export const landingWhyCards: LandingWhyCard[] = [
  {
    id: 'tester-first',
    title: 'Tester-first experience',
    titleAr: 'تجربة التستر أولًا',
    body: 'Try before choosing your full bottle.',
    bodyAr: 'جرّب قبل ما تختار الزجاجة الكاملة.',
  },
  {
    id: 'clear-personalities',
    title: 'Four clear scent personalities',
    titleAr: 'أربع شخصيات واضحة',
    body: 'Fresh, soft, warm, and dark — each scent has a clear role.',
    bodyAr: 'فريش، ناعم، دافئ، وغامض… كل ريحة لها دور واضح.',
  },
  {
    id: 'gift-ready',
    title: 'Premium gift-ready design',
    titleAr: 'تقديم Premium مناسب للهدية',
    body: 'Designed to look as composed as it smells.',
    bodyAr: 'متصمم بشكل هادئ ومهندم بقدر ما هو جميل في الرائحة.',
  },
  {
    id: 'quality',
    title: 'Batch quality ritual',
    titleAr: 'طقس جودة لكل باتش',
    body: 'Reviewed for clarity, spray behavior, and presentation.',
    bodyAr: 'مراجعة للصفاء، الرش، والتقديم العام.',
  },
  {
    id: 'whatsapp',
    title: 'Easy WhatsApp ordering',
    titleAr: 'طلب واتساب سهل',
    body: 'Ask, choose, and order without friction.',
    bodyAr: 'اسأل، اختار، واطلب ببساطة.',
  },
  {
    id: 'sizes',
    title: 'Sizes for every need',
    titleAr: 'أحجام لكل احتياج',
    body: 'Tester, travel, full bottle, and gift options.',
    bodyAr: 'تستر، حجم سفر، زجاجة كاملة، وخيارات هدية.',
  },
];

export const landingStoryChapters: LandingStoryChapter[] = [
  {
    id: 'opening',
    title: 'Opening',
    titleAr: 'الافتتاحية',
    body: 'The first spray introduces the mood with a clear opening note.',
    bodyAr: 'أول رشة بتعرفك على المود من أول لحظة.',
    visualLabel: 'Mist burst',
    visualLabelAr: 'ومضة الرشة',
  },
  {
    id: 'heart',
    title: 'Heart',
    titleAr: 'القلب',
    body: 'The scent settles into its signature body and personality.',
    bodyAr: 'بعد الدقائق الأولى، الرائحة تبدأ تثبت على شخصيتها الحقيقية.',
    visualLabel: 'Signature body',
    visualLabelAr: 'القلب الحقيقي',
  },
  {
    id: 'trail',
    title: 'Trail',
    titleAr: 'الأثر',
    body: 'What remains is the trace people remember after you leave.',
    bodyAr: 'اللي بيفضل بعدك هو الأثر… وده نفَس العطر.',
    visualLabel: 'Lasting trace',
    visualLabelAr: 'الأثر الباقي',
  },
];

export const landingFlowSteps = [
  {
    id: 'tester',
    title: 'Order a tester',
    titleAr: 'اطلب تستر',
  },
  {
    id: 'wear',
    title: 'Wear it for a full day',
    titleAr: 'جرّبه يوم كامل',
  },
  {
    id: 'choose',
    title: 'Choose your bottle',
    titleAr: 'اختار زجاجتك',
  },
  {
    id: 'reorder',
    title: 'Come back to the same scent anytime',
    titleAr: 'ارجع لنفس الريحة في أي وقت',
  },
];

export const landingMedia = {
  discoveryImage,
  giftSetImage,
  heroPoster,
  heroVideo,
  mistTexture,
  viewerPoster,
};

export const landingBetterTogether = {
  title: 'Better as a set.',
  titleAr: 'أفضل كمجموعة.',
  body: 'Start with the Discovery Mini, move to the bottle that feels like you, or choose a gift-ready set for someone else.',
  bodyAr: 'ابدأ بـ Discovery Mini، وبعدها اختار الزجاجة اللي شبهك، أو خذها كهدية جاهزة لشخص مهم.',
  bullets: [
    'Discovery Mini for the first impression',
    'A full bottle once one mood becomes yours',
    'Gift set presentation for a refined first gift',
  ],
  bulletsAr: [
    'Discovery Mini للتجربة الأولى',
    'زجاجة كاملة لما المود يثبت معك',
    'Gift Set بتقديم هادئ وأفخم',
  ],
};

export const landingChoiceCards: LandingChoiceCard[] = [
  {
    id: 'choice-sharara',
    fragranceId: 'sharara',
    title: 'Start with Sharara',
    titleAr: 'ابدأ بشرارة',
    body: 'Fresh spice with a darker musky signature for people who want presence from the first spray.',
    bodyAr: 'فريش حار بطابع مسكي أغمق… لمن يحب الحضور من أول رشة.',
    cta: 'Try Sharara',
    ctaAr: 'جرّب شرارة',
  },
  {
    id: 'choice-ghayma',
    fragranceId: 'ghayma',
    title: 'Choose Ghayma for gifts',
    titleAr: 'اختر غيمة لو تفكر في هدية',
    body: 'Soft fruity musk with a calmer elegance that feels easy to gift and easy to wear.',
    bodyAr: 'مسكي فاكهي ناعم بأناقة أهدأ… سهل كهدية وسهل في اللبس اليومي.',
    cta: 'Try Ghayma',
    ctaAr: 'جرّب غيمة',
  },
  {
    id: 'choice-Nada',
    fragranceId: 'Nada',
    title: 'Go warmer with Nada',
    titleAr: 'اذهب للأدفأ مع ندى',
    body: 'Coffee warmth, sweet depth, and evening character for colder nights and special moments.',
    bodyAr: 'دفء القهوة وعمق حلو للمساء، الشتاء، واللحظات الخاصة.',
    cta: 'Try Nada',
    ctaAr: 'جرّب ندى',
  },
  {
    id: 'choice-discovery',
    fragranceId: 'discovery',
    title: 'Not sure yet? Start with Discovery Mini',
    titleAr: 'لسه محتار؟ ابدأ بـ Discovery Mini',
    body: 'Try the six launch scents first, then return for the bottle that stays with you.',
    bodyAr: 'جرّب الست روائح أولًا، وبعدها ارجع للزجاجة التي تثبت معك.',
    cta: 'Order Discovery Mini',
    ctaAr: 'اطلب Discovery Mini',
  },
];

export const landingExploreCards: LandingExploreCard[] = [
  {
    id: 'shop',
    title: 'Shop the collection',
    titleAr: 'تسوّق المجموعة',
    body: 'See the six launch scents together with sizes, testers, and gift options.',
    bodyAr: 'شاهد الست روائح الأساسية مع الأحجام، التستر، وخيارات الهدية.',
    href: '/shop',
  },
  {
    id: 'faq',
    title: 'Questions before you choose?',
    titleAr: 'أسئلة قبل الاختيار؟',
    body: 'Read the common answers about sizes, testers, ordering, and returns.',
    bodyAr: 'اقرأ الإجابات الأكثر شيوعًا عن الأحجام، التستر، الطلب، والاسترجاع.',
    href: '/faq',
  },
  {
    id: 'about',
    title: 'Meet Nafas',
    titleAr: 'تعرّف على Nafas',
    body: 'Learn the mood, design direction, and quality philosophy behind the brand.',
    bodyAr: 'تعرّف على فلسفة المود، التصميم، وطقس الجودة خلف العلامة.',
    href: '/about',
  },
];

export const landingTeaserMoods = [
  { id: 'madar', label: 'Madar', labelAr: 'مدار' },
  { id: 'athar', label: 'Athar', labelAr: 'أثر' },
  { id: 'barq', label: 'Barq', labelAr: 'برق' },
  { id: 'nada', label: 'Nada', labelAr: 'ندى' },
];

