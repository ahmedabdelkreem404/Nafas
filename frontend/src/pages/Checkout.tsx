import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../api/publicApi';
import ProductMedia from '../components/ProductMedia';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../hooks/useCart';
import { buildCheckoutPayload, validatePaymentProof } from '../utils/checkout';
import { formatCurrency } from '../utils/format';
import { normalizeOrder } from '../utils/orders';

const governorates = ['القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'الغربية', 'البحيرة', 'كفر الشيخ', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء', 'جنوب سيناء', 'الوادي الجديد', 'مطروح', 'البحر الأحمر'];

const PHONE_REGEX = /^(010|011|012|015)\d{8}$/;
const VODAFONE_CASH_NUMBER = import.meta.env.VITE_VODAFONE_CASH_NUMBER || '';
const INSTAPAY_HANDLE = import.meta.env.VITE_INSTAPAY_HANDLE || '';

function canUseLocalCheckoutFallback() {
  return import.meta.env.DEV && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
}

function createLocalOrder(form: Record<string, string>, items: ReturnType<typeof useCart>['items'], total: number) {
  const orderNumber = `LOCAL-${Date.now().toString().slice(-8)}`;
  return normalizeOrder({
    address: form.address,
    city: form.city,
    customer_name: form.customer_name,
    customer_phone: form.phone,
    governorate: form.governorate,
    items: items.map((item, index) => ({
      id: index + 1,
      product: item.product,
      quantity: item.quantity,
      total_price: (item.variant.retail_price || 0) * item.quantity,
      unit_price: item.variant.retail_price || 0,
      variant: item.variant,
      variant_label: item.variant.label,
    })),
    order_number: orderNumber,
    payment: {
      method: form.payment_method,
      provider: form.payment_method,
      reference: form.payment_method === 'cash_on_delivery' ? `COD-${orderNumber}` : form.payment_reference,
      status: form.payment_method === 'cash_on_delivery' ? 'pending' : 'pending_review',
    },
    status: 'pending',
    total,
  });
}

function formatCheckoutError(message: string, locale: 'ar' | 'en') {
  if (locale !== 'ar') {
    return message;
  }

  const couponErrors: Record<string, string> = {
    'Invalid coupon code': 'كود الخصم غير صحيح أو غير متاح.',
    'Coupon has expired': 'كود الخصم منتهي.',
    'Coupon usage limit reached': 'تم استخدام كود الخصم بالكامل.',
    'Coupon minimum not met': 'الطلب لا يحقق الحد الأدنى لهذا الكود.',
  };

  return couponErrors[message] || message;
}

