import type { Locale } from '../../../context/LocaleContext';
import type { ChoiceId, Highlight, ScentId, ViewerTab } from '../types';

type Localized<T = string> = Record<Locale, T>;

export const text = <T,>(value: Localized<T>, locale: Locale): T => value[locale];

export const appleHomeCopy = {
  ribbon: {
    aria: { ar: 'إعلان نفَس', en: 'Nafas announcement' },
    body: {
      ar: 'اكتشف مجموعة نفَس الأولى: أربع روائح، أربع حالات مزاجية، وتجربة تستر قبل اختيار الزجاجة.',
      en: 'Discover the first Nafas collection: four scent moods, tester-first discovery, and a calmer way to choose.',
    },
    cta: { ar: 'ابدأ بالتستر', en: 'Start with testers' },
  },
  ritual: {
    aria: { ar: 'طقس نفَس السينمائي', en: 'Nafas cinematic ritual' },
    kicker: { ar: 'طقس نفَس', en: 'Nafas ritual' },
    moment: { ar: 'لحظة الرشة', en: 'First spray' },
    primaryCta: { ar: 'اكتشف العطور', en: 'Shop the collection' },
    secondaryCta: { ar: 'جرّب التستر', en: 'Start with testers' },
    play: { ar: 'تشغيل العرض التلقائي', en: 'Play carousel' },
    pause: { ar: 'إيقاف العرض التلقائي', en: 'Pause carousel' },
    select: { ar: 'اعرض', en: 'Show' },
  },
  highlights: {
    kicker: { ar: 'لمحات المجموعة', en: 'Collection highlights' },
    title: { ar: 'اكتشف نفَسك من أول رشة.', en: 'Meet the mood behind every bottle.' },
    carousel: { ar: 'عرض لمحات العطور', en: 'Highlights carousel' },
    controls: { ar: 'أدوات عرض اللمحات', en: 'Highlight controls' },
    slides: { ar: 'شرائح اللمحات', en: 'Highlight slides' },
  },
  emotional: {
    kicker: { ar: 'لحظة العلامة', en: 'Brand moment' },
    title: { ar: 'رائحة تشبه حضورك.', en: 'A scent that feels close to you.' },
    body: {
      ar: 'أربع روائح واضحة، من شرارة اللافتة إلى غيمة الناعمة، ومن دفوة الدافئة إلى ظلّ الهادئ.',
      en: 'Four clear signatures: bright Sharara, soft Ghayma, warm Dafwa, and quiet Zell.',
    },
  },
  viewer: {
    kicker: { ar: 'عارض العطور', en: 'Product viewer' },
    title: { ar: 'خذ نظرة أقرب.', en: 'Look closer before you choose.' },
    scentControls: { ar: 'اختيار العطر', en: 'Choose a scent' },
    details: { ar: 'تفاصيل العطر', en: 'Scent details' },
    cta: { ar: 'ابدأ بتستر', en: 'Start with a tester' },
    visualDirection: { ar: 'الاتجاه البصري', en: 'Visual direction' },
  },
  chapters: {
    kicker: { ar: 'رحلة الرشة', en: 'Scent journey' },
    title: { ar: 'رحلة الرشة.', en: 'The rhythm of a fragrance.' },
  },
  senses: {
    kicker: { ar: 'وليمة للحواس', en: 'A feast for the senses' },
    title: { ar: 'من الافتتاحية إلى الأثر.', en: 'From opening to trail.' },
  },
  flow: {
    kicker: { ar: 'من التستر إلى الزجاجة', en: 'From tester to bottle' },
    title: { ar: 'ابدأ بتستر، واختر بثقة.', en: 'Try first, then commit with confidence.' },
    primaryCta: { ar: 'ابنِ مجموعة التستر', en: 'Build a tester set' },
    whatsappCta: { ar: 'اطلب عبر واتساب', en: 'Order on WhatsApp' },
    sizesCta: { ar: 'شاهد العطور', en: 'Compare scents' },
    primaryMessage: {
      ar: 'أريد بناء مجموعة تستر من Nafas',
      en: 'I want to build a Nafas tester set',
    },
    orderMessage: {
      ar: 'أريد الطلب عبر واتساب من Nafas',
      en: 'I want to order Nafas through WhatsApp',
    },
  },
  hero: {
    kicker: { ar: 'نفَس', en: 'Maison Nafas' },
    title: { ar: 'نفَس قريب منك.', en: 'Nafas, worn close.' },
    lead: {
      ar: 'أربع روائح محلية بهوية هادئة: شرارة، غيمة، دفوة، وظلّ. ابدأ بتستر صغير واختر الرائحة التي تشبه حضورك.',
      en: 'Four local perfumes with a calm, premium identity. Begin with testers, then choose the bottle that fits your presence.',
    },
    caption: { ar: 'ماء عطر نفَس', en: 'Nafas eau de parfum' },
  },
  together: {
    kicker: { ar: 'أفضل معاً', en: 'Better together' },
    title: { ar: 'اكتشاف هادئ، ثم زجاجتك.', en: 'Discover calmly, then choose the bottle.' },
    body: {
      ar: 'ابدأ بمجموعة تستر صغيرة، ارتدِ الرائحة في يومك، ثم اختر الزجاجة أو الهدية الأقرب لمودك.',
      en: 'Start with a small tester set, wear each scent through your day, then choose the bottle or gift that feels right.',
    },
    cta: { ar: 'ابدأ بالمجموعة', en: 'Start the set' },
  },
  selector: {
    kicker: { ar: 'اختيار موجه', en: 'Guided choice' },
    title: { ar: 'اختيار العطر أسهل.', en: 'Find your Nafas faster.' },
    body: {
      ar: 'اختر المود الأقرب لك، أو ابدأ بمجموعة التستر إذا كنت ما زلت محتاراً.',
      en: 'Pick the mood closest to you, or begin with testers if you want to explore first.',
    },
    options: { ar: 'اختيار المود', en: 'Choose a mood' },
    result: { ar: 'اقتراح نفَس', en: 'Nafas suggestion' },
  },
  trust: {
    kicker: { ar: 'ثقة بلا مبالغة', en: 'Trust, without exaggeration' },
    title: { ar: 'وضوح في التجربة والجودة.', en: 'Clear quality, realistic promises.' },
  },
  comparison: {
    kicker: { ar: 'ساعدني أختار', en: 'Help me choose' },
    title: { ar: 'اختر نفَسك.', en: 'Choose your Nafas.' },
    mood: { ar: 'المود', en: 'Mood' },
    bestFor: { ar: 'يناسب', en: 'Best for' },
    entry: { ar: 'نقطة البداية', en: 'Entry point' },
    cta: { ar: 'استكشف', en: 'Explore' },
    bottleAlt: { ar: 'زجاجة عطر', en: 'Perfume bottle' },
  },
  explore: {
    kicker: { ar: 'استمر في الرحلة', en: 'Keep exploring' },
    title: { ar: 'كمّل الرحلة.', en: 'Keep exploring Nafas.' },
    whatsappMessage: { ar: 'أريد التواصل مع Nafas', en: 'I want to contact Nafas' },
  },
  final: {
    title: { ar: 'نفَس قريب منك.', en: 'Nafas, worn close.' },
    body: {
      ar: 'ابدأ بتستر صغير، ودع الرائحة تختار سرعتها على جلدك.',
      en: 'Start with a tester and let each perfume unfold at its own pace on your skin.',
    },
    cta: { ar: 'اطلب مجموعة التستر', en: 'Order the tester set' },
  },
} as const;

