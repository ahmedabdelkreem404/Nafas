import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, Field, Input, LoadingState, Select } from '../../components/ui';

const movementTypeLabels: Record<string, string> = {
  addition: 'إضافة',
  deduction: 'خصم',
  adjustment: 'تسوية',
};

const AdminInventory: React.FC = () => {
  const [movements, setMovements] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ product_variant_id: '', quantity_change: 1, reason: 'استلام شحنة' });
  const [loading, setLoading] = useState(true);

  const variants = useMemo(() => (
    (products || []).flatMap((product: any) => (product.variants || []).map((variant: any) => ({
      id: variant.id,
      label: `${product.name_ar || product.name_en || 'منتج'} - ${variant.label || variant.sku || 'حجم'}`,
    })))
  ), [products]);

  const load = () => {
    setLoading(true);

    return Promise.all([adminApi.inventory.movements(), adminApi.inventory.lowStock(), adminApi.products.list()])
      .then(([movementsRes, lowStockRes, productsRes]) => {
        setMovements(movementsRes.data || []);
        setLowStock(lowStockRes.data || []);
        setProducts(productsRes.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const columns = useMemo(() => [
    { key: 'variant', header: 'الحجم', cell: (movement: any) => movement.variant?.sku || 'غير محدد' },
    { key: 'type', header: 'نوع الحركة', cell: (movement: any) => movementTypeLabels[movement.type] || movement.type || 'غير محدد' },
    { key: 'qty', header: 'الكمية', cell: (movement: any) => movement.quantity },
    { key: 'reason', header: 'السبب', cell: (movement: any) => movement.reason || 'بدون سبب' },
  ], []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const quantity = Number(form.quantity_change || 0);
    const type = quantity >= 0 ? 'addition' : 'deduction';

    adminApi.inventory.adjust({
      product_variant_id: Number(form.product_variant_id),
      quantity: Math.abs(quantity),
      reason: form.reason,
      type,
    }).then(load);
  };

  return (
    <AdminPageShell
      eyebrow="المخزون"
      title="المخزون وحركاته"
      description="تابع الكميات، استقبل دفعات جديدة، وسجّل أي خصم أو تسوية من واجهة واحدة واضحة."
    >
      <div className="admin-section-title">
        <div>
          <strong>تنبيهات المخزون</strong>
          <span>الأحجام التي تحتاج متابعة قبل نفادها.</span>
        </div>
      </div>

      {!lowStock.length ? (
        <Card tone="soft" className="admin-soft-note">
          لا توجد تنبيهات مخزون منخفض حاليًا.
        </Card>
      ) : (
        <div className="grid-auto">
          {(lowStock || []).map((variant) => (
            <Card key={variant.id} tone="strong" className="stack admin-stock-card">
              <Badge tone={variant.stock_quantity <= 3 ? 'danger' : 'gold'}>
                {variant.stock_quantity <= 3 ? 'مستوى حرج' : 'مخزون منخفض'}
              </Badge>
              <strong>{variant.product?.name_ar || variant.product?.name_en || 'منتج'}</strong>
              <div className="copy-muted">{variant.sku}</div>
              <div className="admin-stock-card__qty">{variant.stock_quantity}</div>
              <Button variant="secondary" onClick={() => setForm({ ...form, product_variant_id: String(variant.id) })}>
                تجهيز تعديل
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Card tone="strong" className="admin-form-card">
        <div className="admin-section-title">
          <div>
            <strong>تعديل المخزون</strong>
            <span>اكتب رقم موجب للإضافة أو رقم سالب للخصم.</span>
          </div>
        </div>

        <form className="stack" onSubmit={submit}>
          <div className="admin-form-grid">
            <Field label="الحجم">
              <Select value={form.product_variant_id} onChange={(event) => setForm({ ...form, product_variant_id: event.target.value })}>
                <option value="">اختر الحجم</option>
                {variants.map((variant: any) => <option key={variant.id} value={variant.id}>{variant.label}</option>)}
              </Select>
            </Field>
            <Field label="التغيير في الكمية" hint="مثال: 10 للإضافة، أو -2 للخصم">
              <Input type="number" value={form.quantity_change} onChange={(event) => setForm({ ...form, quantity_change: Number(event.target.value) })} />
            </Field>
            <Field label="السبب">
              <Input value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} placeholder="استلام شحنة / تلف / تسوية يدوية" />
            </Field>
          </div>
          <div className="admin-form-actions">
            <Button type="submit">حفظ التعديل</Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <LoadingState label="جاري تحميل بيانات المخزون..." />
      ) : !movements.length ? (
        <EmptyState title="لا توجد حركات مخزون" description="ستظهر تعديلات المخزون هنا بمجرد تنفيذها." />
      ) : (
        <Card tone="strong">
          <DataTable rows={movements} columns={columns} cardTitle={(movement) => movement.variant?.sku || 'حركة مخزون'} />
        </Card>
      )}
    </AdminPageShell>
  );
};

export default AdminInventory;
