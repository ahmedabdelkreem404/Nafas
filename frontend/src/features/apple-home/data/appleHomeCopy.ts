import type { Locale } from '../../../context/LocaleContext';
import type { ChoiceId, Highlight, ScentId, ViewerTab } from '../types';

type Localized<T = string> = Record<Locale, T>;

export const text = <T,>(value: Localized<T>, locale: Locale): T => value[locale];

export const appleHomeCopy = {
  ribbon: {
    aria: { ar: 'إعلان نفس', en: 'Nafas announcement' },
    body: {
      ar: 'مجموعة نفس الأولى كاملة الآن: ست روائح، مجموعة تجربة، واختيار أهدأ قبل الزجاجة.',
      en: 'The first Nafas collection is here: six scents, a discovery set, and a calmer way to choose.',
    },
    cta: { ar: 'جرّب قبل ما تختار', en: 'Try before choosing' },
  },
  ritual: {
    aria: { ar: 'طقس نفس السينمائي', en: 'Nafas cinematic ritual' },
    kicker: { ar: 'دار نفس', en: 'Maison Nafas' },
    moment: { ar: 'لحظة الرشة', en: 'First spray' },
    primaryCta: { ar: 'تسوق الكولكشن', en: 'Shop the collection' },
    secondaryCta: { ar: 'مجموعة التجربة', en: 'Discovery Set' },
    play: { ar: 'تشغيل العرض التلقائي', en: 'Play carousel' },
    pause: { ar: 'إيقاف العرض التلقائي', en: 'Pause carousel' },
    select: { ar: 'اعرض', en: 'Show' },
  },
  highlights: {
    kicker: { ar: 'لمحات المجموعة', en: 'Collection highlights' },
    title: { ar: 'اكتشف نفسك من أول رشة.', en: 'Meet the mood behind every bottle.' },
    carousel: { ar: 'عرض لمحات العطور', en: 'Highlights carousel' },
    controls: { ar: 'أدوات عرض اللمحات', en: 'Highlight controls' },
    slides: { ar: 'شرائح اللمحات', en: 'Highlight slides' },
  },
  emotional: {
    kicker: { ar: 'لحظة العلامة', en: 'Brand moment' },
    title: { ar: 'رائحة تشبه حضورك.', en: 'A scent that feels close to you.' },
    body: {
      ar: 'ست روائح واضحة من نفس: شرارة، مدار، أثر، برق، ندى، وغيمة. كل واحدة لها مود، لون، وحضور.',
      en: 'Six Nafas signatures: Sharara, Madar, Athar, Barq, Nada, and Ghayma. Each has its own mood, color, and presence.',
    },
  },
  viewer: {
    kicker: { ar: 'عارض العطور', en: 'Product viewer' },
    title: { ar: 'خذ نظرة أقرب.', en: 'Look closer before you choose.' },
    scentControls: { ar: 'اختيار العطر', en: 'Choose a scent' },
    details: { ar: 'تفاصيل العطر', en: 'Scent details' },
    cta: { ar: 'شاهد التفاصيل', en: 'View details' },
    visualDirection: { ar: 'الاتجاه البصري', en: 'Visual direction' },
  },
  chapters: {
    kicker: { ar: 'رحلة الرشة', en: 'Scent journey' },
    title: { ar: 'رحلة الرشة.', en: 'The rhythm of a fragrance.' },
  },
  senses: {
    kicker: { ar: 'من الرشة للأثر', en: 'From spray to trail' },
    title: { ar: 'من الافتتاحية إلى الأثر.', en: 'From opening to trail.' },
  },
  flow: {
    kicker: { ar: 'مجموعة التجربة', en: 'Discovery Set' },
    title: { ar: 'ابدأ بتستر، واختر بدقة.', en: 'Try first, then choose with clarity.' },
    primaryCta: { ar: 'اطلب مجموعة التجربة', en: 'Order Discovery Set' },
    whatsappCta: { ar: 'اسألنا على واتساب', en: 'Ask on WhatsApp' },
    sizesCta: { ar: 'شاهد العطور', en: 'Compare scents' },
    primaryMessage: {
      ar: 'أريد طلب مجموعة التجربة من نفس',
      en: 'I want to order the Nafas Discovery Set',
    },
    orderMessage: {
      ar: 'أريد مساعدة في اختيار عطر من نفس',
      en: 'I want help choosing a Nafas perfume',
    },
  },
  hero: {
    kicker: { ar: 'دار نفس', en: 'Maison Nafas' },
    title: { ar: 'كل نفس... بيحكي عنك', en: 'Every breath tells your story.' },
    lead: {
      ar: 'عطور مصممة بعناية، متعتقة، ومتوازنة. ابدأ بشرارة أو جرّب الست روائح في مجموعة التجربة.',
      en: 'Carefully composed, matured, and balanced perfumes. Begin with Sharara or explore all six through the Discovery Set.',
    },
    caption: { ar: 'ماء عطر نفس', en: 'Nafas eau de parfum' },
  },
  together: {
    kicker: { ar: 'جرّب قبل ما تختار', en: 'Try before choosing' },
    title: { ar: 'مجموعة التجربة جزء من الرحلة.', en: 'Discovery is part of the ritual.' },
    body: {
      ar: 'ست عينات صغيرة تساعدك تلبس كل عطر في يومك قبل اختيار الزجاجة الأقرب لحضورك.',
      en: 'Six small samples let you wear every scent through your day before choosing the bottle that fits your presence.',
    },
    cta: { ar: 'اطلب مجموعة التجربة', en: 'Order Discovery Set' },
  },
  selector: {
    kicker: { ar: 'اختيار العطر', en: 'Scent finder' },
    title: { ar: 'اختيار العطر أسهل.', en: 'Find your Nafas faster.' },
    body: {
      ar: 'اختار المود الأقرب لك هنا، أو ادخل لاكتشاف عطرك بخطوات أهدأ وتوصية أوضح.',
      en: 'Choose a mood here, or open the guided finder for a clearer recommendation.',
    },
    options: { ar: 'اختيار المود', en: 'Choose a mood' },
    result: { ar: 'اقتراح نفس', en: 'Nafas suggestion' },
  },
  trust: {
    kicker: { ar: 'ثقة بلا مبالغة', en: 'Trust, without exaggeration' },
    title: { ar: 'وضوح في التجربة والجودة.', en: 'Clear quality, realistic promises.' },
  },
  comparison: {
    kicker: { ar: 'ساعدني أختار', en: 'Help me choose' },
    title: { ar: 'اختر نفسك.', en: 'Choose your Nafas.' },
    mood: { ar: 'المود', en: 'Mood' },
    bestFor: { ar: 'يناسب', en: 'Best for' },
    entry: { ar: 'نقطة البداية', en: 'Entry point' },
    cta: { ar: 'استكشف', en: 'Explore' },
    bottleAlt: { ar: 'زجاجة عطر', en: 'Perfume bottle' },
  },
  explore: {
    kicker: { ar: 'استمر في الرحلة', en: 'Keep exploring' },
    title: { ar: 'كمّل الرحلة.', en: 'Keep exploring Nafas.' },
    whatsappMessage: { ar: 'أريد التواصل مع نفس', en: 'I want to contact Nafas' },
  },
  final: {
    title: { ar: 'نفس قريب منك.', en: 'Nafas, worn close.' },
    body: {
      ar: 'ابدأ بعطر واحد أو بمجموعة التجربة، ودع الرائحة تختار سرعتها على جلدك.',
      en: 'Start with one bottle or the Discovery Set, and let each perfume unfold at its own pace.',
    },
    cta: { ar: 'اكتشف عطرك', en: 'Find your scent' },
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
    mood: { ar: 'فريش / حار / مسكي داكن', en: 'Fresh / Spicy / Dark musk' },
    aura: { ar: 'أسود مطفي ونحاس دافئ', en: 'Matte black and copper' },
    heroDescription: { ar: 'شرارة حضور سريع: بداية فريش، حرارة هادية، ومسك داكن قريب من الجلد.', en: 'Sharara opens fresh, warms quietly, and leaves a dark musky trail.' },
    bestFor: { ar: 'حضور رجالي واضح من أول لحظة.', en: 'A clear masculine first impression.' },
    notes: { ar: 'فريش، توابل هادئة، زعفران، ومسك داكن.', en: 'Fresh notes, quiet spice, saffron, dark musk.' },
    bottle: { ar: 'أسود مطفي مع دفء نحاسي.', en: 'Matte black with a copper glow.' },
    sizes: { ar: 'ابدأ بمجموعة التجربة، ثم اختار 30ml أو 50ml.', en: 'Start with the Discovery Set, then choose 30ml or 50ml.' },
    gift: { ar: 'اختيار قوي لشخص يحب الروائح اللافتة.', en: 'A strong gift for someone who likes noticeable scents.' },
    usage: { ar: 'نهار جريء أو بداية مساء.', en: 'Bold daytime wear or early evening.' },
    entry: { ar: 'العطر البطل في الكولكشن.', en: 'The hero scent of the collection.' },
  },
  madar: {
    name: { ar: 'مدار', en: 'Madar' },
    line: { ar: 'فريش يدور معاك طول اليوم.', en: 'Fresh enough to move with your day.' },
    mood: { ar: 'فريش / خشبي / رياضي', en: 'Fresh / Woody / Sporty' },
    aura: { ar: 'أزرق داكن وفضي', en: 'Dark blue and silver' },
    heroDescription: { ar: 'مدار فريش وخشبي، مناسب ليوم طويل وحركة كتير من غير ضوضاء.', en: 'Madar is clean, woody, and built for active everyday wear.' },
    bestFor: { ar: 'روتين يومي فريش ورجالي.', en: 'Fresh masculine daily wear.' },
    notes: { ar: 'حمضيات باردة، هواء نظيف، أخشاب خفيفة، ومسك.', en: 'Cool citrus, clean air, light woods, musk.' },
    bottle: { ar: 'أزرق داكن مع لمسة فضية.', en: 'Dark blue with a silver accent.' },
    sizes: { ar: 'زجاجة يومية أو تجربة ضمن الست روائح.', en: 'A daily bottle or part of the six-scent set.' },
    gift: { ar: 'اختيار آمن لشخص يحب الفريش النضيف.', en: 'A safe pick for someone who likes clean freshness.' },
    usage: { ar: 'صباح، شغل، مشاوير، وحر.', en: 'Morning, work, errands, warm days.' },
    entry: { ar: 'ابدأ به لو بتحب الفريش.', en: 'Start here if you like fresh scents.' },
  },
  athar: {
    name: { ar: 'أثر', en: 'Athar' },
    line: { ar: 'يسبقك ويفضل بعدك.', en: 'Arrives before you and lingers after.' },
    mood: { ar: 'داكن / فريش / خشبي', en: 'Dark / Fresh / Woody' },
    aura: { ar: 'فحمي وذهبي', en: 'Charcoal and gold' },
    heroDescription: { ar: 'أثر داكن وفريش في نفس الوقت، معمول لحضور قوي وهادئ.', en: 'Athar balances fresh darkness with a polished woody trail.' },
    bestFor: { ar: 'مناسبات، مساء، وحضور واثق.', en: 'Occasions, evening, confident presence.' },
    notes: { ar: 'افتتاحية فريش، خشب داكن، عنبر، ولمسة ذهبية.', en: 'Fresh opening, dark woods, amber, golden warmth.' },
    bottle: { ar: 'فحمي مع تفاصيل ذهبية.', en: 'Charcoal with gold detailing.' },
    sizes: { ar: 'لما تحتاج عطر له أثر واضح.', en: 'For moments that need a clear trail.' },
    gift: { ar: 'هدية راقية لشخص يحب العمق.', en: 'A refined gift for someone who likes depth.' },
    usage: { ar: 'مساء، مناسبات، وأيام تحتاج حضور.', en: 'Evening, occasions, presence-led days.' },
    entry: { ar: 'اختيار المناسبات الهادية.', en: 'A quiet occasion scent.' },
  },
  barq: {
    name: { ar: 'برق', en: 'Barq' },
    line: { ar: 'قهوة باردة بطابع فريش حار.', en: 'Cool coffee with fresh spice.' },
    mood: { ar: 'فريش / حار / قهوة', en: 'Fresh / Spicy / Coffee' },
    aura: { ar: 'عنبر وأسود', en: 'Amber and black' },
    heroDescription: { ar: 'برق يجمع لمعة الفريش مع دفء القهوة والتوابل، من غير ثقل زائد.', en: 'Barq gives fresh lift, coffee warmth, and restrained spice.' },
    bestFor: { ar: 'مزاج مختلف وملفت.', en: 'A distinctive, memorable mood.' },
    notes: { ar: 'قهوة باردة، توابل، عنبر، وفريش خفيف.', en: 'Cool coffee, spice, amber, light freshness.' },
    bottle: { ar: 'عنبر وأسود بلمعة دافئة.', en: 'Amber and black with warmth.' },
    sizes: { ar: 'اختيار مختلف بعد تجربة الكولكشن.', en: 'A distinctive choice after discovery.' },
    gift: { ar: 'لمن يحب القهوة والدفء بشكل أنيق.', en: 'For someone who likes coffee warmth.' },
    usage: { ar: 'بعد الظهر، مساء خفيف، وخروجات.', en: 'Afternoon, light evening, going out.' },
    entry: { ar: 'لما تحب حاجة مختلفة.', en: 'For a more distinctive pick.' },
  },
  nada: {
    name: { ar: 'ندى', en: 'Nada' },
    line: { ar: 'فريش، نضيف، وأنثوي.', en: 'Fresh, clean, and feminine.' },
    mood: { ar: 'فريش / فاكهي / نظيف', en: 'Fresh / Fruity / Clean' },
    aura: { ar: 'أوف وايت وروز جولد', en: 'Off-white and rose gold' },
    heroDescription: { ar: 'ندى إحساس فريش ونضيف، فاكهي خفيف وأنثوي من غير مبالغة.', en: 'Nada is clean, fresh, lightly fruity, and softly feminine.' },
    bestFor: { ar: 'يوم نضيف وهادئ.', en: 'A calm, clean day.' },
    notes: { ar: 'فاكهة خفيفة، حمضيات ناعمة، ورد أبيض، ومسك نظيف.', en: 'Light fruit, soft citrus, white florals, clean musk.' },
    bottle: { ar: 'أوف وايت مع روز جولد.', en: 'Off-white with rose gold.' },
    sizes: { ar: 'مناسب للاستخدام اليومي والهدايا.', en: 'Good for daily wear and gifting.' },
    gift: { ar: 'اختيار أنثوي آمن وراقي.', en: 'A polished feminine gift.' },
    usage: { ar: 'صباح، مكتب، ونهار.', en: 'Morning, office, daytime.' },
    entry: { ar: 'فريش ناعم وواضح.', en: 'Soft, clear freshness.' },
  },
  ghayma: {
    name: { ar: 'غيمة', en: 'Ghayma' },
    line: { ar: 'نعومة بتتعرف من غير صوت.', en: 'Softness recognized without noise.' },
    mood: { ar: 'فاكهي / مسكي / ناعم', en: 'Fruity / Musky / Soft' },
    aura: { ar: 'بيج وذهب ناعم', en: 'Beige and soft gold' },
    heroDescription: { ar: 'غيمة ناعمة ومضيئة: فواكه هادية، مسك نظيف، وحضور لطيف يفضل في الذاكرة.', en: 'Ghayma is soft, fruity, musky, and quietly memorable.' },
    bestFor: { ar: 'هدية ناعمة أو يوم هادي.', en: 'A soft day or gentle gift.' },
    notes: { ar: 'فاكهة ناعمة، زهور بيضاء، مسك، ولمسة ذهب هادية.', en: 'Soft fruit, white florals, musk, gentle gold warmth.' },
    bottle: { ar: 'بيج ناعم مع ذهب لطيف.', en: 'Soft beige with gentle gold.' },
    sizes: { ar: 'ابدأ بالتجربة ثم اختار الحجم المناسب.', en: 'Start with discovery, then choose your size.' },
    gift: { ar: 'الأقرب للهدايا الهادئة والأنيقة.', en: 'An easy calm gift.' },
    usage: { ar: 'نهار، مساء خفيف، ومناسبات هادئة.', en: 'Daytime, light evening, calm occasions.' },
    entry: { ar: 'اختيار ناعم ومريح.', en: 'A soft, easy pick.' },
  },
};

