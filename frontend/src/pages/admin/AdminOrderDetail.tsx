import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, ErrorState, LoadingState, Textarea } from '../../components/ui';
import { formatCurrency, formatStatus } from '../../utils/format';

const AdminOrderDetail: React.FC = () => {
  const { id = '' } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.orders.get(id).then((res) => {
      setOrder(res.data);
      setNotes(res.data.admin_notes || '');
      setPaymentNote(res.data.payment?.admin_note || '');
    }).catch((err) => setError(err.message || 'تعذّر تحميل تفاصيل الطلب'));
  }, [id]);

  if (error) return <AdminPageShell eyebrow="Orders" title="تفاصيل الطلب" description=""><ErrorState message={error} /></AdminPageShell>;
  if (!order) return <AdminPageShell eyebrow="Orders" title="تفاصيل الطلب" description=""><LoadingState label="جاري تحميل الطلب..." /></AdminPageShell>;

  const payment = order.payment || null;
  const paymentMethodLabel: Record<string, string> = {
    cash_on_delivery: 'الدفع عند الاستلام',
    vodafone_cash: 'فودافون كاش',
    instapay: 'إنستاباي',
  };
  const canReviewPayment = ['vodafone_cash', 'instapay'].includes(payment?.method || payment?.provider);

  const downloadPaymentProof = async () => {
    const res = await adminApi.orders.downloadPaymentProof(id);
    const url = window.URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-proof-${order.order_number}`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const reviewPayment = async (reviewStatus: 'approved' | 'rejected') => {
    const res = await adminApi.orders.reviewPayment(id, {
      review_status: reviewStatus,
      admin_note: paymentNote,
    });
    setOrder(res.data.order);
  };

  return (
    <AdminPageShell eyebrow={order.order_number} title="تفاصيل الطلب" description="مراجعة العميل والعناصر والملاحظات الداخلية داخل بطاقة واحدة مرتبة.">
      <div className="detail-layout" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 0.8fr)' }}>
        <Card tone="strong" className="stack">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <strong>{order.customer_name || 'Guest'}</strong>
            <Badge tone={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'gold'}>{formatStatus(order.status)}</Badge>
          </div>
          {(order.items || []).map((item: any) => (
            <div key={item.id} className="data-card__row" style={{ paddingBlock: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <strong>{item.variant?.product?.name_ar || item.variant?.product?.name_en}</strong>
                <div className="copy-muted">{item.variant?.label || `${item.variant?.size_ml} مل`}</div>
              </div>
              <strong>{item.quantity} × {formatCurrency(item.unit_price)}</strong>
            </div>
          ))}
        </Card>
        <Card tone="strong" className="stack">
          <div className="data-card__row"><span className="data-card__label">الإجمالي</span><strong>{formatCurrency(order.total_amount)}</strong></div>
          <div className="data-card__row"><span className="data-card__label">الهاتف</span><span>{order.customer_phone}</span></div>
          <div className="data-card__row"><span className="data-card__label">العنوان</span><span>{order.address}</span></div>
          {payment ? (
            <div className="stack">
              <strong>مراجعة الدفع</strong>
              <div className="data-card__row">
                <span className="data-card__label">الطريقة</span>
                <span>{paymentMethodLabel[payment.method || payment.provider] || payment.method || payment.provider}</span>
              </div>
              <div className="data-card__row"><span className="data-card__label">الحالة</span><Badge tone={payment.status === 'approved' ? 'success' : payment.status === 'rejected' ? 'danger' : 'gold'}>{formatStatus(payment.status)}</Badge></div>
              {payment.reference ? <div className="data-card__row"><span className="data-card__label">رقم العملية</span><span>{payment.reference}</span></div> : null}
              {payment.payer_phone ? <div className="data-card__row"><span className="data-card__label">هاتف المحوّل</span><span>{payment.payer_phone}</span></div> : null}
              {payment.proof_image_path ? (
                <div className="stack">
                  <strong>إثبات الدفع</strong>
                  <div className="data-card__row">
                    <span className="data-card__label">المسار المخزن</span>
                    <span style={{ overflowWrap: 'anywhere', textAlign: 'end' }}>{payment.proof_image_path}</span>
                  </div>
                  <Button variant="ghost" onClick={downloadPaymentProof}>تحميل إثبات الدفع</Button>
                  <small className="copy-muted">رابط الإثبات محمي للأدمن فقط، ولا يتم عرضه كرابط عام للعملاء.</small>
                </div>
              ) : (
                canReviewPayment ? <small className="copy-muted">لا توجد صورة إثبات مرفوعة. راجع رقم العملية مع بيانات التحويل يدويًا.</small> : null
              )}
              {canReviewPayment ? (
                <>
                  <Textarea value={paymentNote} onChange={(event) => setPaymentNote(event.target.value)} placeholder="ملاحظة مراجعة الدفع" />
                  <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                    <Button onClick={() => reviewPayment('approved')}>اعتماد الدفع</Button>
                    <Button variant="ghost" onClick={() => reviewPayment('rejected')}>رفض الدفع</Button>
                  </div>
                  <small className="copy-muted">بعد اعتماد الدفع، غيّر حالة الطلب إلى Confirmed لبدء التجهيز.</small>
                </>
              ) : null}
            </div>
          ) : null}
          <div className="stack">
            <strong>ملاحظات داخلية</strong>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
            <Button onClick={() => adminApi.orders.update(id, { admin_notes: notes })}>حفظ الملاحظات</Button>
          </div>
        </Card>
      </div>
    </AdminPageShell>
  );
};

export default AdminOrderDetail;
