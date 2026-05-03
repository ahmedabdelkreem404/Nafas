import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, Field, Input, LoadingState } from '../../components/ui';
import { formatCurrency, formatDate, formatNumber } from '../../utils/format';

const blankCustomer = { name: '', email: '', password: '' };

function getCustomerTag(totalOrders: number) {
  if (totalOrders >= 5) return { label: 'عميل مخلص', tone: 'success' as const };
  if (totalOrders >= 2) return { label: 'عميل متكرر', tone: 'gold' as const };
  return { label: 'عميل جديد', tone: 'muted' as const };
}

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [form, setForm] = useState<any>(blankCustomer);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.customers.list().then((res) => setCustomers(res.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const columns = useMemo(() => [
    { key: 'name', header: 'العميل', cell: (customer: any) => customer.name },
    { key: 'email', header: 'البريد', cell: (customer: any) => customer.email },
    { key: 'orders', header: 'الطلبات', cell: (customer: any) => customer.orders_count || 0 },
    { key: 'segment', header: 'التصنيف', cell: (customer: any) => <Badge tone={getCustomerTag(customer.orders_count || 0).tone}>{getCustomerTag(customer.orders_count || 0).label}</Badge> },
    { key: 'actions', header: 'إجراءات', cell: (customer: any) => <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><Button size="sm" variant="secondary" onClick={() => adminApi.customers.get(customer.id).then((res) => setSelectedCustomer(res.data))}>عرض</Button><Button size="sm" variant="danger" onClick={() => adminApi.customers.delete(customer.id).then(load)}>حذف</Button></div> },
  ], []);

  return (
    <AdminPageShell eyebrow="العملاء" title="العملاء" description="سجل أوضح للعملاء مع تفاصيل تاريخ الطلبات وتجزئة مبدئية قابلة للاستخدام لاحقًا في التسويق.">
      <Card tone="strong">
        <form className="stack" onSubmit={(event) => {
          event.preventDefault();
          adminApi.customers.create(form).then(() => { setForm(blankCustomer); load(); });
        }}>
          <div className="grid-auto">
            <Field label="الاسم"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="البريد"><Input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
            <Field label="كلمة المرور"><Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></Field>
          </div>
          <Button type="submit">إضافة عميل</Button>
        </form>
      </Card>

      {selectedCustomer ? (
        <Card tone="strong" className="stack">
          <div className="data-card__row">
            <div>
              <strong>{selectedCustomer.name}</strong>
              <div className="copy-muted">{selectedCustomer.email}</div>
            </div>
            <Badge tone={getCustomerTag(selectedCustomer.total_orders || 0).tone}>{getCustomerTag(selectedCustomer.total_orders || 0).label}</Badge>
          </div>
          <div className="grid-auto">
            <div className="data-card"><div className="data-card__label">إجمالي الطلبات</div><strong>{formatNumber(selectedCustomer.total_orders || 0)}</strong></div>
            <div className="data-card"><div className="data-card__label">إجمالي الإنفاق</div><strong>{formatCurrency(selectedCustomer.total_spent || 0)}</strong></div>
            <div className="data-card"><div className="data-card__label">أول طلب</div><strong>{selectedCustomer.first_order_at ? formatDate(selectedCustomer.first_order_at) : '—'}</strong></div>
            <div className="data-card"><div className="data-card__label">آخر طلب</div><strong>{selectedCustomer.last_order_at ? formatDate(selectedCustomer.last_order_at) : '—'}</strong></div>
          </div>
          <strong>تاريخ الطلبات</strong>
          {(selectedCustomer.orders || []).length ? (
            <div className="stack">
              {selectedCustomer.orders.map((order: any) => (
                <div key={order.id} className="data-card__row">
                  <div>
                    <strong>{order.order_number}</strong>
                    <div className="copy-muted">{formatDate(order.created_at)}</div>
                  </div>
                  <div style={{ textAlign: 'end' }}>
                    <Badge tone={order.status === 'delivered' ? 'success' : 'gold'}>{order.status}</Badge>
                    <div className="copy-muted">{formatCurrency(order.total_amount || 0)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="لا توجد طلبات" description="هذا العميل لم يُكمل طلبًا بعد." />
          )}
        </Card>
      ) : null}

      {loading ? <LoadingState label="جاري تحميل العملاء..." /> : !customers.length ? <EmptyState title="لا يوجد عملاء" description="ستظهر حسابات العملاء هنا بعد التسجيل أو الإضافة." /> : <Card tone="strong"><DataTable rows={customers} columns={columns} cardTitle={(customer) => customer.name} /></Card>}
    </AdminPageShell>
  );
};

export default AdminCustomers;