export const highlightCopy: Record<Highlight['id'], {
  copy: Localized;
  eyebrow: Localized;
  title: Localized;
}> = {
  sharara: { eyebrow: { ar: 'توابل فريش', en: 'Fresh spice' }, title: scentCopy.sharara.name, copy: { ar: 'أول رشة تلفت، وأثر مسكي داكن يفضل.', en: 'A bright first spray with a darker musky trail.' } },
  madar: { eyebrow: { ar: 'حركة نضيفة', en: 'Clean motion' }, title: scentCopy.madar.name, copy: { ar: 'فريش خشبي رياضي يدور معاك طول اليوم.', en: 'Fresh, woody, and made to move through the day.' } },
  athar: { eyebrow: { ar: 'أثر عميق', en: 'Deep trail' }, title: scentCopy.athar.name, copy: { ar: 'داكن وفريش وخشبي، يسبقك ويفضل بعدك.', en: 'Dark, fresh, and woody with a clear trail.' } },
  barq: { eyebrow: { ar: 'لمعة قهوة', en: 'Coffee spark' }, title: scentCopy.barq.name, copy: { ar: 'قهوة باردة بطابع فريش حار ولمعة دافئة.', en: 'Cool coffee with fresh spice and warm glow.' } },
  nada: { eyebrow: { ar: 'نضافة فريش', en: 'Fresh clean' }, title: scentCopy.nada.name, copy: { ar: 'فريش، نضيف، وأنثوي بنعومة روز جولد.', en: 'Fresh, clean, and softly feminine.' } },
  ghayma: { eyebrow: { ar: 'هدية ناعمة', en: 'Soft gift' }, title: scentCopy.ghayma.name, copy: { ar: 'نعومة بتتعرف من غير صوت، فاكهية ومسك نضيف.', en: 'Soft fruity musk, calm and memorable.' } },
  discovery: { eyebrow: { ar: 'جرّب أولاً', en: 'Try first' }, title: { ar: 'مجموعة التجربة', en: 'Discovery Set' }, copy: { ar: 'جرّب الست روائح قبل اختيار الزجاجة.', en: 'Try all six scents before choosing a bottle.' } },
  gift: { eyebrow: { ar: 'جاهزة للإهداء', en: 'Ready to give' }, title: { ar: 'هدايا نفس', en: 'Nafas gifts' }, copy: { ar: 'اختيارات هادئة للهدايا الرجالي والحريمي.', en: 'Calm gift edits for men and women.' } },
  quality: { eyebrow: { ar: 'مراجعة الدفعات', en: 'Batch checked' }, title: { ar: 'طقس الجودة', en: 'Quality ritual' }, copy: { ar: 'تعتيق ومراجعة للصفاء والرش والتقديم.', en: 'Maturation and practical checks before delivery.' } },
};

