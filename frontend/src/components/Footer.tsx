import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { BRAND_LOGO, WHATSAPP_SUPPORT_URL } from '../utils/brand';

const footerCopy = {
  ar: {
    brand: 'دار عطرية عربية تبدأ بالتجربة الهادئة: تستر أولاً، اختيار أوضح، ووعود واقعية تناسب العطر الحقيقي.',
    contact: 'واتساب',
    copyright: 'نفَس',
    help: 'المساندة',
    legal: 'القانونية',
    note: 'تختلف مدة ثبات وفوحان العطر حسب البشرة، الطقس، وطريقة الاستخدام. نركز على تجربة واضحة ومريحة بدون مبالغات.',
    shop: 'التسوق',
    social: 'القنوات',
    sections: {
      about: 'عن نفَس',
      account: 'الحساب',
      faq: 'الأسئلة',
      favorites: 'المفضلة',
      privacy: 'الخصوصية',
      quality: 'الجودة',
      returns: 'الاسترجاع',
      shop: 'كل العطور',
      terms: 'الشروط',
    },
    title: 'دار نفَس',
  },
  en: {
    brand: 'An Arabic perfume house built around calm discovery: try first, choose clearly, and expect realistic fragrance performance.',
    contact: 'WhatsApp',
    copyright: 'Nafas',
    help: 'Help',
    legal: 'Legal',
    note: 'Longevity and projection vary by skin, weather, and use. Nafas keeps claims realistic and focused on a clear wearing experience.',
    shop: 'Shop',
    social: 'Channels',
    sections: {
      about: 'About Nafas',
      account: 'Account',
      faq: 'FAQ',
      favorites: 'Favorites',
      privacy: 'Privacy',
      quality: 'Quality',
      returns: 'Returns',
      shop: 'All perfumes',
      terms: 'Terms',
    },
    title: 'Maison Nafas',
  },
} as const;

export default function Footer() {
  const { locale } = useLocale();
  const { getSetting } = useSiteSettings();
  const copy = footerCopy[locale];
  const suffix = locale === 'ar' ? 'ar' : 'en';
  const logoUrl = getSetting('logo_url', BRAND_LOGO);
  const whatsappUrl = getSetting('whatsapp_url', WHATSAPP_SUPPORT_URL);
  const title = getSetting(`footer_title_${suffix}`, copy.title);
  const brand = getSetting(`footer_brand_${suffix}`, copy.brand);
  const note = getSetting(`footer_note_${suffix}`, copy.note);

  return (
    <footer className="site-footer">
      <div className="n-container site-footer__grid">
        <div className="site-footer__brand-block">
          <img src={logoUrl} alt="Nafas" className="site-footer__brand-logo" />
          <h2>{title}</h2>
          <p>{brand}</p>
          <a className="site-footer__whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
            <MessageCircle size={18} aria-hidden="true" />
            {copy.contact}
          </a>
        </div>

        <nav aria-label={copy.shop}>
          <h3>{copy.shop}</h3>
          <Link to="/shop">{copy.sections.shop}</Link>
          <Link to="/favorites">{copy.sections.favorites}</Link>
          <Link to="/quality">{copy.sections.quality}</Link>
        </nav>

        <nav aria-label={copy.help}>
          <h3>{copy.help}</h3>
          <Link to="/faq">{copy.sections.faq}</Link>
          <Link to="/account">{copy.sections.account}</Link>
          <Link to="/about">{copy.sections.about}</Link>
        </nav>

        <nav aria-label={copy.legal}>
          <h3>{copy.legal}</h3>
          <Link to="/privacy-policy">{copy.sections.privacy}</Link>
          <Link to="/return-policy">{copy.sections.returns}</Link>
          <Link to="/terms">{copy.sections.terms}</Link>
        </nav>
      </div>

      <div className="n-container site-footer__bottom">
        <p>{note}</p>
        <span>{copy.copyright} © 2026</span>
      </div>
    </footer>
  );
}