export const scentCopy: Record<ScentId, {
  aura: Localized;
  bestFor: Localized;
  bottle: Localized;
  entry: Localized;
  gift: Localized;
  heroDescription: Localized;
  line: Localized;
  mood: Localized;
  name: Localized;
  notes: Localized;
  sizes: Localized;
  usage: Localized;
}> = {
  sharara: {
    name: { ar: 'شرارة', en: 'Sharara' },
    line: { ar: 'أول رشة تلفت، وأثر يفضل.', en: 'A bright first spark with a darker trail.' },
    mood: { ar: 'فريش / حار / مسكي', en: 'Fresh / Spicy / Musky' },
    aura: { ar: 'أسود ونحاس دافئ', en: 'Black and copper amber' },
    heroDescription: {
      ar: 'شرارة معمولة للحضور السريع: بداية فريش، حرارة هادئة، ومسك يفضل قريباً من الجلد.',
      en: 'Sharara is built for a confident entrance: fresh lift, quiet heat, and dark musk close to skin.',
    },
    bestFor: { ar: 'حضور واضح من أول لحظة.', en: 'A clear first impression.' },
    notes: { ar: 'برغموت، فلفل وردي، زعفران، ومسك داكن.', en: 'Bergamot, pink pepper, saffron, dark musk.' },
    bottle: { ar: 'أسود مطفي مع دفء نحاسي.', en: 'Matte black with a warm copper accent.' },
    sizes: { ar: 'ابدأ بتستر، ثم اختر حجم السفر أو الزجاجة الكاملة.', en: 'Start with a tester, then move to travel or full bottle.' },
    gift: { ar: 'اختيار قوي لشخص يحب الروائح اللافتة.', en: 'A strong gift for someone who likes noticeable scents.' },
    usage: { ar: 'نهار جريء أو بداية مساء.', en: 'Bold daytime wear or the start of an evening.' },
    entry: { ar: 'تستر أولاً، ثم زجاجة كاملة.', en: 'Tester first, then full bottle.' },
  },
  ghayma: {
    name: { ar: 'غيمة', en: 'Ghayma' },
    line: { ar: 'نعومة تتعلق في الذاكرة.', en: 'Softness that lingers in memory.' },
    mood: { ar: 'ناعم / فاكهي / زهري / مسكي', en: 'Soft / Fruity / Floral / Musky' },
    aura: { ar: 'أوف وايت وروز جولد', en: 'Off-white and rose gold' },
    heroDescription: {
      ar: 'غيمة ناعمة ومضيئة: فواكه خفيفة، ورد هادئ، ومسك نظيف يسيب ذكرى لطيفة.',
      en: 'Ghayma is airy and luminous: soft fruit, quiet florals, and clean musk with a gentle memory.',
    },
    bestFor: { ar: 'هدية هادئة أو يوم ناعم.', en: 'A soft day or an easy gift.' },
    notes: { ar: 'كمثرى، حمضيات ناعمة، زهور بيضاء، ومسك نظيف.', en: 'Pear, soft citrus, white florals, clean musk.' },
    bottle: { ar: 'أوف وايت مع لمسة روز جولد.', en: 'Off-white with a rose-gold detail.' },
    sizes: { ar: 'ابدأ بتستر ثم اختر الحجم المناسب.', en: 'Start with a tester, then choose your size.' },
    gift: { ar: 'الأقرب للهدايا الهادئة والأنيقة.', en: 'The easiest pick for calm, elegant gifting.' },
    usage: { ar: 'نهار، مكتب، ومساء خفيف.', en: 'Daytime, office, and lighter evenings.' },
    entry: { ar: 'تستر ناعم قبل الزجاجة.', en: 'Soft tester before the bottle.' },
  },
  dafwa: {
    name: { ar: 'دفوة', en: 'Dafwa' },
    line: { ar: 'قهوة دافئة وحضور ما يتنسيش.', en: 'Coffee warmth with a memorable presence.' },
    mood: { ar: 'دافئ / قهوة / حلو / شرقي', en: 'Warm / Coffee / Sweet / Oriental' },
    aura: { ar: 'موكا وذهب هادئ', en: 'Mocha and quiet gold' },
    heroDescription: {
      ar: 'دفوة تميل لليل الهادئ: قهوة محمصة، حلاوة متزنة، ولمعة شرقية دافئة.',
      en: 'Dafwa leans into quiet nights: roasted coffee, balanced sweetness, and warm amber glow.',
    },
    bestFor: { ar: 'مساء دافئ ولحظات قريبة.', en: 'Warm evenings and intimate moments.' },
    notes: { ar: 'قهوة محمصة، كراميل داكن، فانيلا، وعنبر.', en: 'Roasted coffee, dark caramel, vanilla, amber.' },
    bottle: { ar: 'موكا عميق مع تفاصيل ذهبية.', en: 'Deep mocha with gold detailing.' },
    sizes: { ar: 'تستر وزجاجات للروتين اليومي أو الهدية.', en: 'Tester and bottle options for routine or gifting.' },
    gift: { ar: 'لمن يحب الدفء والحلاوة المتزنة.', en: 'For someone who likes warmth with restraint.' },
    usage: { ar: 'المساء، الشتاء، واللحظات القريبة.', en: 'Evening, winter, and close moments.' },
    entry: { ar: 'تستر دافئ قبل القرار.', en: 'Warm tester before committing.' },
  },
  zell: {
    name: { ar: 'ظلّ', en: 'Zell' },
    line: { ar: 'هادئ، لكنه يسيب أثر.', en: 'Quiet, but it leaves a trace.' },
    mood: { ar: 'خشبي / داكن / مسكي', en: 'Woody / Dark / Musky' },
    aura: { ar: 'فحمي وفضي مضبوط', en: 'Charcoal and controlled silver' },
    heroDescription: {
      ar: 'ظلّ هادئ وواثق: خشب داكن، مسك عميق، وحضور بيبان من غير ضوضاء.',
      en: 'Zell is calm and assured: dark woods, deep musk, and presence without noise.',
    },
    bestFor: { ar: 'عمق هادئ بدون ضوضاء.', en: 'Quiet depth without excess.' },
    notes: { ar: 'بهار جاف، خشب كشميري، سوسن هادئ، ومسك.', en: 'Dry spice, cashmere wood, quiet iris, musk.' },
    bottle: { ar: 'فحمي مع لمسة فضية مضبوطة.', en: 'Charcoal with a precise silver accent.' },
    sizes: { ar: 'تستر أولاً ثم الحجم الذي يشبهك.', en: 'Tester first, then the size that suits you.' },
    gift: { ar: 'اختيار راقٍ لمن يحب الغموض الهادئ.', en: 'A refined pick for someone who likes subtle mystery.' },
    usage: { ar: 'مساء هادئ أو أناقة يومية.', en: 'Quiet evenings or polished daily wear.' },
    entry: { ar: 'تستر قريب من الجلد.', en: 'Skin-close tester first.' },
  },
};

