import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, Field, Input, Select } from '../../components/ui';

const blank = { code: '', discount_type: 'fixed', discount_value: 0, min_cart_total: 0, usage_limit: 1, is_active: true };

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [form, setForm] = useState<any>(blank);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => adminApi.coupons.list().then((res) => setCoupons(res.data || []));
  useEffect(() => { load(); }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) await adminApi.coupons.update(editingId, form);
    else await adminApi.coupons.create(form);
    setEditingId(null);
    setForm(blank);
    load();
  };

  const columns = useMemo(() => [
    { key: 'code', header: 'الكود', cell: (coupon: any) => coupon.code },
    { key: 'type', header: 'النوع', cell: (coupon: any) => coupon.discount_type },
    { key: 'value', header: 'القيمة', cell: (coupon: any) => coupon.discount_value },
    { key: 'status', header: 'الحالة', cell: (coupon: any) => <Badge tone={coupon.is_active ? 'success' : 'muted'}>{coupon.is_active ? 'نشط' : 'متوقف'}</Badge> },
    { key: 'actions', header: 'إجراءات', cell: (coupon: any) => <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><Button size="sm" variant="secondary" onClick={() => { setEditingId(coupon.id); setForm({ ...coupon }); }}>تعديل</Button><Button size="sm" variant="danger" onClick={() => adminApi.coupons.delete(coupon.id).then(load)}>حذف</Button></div> },
  ], []);

  return (
    <AdminPageShell eyebrow="Coupons" title="إدارة الكوبونات" description="واجهة أبسط وأوضح لإنشاء الأكواد وتفعيلها أو تعطيلها بسرعة.">
      <Card tone="strong">
        <form onSubmit={submit} className="stack">
          <div className="grid-auto">
            <Field label="الكود"><Input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} /></Field>
            <Field label="نوع الخصم"><Select value={form.discount_type} onChange={(event) => setForm({ ...form, discount_type: event.target.value })}><option value="fixed">fixed</option><option value="percentage">percentage</option></Select></Field>
            <Field label="قيمة الخصم"><Input type="number" value={form.discount_value} onChange={(event) => setForm({ ...form, discount_value: Number(event.target.value) })} /></Field>
            <Field label="الحد الأدنى"><Input type="number" value={form.min_cart_total} onChange={(event) => setForm({ ...form, min_cart_total: Number(event.target.value) })} /></Field>
            <Field label="حد الاستخدام"><Input type="number" value={form.usage_limit} onChange={(event) => setForm({ ...form, usage_limit: Number(event.target.value) })} /></Field>
            <Field label="الحالة"><Select value={String(form.is_active)} onChange={(event) => setForm({ ...form, is_active: event.target.value === 'true' })}><option value="true">نشط</option><option value="false">غير نشط</option></Select></Field>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button type="submit">{editingId ? 'حفظ الكوبون' : 'إنشاء كوبون'}</Button>
            {editingId ? <Button variant="ghost" type="button" onClick={() => { setEditingId(null); setForm(blank); }}>إلغاء</Button> : null}
          </div>
        </form>
      </Card>
      {!coupons.length ? <EmptyState title="لا توجد كوبونات" description="أضف أول كود خصم من هنا." /> : <Card tone="strong"><DataTable rows={coupons} columns={columns} cardTitle={(coupon) => coupon.code} /></Card>}
    </AdminPageShell>
  );
};

export default AdminCoupons;
