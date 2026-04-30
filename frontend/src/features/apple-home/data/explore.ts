import type { ExploreCard } from '../types';
import { WHATSAPP_BASE_URL } from '../utils/whatsapp';

export const exploreCards: ExploreCard[] = [
  { id: 'shop', title: 'Shop', copy: 'تسوق الكولكشن الأساسي.', href: '/shop' },
  { id: 'discovery', title: 'Discovery Set', copy: 'جرّب الست روائح قبل الزجاجة.', href: '/discovery-set' },
  { id: 'gifts', title: 'Gift Boxes', copy: 'اختيارات رجالي وحريمي بهدوء.', href: '/gift-boxes' },
  { id: 'finder', title: 'Scent Finder', copy: 'اختبار سريع يرشح لك عطر مناسب.', href: '/scent-finder' },
  { id: 'whatsapp', title: 'WhatsApp', copy: 'اسألنا أو اطلب مباشرة.', href: WHATSAPP_BASE_URL, external: true },
];
