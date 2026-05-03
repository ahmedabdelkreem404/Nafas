import type { Locale } from '../../../context/LocaleContext';
import type { ChoiceId, Highlight, Scent, ScentId, ViewerTab } from '../types';

type Localized<T = string> = Record<Locale, T>;

export const text = <T,>(value: Localized<T>, locale: Locale): T => value[locale];

export const appleHomeCopy = {
  ribbon: {
    aria: { ar: 'إعلان نفَس', en: 'Nafas announcement' },
    body: {
      ar: 'اكتشف مجموعة نفَس الأولى: ست روائح، مجموعة تجربة، وبوكسات هدية جاهزة للاختيار الهادئ.',
      en: 'Discover the first Nafas collection: six perfumes, a Discovery Set, and gift boxes for easier choosing.',
    },
    cta: { ar: 'ابدأ بمجموعة التجربة', en: 'Start with the Discovery Set' },
  },
  ritual: {
    aria: { ar: 'طقس نفَس السينمائي', en: 'Nafas cinematic ritual' },
    kicker: { ar: 'طقس نفَس', en: 'Nafas ritual' },
    moment: { ar: 'لحظة الرشة', en: 'First spray' },
    primaryCta: { ar: 'اكتشف العطور', en: 'Shop the collection' },
    secondaryCta: { ar: 'جرّب المجموعة', en: 'Start with discovery' },
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
      ar: 'ست روائح واضحة من نفَس: شرارة، مدار، أثر، برق، ندى، وغيمة. كل واحدة بمود مختلف، من الانتعاش اللافت إلى النعومة الهادئة.',
      en: 'Six clear Nafas signatures: Sharara, Madar, Athar, Barq, Nada, and Ghayma, each with its own mood.',
    },
  },
  viewer: {
    kicker: { ar: 'عارض العطور', en: 'Product viewer' },
    title: { ar: 'خذ نظرة أقرب.', en: 'Look closer before you choose.' },
    scentControls: { ar: 'اختيار العطر', en: 'Choose a scent' },
    details: { ar: 'تفاصيل العطر', en: 'Scent details' },
    cta: { ar: 'ابدأ بمجموعة التجربة', en: 'Start with the Discovery Set' },
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
    kicker: { ar: 'من التجربة إلى الزجاجة', en: 'From discovery to bottle' },
    title: { ar: 'ابدأ بتجربة، واختر بثقة.', en: 'Try first, then commit with confidence.' },
    primaryCta: { ar: 'اطلب مجموعة التجربة', en: 'Order the Discovery Set' },
    whatsappCta: { ar: 'اطلب عبر واتساب', en: 'Order on WhatsApp' },
    sizesCta: { ar: 'شاهد العطور', en: 'Compare scents' },
    primaryMessage: {
      ar: 'أريد طلب مجموعة التجربة من Nafas',
      en: 'I want to order the Nafas Discovery Set',
    },
    orderMessage: {
      ar: 'أريد الطلب عبر واتساب من Nafas',
      en: 'I want to order Nafas through WhatsApp',
    },
  },
  hero: {
    kicker: { ar: 'نفَس', en: 'Nafas' },
    title: { ar: 'نفَس قريب منك.', en: 'Nafas, worn close.' },
    lead: {
      ar: 'ست روائح محلية بهوية هادئة: شرارة، مدار، أثر، برق، ندى، وغيمة. ابدأ بمجموعة التجربة أو اختَر بوكس هدية جاهز للمناسبة.',
      en: 'Six local perfumes with a calm, premium identity. Start with the Discovery Set or choose a ready gift box.',
    },
    caption: { ar: 'ماء عطر نفَس', en: 'Nafas eau de parfum' },
  },
  together: {
    kicker: { ar: 'أفضل معًا', en: 'Better together' },
    title: { ar: 'اكتشاف هادئ، ثم زجاجتك.', en: 'Discover calmly, then choose the bottle.' },
    body: {
      ar: 'ابدأ بمجموعة التجربة، ارتدِ كل رائحة في يومك، ثم اختر الزجاجة أو بوكس الهدية الأقرب للمود.',
      en: 'Start with the Discovery Set, wear each scent through your day, then choose the bottle or gift box that feels right.',
    },
    cta: { ar: 'ابدأ بالمجموعة', en: 'Start the set' },
  },
  selector: {
    kicker: { ar: 'اختيار موجه', en: 'Guided choice' },
    title: { ar: 'اختيار العطر أسهل.', en: 'Find your Nafas faster.' },
    body: {
      ar: 'اختر المود الأقرب لك، أو ابدأ بمجموعة التجربة إذا كنت ما زلت محتارًا.',
      en: 'Pick the mood closest to you, or begin with the Discovery Set if you want to explore first.',
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
      ar: 'ابدأ بمجموعة التجربة، ودع الرائحة تختار سرعتها على جلدك قبل الزجاجة الكاملة.',
      en: 'Start with the Discovery Set and let each perfume unfold on your skin before the full bottle.',
    },
    cta: { ar: 'اطلب مجموعة التجربة', en: 'Order the Discovery Set' },
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
    heroDescription: { ar: 'شرارة معمولة للحضور السريع: بداية فريش، حرارة هادئة، ومسك يفضل قريبًا من الجلد.', en: 'Sharara is built for a confident entrance: fresh lift, quiet heat, and dark musk close to skin.' },
    bestFor: { ar: 'حضور واضح من أول لحظة.', en: 'A clear first impression.' },
    notes: { ar: 'برغموت، فلفل وردي، زعفران، ومسك داكن.', en: 'Bergamot, pink pepper, saffron, dark musk.' },
    bottle: { ar: 'أسود مطفي مع دفء نحاسي.', en: 'Matte black with a warm copper accent.' },
    sizes: { ar: 'ابدأ بتستر، ثم اختر حجم السفر أو الزجاجة الكاملة.', en: 'Start with a tester, then move to travel or full bottle.' },
    gift: { ar: 'اختيار قوي لشخص يحب الروائح اللافتة.', en: 'A strong gift for someone who likes noticeable scents.' },
    usage: { ar: 'نهار جريء أو بداية مساء.', en: 'Bold daytime wear or the start of an evening.' },
    entry: { ar: 'تستر أولًا، ثم زجاجة كاملة.', en: 'Tester first, then full bottle.' },
  },
  madar: {
    name: { ar: 'مدار', en: 'Madar' },
    line: { ar: 'نظيف، ثابت، وقريب من يومك.', en: 'Clean, steady, and close to your day.' },
    mood: { ar: 'نظيف / عطري / خشبي', en: 'Clean / Aromatic / Woody' },
    aura: { ar: 'أخضر هادئ وخشب ناعم', en: 'Sage and soft wood' },
    heroDescription: { ar: 'مدار حضور هادئ ومنظم: انتعاش أخضر، قلب عطري، وخشب ناعم يصلح لليوم كله.', en: 'Madar is quiet and composed: green freshness, aromatic heart, and soft woods for the whole day.' },
    bestFor: { ar: 'العمل، الحركة، واليوم الطويل.', en: 'Work, movement, and long days.' },
    notes: { ar: 'حمضيات خفيفة، أعشاب عطرية، خشب ناعم، ومسك.', en: 'Soft citrus, aromatic herbs, gentle woods, musk.' },
    bottle: { ar: 'أخضر هادئ مع تفاصيل خشبية.', en: 'Quiet green with woody details.' },
    sizes: { ar: 'ابدأ بتستر ثم اختر الحجم اليومي.', en: 'Start with a tester, then choose your daily size.' },
    gift: { ar: 'مناسب لمن يحب الرائحة النظيفة غير الصاخبة.', en: 'For someone who likes clean, restrained scents.' },
    usage: { ar: 'صباح، مكتب، ومشاوير يومية.', en: 'Morning, office, and everyday movement.' },
    entry: { ar: 'تستر عملي قبل الحجم اليومي.', en: 'Practical tester before the daily size.' },
  },
  athar: {
    name: { ar: 'أثر', en: 'Athar' },
    line: { ar: 'هادئ في البداية، واضح في الذاكرة.', en: 'Quiet at first, remembered later.' },
    mood: { ar: 'عنبر / مسك / أنيق', en: 'Amber / Musky / Elegant' },
    aura: { ar: 'عنبر دافئ وعاجي', en: 'Warm amber and ivory' },
    heroDescription: { ar: 'أثر رائحة دافئة ومتزنة: عنبر ناعم، لمسة بودرية، ومسك يترك حضورًا مهذبًا.', en: 'Athar is warm and balanced: soft amber, powdery air, and refined musk.' },
    bestFor: { ar: 'مناسبات هادئة وحضور راق.', en: 'Quiet occasions and polished presence.' },
    notes: { ar: 'عنبر، مسك، لمسة بودرية، وخشب ناعم.', en: 'Amber, musk, powdery notes, soft woods.' },
    bottle: { ar: 'عاجي دافئ مع لمسة عنبرية.', en: 'Warm ivory with an amber detail.' },
    sizes: { ar: 'تستر أولًا، ثم زجاجة تناسب روتينك.', en: 'Tester first, then a bottle for your routine.' },
    gift: { ar: 'اختيار آمن وأنيق لمن يحب الدفء الهادئ.', en: 'A safe, elegant pick for calm warmth.' },
    usage: { ar: 'مساء خفيف أو يوم يحتاج رائحة مطمئنة.', en: 'Light evenings or comforting daily wear.' },
    entry: { ar: 'تستر هادئ قبل الاختيار.', en: 'A calm tester before choosing.' },
  },
  barq: {
    name: { ar: 'برق', en: 'Barq' },
    line: { ar: 'لمعة فريش وسرعة حضور.', en: 'Fresh brightness with instant energy.' },
    mood: { ar: 'حمضي / مائي / نشيط', en: 'Citrus / Aquatic / Energetic' },
    aura: { ar: 'أزرق بارد وفضي', en: 'Cool blue and silver' },
    heroDescription: { ar: 'برق يبدأ بانتعاش واضح ولمعة مائية، ثم يهدأ على قاعدة نظيفة وسهلة.', en: 'Barq opens bright and aquatic, then settles into a clean easy base.' },
    bestFor: { ar: 'بداية اليوم، الصيف، والحركة.', en: 'Morning, summer, and movement.' },
    notes: { ar: 'حمضيات، لمسة مائية، أعشاب خفيفة، ومسك نظيف.', en: 'Citrus, aquatic air, light herbs, clean musk.' },
    bottle: { ar: 'أزرق بارد مع تفصيلة فضية.', en: 'Cool blue with a silver detail.' },
    sizes: { ar: 'تستر سريع قبل اختيار حجمك.', en: 'Quick tester before choosing your size.' },
    gift: { ar: 'مناسب لمن يحب الانتعاش الواضح.', en: 'For someone who likes clear freshness.' },
    usage: { ar: 'صباح، سفر، وبعد التمرين.', en: 'Morning, travel, and after training.' },
    entry: { ar: 'تستر منعش قبل الزجاجة.', en: 'Fresh tester before the bottle.' },
  },
  nada: {
    name: { ar: 'ندى', en: 'Nada' },
    line: { ar: 'نعومة صباحية بلمسة زهرية.', en: 'Morning softness with a floral touch.' },
    mood: { ar: 'ندي / زهري / مسك ناعم', en: 'Dewy / Floral / Soft Musk' },
    aura: { ar: 'وردي هادئ وبتلات ناعمة', en: 'Blush and fresh petals' },
    heroDescription: { ar: 'ندى رقيقة ومضيئة: زهور ناعمة، إحساس ندي، ومسك خفيف يفضل بلا مبالغة.', en: 'Nada is delicate and luminous: soft florals, dewy air, and light musk without excess.' },
    bestFor: { ar: 'هدية رقيقة أو يوم ناعم.', en: 'A delicate gift or a soft day.' },
    notes: { ar: 'زهور بيضاء، لمسة فواكه خفيفة، ومسك ناعم.', en: 'White florals, soft fruit, gentle musk.' },
    bottle: { ar: 'وردي هادئ مع لمسة شفافة.', en: 'Quiet blush with a sheer detail.' },
    sizes: { ar: 'ابدأ بتستر ثم اختر الزجاجة الأقرب لك.', en: 'Start with a tester, then choose the closest bottle.' },
    gift: { ar: 'اختيار سهل للهدايا اللطيفة.', en: 'An easy pick for gentle gifts.' },
    usage: { ar: 'صباح، مكتب، وخروجات خفيفة.', en: 'Morning, office, and light outings.' },
    entry: { ar: 'تستر ناعم قبل القرار.', en: 'Soft tester before deciding.' },
  },
  ghayma: {
    name: { ar: 'غيمة', en: 'Ghayma' },
    line: { ar: 'نعومة تتعلق في الذاكرة.', en: 'Softness that lingers in memory.' },
    mood: { ar: 'ناعم / فاكهي / زهري / مسكي', en: 'Soft / Fruity / Floral / Musky' },
    aura: { ar: 'أوف وايت وروز جولد', en: 'Off-white and rose gold' },
    heroDescription: { ar: 'غيمة ناعمة ومضيئة: فواكه خفيفة، ورد هادئ، ومسك نظيف يسيب ذكرى لطيفة.', en: 'Ghayma is airy and luminous: soft fruit, quiet florals, and clean musk with a gentle memory.' },
    bestFor: { ar: 'هدية هادئة أو يوم ناعم.', en: 'A soft day or an easy gift.' },
    notes: { ar: 'كمثرى، حمضيات ناعمة، زهور بيضاء، ومسك نظيف.', en: 'Pear, soft citrus, white florals, clean musk.' },
    bottle: { ar: 'أوف وايت مع لمسة روز جولد.', en: 'Off-white with a rose-gold detail.' },
    sizes: { ar: 'ابدأ بتستر ثم اختر الحجم المناسب.', en: 'Start with a tester, then choose your size.' },
    gift: { ar: 'الأقرب للهدايا الهادئة والأنيقة.', en: 'The easiest pick for calm, elegant gifting.' },
    usage: { ar: 'نهار، مكتب، ومساء خفيف.', en: 'Daytime, office, and lighter evenings.' },
    entry: { ar: 'تستر ناعم قبل الزجاجة.', en: 'Soft tester before the bottle.' },
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
  madar: {
    eyebrow: { ar: 'نظافة هادئة', en: 'Clean orbit' },
    title: scentCopy.madar.name,
    copy: { ar: 'رائحة نظيفة ومنظمة تناسب اليوم الطويل من غير ضوضاء.', en: 'A clean, composed scent for long days without noise.' },
  },
  athar: {
    eyebrow: { ar: 'أثر عنبري', en: 'Amber trace' },
    title: scentCopy.athar.name,
    copy: { ar: 'عنبر ناعم ومسك مهذب يترك حضورًا قريبًا من الذاكرة.', en: 'Soft amber and refined musk that stay close to memory.' },
  },
  barq: {
    eyebrow: { ar: 'طاقة فريش', en: 'Bright energy' },
    title: scentCopy.barq.name,
    copy: { ar: 'انتعاش واضح ولمعة مائية لبداية يوم نشيطة.', en: 'Bright freshness and aquatic shine for an energetic start.' },
  },
  nada: {
    eyebrow: { ar: 'ندى ناعم', en: 'Soft dew' },
    title: scentCopy.nada.name,
    copy: { ar: 'زهور ناعمة ومسك خفيف لإحساس صباحي رقيق.', en: 'Soft florals and light musk for a gentle morning feel.' },
  },
  ghayma: {
    eyebrow: { ar: 'ذكرى ناعمة', en: 'Soft memory' },
    title: scentCopy.ghayma.name,
    copy: { ar: 'نعومة فاكهية وزهور بيضاء، خفيفة لكنها لا تمر مرور الكرام.', en: 'Soft fruit and white florals that feel light but remembered.' },
  },
  discovery: {
    eyebrow: { ar: 'جرّب أولًا', en: 'Try first' },
    title: { ar: 'مجموعة التجربة', en: 'Discovery Set' },
    copy: { ar: 'جرّب الست عطور قبل اختيار زجاجتك.', en: 'Try the six perfumes before choosing your bottle.' },
  },
  gift: {
    eyebrow: { ar: 'جاهزة للإهداء', en: 'Ready to give' },
    title: { ar: 'بوكسات هدية نفَس', en: 'Nafas Gift Boxes' },
    copy: { ar: 'تغليف أنيق واختيار أسهل لو الهدية محتاجة قرار هادئ.', en: 'Elegant packaging and easier gifting when the choice needs calm.' },
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
    copy: { ar: 'بعد دقائق، الشخصية تظهر: فريش، ناعمة، دافئة، أو نظيفة.', en: 'After a few minutes, the true personality settles in.' },
  },
  trail: {
    title: { ar: 'الأثر', en: 'Trail' },
    copy: { ar: 'الجزء الذي يبقى قريبًا من الجلد ويعود في الذاكرة.', en: 'The part that stays close to skin and returns in memory.' },
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
    title: { ar: 'اطلب مجموعة التجربة', en: 'Order discovery' },
    copy: { ar: 'ابدأ بحجم صغير للست عطور.', en: 'Start small with all six perfumes.' },
  },
  wear: {
    title: { ar: 'جرّبه يوم كامل', en: 'Wear it for a day' },
    copy: { ar: 'اترك الرائحة تظهر على جلدك بهدوء.', en: 'Let the scent unfold on skin.' },
  },
  choose: {
    title: { ar: 'اختر زجاجتك أو هديتك', en: 'Choose your bottle or gift' },
    copy: { ar: 'حدد الرائحة أو بوكس الهدية الأقرب لحضورك.', en: 'Pick the scent or gift box that fits your presence.' },
  },
  return: {
    title: { ar: 'ارجع لنفس الرائحة', en: 'Come back anytime' },
    copy: { ar: 'أعد الطلب عندما يستقر اختيارك.', en: 'Reorder once the choice feels settled.' },
  },
};

