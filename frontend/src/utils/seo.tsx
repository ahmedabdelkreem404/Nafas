import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';

type LocalizedSeoConfig = {
  title: string;
  description: string;
};

type SeoConfig = {
  ar: LocalizedSeoConfig;
  en: LocalizedSeoConfig;
};

const defaultSeo: SeoConfig = {
  ar: {
    title: 'Nafas | عطور عربية فاخرة',
    description: 'اكتشف عطور نفَس: ست روائح، مجموعة تجربة، وبوكسات هدية مع تجربة شراء عربية واضحة وهادئة.',
  },
  en: {
    title: 'Nafas | Arabic-first fine fragrances',
    description: 'Discover Nafas perfumes: six scents, a discovery set, and gift boxes with a calm Arabic-first buying experience.',
  },
};

const seoByPath: Record<string, SeoConfig> = {
  '/': defaultSeo,
  '/shop': {
    ar: {
      title: 'متجر نفَس | العطور ومجموعة التجربة والهدايا',
      description: 'تسوق عطور نفَس الستة، مجموعة التجربة، وبوكسات الهدايا مع دفع عند الاستلام وتحويل يدوي.',
    },
    en: {
      title: 'Nafas Shop | Perfumes, discovery set, and gift boxes',
      description: 'Shop the six Nafas perfumes, discovery set, and gift boxes with COD and manual payment options.',
    },
  },
  '/cart': {
    ar: {
      title: 'السلة | نفَس',
      description: 'راجع اختياراتك من عطور نفَس قبل الانتقال إلى الدفع.',
    },
    en: {
      title: 'Cart | Nafas',
      description: 'Review your Nafas selections before checkout.',
    },
  },
  '/checkout': {
    ar: {
      title: 'إتمام الطلب | نفَس',
      description: 'أكمل طلب نفَس عبر الدفع عند الاستلام أو Vodafone Cash أو Instapay.',
    },
    en: {
      title: 'Checkout | Nafas',
      description: 'Complete your Nafas order with COD, Vodafone Cash, or Instapay.',
    },
  },
  '/about': {
    ar: {
      title: 'عن نفَس | دار عطرية عربية',
      description: 'تعرف على هوية نفَس وتجربة العطور العربية الأولى.',
    },
    en: {
      title: 'About Nafas | Arabic fragrance house',
      description: 'Learn about the Nafas identity and Arabic-first fragrance experience.',
    },
  },
  '/quality': {
    ar: {
      title: 'الجودة | نفَس',
      description: 'مبادئ الجودة في نفَس: وصف واضح، تشطيب أنيق، ووعود واقعية.',
    },
    en: {
      title: 'Quality | Nafas',
      description: 'Nafas quality principles: clear descriptions, refined finishing, and realistic claims.',
    },
  },
  '/faq': {
    ar: {
      title: 'الأسئلة الشائعة | نفَس',
      description: 'إجابات سريعة حول الطلب، الدفع، الاختيار، والتوصيل في نفَس.',
    },
    en: {
      title: 'FAQ | Nafas',
      description: 'Quick answers about ordering, payment, selection, and delivery at Nafas.',
    },
  },
  '/privacy-policy': {
    ar: {
      title: 'سياسة الخصوصية | نفَس',
      description: 'كيف تتعامل نفَس مع بيانات العملاء والطلبات والدعم.',
    },
    en: {
      title: 'Privacy Policy | Nafas',
      description: 'How Nafas handles customer data, orders, and support.',
    },
  },
  '/return-policy': {
    ar: {
      title: 'سياسة الاستبدال والاسترجاع | نفَس',
      description: 'شروط الاستبدال والاسترجاع المبدئية لطلبات نفَس.',
    },
    en: {
      title: 'Return Policy | Nafas',
      description: 'Initial exchange and return terms for Nafas orders.',
    },
  },
  '/shipping-policy': {
    ar: {
      title: 'سياسة الشحن والتوصيل | نفَس',
      description: 'معلومات الشحن، التأكيد، والمتابعة لطلبات نفَس.',
    },
    en: {
      title: 'Shipping Policy | Nafas',
      description: 'Shipping, confirmation, and follow-up information for Nafas orders.',
    },
  },
  '/terms': {
    ar: {
      title: 'الشروط والأحكام | نفَس',
      description: 'الشروط الأساسية لاستخدام متجر نفَس وإتمام الطلبات.',
    },
    en: {
      title: 'Terms | Nafas',
      description: 'Basic terms for using Nafas and placing orders.',
    },
  },
};

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(property ? 'property' : 'name', name);
    document.head.appendChild(element);
  }

  element.content = content;
}

export default function SeoManager() {
  const location = useLocation();
  const { locale } = useLocale();

  useEffect(() => {
    const isProduct = location.pathname.startsWith('/products/');
    const productSlug = decodeURIComponent(location.pathname.split('/').filter(Boolean).at(-1) || 'Product');
    const routeSeo = seoByPath[location.pathname]?.[locale] || defaultSeo[locale];
    const title = isProduct
      ? `${productSlug} | ${locale === 'ar' ? 'نفَس' : 'Nafas'}`
      : routeSeo.title;
    const description = isProduct
      ? (locale === 'ar'
        ? 'تفاصيل العطر، الأحجام، السعر، وطريقة الطلب من متجر نفَس.'
        : 'Fragrance details, sizes, price, and ordering from Nafas.')
      : routeSeo.description;
    const canonical = `${window.location.origin}${location.pathname}`;

    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.title = title;
    setMeta('description', description);
    setMeta('robots', 'index,follow');
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', isProduct ? 'product' : 'website', true);
    setMeta('og:url', canonical, true);
    setMeta('twitter:card', 'summary_large_image');

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [locale, location.pathname]);

  return null;
}