export default function Checkout() {
  const { locale } = useLocale();
  const { clearCart, items, total } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const paymentProofInputRef = useRef<HTMLInputElement | null>(null);
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
    payment_method: 'cash_on_delivery',
    payment_reference: '',
    payment_payer_phone: '',
    coupon_code: '',
  });
  const paymentProofError = errors.payment_proof || '';

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
      case 'payment_reference':
        return form.payment_method === 'cash_on_delivery' || value.trim().length >= 3 ? '' : (locale === 'ar' ? 'اكتب رقم العملية أو المرجع بعد التحويل' : 'Enter the transfer reference after paying.');
      case 'payment_payer_phone':
        return !value.trim() || PHONE_REGEX.test(value.trim()) ? '' : (locale === 'ar' ? 'رقم الهاتف غير صحيح، مثال: 01012345678' : 'Invalid phone number. Example: 01012345678');
      default:
        return '';
    }
  };

  const validateAndStore = (name: string, value: string) => {
    const message = validateField(name, value);
    setErrors((current) => ({ ...current, [name]: message }));
    return message;
  };

  const setPaymentMethod = (paymentMethod: string) => {
    setForm((current) => ({ ...current, payment_method: paymentMethod }));

    if (paymentMethod === 'cash_on_delivery') {
      setPaymentProof(null);
      setErrors((current) => ({
        ...current,
        payment_reference: '',
        payment_payer_phone: '',
        payment_proof: '',
      }));
      setTouched((current) => ({
        ...current,
        payment_reference: false,
        payment_payer_phone: false,
        payment_proof: false,
      }));
    }
  };

  const clearPaymentProof = () => {
    setPaymentProof(null);
    setErrors((current) => ({ ...current, payment_proof: '' }));
    setTouched((current) => ({ ...current, payment_proof: false }));

    if (paymentProofInputRef.current) {
      paymentProofInputRef.current.value = '';
    }
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
          payment_reference: validateField('payment_reference', form.payment_reference),
          payment_payer_phone: validateField('payment_payer_phone', form.payment_payer_phone),
          payment_proof: form.payment_method === 'cash_on_delivery' ? '' : validatePaymentProof(paymentProof, locale),
        };
        setErrors(nextErrors);
        setTouched({
          customer_name: true,
          phone: true,
          email: true,
          governorate: true,
          city: true,
          address: true,
          payment_reference: true,
          payment_payer_phone: true,
          payment_proof: true,
        });
        if (Object.values(nextErrors).some(Boolean)) {
          return;
        }

        setSubmitting(true);
        setError('');
        try {
          if (!canUseLocalCheckoutFallback()) {
            await publicApi.validateCart(items.map((item) => ({ quantity: item.quantity, variant_id: item.variant.id })));
          }
          const payload = buildCheckoutPayload({ ...form, payment_proof: paymentProof }, items);
          let order;
          try {
            const response = await publicApi.checkout(payload);
            order = normalizeOrder(response.data.order);
          } catch (checkoutError) {
            if (!canUseLocalCheckoutFallback()) {
              throw checkoutError;
            }
            order = createLocalOrder(form, items, total);
          }
          sessionStorage.setItem(`order_${order.order_number}`, JSON.stringify(order));
          navigate(`/order-confirmation/${order.order_number}`);
          void clearCart().catch(() => {
            // The order is already created; confirmation must not be blocked by cart cleanup.
          });
        } catch (err: any) {
          const message = err.message || (locale === 'ar' ? 'تعذّر إتمام الطلب.' : 'Unable to place the order.');
          setError(formatCheckoutError(message, locale));
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
            {[
              {
                key: 'cash_on_delivery',
                title: locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on delivery',
                body: locale === 'ar' ? 'اختيار بسيط: ادفع نقدًا عند وصول الطلب، بدون رقم مرجع أو مراجعة تحويل.' : 'Simple option: pay in cash when your order arrives, with no transfer reference required.',
                destination: '',
              },
              {
                key: 'vodafone_cash',
                title: locale === 'ar' ? 'فودافون كاش' : 'Vodafone Cash',
                body: locale === 'ar' ? 'حوّل المبلغ على الرقم الموضح، ثم اكتب رقم العملية أو المرجع ليتم مراجعة الدفع يدويًا قبل تأكيد التجهيز.' : 'Transfer to the configured number, then enter the transaction reference so the team can manually review payment before preparation.',
                destination: VODAFONE_CASH_NUMBER,
              },
              {
                key: 'instapay',
                title: locale === 'ar' ? 'إنستاباي' : 'Instapay',
                body: locale === 'ar' ? 'حوّل المبلغ عبر حساب إنستاباي الموضح، ثم اكتب رقم العملية أو المرجع ليتم مراجعة الدفع يدويًا قبل تأكيد التجهيز.' : 'Pay through the configured Instapay account, then enter the transaction reference so the team can manually review payment before preparation.',
                destination: INSTAPAY_HANDLE,
              },
            ].map((method) => (
              <label key={method.key} className="radio-card">
                <input
                  type="radio"
                  name="payment_method"
                  value={method.key}
                  checked={form.payment_method === method.key}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <span>
                  <strong>{method.title}</strong>
                  <small>{method.body}</small>
                  {method.key === 'vodafone_cash' ? (
                    <small>
                      {locale === 'ar' ? 'حوّل المبلغ على: ' : 'Transfer to: '}
                      <b>{method.destination || (import.meta.env.DEV ? 'VITE_VODAFONE_CASH_NUMBER غير مضبوط' : '')}</b>
                    </small>
                  ) : null}
                  {method.key === 'instapay' ? (
                    <small>
                      {locale === 'ar' ? 'أو عبر Instapay: ' : 'Instapay: '}
                      <b>{method.destination || (import.meta.env.DEV ? 'VITE_INSTAPAY_HANDLE غير مضبوط' : '')}</b>
                    </small>
                  ) : null}
                </span>
              </label>
            ))}
            {form.payment_method !== 'cash_on_delivery' ? (
              <div className="form-grid" style={{ marginTop: '1rem' }}>
                <label className={errors.payment_reference && touched.payment_reference ? 'has-error' : ''}>
                  <span>{locale === 'ar' ? 'رقم العملية / المرجع' : 'Transaction reference'}</span>
                  <input
                    type="text"
                    value={form.payment_reference}
                    onBlur={(event) => {
                      setTouched((current) => ({ ...current, payment_reference: true }));
                      validateAndStore('payment_reference', event.target.value);
                    }}
                    onChange={(event) => {
                      setForm({ ...form, payment_reference: event.target.value });
                      if (touched.payment_reference) {
                        validateAndStore('payment_reference', event.target.value);
                      }
                    }}
                    required
                  />
                  {errors.payment_reference && touched.payment_reference ? <small className="field-error">{errors.payment_reference}</small> : null}
                </label>
                <label className={errors.payment_payer_phone && touched.payment_payer_phone ? 'has-error' : ''}>
                  <span>{locale === 'ar' ? 'هاتف المحوّل (اختياري)' : 'Payer phone (optional)'}</span>
                  <input
                    type="text"
                    value={form.payment_payer_phone}
                    onBlur={(event) => {
                      setTouched((current) => ({ ...current, payment_payer_phone: true }));
                      validateAndStore('payment_payer_phone', event.target.value);
                    }}
                    onChange={(event) => {
                      setForm({ ...form, payment_payer_phone: event.target.value });
                      if (touched.payment_payer_phone) {
                        validateAndStore('payment_payer_phone', event.target.value);
                      }
                    }}
                  />
                  {errors.payment_payer_phone && touched.payment_payer_phone ? <small className="field-error">{errors.payment_payer_phone}</small> : null}
                </label>
                <small className="field-hint is-wide">
                  {locale === 'ar'
                    ? 'بعد التحويل، اكتب رقم العملية أو المرجع. يمكنك رفع صورة إثبات الدفع اختياريًا لمساعدة الفريق في المراجعة اليدوية.'
                    : 'After transferring, enter the transaction reference. You can optionally upload a proof image to help the team review payment manually.'}
                </small>
                <label className={`is-wide ${paymentProofError && touched.payment_proof ? 'has-error' : ''}`}>
                  <span>{locale === 'ar' ? 'صورة إثبات الدفع (اختياري)' : 'Payment proof image (optional)'}</span>
                  <input
                    ref={paymentProofInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onBlur={() => setTouched((current) => ({ ...current, payment_proof: true }))}
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      const message = validatePaymentProof(file, locale);
                      setPaymentProof(message ? null : file);
                      setTouched((current) => ({ ...current, payment_proof: true }));
                      setErrors((current) => ({ ...current, payment_proof: message }));
                      if (message) {
                        event.target.value = '';
                      }
                    }}
                  />
                  {paymentProof ? (
                    <small className="field-hint">
                      {locale === 'ar' ? `تم اختيار: ${paymentProof.name}` : `Selected: ${paymentProof.name}`}
                    </small>
                  ) : null}
                  {paymentProofError && touched.payment_proof ? <small className="field-error">{paymentProofError}</small> : null}
                  {paymentProofError ? (
                    <button type="button" className="text-button" onClick={clearPaymentProof}>
                      {locale === 'ar' ? 'المتابعة بدون صورة إثبات' : 'Continue without proof image'}
                    </button>
                  ) : null}
                  <small className="field-hint">
                    {locale === 'ar'
                      ? 'الصيغ المقبولة: JPG أو PNG أو WEBP. الحد الأقصى 3MB.'
                      : 'Accepted formats: JPG, PNG, or WEBP. Maximum size 3MB.'}
                  </small>
                </label>
              </div>
            ) : null}
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
          <label className="coupon-field">
            <span>{locale === 'ar' ? 'عندك كود خصم؟' : 'Have a coupon code?'}</span>
            <input
              type="text"
              value={form.coupon_code}
              onChange={(event) => {
                setForm({ ...form, coupon_code: event.target.value });
                setError('');
              }}
              placeholder={locale === 'ar' ? 'اكتب الكود هنا' : 'Enter code'}
            />
            <small>{locale === 'ar' ? 'سيتم تطبيق الكود عند تأكيد الطلب' : 'The code will be applied when you confirm the order.'}</small>
          </label>
          <button type="submit" className="n-btn n-btn--primary" disabled={submitting || hasErrors || !isComplete}>
            {submitting ? (locale === 'ar' ? 'جارِ التأكيد...' : 'Confirming...') : (locale === 'ar' ? 'تأكيد الطلب' : 'Confirm order')}
          </button>
          {error ? <div className="error-banner">{error}</div> : null}
        </aside>
      </form>
    </div>
  );
}