export const selectorCopy: Record<ChoiceId, { label: Localized }> = {
  sharara: { label: { ar: 'فريش ولافت', en: 'Fresh and bold' } },
  madar: { label: { ar: 'نظيف وهادئ', en: 'Clean and calm' } },
  athar: { label: { ar: 'دافئ وأنيق', en: 'Warm and elegant' } },
  barq: { label: { ar: 'منعش ونشيط', en: 'Bright and fresh' } },
  nada: { label: { ar: 'زهري ورقيق', en: 'Floral and soft' } },
  ghayma: { label: { ar: 'ناعم وهادئ', en: 'Soft and calm' } },
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

export function getScentCopy(scent: Scent) {
  return scentCopy[scent.id] || {
    name: { ar: scent.nameAr, en: scent.name },
    line: { ar: scent.line, en: scent.line },
    mood: { ar: scent.mood, en: scent.mood },
    aura: { ar: scent.aura, en: scent.aura },
    heroDescription: { ar: scent.heroDescription, en: scent.heroDescription },
    bestFor: { ar: scent.bestFor, en: scent.bestFor },
    notes: { ar: scent.notes, en: scent.notes },
    bottle: { ar: scent.bottle, en: scent.bottle },
    sizes: { ar: scent.sizes, en: scent.sizes },
    gift: { ar: scent.gift, en: scent.gift },
    usage: { ar: scent.usage, en: scent.usage },
    entry: { ar: scent.bestFor, en: scent.bestFor },
  };
}

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
    title: { ar: 'مجموعة التجربة أولًا', en: 'Discovery-first' },
    copy: { ar: 'جرّب قبل ما تختار الزجاجة الكاملة أو بوكس الهدية.', en: 'Try before choosing the full bottle or gift box.' },
  },
  support: {
    title: { ar: 'دعم واتساب', en: 'WhatsApp support' },
    copy: { ar: 'اسألنا عن المود، الحجم، أو الهدية المناسبة.', en: 'Ask about moods, sizes, and gifting choices.' },
  },
};

export const exploreCopy: Record<string, { copy: Localized; title: Localized }> = {
  shop: {
    title: { ar: 'المتجر', en: 'Shop' },
    copy: { ar: 'تسوق العطور الست، مجموعة التجربة، وبوكسات الهدايا.', en: 'Browse the six perfumes, Discovery Set, and gift boxes.' },
  },
  faq: {
    title: { ar: 'الأسئلة', en: 'FAQ' },
    copy: { ar: 'إجابات سريعة قبل الاختيار.', en: 'Quick answers before choosing.' },
  },
  about: {
    title: { ar: 'عن نفَس', en: 'About Nafas' },
    copy: { ar: 'القصة والفلسفة خلف العلامة.', en: 'The story and thinking behind the brand.' },
  },
  whatsapp: {
    title: { ar: 'واتساب', en: 'WhatsApp' },
    copy: { ar: 'اسألنا أو اطلب مباشرة.', en: 'Ask us or order directly.' },
  },
};
