import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { BRAND_LOGO, WHATSAPP_SUPPORT_URL } from '../utils/brand';

export default function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="site-footer">
      <div className="n-container site-footer__grid">
        <div className="site-footer__brand-block">
          <img src={BRAND_LOGO} alt="نفَس" className="site-footer__brand-logo" />
          <p>{locale === 'ar' ? 'علامة عطرية عربية أولًا، مصممة لتجعل اكتشاف الرائحة أهدأ وأوضح.' : 'An Arabic-first perfume house designed to make fragrance discovery calmer and more precise.'}</p>
        </div>
        <div>
          <h3>{locale === 'ar' ? 'الدار' : 'Maison'}</h3>
          <Link to="/about">{locale === 'ar' ? 'عن نفَس' : 'About'}</Link>
          <Link to="/shop">{locale === 'ar' ? 'المتجر' : 'Shop'}</Link>
          <Link to="/quality">{locale === 'ar' ? 'الجودة' : 'Quality'}</Link>
        </div>
        <div>
          <h3>{locale === 'ar' ? 'المساندة' : 'Support'}</h3>
          <Link to="/faq">FAQ</Link>
          <Link to="/privacy-policy">{locale === 'ar' ? 'الخصوصية' : 'Privacy'}</Link>
          <Link to="/return-policy">{locale === 'ar' ? 'الاسترجاع' : 'Returns'}</Link>
        </div>
        <div>
          <h3>{locale === 'ar' ? 'القانونية' : 'Legal'}</h3>
          <Link to="/terms">{locale === 'ar' ? 'الشروط' : 'Terms'}</Link>
          <a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
      <div className="n-container site-footer__bottom">Nafas © 2025</div>
    </footer>
  );
}
