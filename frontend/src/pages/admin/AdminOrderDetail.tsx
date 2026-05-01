import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, ErrorState, LoadingState, Textarea } from '../../components/ui';
import { formatCurrency, formatStatus } from '../../utils/format';

const paymentLabel = (method?: string) => ({
  cash_on_delivery: 'دفع عند الاستلام',
  vodafone_cash: 'Vodafone Cash',
  instapay: 'Instapay',
  online_card: 'بطاقة أونلاين',
  bank_transfer: 'تحويل بنكي',
}[method || ''] || method || 'غير محدد');

const AdminOrderDetail: React.FC = () => {
  const { id = '' } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.orders.get(id).then((res) => {
      setOrder(res.data);
      setNotes(res.data.admin_notes || '');
    }).catch((err) => setError(err.message || 'تعذّر تحميل تفاصيل الطلب'));
  }, [id]);

  if (error) return <AdminPageShell eyebrow="Orders" title="تفاصيل الطلب" description=""><ErrorState message={error} /></AdminPageShell>;
  if (!order) return <AdminPageShell eyebrow="Orders" title="تفاصيل الطلب" description=""><LoadingState label="جاري تحميل الطلب..." /></AdminPageShell>;

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
          <div className="data-card__row"><span className="data-card__label">طريقة الدفع</span><strong>{paymentLabel(order.payment_method)}</strong></div>
          <div className="data-card__row"><span className="data-card__label">مرجع الدفع</span><span>{order.payment?.reference || 'لا يوجد'}</span></div>
          <div className="data-card__row"><span className="data-card__label">حالة الدفع</span><Badge tone={order.payment?.status === 'paid' ? 'success' : 'gold'}>{order.payment?.status || 'pending'}</Badge></div>
          <div className="data-card__row"><span className="data-card__label">الهاتف</span><span>{order.customer_phone}</span></div>
          <div className="data-card__row"><span className="data-card__label">العنوان</span><span>{order.address}</span></div>
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
