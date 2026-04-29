import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, Field, Input, LoadingState, Select } from '../../components/ui';

const AdminBatches: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ product_id: '', product_variant_id: '', quantity_produced: '', mix_date: '', maturation_start_date: '', allowed_sale_date: '', notes: '' });

  const fetchData = async () => {
    setLoading(true);
    const [batchesRes, productsRes] = await Promise.all([adminApi.batches.list(), adminApi.products.list()]);
    setBatches(batchesRes.data || []);
    setProducts(productsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const columns = useMemo(() => [
    { key: 'code', header: 'الكود', cell: (batch: any) => batch.batch_code },
    { key: 'status', header: 'الحالة', cell: (batch: any) => <Badge tone={batch.qc_status === 'approved' ? 'success' : 'gold'}>{batch.qc_status}</Badge> },
    { key: 'qty', header: 'الكمية', cell: (batch: any) => batch.quantity_produced },
    { key: 'actions', header: 'إجراءات', cell: (batch: any) => <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><Button size="sm" variant="secondary" onClick={() => adminApi.batches.update(batch.id, { qc_status: 'approved' }).then(fetchData)}>اعتماد</Button><Button size="sm" variant="danger" onClick={() => adminApi.batches.delete(batch.id).then(fetchData)}>حذف</Button></div> },
  ], []);

  return (
    <AdminPageShell eyebrow="Batches" title="دفعات الإنتاج" description="لوحة عملية لدفعات الخلط والمراجعة والموافقة دون ازدحام جداول قاسٍ على الشاشات الصغيرة.">
      <Card tone="strong">
        <form className="stack" onSubmit={(event) => { event.preventDefault(); adminApi.batches.create(form).then(fetchData); }}>
          <div className="grid-auto">
            <Field label="المنتج"><Select value={form.product_id} onChange={(event) => setForm({ ...form, product_id: event.target.value })}><option value="">اختر المنتج</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name_en}</option>)}</Select></Field>
            <Field label="variant id"><Input value={form.product_variant_id} onChange={(event) => setForm({ ...form, product_variant_id: event.target.value })} /></Field>
            <Field label="الكمية"><Input value={form.quantity_produced} onChange={(event) => setForm({ ...form, quantity_produced: event.target.value })} /></Field>
            <Field label="تاريخ الخلط"><Input type="date" value={form.mix_date} onChange={(event) => setForm({ ...form, mix_date: event.target.value })} /></Field>
            <Field label="بداية الماتوريشن"><Input type="date" value={form.maturation_start_date} onChange={(event) => setForm({ ...form, maturation_start_date: event.target.value })} /></Field>
            <Field label="مسموح للبيع"><Input type="date" value={form.allowed_sale_date} onChange={(event) => setForm({ ...form, allowed_sale_date: event.target.value })} /></Field>
          </div>
          <Field label="ملاحظات"><Input value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></Field>
          <Button type="submit">إضافة دفعة</Button>
        </form>
      </Card>
      {loading ? <LoadingState label="جاري تحميل الدفعات..." /> : !batches.length ? <EmptyState title="لا توجد دفعات" description="أضف أول دفعة إنتاج من هنا." /> : <Card tone="strong"><DataTable rows={batches} columns={columns} cardTitle={(batch) => batch.batch_code} /></Card>}
    </AdminPageShell>
  );
};

export default AdminBatches;
