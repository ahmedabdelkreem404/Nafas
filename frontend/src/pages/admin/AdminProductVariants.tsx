import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, ErrorState, Field, Input, LoadingState, Select } from '../../components/ui';
import { formatCurrency } from '../../utils/format';

const blankVariant = { sku: '', size_ml: 50, label: '', retail_price: 0, wholesale_price: 0, cost_price: 0, stock_quantity: 0, low_stock_threshold: 5, is_active: true };

const AdminProductVariants: React.FC = () => {
  const { id = '' } = useParams();
  const [variants, setVariants] = useState<any[]>([]);
  const [form, setForm] = useState<any>(blankVariant);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi.products.variants(id).then((res) => setVariants(res.data || [])).catch((err) => setError(err.message || 'تعذّر تحميل الأحجام')).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingId) {
        await adminApi.products.updateVariant(editingId, form);
      } else {
        await adminApi.products.createVariant(id, form);
      }
      setEditingId(null);
      setForm(blankVariant);
      load();
    } catch (err: any) {
      setError(err.message || 'تعذّر حفظ الحجم');
    }
  };

  const columns = useMemo(() => [
    { key: 'sku', header: 'SKU', cell: (variant: any) => variant.sku },
    { key: 'label', header: 'الحجم', cell: (variant: any) => variant.label || `${variant.size_ml} مل` },
    { key: 'price', header: 'السعر', cell: (variant: any) => formatCurrency(variant.retail_price) },
    { key: 'stock', header: 'المخزون', cell: (variant: any) => <Badge tone={variant.stock_quantity > (variant.low_stock_threshold || 0) ? 'success' : 'danger'}>{variant.stock_quantity}</Badge> },
    { key: 'actions', header: 'إجراءات', cell: (variant: any) => <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><Button size="sm" variant="secondary" onClick={() => { setEditingId(variant.id); setForm({ ...variant }); }}>تعديل</Button><Button size="sm" variant="danger" onClick={() => adminApi.products.deleteVariant(variant.id).then(load)}>حذف</Button></div> },
  ], [load]);

  return (
    <AdminPageShell eyebrow="Catalog" title="أحجام ومتغيرات المنتج" description="تحكم واضح في المقاسات والأسعار والمخزون مع تجربة مريحة حتى على الهاتف.">
      {error ? <ErrorState message={error} /> : null}
      <Card tone="strong">
        <form className="stack" onSubmit={save}>
          <div className="grid-auto">
            <Field label="SKU"><Input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} /></Field>
            <Field label="الحجم بالمل"><Input type="number" value={form.size_ml} onChange={(event) => setForm({ ...form, size_ml: Number(event.target.value) })} /></Field>
            <Field label="الاسم"><Input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} /></Field>
            <Field label="سعر البيع"><Input type="number" value={form.retail_price} onChange={(event) => setForm({ ...form, retail_price: Number(event.target.value) })} /></Field>
            <Field label="سعر الجملة"><Input type="number" value={form.wholesale_price} onChange={(event) => setForm({ ...form, wholesale_price: Number(event.target.value) })} /></Field>
            <Field label="التكلفة"><Input type="number" value={form.cost_price} onChange={(event) => setForm({ ...form, cost_price: Number(event.target.value) })} /></Field>
            <Field label="المخزون"><Input type="number" value={form.stock_quantity} onChange={(event) => setForm({ ...form, stock_quantity: Number(event.target.value) })} /></Field>
            <Field label="حد التنبيه"><Input type="number" value={form.low_stock_threshold} onChange={(event) => setForm({ ...form, low_stock_threshold: Number(event.target.value) })} /></Field>
            <Field label="الحالة"><Select value={String(form.is_active)} onChange={(event) => setForm({ ...form, is_active: event.target.value === 'true' })}><option value="true">نشط</option><option value="false">غير نشط</option></Select></Field>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button type="submit">{editingId ? 'حفظ التعديل' : 'إضافة حجم'}</Button>
            {editingId ? <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(blankVariant); }}>إلغاء</Button> : null}
          </div>
        </form>
      </Card>

      {loading ? <LoadingState label="جاري تحميل الأحجام..." /> : !variants.length ? <EmptyState title="لا توجد متغيرات بعد" description="أضف أول حجم لهذا المنتج." /> : <Card tone="strong"><DataTable rows={variants} columns={columns} cardTitle={(variant) => variant.label || `${variant.size_ml} مل`} /></Card>}
    </AdminPageShell>
  );
};

export default AdminProductVariants;
