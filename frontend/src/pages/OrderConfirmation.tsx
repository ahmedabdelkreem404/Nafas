import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi } from '../api/publicApi';
import ProductMedia from '../components/ProductMedia';
import { useLocale } from '../context/LocaleContext';
import type { Order } from '../types/store';
import { getUserFirstName, isAuthenticated } from '../utils/auth';
import { formatCurrency } from '../utils/format';
import { normalizeOrder } from '../utils/orders';

const paymentMethodLabel: Record<string, { ar: string; en: string }> = {
  cash_on_delivery: { ar: 'الدفع عند الاستلام', en: 'Cash on delivery' },
  instapay: { ar: 'إنستاباي', en: 'Instapay' },
  vodafone_cash: { ar: 'فودافون كاش', en: 'Vodafone Cash' },
};

const paymentStatusLabel: Record<string, { ar: string; en: string }> = {
  approved: { ar: 'تم اعتماد الدفع', en: 'Payment approved' },
  pending: { ar: 'قيد التأكيد', en: 'Pending confirmation' },
  pending_review: { ar: 'تحت مراجعة الدفع', en: 'Payment under review' },
  rejected: { ar: 'تم رفض الدفع', en: 'Payment rejected' },
};

const orderStatusLabel: Record<string, { ar: string; en: string }> = {
  cancelled: { ar: 'ملغي', en: 'Cancelled' },
  confirmed: { ar: 'مؤكد', en: 'Confirmed' },
  delivered: { ar: 'تم التسليم', en: 'Delivered' },
  pending: { ar: 'قيد التأكيد', en: 'Pending confirmation' },
  preparing: { ar: 'جاري التحضير', en: 'Preparing' },
  refunded: { ar: 'مسترد', en: 'Refunded' },
  shipped: { ar: 'تم الشحن', en: 'Shipped' },
};

