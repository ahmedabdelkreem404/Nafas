import { Heart, Languages, Menu, MessageCircle, ShoppingBag, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { useEngagement } from '../hooks/useEngagement';
import { getStoredUser, getUserFirstName, isAuthenticated } from '../utils/auth';
import { BRAND_ICON, BRAND_LOGO, WHATSAPP_SUPPORT_URL } from '../utils/brand';
import { formatNumber } from '../utils/format';

const navItems = {
  ar: [
    { to: '/', label: 'الرئيسية' },
    { to: '/shop', label: 'المتجر' },
    { to: '/about', label: 'قصتنا' },
    { to: '/faq', label: 'الأسئلة' },
  ],
  en: [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
  ],
} as const;

const sensoryNavItems = {
  ar: [
    { to: '/', label: 'الرئيسية' },
    { to: '/shop', label: 'الكولكشن' },
    { to: '/scent-finder', label: 'اكتشف عطرك' },
    { to: '/discovery-set', label: 'مجموعة التجربة' },
    { to: '/quality', label: 'الجودة' },
  ],
  en: [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Collection' },
    { to: '/scent-finder', label: 'Scent Finder' },
    { to: '/discovery-set', label: 'Discovery Set' },
    { to: '/quality', label: 'Quality' },
  ],
} as const;

void navItems;

const drawerCopy = {
  ar: {
    account: 'الحساب',
    cart: 'السلة',
    close: 'إغلاق القائمة',
    contact: 'تواصل واتساب',
    favorites: 'المفضلة',
    language: 'English',
    main: 'روابط رئيسية',
    menu: 'القائمة',
    shop: 'التسوق',
    shopAll: 'كل العطور',
    support: 'المساندة',
    welcome: 'مرحباً',
  },
  en: {
    account: 'Account',
    cart: 'Cart',
    close: 'Close menu',
    contact: 'WhatsApp support',
    favorites: 'Favorites',
    language: 'العربية',
    main: 'Main links',
    menu: 'Menu',
    shop: 'Shop',
    shopAll: 'All perfumes',
    support: 'Support',
    welcome: 'Hi',
  },
} as const;

const drawerId = 'nafas-mobile-drawer';

export default function Navbar() {
  const { locale, toggleLocale } = useLocale();
  const { openCart, totalCount } = useCart();
  const { favoriteCount } = useEngagement();
  const [open, setOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [favoritePulse, setFavoritePulse] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const user = getStoredUser();
  const signedIn = isAuthenticated() && Boolean(user);
  const firstName = getUserFirstName(locale);
  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'N';
  const links = sensoryNavItems[locale];
  const copy = drawerCopy[locale];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    document.body.style.overflow = open ? 'hidden' : '';

    if (!open) {
      return () => {
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
      };
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusFirst = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(focusableSelector)]
        .filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);

      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusFirst);
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('nav-open');
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
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

  const openCartFromDrawer = () => {
    setOpen(false);
    openCart();
  };

  return (
    <>
      <header className="site-nav-wrap">
        <nav className={`site-nav site-nav--${locale}`} aria-label="Nafas">
          <Link to="/" className="site-nav__brand" aria-label="Nafas">
            <span className="site-nav__brand-icon">
              <img src={BRAND_ICON} alt="" className="site-nav__brand-icon-image" />
            </span>
            <span className="site-nav__brand-copy">
              <img src={BRAND_LOGO} alt="Nafas" className="site-nav__brand-logo" />
              <small>{locale === 'ar' ? 'دار نفَس' : 'Maison Nafas'}</small>
            </span>
          </Link>

          <div className="site-nav__links">
            {links.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `site-nav__link ${index > 1 ? 'site-nav__link--secondary' : 'site-nav__link--primary'} ${isActive ? 'is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="site-nav__actions">
            <button type="button" className="lang-toggle" onClick={toggleLocale} aria-label={copy.language}>
              <Languages aria-hidden="true" size={16} />
              <span className={locale === 'ar' ? 'is-active' : ''}>ع</span>
              <span className={locale === 'en' ? 'is-active' : ''}>EN</span>
            </button>

            <Link to="/favorites" className={`site-icon site-icon--favorites ${favoritePulse ? 'is-bumping' : ''}`} aria-label={copy.favorites}>
              <Heart size={18} aria-hidden="true" />
              <span className="site-badge">{formatNumber(favoriteCount, locale)}</span>
            </Link>

            <Link to="/account" className={`site-icon site-icon--account ${signedIn ? 'site-avatar' : ''}`} aria-label={copy.account}>
              {signedIn ? (
                <>
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt={user.name} className="site-avatar__image" />
                  ) : (
                    <span className="site-avatar__fallback">{initials}</span>
                  )}
                  <span className="site-avatar__label">{copy.welcome} {firstName}</span>
                </>
              ) : (
                <User size={18} aria-hidden="true" />
              )}
            </Link>

            <button type="button" className={`site-icon site-icon--cart ${cartPulse ? 'is-bumping' : ''}`} onClick={openCart} aria-label={copy.cart}>
              <ShoppingBag size={18} aria-hidden="true" />
              <span className="site-badge">{formatNumber(totalCount, locale)}</span>
            </button>

            <button
              type="button"
              className="site-icon site-icon--menu"
              onClick={() => setOpen(true)}
              aria-label={copy.menu}
              aria-controls={drawerId}
              aria-expanded={open}
            >
              <Menu size={18} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <button
        type="button"
        className={`mobile-panel-backdrop ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-label={copy.close}
      />
      <aside
        id={drawerId}
        ref={panelRef}
        className={`mobile-panel mobile-panel--${locale} ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        aria-label={copy.menu}
      >
        <div className="mobile-panel__head">
          <Link to="/" className="mobile-panel__brand" onClick={() => setOpen(false)}>
            <img src={BRAND_LOGO} alt="Nafas" className="mobile-panel__logo" />
            <span>{locale === 'ar' ? 'دار نفَس' : 'Maison Nafas'}</span>
          </Link>
          <button type="button" className="site-icon" onClick={() => setOpen(false)} aria-label={copy.close}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mobile-panel__section">
          <strong>{copy.main}</strong>
          <div className="mobile-panel__links">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className="mobile-panel__link" onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mobile-panel__section">
          <strong>{copy.shop}</strong>
          <div className="mobile-panel__links">
            <Link to="/shop" className="mobile-panel__link" onClick={() => setOpen(false)}>{copy.shopAll}</Link>
            <Link to="/favorites" className="mobile-panel__link" onClick={() => setOpen(false)}>{copy.favorites}</Link>
            <button type="button" className="mobile-panel__link mobile-panel__button" onClick={openCartFromDrawer}>
              {copy.cart}
              <span>{formatNumber(totalCount, locale)}</span>
            </button>
          </div>
        </div>

        <div className="mobile-panel__section">
          <strong>{copy.support}</strong>
          <div className="mobile-panel__links">
            <Link to="/account" className="mobile-panel__link" onClick={() => setOpen(false)}>
              {signedIn && firstName ? `${copy.welcome} ${firstName}` : copy.account}
            </Link>
            <a href={WHATSAPP_SUPPORT_URL} className="mobile-panel__link mobile-panel__link--gold" target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              {copy.contact}
            </a>
            <button type="button" className="mobile-panel__link mobile-panel__button" onClick={toggleLocale}>
              {copy.language}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
