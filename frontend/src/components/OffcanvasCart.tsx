import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/format';
import ProductMedia from './ProductMedia';

export default function OffcanvasCart() {
  const { pathname } = useLocation();
  const { locale } = useLocale();
  const { closeCart, isOpen, items, removeFromCart, total } = useCart();
  const previousPathname = useRef(pathname);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      closeCart();
    }

    previousPathname.current = pathname;
  }, [closeCart, pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeCart, isOpen]);

  useEffect(() => {
    if (!confirmingId) {
      return;
    }

    const timer = window.setTimeout(() => setConfirmingId(null), 4000);
    return () => window.clearTimeout(timer);
  }, [confirmingId]);

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? 'is-open' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer cart-drawer--${locale} ${isOpen ? 'is-open' : ''}`}>
        <header className="cart-drawer__head">
          <div>
            <small>{locale === 'ar' ? 'سلة سريعة' : 'Quick cart'}</small>
            <h3>{locale === 'ar' ? 'سلة نفَس' : 'Nafas cart'}</h3>
          </div>
          <button type="button" className="site-icon" onClick={closeCart} aria-label="Close cart">
            <X size={18} />
          </button>
        </header>
        <div className="cart-drawer__items">
          {items.length ? items.map((item) => (
            <article className="drawer-item" key={item.id}>
              <div className="drawer-item__thumb">
                <ProductMedia product={item.product} alt={item.product?.name_ar || item.product?.name_en || 'Product'} />
              </div>
              <div className="drawer-item__copy">
                <strong>{locale === 'ar' ? item.product?.name_ar || item.product?.name_en : item.product?.name_en || item.product?.name_ar}</strong>
                <span>{item.variant.label}</span>
                <small>{formatCurrency((item.variant.retail_price || 0) * item.quantity, locale)}</small>
                <button type="button" className="text-button" onClick={() => setConfirmingId(item.id)}>
                  {locale === 'ar' ? 'إزالة' : 'Remove'}
                </button>
                <div className={`inline-confirm ${confirmingId === item.id ? 'is-open' : ''}`}>
                  <span>{locale === 'ar' ? 'إزالة هذا المنتج؟' : 'Remove this item?'}</span>
                  <button type="button" className="text-button" onClick={() => removeFromCart(item.id).then(() => setConfirmingId(null))}>{locale === 'ar' ? 'نعم' : 'Yes'}</button>
                  <button type="button" className="text-button" onClick={() => setConfirmingId(null)}>{locale === 'ar' ? 'لا' : 'No'}</button>
                </div>
              </div>
            </article>
          )) : (
            <div className="empty-panel">{locale === 'ar' ? 'السلة فارغة الآن.' : 'Your cart is empty.'}</div>
          )}
        </div>
        <footer className="cart-drawer__foot">
          <div className="price-line">
            <span>{locale === 'ar' ? 'المجموع' : 'Subtotal'}</span>
            <strong>{formatCurrency(total, locale)}</strong>
          </div>
          <Link to="/checkout" className="n-btn n-btn--primary" onClick={closeCart}>
            {locale === 'ar' ? 'إتمام الطلب' : 'Checkout'}
          </Link>
          <Link to="/cart" className="n-btn n-btn--ghost" onClick={closeCart}>
            {locale === 'ar' ? 'صفحة السلة' : 'View cart'}
          </Link>
        </footer>
      </aside>
    </>
  );
}