export default function OrderConfirmation() {
  const { orderNumber = '' } = useParams();
  const { locale } = useLocale();
  const [order, setOrder] = useState<Order | null>(null);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const firstName = getUserFirstName(locale);
  const signedIn = isAuthenticated();

  useEffect(() => {
    const cached = sessionStorage.getItem(`order_${orderNumber}`);
    if (cached) {
      setOrder(normalizeOrder(JSON.parse(cached) as Order));
    }
  }, [orderNumber]);

  const payment = order?.payment || null;
  const paymentMethod = payment?.method || payment?.provider || '';
  const isManualPayment = ['vodafone_cash', 'instapay'].includes(paymentMethod);

  const title = useMemo(() => {
    if (locale === 'en') {
      return signedIn && firstName ? `Thank you ${firstName}, your order is received` : 'Your order is received';
    }

    return signedIn && firstName ? `شكرًا ${firstName}، تم استلام طلبك` : 'تم استلام طلبك بنجاح';
  }, [firstName, locale, signedIn]);

  const whatsappMessage = encodeURIComponent(
    locale === 'ar'
      ? `مرحبًا، أريد متابعة طلبي من نفس رقم ${order?.order_number || orderNumber}`
      : `Hello, I want to follow up on my Nafas order ${order?.order_number || orderNumber}`,
  );

  return (
    <div className="n-container n-section order-page">
      {order ? (
        <section className="order-confirmation-card" aria-labelledby="order-confirmation-title">
          <div className="order-confirmation-card__hero">
            <div className="order-confirmation-card__icon" aria-hidden="true">
              <CheckCircle2 size={34} />
            </div>
            <div>
              <p className="heading-eyebrow">{locale === 'ar' ? 'تم تسجيل الطلب' : 'Order recorded'}</p>
              <h1 id="order-confirmation-title">{title}</h1>
              <p>
                {isManualPayment
                  ? (locale === 'ar'
                    ? 'تم استلام طلبك، وسيتم مراجعة التحويل يدويًا ثم تأكيد الطلب.'
                    : 'Your order is in. The transfer will be reviewed manually before confirmation.')
                  : (locale === 'ar'
                    ? 'تم استلام طلبك، وسنتواصل معك لتأكيد التفاصيل قبل التجهيز.'
                    : 'Your order is in. We will contact you to confirm the details before preparation.')}
              </p>
            </div>
          </div>

          <div className="order-confirmation-card__grid">
            <div className="order-confirmation-card__panel">
              <h2>{locale === 'ar' ? 'ملخص الطلب' : 'Order summary'}</h2>
              <div className="order-confirmation-lines">
                <div className="order-confirmation-line">
                  <span>{locale === 'ar' ? 'رقم الطلب' : 'Order number'}</span>
                  <strong>{order.order_number}</strong>
                </div>
                <div className="order-confirmation-line">
                  <span>{locale === 'ar' ? 'حالة الطلب' : 'Order status'}</span>
                  <strong>{orderStatusLabel[order.status || 'pending']?.[locale] || order.status || orderStatusLabel.pending[locale]}</strong>
                </div>
                <div className="order-confirmation-line">
                  <span>{locale === 'ar' ? 'طريقة الدفع' : 'Payment method'}</span>
                  <strong>{paymentMethodLabel[paymentMethod]?.[locale] || paymentMethodLabel.cash_on_delivery[locale]}</strong>
                </div>
                <div className="order-confirmation-line">
                  <span>{locale === 'ar' ? 'حالة الدفع' : 'Payment status'}</span>
                  <strong>{paymentStatusLabel[payment?.status || 'pending']?.[locale] || paymentStatusLabel.pending[locale]}</strong>
                </div>
                {payment?.reference ? (
                  <div className="order-confirmation-line">
                    <span>{locale === 'ar' ? 'رقم العملية' : 'Reference'}</span>
                    <strong>{payment.reference}</strong>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="order-confirmation-card__panel order-confirmation-card__panel--total">
              <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <strong>{formatCurrency(order.total || 0, locale)}</strong>
            </div>
          </div>

          <div className="order-confirmation-card__items">
            <h2>{locale === 'ar' ? 'العطور المطلوبة' : 'Ordered scents'}</h2>
            {(order.items || []).map((item, index) => (
              <article key={item.id || index} className="order-confirmation-item">
                <div className="order-confirmation-item__thumb">
                  {item.product ? (
                    <ProductMedia
                      product={item.product}
                      alt={item.product_name || item.product.name_ar || item.product.name_en}
                    />
                  ) : null}
                </div>
                <div>
                  <strong>{item.product_name || item.product?.name_ar || item.product?.name_en || (locale === 'ar' ? 'منتج من نفس' : 'Nafas product')}</strong>
                  <span>{item.variant_label || item.variant?.label || (locale === 'ar' ? 'حجم محدد' : 'Selected size')}</span>
                </div>
                <b>{locale === 'ar' ? `${item.quantity} قطعة` : `${item.quantity} item(s)`}</b>
              </article>
            ))}
          </div>

          <div className="order-confirmation-card__actions">
            <Link to="/shop" className="n-btn n-btn--primary">
              {locale === 'ar' ? 'متابعة التسوق' : 'Continue shopping'}
            </Link>
            <a className="n-btn n-btn--secondary" href={`https://wa.me/201095532012?text=${whatsappMessage}`} target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              {locale === 'ar' ? 'متابعة عبر واتساب' : 'Follow up on WhatsApp'}
            </a>
          </div>
        </section>
      ) : (
        <section className="order-lookup-card">
          <p className="heading-eyebrow">{locale === 'ar' ? 'متابعة الطلب' : 'Order lookup'}</p>
          <h1>{locale === 'ar' ? 'ابحث عن طلبك' : 'Look up your order'}</h1>
          <p>
            {locale === 'ar'
              ? 'أدخل رقم الهاتف المستخدم أثناء الطلب لإظهار التفاصيل.'
              : 'Enter the phone number used during checkout to load the order details.'}
          </p>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setError('');
              try {
                const response = await publicApi.getOrderConfirmation(orderNumber, { phone }, { skipAuth: true });
                setOrder(normalizeOrder(response.data.data || response.data.order || response.data));
              } catch (err: any) {
                setError(err.message || (locale === 'ar' ? 'تعذّر العثور على الطلب.' : 'Unable to find the order.'));
              }
            }}
          >
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={locale === 'ar' ? 'رقم الهاتف' : 'Phone number'}
            />
            <button type="submit" className="n-btn n-btn--primary">
              {locale === 'ar' ? 'عرض الطلب' : 'View order'}
            </button>
          </form>
          {error ? <div className="error-banner">{error}</div> : null}
        </section>
      )}
    </div>
  );
}