export const highlightCopy: Record<Highlight['id'], {
  copy: Localized;
  eyebrow: Localized;
  title: Localized;
}> = {
  sharara: {
    eyebrow: { ar: 'توابل فريش', en: 'Fresh spice' },
    title: scentCopy.sharara.name,
    copy: { ar: 'رشة أولى واضحة، دفء نحاسي، وأثر مسكي داكن.', en: 'A clear opening, copper warmth, and a darker musky finish.' },
  },
  ghayma: {
    eyebrow: { ar: 'ذكرى ناعمة', en: 'Soft memory' },
    title: scentCopy.ghayma.name,
    copy: { ar: 'نعومة فاكهية وزهور بيضاء، خفيفة لكنها لا تمر مرور الكرام.', en: 'Soft fruit and white florals that feel light but remembered.' },
  },
  dafwa: {
    eyebrow: { ar: 'دفء القهوة', en: 'Coffee warmth' },
    title: scentCopy.dafwa.name,
    copy: { ar: 'قهوة، حلاوة، وعنبر دافئ لمساء له إيقاع أبطأ.', en: 'Coffee, amber, and balanced sweetness for a slower evening.' },
  },
  zell: {
    eyebrow: { ar: 'عمق هادئ', en: 'Quiet depth' },
    title: scentCopy.zell.name,
    copy: { ar: 'خشب داكن ومسك قريب. هادئ، مركز، وواثق.', en: 'Dark woods and close musk: quiet, focused, assured.' },
  },
  discovery: {
    eyebrow: { ar: 'جرّب أولاً', en: 'Try first' },
    title: { ar: 'مجموعة التستر', en: 'Discovery Mini' },
    copy: { ar: 'جرّب الأربع حالات المزاجية قبل اختيار زجاجتك.', en: 'Try the four moods before choosing your bottle.' },
  },
  gift: {
    eyebrow: { ar: 'جاهزة للإهداء', en: 'Ready to give' },
    title: { ar: 'هدية نفَس', en: 'Gift Set' },
    copy: { ar: 'تقديم هادئ وراقٍ لرائحة تشبه صاحبها.', en: 'A calm, polished gift for a scent that feels personal.' },
  },
  quality: {
    eyebrow: { ar: 'مراجعة الدفعات', en: 'Batch checked' },
    title: { ar: 'طقس الجودة', en: 'Quality Ritual' },
    copy: { ar: 'مراجعة للصفاء، الرش، والتقديم قبل وصول التجربة لك.', en: 'Clarity, spray feel, and presentation are checked before delivery.' },
  },
};

