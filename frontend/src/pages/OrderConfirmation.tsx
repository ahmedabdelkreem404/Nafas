import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { publicApi } from '../api/publicApi';
import ProductMedia from '../components/ProductMedia';
import { useLocale } from '../context/LocaleContext';
import type { Order } from '../types/store';
import { getUserFirstName, isAuthenticated } from '../utils/auth';
import { formatCurrency } from '../utils/format';
import { normalizeOrder } from '../utils/orders';

export default function OrderConfirmation() {
  const { orderNumber = '' } = useParams();
  const { locale } = useLocale();
  const [order, setOrder] = useState<Order | null>(null);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const firstName = getUserFirstName(locale);
  const signedIn = isAuthenticated();
  const payment = order?.payment || null;
  const paymentMethod = payment?.method || payment?.provider || '';
  const isManualPayment = ['vodafone_cash', 'instapay'].includes(paymentMethod);
  const paymentMethodLabel: Record<string, { ar: string; en: string }> = {
    cash_on_delivery: { ar: 'الدفع عند الاستلام', en: 'Cash on delivery' },
    vodafone_cash: { ar: 'فودافون كاش', en: 'Vodafone Cash' },
    instapay: { ar: 'إنستاباي', en: 'Instapay' },
  };
  const paymentStatusLabel: Record<string, { ar: string; en: string }> = {
    pending: { ar: 'قيد التأكيد', en: 'Pending' },
    pending_review: { ar: 'تحت مراجعة الدفع', en: 'Payment under review' },
    approved: { ar: 'تم اعتماد الدفع', en: 'Payment approved' },
    rejected: { ar: 'تم رفض الدفع', en: 'Payment rejected' },
  };

  useEffect(() => {
    const cached = sessionStorage.getItem(`order_${orderNumber}`);
    if (cached) {
      setOrder(normalizeOrder(JSON.parse(cached) as Order));
    }
  }, [orderNumber]);

  return (
    <div className="n-container n-section order-page">
      {order ? (
        <div className="confirmation-card">
          <CheckCircle2 className="confirmation-card__icon" size={64} />
          <h1>
            {signedIn && firstName
              ? (locale === 'ar' ? `شكراً ${firstName}، تم استلام طلبك بنجاح` : `Thank you ${firstName}, your order has been received`)
              : (locale === 'ar' ? 'تم استلام طلبك بنجاح' : 'Your order has been received')}
          </h1>
          <p className="mono">{order.order_number}</p>
          <div className="summary-items">
            {(order.items || []).map((item, index) => (
              <article key={item.id || index} className="summary-item">
                <div className="summary-item__thumb">
                  {item.product ? (
                    <ProductMedia
                      product={item.product}
                      alt={item.product_name || item.product.name_ar || item.product.name_en}
                    />
                  ) : null}
                </div>
                <div>
                  <strong>{item.product_name || item.product?.name_ar || item.product?.name_en}</strong>
                  <p>{item.variant_label || item.variant?.label} × {item.quantity}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="price-line price-line--total">
            <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
            <strong>{formatCurrency(order.total || 0, locale)}</strong>
          </div>
          {payment ? (
            <div className="confirmation-card__payment">
              <div className="price-line">
                <span>{locale === 'ar' ? 'طريقة الدفع' : 'Payment method'}</span>
                <strong>{paymentMethodLabel[paymentMethod]?.[locale] || paymentMethod}</strong>
              </div>
              {payment.reference ? (
                <div className="price-line">
                  <span>{locale === 'ar' ? 'رقم العملية' : 'Reference'}</span>
                  <strong>{payment.reference}</strong>
                </div>
              ) : null}
              <div className="price-line">
                <span>{locale === 'ar' ? 'حالة الدفع' : 'Payment status'}</span>
                <strong>{paymentStatusLabel[payment.status || '']?.[locale] || payment.status}</strong>
              </div>
            </div>
          ) : null}
          <p>
            {isManualPayment
              ? (locale === 'ar'
                ? 'تم استلام طلبك، وسيتم مراجعة التحويل يدويًا ثم تأكيد الطلب.'
                : 'Your order has been received. The transfer will be reviewed manually, then the order will be confirmed.')
              : (locale === 'ar'
                ? 'تم استلام طلبك، وسيتم التواصل معك لتأكيد التوصيل والدفع عند الاستلام.'
                : 'Your order has been received. We will contact you shortly to confirm delivery and cash on delivery.')}
          </p>
          <Link to="/shop" className="n-btn n-btn--primary">
            {locale === 'ar' ? 'متابعة التسوق' : 'Continue shopping'}
          </Link>
        </div>
      ) : (
        <div className="lookup-card">
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
        </div>
      )}
    </div>
  );
}