export const chapterCopy: Record<string, { copy: Localized; title: Localized }> = {
  opening: { title: { ar: 'الافتتاحية', en: 'Opening' }, copy: { ar: 'أول لمعة من الرائحة تفتح المزاج وتحدد الاتجاه.', en: 'The first lift sets the tone and invites you closer.' } },
  heart: { title: { ar: 'القلب', en: 'Heart' }, copy: { ar: 'بعد دقائق، الشخصية تظهر: فريش، داكن، ناعم، أو دافئ.', en: 'After a few minutes, the true personality settles in.' } },
  trail: { title: { ar: 'الأثر', en: 'Trail' }, copy: { ar: 'الجزء الذي يبقى قريباً من الجلد ويعود في الذاكرة.', en: 'The part that stays close to skin and returns in memory.' } },
};

export const sensoryCopy: Record<string, { copy: Localized; title: Localized }> = {
  opening: { title: { ar: 'الافتتاحية', en: 'Opening' }, copy: { ar: 'نفحة أولى تلمع وتدعو للاقتراب.', en: 'A first impression that glows and draws you in.' } },
  heart: { title: { ar: 'القلب', en: 'Heart' }, copy: { ar: 'المود الحقيقي يستقر بهدوء على الجلد.', en: 'The main mood settles calmly on skin.' } },
  base: { title: { ar: 'القاعدة', en: 'Base' }, copy: { ar: 'مسك، خشب، عنبر، ولمسة أخيرة تترك أثر.', en: 'Musk, woods, amber, and the final trail.' } },
};

