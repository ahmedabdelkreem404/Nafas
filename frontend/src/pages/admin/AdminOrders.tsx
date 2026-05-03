import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, ErrorState, LoadingState, Select } from '../../components/ui';
import { adminStatusLabel } from '../../utils/adminLabels';
import { formatCurrency } from '../../utils/format';

const statusTone = (status: string) => status === 'delivered' ? 'success' : ['cancelled', 'refunded'].includes(status) ? 'danger' : 'gold';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.orders.list();
      setOrders(res.data || []);
    } catch (err: any) {
      setError(err.message || 'تعذّر تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = useCallback(async (id: number, status: string) => {
    try {
      await adminApi.orders.updateStatus(id, status);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'تعذّر تحديث الحالة');
    }
  }, [fetchOrders]);

  const columns = useMemo(() => [
    { key: 'number', header: 'الطلب', cell: (order: any) => <div className="stack" style={{ gap: '0.2rem' }}><strong>{order.order_number}</strong><span className="copy-muted">{new Date(order.created_at).toLocaleDateString('ar-EG')}</span></div> },
    { key: 'customer', header: 'العميل', cell: (order: any) => order.customer_name || order.customer_email || 'زائر' },
    { key: 'total', header: 'الإجمالي', cell: (order: any) => formatCurrency(order.total_amount) },
    { key: 'status', header: 'الحالة', cell: (order: any) => <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}><Badge tone={statusTone(order.status) as any}>{adminStatusLabel(order.status)}</Badge><Select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)} style={{ minWidth: 150 }}><option value="pending">قيد المراجعة</option><option value="confirmed">مؤكد</option><option value="preparing">جاري التحضير</option><option value="shipped">تم الشحن</option><option value="delivered">تم التسليم</option><option value="cancelled">ملغي</option><option value="refunded">مسترد</option></Select></div> },
    { key: 'actions', header: 'إجراءات', cell: (order: any) => <Link to={`/admin/orders/${order.id}`}><Button size="sm" variant="secondary">التفاصيل</Button></Link> },
  ], [updateStatus]);

  return (
    <AdminPageShell eyebrow="الطلبات والعملاء" title="إدارة الطلبات" description="عرض متماسك للحالات والتفاصيل مع تحديث سريع وآمن داخل نفس الصفحة.">
      {loading ? <LoadingState label="جاري تحميل الطلبات..." /> : error ? <ErrorState message={error} /> : !orders.length ? <EmptyState title="لا توجد طلبات" description="ستظهر الطلبات الجديدة هنا فور إنشائها." /> : <Card tone="strong"><DataTable rows={orders} columns={columns} cardTitle={(order) => order.order_number} /></Card>}
    </AdminPageShell>
  );
};

export default AdminOrders;
