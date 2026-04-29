import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../api/publicApi';
import ProductMedia from '../components/ProductMedia';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { buildCheckoutPayload } from '../utils/checkout';
import { formatCurrency } from '../utils/format';
import { normalizeOrder } from '../utils/orders';

const governorates = ['القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'الغربية', 'البحيرة', 'كفر الشيخ', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء', 'جنوب سيناء', 'الوادي الجديد', 'مطروح', 'البحر الأحمر'];

const PHONE_REGEX = /^(010|011|012|015)\d{8}$/;

export default function Checkout() {
  const { locale } = useLocale();
  const { clearCart, items, total } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    email: '',
    governorate: '',
    city: '',
    address: '',
    delivery_notes: '',
    payment_method: 'cod',
  });

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'customer_name':
        return value.trim().length >= 3 ? '' : (locale === 'ar' ? 'الاسم يجب أن يكون 3 أحرف على الأقل' : 'Name must be at least 3 characters.');
      case 'phone':
        return PHONE_REGEX.test(value.trim()) ? '' : (locale === 'ar' ? 'رقم هاتف غير صحيح، مثال: 01012345678' : 'Invalid phone number. Example: 01012345678');
      case 'address':
        return value.trim().length >= 10 ? '' : (locale === 'ar' ? 'الرجاء كتابة العنوان بشكل أكثر تفصيلاً' : 'Please provide a more detailed address.');
      case 'city':
        return value.trim() ? '' : (locale === 'ar' ? 'يرجى كتابة المدينة' : 'Please enter the city.');
      case 'governorate':
        return value.trim() ? '' : (locale === 'ar' ? 'يرجى اختيار المحافظة' : 'Please choose a governorate.');
      case 'email':
        return !value.trim() || /\S+@\S+\.\S+/.test(value) ? '' : (locale === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address.');
      default:
        return '';
    }
  };

  const validateAndStore = (name: string, value: string) => {
    const message = validateField(name, value);
    setErrors((current) => ({ ...current, [name]: message }));
    return message;
  };

  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);
  const isComplete = Boolean(
    form.customer_name.trim() &&
    form.phone.trim() &&
    form.governorate.trim() &&
    form.city.trim() &&
    form.address.trim(),
  );

  if (!items.length) {
    return <div className="n-container n-section"><div className="empty-panel">{locale === 'ar' ? 'أضف منتجًا واحدًا على الأقل قبل إتمام الطلب.' : 'Add at least one item before checking out.'}</div></div>;
  }

  return (
    <div className="n-container n-section checkout-page">
      <div className="page-head page-head--compact">
        <small>{locale === 'ar' ? 'إتمام الطلب' : 'Checkout'}</small>
        <h1>{locale === 'ar' ? 'حقول واضحة ومسار هادئ حتى التأكيد' : 'Clear fields and a calm path to confirmation'}</h1>
      </div>
      <form className="checkout-layout" onSubmit={async (event) => {
        event.preventDefault();
        const nextErrors = {
          customer_name: validateField('customer_name', form.customer_name),
          phone: validateField('phone', form.phone),
          email: validateField('email', form.email),
          governorate: validateField('governorate', form.governorate),
          city: validateField('city', form.city),
          address: validateField('address', form.address),
        };
        setErrors(nextErrors);
        setTouched({
          customer_name: true,
          phone: true,
          email: true,
          governorate: true,
          city: true,
          address: true,
        });
        if (Object.values(nextErrors).some(Boolean)) {
          return;
        }

        setSubmitting(true);
        setError('');
        try {
          await publicApi.validateCart(items.map((item) => ({ quantity: item.quantity, variant_id: item.variant.id })));
          const payload = buildCheckoutPayload(form, items);
          const response = await publicApi.checkout(payload);
          const order = normalizeOrder(response.data.order);
          sessionStorage.setItem(`order_${order.order_number}`, JSON.stringify(order));
          await clearCart();
          navigate(`/order-confirmation/${order.order_number}`);
        } catch (err: any) {
          setError(err.message || (locale === 'ar' ? 'تعذّر إتمام الطلب.' : 'Unable to place the order.'));
        } finally {
          setSubmitting(false);
        }
      }}>
        <div className="checkout-form">
          <section className="form-card">
            <h2>{locale === 'ar' ? 'بيانات العميل' : 'Customer details'}</h2>
            <div className="form-grid">
              {[
                { key: 'customer_name', label: locale === 'ar' ? 'الاسم الكامل' : 'Full name', type: 'text' },
                { key: 'phone', label: locale === 'ar' ? 'رقم الهاتف' : 'Phone', type: 'text' },
                { key: 'email', label: locale === 'ar' ? 'البريد الإلكتروني' : 'Email', type: 'email' },
                { key: 'city', label: locale === 'ar' ? 'المدينة' : 'City', type: 'text' },
              ].map((field) => (
                <label key={field.key} className={errors[field.key] && touched[field.key] ? 'has-error' : ''}>
                  <span>{field.label}</span>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onBlur={(event) => {
                      setTouched((current) => ({ ...current, [field.key]: true }));
                      validateAndStore(field.key, event.target.value);
                    }}
                    onChange={(event) => {
                      setForm({ ...form, [field.key]: event.target.value });
                      if (touched[field.key]) {
                        validateAndStore(field.key, event.target.value);
                      }
                    }}
                    required={field.key !== 'email'}
                  />
                  {errors[field.key] && touched[field.key] ? <small className="field-error">{errors[field.key]}</small> : null}
                </label>
              ))}

              <label className={errors.governorate && touched.governorate ? 'has-error' : ''}>
                <span>{locale === 'ar' ? 'المحافظة' : 'Governorate'}</span>
                <select
                  required
                  value={form.governorate}
                  onBlur={(event) => {
                    setTouched((current) => ({ ...current, governorate: true }));
                    validateAndStore('governorate', event.target.value);
                  }}
                  onChange={(event) => {
                    setForm({ ...form, governorate: event.target.value });
                    if (touched.governorate) {
                      validateAndStore('governorate', event.target.value);
                    }
                  }}
                >
                  <option value="">{locale === 'ar' ? 'اختر المحافظة' : 'Choose governorate'}</option>
                  {governorates.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                {errors.governorate && touched.governorate ? <small className="field-error">{errors.governorate}</small> : null}
              </label>

              <label className={`is-wide ${errors.address && touched.address ? 'has-error' : ''}`}>
                <span>{locale === 'ar' ? 'العنوان' : 'Address'}</span>
                <textarea
                  required
                  rows={4}
                  value={form.address}
                  onBlur={(event) => {
                    setTouched((current) => ({ ...current, address: true }));
                    validateAndStore('address', event.target.value);
                  }}
                  onChange={(event) => {
                    setForm({ ...form, address: event.target.value });
                    if (touched.address) {
                      validateAndStore('address', event.target.value);
                    }
                  }}
                />
                {errors.address && touched.address ? <small className="field-error">{errors.address}</small> : null}
              </label>

              <label className="is-wide">
                <span>{locale === 'ar' ? 'ملاحظات التوصيل' : 'Delivery notes'}</span>
                <textarea rows={3} value={form.delivery_notes} onChange={(event) => setForm({ ...form, delivery_notes: event.target.value })} />
              </label>
            </div>
          </section>

          <section className="form-card">
            <h2>{locale === 'ar' ? 'طريقة الدفع' : 'Payment method'}</h2>
            <label className="radio-card"><input type="radio" checked readOnly /><span>{locale === 'ar' ? 'الدفع عند الاستلام (COD)' : 'Cash on delivery (COD)'}</span></label>
          </section>
        </div>

        <aside className="summary-card">
          <h2>{locale === 'ar' ? 'ملخص الطلب' : 'Order summary'}</h2>
          <div className="summary-items">
            {items.map((item) => (
              <article key={item.id} className="summary-item">
                <div className="summary-item__thumb"><ProductMedia product={item.product} alt={locale === 'ar' ? item.product?.name_ar || '' : item.product?.name_en || ''} /></div>
                <div>
                  <strong>{locale === 'ar' ? item.product?.name_ar || item.product?.name_en : item.product?.name_en || item.product?.name_ar}</strong>
                  <p>{item.variant.label} × {item.quantity}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="price-line"><span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span><strong>{formatCurrency(total, locale)}</strong></div>
          <button type="submit" className="n-btn n-btn--primary" disabled={submitting || hasErrors || !isComplete}>
            {submitting ? (locale === 'ar' ? 'جارِ التأكيد...' : 'Confirming...') : (locale === 'ar' ? 'تأكيد الطلب' : 'Confirm order')}
          </button>
          {error ? <div className="error-banner">{error}</div> : null}
        </aside>
      </form>
    </div>
  );
}
