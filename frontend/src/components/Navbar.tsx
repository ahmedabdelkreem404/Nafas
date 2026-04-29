import { Heart, Menu, ShoppingBag, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { useEngagement } from '../hooks/useEngagement';
import { getStoredUser, getUserFirstName, isAuthenticated } from '../utils/auth';
import { BRAND_ICON, BRAND_LOGO } from '../utils/brand';
import { formatNumber } from '../utils/format';

const navItems = {
  ar: [
    ['/', 'الرئيسية'],
    ['/shop', 'المتجر'],
    ['/about', 'قصتنا'],
    ['/faq', 'الأسئلة'],
  ],
  en: [
    ['/', 'Home'],
    ['/shop', 'Shop'],
    ['/about', 'About'],
    ['/faq', 'FAQ'],
  ],
} as const;

export default function Navbar() {
  const { locale, toggleLocale } = useLocale();
  const { openCart, totalCount } = useCart();
  const { favoriteCount } = useEngagement();
  const [open, setOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [favoritePulse, setFavoritePulse] = useState(false);
  const user = getStoredUser();
  const signedIn = isAuthenticated() && Boolean(user);
  const firstName = getUserFirstName(locale);
  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'N';

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!totalCount) {
      return;
    }

    setCartPulse(true);
    const timer = window.setTimeout(() => setCartPulse(false), 600);
    return () => window.clearTimeout(timer);
  }, [totalCount]);

  useEffect(() => {
    if (!favoriteCount) {
      return;
    }

    setFavoritePulse(true);
    const timer = window.setTimeout(() => setFavoritePulse(false), 600);
    return () => window.clearTimeout(timer);
  }, [favoriteCount]);

  const links = navItems[locale];

  return (
    <>
      <header className="site-nav-wrap">
        <nav className={`site-nav site-nav--${locale}`}>
          <Link to="/" className="site-nav__brand" aria-label="Nafas">
            <span className="site-nav__brand-icon">
              <img src={BRAND_ICON} alt="" className="site-nav__brand-icon-image" />
            </span>
            <span className="site-nav__brand-copy">
              <img src={BRAND_LOGO} alt="نفَس" className="site-nav__brand-logo" />
              <small>{locale === 'ar' ? 'دار نفَس' : 'Maison Nafas'}</small>
            </span>
          </Link>

          <div className="site-nav__links">
            {links.map(([to, label], index) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `site-nav__link ${index > 1 ? 'site-nav__link--secondary' : 'site-nav__link--primary'} ${isActive ? 'is-active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="site-nav__actions">
            <button type="button" className="lang-toggle" onClick={toggleLocale} aria-label="Toggle language">
              <span className={locale === 'ar' ? 'is-active' : ''}>ع</span>
              <span className={locale === 'en' ? 'is-active' : ''}>EN</span>
            </button>

            <Link to="/favorites" className={`site-icon site-icon--favorites ${favoritePulse ? 'is-bumping' : ''}`} aria-label="Favorites">
              <Heart size={18} />
              <span className="site-badge">{formatNumber(favoriteCount, locale)}</span>
            </Link>

            <Link to="/account" className={`site-icon ${signedIn ? 'site-avatar' : ''}`} aria-label="Account">
              {signedIn ? (
                <>
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt={user.name} className="site-avatar__image" />
                  ) : (
                    <span className="site-avatar__fallback">{initials}</span>
                  )}
                  <span className="site-avatar__label">{locale === 'ar' ? `مرحبًا ${firstName}` : `Hi ${firstName}`}</span>
                </>
              ) : (
                <User size={18} />
              )}
            </Link>

            <button type="button" className={`site-icon ${cartPulse ? 'is-bumping' : ''}`} onClick={openCart} aria-label="Cart">
              <ShoppingBag size={18} />
              <span className="site-badge">{formatNumber(totalCount, locale)}</span>
            </button>

            <button type="button" className="site-icon site-icon--menu" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </header>

      <div className={`mobile-panel-backdrop ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`mobile-panel mobile-panel--${locale} ${open ? 'is-open' : ''}`}>
        <div className="mobile-panel__head">
          <img src={BRAND_LOGO} alt="نفَس" className="mobile-panel__logo" />
          <button type="button" className="site-icon" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="mobile-panel__links">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className="mobile-panel__link" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}

          <Link to="/favorites" className="mobile-panel__link" onClick={() => setOpen(false)}>
            {locale === 'ar' ? 'المفضلة' : 'Favorites'}
          </Link>

          <Link to="/account" className="mobile-panel__link" onClick={() => setOpen(false)}>
            {signedIn && firstName
              ? (locale === 'ar' ? `مرحبًا ${firstName}` : `Hi ${firstName}`)
              : (locale === 'ar' ? 'الحساب' : 'Account')}
          </Link>
        </div>
      </aside>
    </>
  );
}
