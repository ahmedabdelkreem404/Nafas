import type { ExploreCard } from '../types';
import { WHATSAPP_BASE_URL } from '../utils/whatsapp';

export const exploreCards: ExploreCard[] = [
  {
    id: 'shop',
    title: 'Shop',
    copy: 'تسوق المجموعة الأساسية.',
    href: '/shop',
  },
  {
    id: 'faq',
    title: 'FAQ',
    copy: 'إجابات سريعة قبل الاختيار.',
    href: '/faq',
  },
  {
    id: 'about',
    title: 'About Nafas',
    copy: 'القصة والفلسفة خلف نفَس.',
    href: '/about',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    copy: 'اسألنا أو اطلب مباشرة.',
    href: WHATSAPP_BASE_URL,
    external: true,
  },
];
