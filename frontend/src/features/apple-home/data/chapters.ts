import type { FlowStep, SensoryLayer, StoryChapter } from '../types';

export const storyChapters: StoryChapter[] = [
  {
    id: 'opening',
    title: 'الافتتاحية',
    copy: 'أول لمعة من الرائحة تفتح المزاج وتحدد الاتجاه.',
    image: '/assets/stock/optimized/fragrance-spray-moment.webp',
  },
  {
    id: 'heart',
    title: 'القلب',
    copy: 'بعد دقائق، الشخصية تظهر: فريش، ناعمة، دافئة، أو غامضة.',
    image: '/assets/stock/optimized/product-perfume-closeup.webp',
  },
  {
    id: 'trail',
    title: 'الأثر',
    copy: 'الجزء الذي يبقى قريباً من الجلد ويعود في الذاكرة.',
    image: '/assets/stock/optimized/hero-perfume-dark.webp',
  },
];

export const sensoryLayers: SensoryLayer[] = [
  {
    id: 'opening',
    title: 'الافتتاحية / Opening',
    copy: 'نفحة أولى تلمع وتدعو للاقترب.',
  },
  {
    id: 'heart',
    title: 'القلب / Heart',
    copy: 'المود الحقيقي يستقر بهدوء على الجلد.',
  },
  {
    id: 'base',
    title: 'القاعدة / Base',
    copy: 'مِسك، خشب، عنبر، ولمسة أخيرة تترك أثر.',
  },
];

export const testerFlowSteps: FlowStep[] = [
  { id: 'tester', title: 'اطلب تستر' },
  { id: 'wear', title: 'جربه يوم كامل' },
  { id: 'choose', title: 'اختار زجاجتك' },
  { id: 'return', title: 'ارجع لنفس الريحة في أي وقت' },
];
