import type { SelectorOption, TrustCard } from '../types';

export const selectorOptions: SelectorOption[] = [
  { id: 'sharara', label: 'فريش ولافت' },
  { id: 'ghayma', label: 'ناعم وهادي' },
  { id: 'dafwa', label: 'دافئ وحلو' },
  { id: 'zell', label: 'غامض وخشبي' },
  { id: 'discovery', label: 'لسه محتار' },
];

export const trustCards: TrustCard[] = [
  {
    id: 'tester-first',
    title: 'Tester-first experience',
    copy: 'جرّب قبل ما تختار الزجاجة الكاملة.',
  },
  {
    id: 'personalities',
    title: 'Clear scent personalities',
    copy: 'كل رائحة لها مود واضح يساعدك تختار أسرع.',
  },
  {
    id: 'presentation',
    title: 'Premium presentation',
    copy: 'تجربة هادئة من أول نظرة لآخر رشة.',
  },
  {
    id: 'quality',
    title: 'Batch quality ritual',
    copy: 'مراجعة للصفاء، الرش، والتقديم العام.',
  },
  {
    id: 'ordering',
    title: 'Easy ordering',
    copy: 'اسأل، اختار، واطلب بخطوات واضحة.',
  },
  {
    id: 'sizes',
    title: 'Sizes for every need',
    copy: 'تستر، حجم سفر، زجاجة كاملة، وخيارات هدية.',
  },
];