export const chapterCopy: Record<string, { copy: Localized; title: Localized }> = {
  opening: {
    title: { ar: 'الافتتاحية', en: 'Opening' },
    copy: { ar: 'أول لمعة من الرائحة تفتح المزاج وتحدد الاتجاه.', en: 'The first lift sets the tone and invites you closer.' },
  },
  heart: {
    title: { ar: 'القلب', en: 'Heart' },
    copy: { ar: 'بعد دقائق، الشخصية تظهر: فريش، ناعمة، دافئة، أو غامضة.', en: 'After a few minutes, the true personality settles in.' },
  },
  trail: {
    title: { ar: 'الأثر', en: 'Trail' },
    copy: { ar: 'الجزء الذي يبقى قريباً من الجلد ويعود في الذاكرة.', en: 'The part that stays close to skin and returns in memory.' },
  },
};

export const sensoryCopy: Record<string, { copy: Localized; title: Localized }> = {
  opening: {
    title: { ar: 'الافتتاحية', en: 'Opening' },
    copy: { ar: 'نفحة أولى تلمع وتدعو للاقتراب.', en: 'A first impression that glows and draws you in.' },
  },
  heart: {
    title: { ar: 'القلب', en: 'Heart' },
    copy: { ar: 'المود الحقيقي يستقر بهدوء على الجلد.', en: 'The main mood settles calmly on skin.' },
  },
  base: {
    title: { ar: 'القاعدة', en: 'Base' },
    copy: { ar: 'مسك، خشب، عنبر، ولمسة أخيرة تترك أثر.', en: 'Musk, woods, amber, and the final trail.' },
  },
};

