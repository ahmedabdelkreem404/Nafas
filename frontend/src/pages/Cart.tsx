import { ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCachedProducts } from '../cache/productCache';
import CartItem from '../components/CartItem';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { useEngagement } from '../hooks/useEngagement';
import type { Product } from '../types/store';
import { formatCurrency } from '../utils/format';

export default function Cart() {
  const { locale } = useLocale();
  const { getScore } = useEngagement();
  const { items, removeFromCart, total, updateQuantity } = useCart();
  const [suggested, setSuggested] = useState<Product[]>([]);

  useEffect(() => {
    if (items.length) {
      return;
    }

    getCachedProducts()
      .then((products) => {
        const nextProducts = [...products].sort((left, right) => getScore(right) - getScore(left)).slice(0, 3);
        setSuggested(nextProducts);
      })
      .catch(() => setSuggested([]));
  }, [getScore, items.length]);

  const recommendations = useMemo(() => suggested.slice(0, 3), [suggested]);

  if (!items.length) {
    return (
      <div className="n-container n-section">
        <div className="empty-panel empty-panel--large">
          <ShoppingBag size={28} />
          <h1>{locale === 'ar' ? 'السلة ما زالت فارغة' : 'Your cart is still empty'}</h1>
          <p>{locale === 'ar' ? 'ابدأ من المجموعة ثم عد إلى هنا عندما تجد الرائحة التي تشبه حضورك.' : 'Start with the collection, then come back once you find the scent that fits your presence.'}</p>
          <Link to="/shop" className="n-btn n-btn--primary">{locale === 'ar' ? 'اكتشف العطور' : 'Discover perfumes'}</Link>
        </div>
        {recommendations.length ? (
          <div className="n-section">
            <div className="section-head">
              <div>
                <small>{locale === 'ar' ? 'ربما يعجبك...' : 'You may also like'}</small>
                <h2>{locale === 'ar' ? 'روائح مقترحة لك' : 'Suggested scents for you'}</h2>
              </div>
            </div>
            <div className="product-grid product-grid--three nh__cards">
              {recommendations.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="n-container n-section cart-page">
      <div className="page-head page-head--compact">
        <small>{locale === 'ar' ? 'السلة' : 'Cart'}</small>
        <h1>{locale === 'ar' ? 'مراجعة هادئة قبل التأكيد' : 'A calm review before confirmation'}</h1>
      </div>
      <div className="cart-layout">
        <div className="cart-items stack">
          {items.map((item) => (
            <Reveal key={item.id}>
              <CartItem
                item={item}
                locale={locale}
                onQuantityChange={(nextQuantity) => updateQuantity(item.id, nextQuantity)}
                onRemove={() => removeFromCart(item.id)}
                removeLabel={locale === 'ar' ? 'إزالة' : 'Remove'}
                stockLabel={{
                  in: locale === 'ar' ? 'متوفر' : 'In stock',
                  out: locale === 'ar' ? 'نفد المخزون' : 'Out of stock',
                }}
              />
            </Reveal>
          ))}
        </div>
        <aside className="summary-card">
          <h2>{locale === 'ar' ? 'ملخص الطلب' : 'Order summary'}</h2>
          <div className="price-line"><span>{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span><strong>{formatCurrency(total, locale)}</strong></div>
          <div className="price-line"><span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span><small>{locale === 'ar' ? 'سيتم احتسابه عند التأكيد' : 'Calculated at confirmation'}</small></div>
          <div className="price-line price-line--total"><span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span><strong>{formatCurrency(total, locale)}</strong></div>
          <Link to="/checkout" className="n-btn n-btn--primary">{locale === 'ar' ? 'إتمام الطلب' : 'Checkout'}</Link>
          <Link to="/shop" className="n-btn n-btn--ghost">{locale === 'ar' ? 'متابعة التسوق' : 'Continue shopping'}</Link>
        </aside>
      </div>
    </div>
  );
}