export const flowCopy: Record<string, { copy: Localized; title: Localized }> = {
  tester: { title: { ar: 'اطلب مجموعة التجربة', en: 'Order Discovery Set' }, copy: { ar: 'ست عينات صغيرة من كل الكولكشن.', en: 'Six small samples from the full collection.' } },
  wear: { title: { ar: 'جرّبه يوم كامل', en: 'Wear it for a day' }, copy: { ar: 'اترك الرائحة تظهر على جلدك في وقتها.', en: 'Let each scent unfold on skin.' } },
  choose: { title: { ar: 'اختر زجاجتك', en: 'Choose your bottle' }, copy: { ar: 'حدد الرائحة الأقرب لحضورك.', en: 'Pick the scent that fits your presence.' } },
  return: { title: { ar: 'ارجع لنفس الرائحة', en: 'Come back anytime' }, copy: { ar: 'أعد الطلب عندما يستقر اختيارك.', en: 'Reorder once the choice feels settled.' } },
};

export const selectorCopy: Record<ChoiceId, { label: Localized }> = {
  sharara: { label: { ar: 'حضور لافت', en: 'Striking presence' } },
  madar: { label: { ar: 'فريش يومي', en: 'Daily fresh' } },
  athar: { label: { ar: 'حضور غامق', en: 'Dark presence' } },
  barq: { label: { ar: 'قهوة مميزة', en: 'Unique coffee' } },
  nada: { label: { ar: 'أنوثة ناعمة', en: 'Soft femininity' } },
  ghayma: { label: { ar: 'هدية', en: 'Gift' } },
  discovery: { label: { ar: 'محتار؟ خلينا نساعدك', en: 'Still deciding? Let us help' } },
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
  'fixed-formulas': { title: { ar: 'تركيز واضح', en: 'Clear concentration' }, copy: { ar: 'نذكر 24% بشكل تجاري واضح، بدون كشف أي تفاصيل داخلية.', en: 'A clear public 24% concentration note without internal formula details.' } },
  'batch-checks': { title: { ar: 'مراجعة الدفعات', en: 'Batch discipline' }, copy: { ar: 'تعتيق 21-30 يوم ومراجعة عملية للصفاء والرش والتقديم.', en: '21-30 day maturation with practical clarity, spray, and finish checks.' } },
  'tester-first': { title: { ar: 'التجربة أولاً', en: 'Discovery first' }, copy: { ar: 'مجموعة التجربة تساعدك تختار بهدوء قبل الزجاجة.', en: 'The Discovery Set helps you choose calmly before a full bottle.' } },
  support: { title: { ar: 'دعم واتساب', en: 'WhatsApp support' }, copy: { ar: 'اسألنا عن المود، الحجم، أو الهدية المناسبة بدون ضغط.', en: 'Ask about mood, size, or gifting without pressure.' } },
};

export const exploreCopy: Record<string, { copy: Localized; title: Localized }> = {
  shop: { title: { ar: 'المتجر', en: 'Shop' }, copy: { ar: 'تسوق الكولكشن الأساسي.', en: 'Browse the main collection.' } },
  discovery: { title: { ar: 'مجموعة التجربة', en: 'Discovery Set' }, copy: { ar: 'جرّب الست روائح قبل الزجاجة.', en: 'Try all six before the bottle.' } },
  gifts: { title: { ar: 'الهدايا', en: 'Gift Boxes' }, copy: { ar: 'اختيارات رجالي وحريمي بهدوء.', en: 'Men and women gift edits.' } },
  finder: { title: { ar: 'اكتشف عطرك', en: 'Scent Finder' }, copy: { ar: 'اختبار سريع يرشح لك عطر مناسب.', en: 'A quick guided recommendation.' } },
  whatsapp: { title: { ar: 'واتساب', en: 'WhatsApp' }, copy: { ar: 'اسألنا أو اطلب مباشرة.', en: 'Ask us or order directly.' } },
};