export const flowCopy: Record<string, { copy: Localized; title: Localized }> = {
  tester: {
    title: { ar: 'اطلب تستر', en: 'Order testers' },
    copy: { ar: 'ابدأ بحجم صغير لكل مود.', en: 'Start small with each mood.' },
  },
  wear: {
    title: { ar: 'جرّبه يوم كامل', en: 'Wear it for a day' },
    copy: { ar: 'اترك الرائحة تظهر على جلدك.', en: 'Let the scent unfold on skin.' },
  },
  choose: {
    title: { ar: 'اختر زجاجتك', en: 'Choose your bottle' },
    copy: { ar: 'حدد الرائحة الأقرب لحضورك.', en: 'Pick the scent that fits your presence.' },
  },
  return: {
    title: { ar: 'ارجع لنفس الرائحة', en: 'Come back anytime' },
    copy: { ar: 'أعد الطلب عندما يستقر اختيارك.', en: 'Reorder once the choice feels settled.' },
  },
};

export const selectorCopy: Record<ChoiceId, { label: Localized }> = {
  sharara: { label: { ar: 'فريش ولافت', en: 'Fresh and bold' } },
  ghayma: { label: { ar: 'ناعم وهادئ', en: 'Soft and calm' } },
  dafwa: { label: { ar: 'دافئ وحلو', en: 'Warm and sweet' } },
  zell: { label: { ar: 'غامض وخشبي', en: 'Shadowed woods' } },
  discovery: { label: { ar: 'لسه محتار', en: 'Still deciding' } },
};

export const viewerTabCopy: Record<ViewerTab, Localized> = {
  scent: { ar: 'الرائحة', en: 'Scent' },
  notes: { ar: 'النوتات', en: 'Notes' },
  bottle: { ar: 'العبوة', en: 'Bottle' },
  sizes: { ar: 'الأحجام', en: 'Sizes' },
  gift: { ar: 'الهدية', en: 'Gift' },
  usage: { ar: 'الاستخدام', en: 'Use' },
};

export const trustCopy: Record<string, { copy: Localized; title: Localized }> = {
  'fixed-formulas': {
    title: { ar: 'تركيبات ثابتة', en: 'Fixed formulas' },
    copy: { ar: 'كل رائحة لها شخصية واضحة ومراجعة قبل اعتمادها.', en: 'Each scent keeps a clear personality before release.' },
  },
  'batch-checks': {
    title: { ar: 'مراجعة الدفعات', en: 'Batch quality checks' },
    copy: { ar: 'نفحص الصفاء، الرش، والتقديم بشكل عملي.', en: 'Clarity, spray feel, and presentation are checked practically.' },
  },
  'tester-first': {
    title: { ar: 'تجربة التستر أولاً', en: 'Tester-first discovery' },
    copy: { ar: 'جرّب قبل ما تختار الزجاجة الكاملة.', en: 'Try the perfume before choosing a full bottle.' },
  },
  support: {
    title: { ar: 'دعم واتساب', en: 'WhatsApp support' },
    copy: { ar: 'اسألنا عن المود، الحجم، أو الهدية المناسبة.', en: 'Ask about moods, sizes, and gifting choices.' },
  },
};

export const exploreCopy: Record<string, { copy: Localized; title: Localized }> = {
  shop: {
    title: { ar: 'المتجر', en: 'Shop' },
    copy: { ar: 'تسوق المجموعة الأساسية.', en: 'Browse the main collection.' },
  },
  faq: {
    title: { ar: 'الأسئلة', en: 'FAQ' },
    copy: { ar: 'إجابات سريعة قبل الاختيار.', en: 'Quick answers before choosing.' },
  },
  about: {
    title: { ar: 'عن نفَس', en: 'About Nafas' },
    copy: { ar: 'القصة والفلسفة خلف الدار.', en: 'The story and thinking behind the house.' },
  },
  whatsapp: {
    title: { ar: 'واتساب', en: 'WhatsApp' },
    copy: { ar: 'اسألنا أو اطلب مباشرة.', en: 'Ask us or order directly.' },
  },
};
