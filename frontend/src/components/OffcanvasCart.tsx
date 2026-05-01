import { X, Loader } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/format';
import ProductMedia from './ProductMedia';

const cartCopy = {
  ar: {
    checkout: 'إتمام الطلب',
    close: 'إغلاق السلة',
    confirmNo: 'لا',
    confirmRemove: 'إزالة هذا المنتج؟',
    confirmYes: 'نعم',
    empty: 'السلة فارغة الآن.',
    heading: 'سلة نفَس',
    loading: 'جاري التحميل...',
    remove: 'إزالة',
    subtotal: 'المجموع',
    title: 'سلة سريعة',
    viewCart: 'صفحة السلة',
  },
  en: {
    checkout: 'Checkout',
    close: 'Close cart',
    confirmNo: 'No',
    confirmRemove: 'Remove this item?',
    confirmYes: 'Yes',
    empty: 'Your cart is empty.',
    heading: 'Nafas cart',
    loading: 'Loading...',
    remove: 'Remove',
    subtotal: 'Subtotal',
    title: 'Quick cart',
    viewCart: 'View cart',
  },
} as const;

export default function OffcanvasCart() {
  const { pathname } = useLocation();
  const { locale } = useLocale();
  const { closeCart, isOpen, items, loading, removeFromCart, total } = useCart();
  const previousPathname = useRef(pathname);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const copy = cartCopy[locale];

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      closeCart();
    }

    previousPathname.current = pathname;
  }, [closeCart, pathname]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeCart, isOpen]);

  useEffect(() => {
    if (!confirmingId) {
      return undefined;
    }

    const timer = window.setTimeout(() => setConfirmingId(null), 4000);
    return () => window.clearTimeout(timer);
  }, [confirmingId]);

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? 'is-open' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer cart-drawer--${locale} ${isOpen ? 'is-open' : ''}`} aria-label={copy.heading} aria-hidden={!isOpen}>
        <header className="cart-drawer__head">
          <div>
            <small>{copy.title}</small>
            <h3>{copy.heading}</h3>
          </div>
          <button type="button" className="site-icon" onClick={closeCart} aria-label={copy.close}>
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <div className="cart-drawer__items">
          {loading ? (
            <div className="empty-panel"><Loader className="spinner" size={24} /> <span>{copy.loading}</span></div>
          ) : items.length ? items.map((item) => (
            <article className="drawer-item" key={item.id}>
              <div className="drawer-item__thumb">
                <ProductMedia product={item.product} alt={item.product?.name_ar || item.product?.name_en || 'Product'} />
              </div>
              <div className="drawer-item__copy">
                <strong>{locale === 'ar' ? item.product?.name_ar || item.product?.name_en : item.product?.name_en || item.product?.name_ar}</strong>
                <span>{item.variant.label}</span>
                <small>{formatCurrency((item.variant.retail_price || 0) * item.quantity, locale)}</small>
                <button type="button" className="text-button" onClick={() => setConfirmingId(item.id)}>
                  {copy.remove}
                </button>
                <div className={`inline-confirm ${confirmingId === item.id ? 'is-open' : ''}`}>
                  <span>{copy.confirmRemove}</span>
                  <button type="button" className="text-button" onClick={() => removeFromCart(item.id).then(() => setConfirmingId(null))}>{copy.confirmYes}</button>
                  <button type="button" className="text-button" onClick={() => setConfirmingId(null)}>{copy.confirmNo}</button>
                </div>
              </div>
            </article>
          )) : (
            <div className="empty-panel">{copy.empty}</div>
          )}
        </div>
        <footer className="cart-drawer__foot">
          <div className="price-line">
            <span>{copy.subtotal}</span>
            <strong>{formatCurrency(total, locale)}</strong>
          </div>
          <Link to="/checkout" className="n-btn n-btn--primary" onClick={closeCart}>
            {copy.checkout}
          </Link>
          <Link to="/cart" className="n-btn n-btn--ghost" onClick={closeCart}>
            {copy.viewCart}
          </Link>
        </footer>
      </aside>
    </>
  );
}
