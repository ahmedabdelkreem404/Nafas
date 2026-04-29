import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, Field, Input, LoadingState, Select } from '../../components/ui';

const AdminInventory: React.FC = () => {
  const [movements, setMovements] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ product_variant_id: '', quantity_change: 1, reason: 'استلام شحنة' });
  const [loading, setLoading] = useState(true);

  const variants = useMemo(() => (
    (products || []).flatMap((product: any) => (product.variants || []).map((variant: any) => ({
      id: variant.id,
      label: `${product.name_ar || product.name_en} · ${variant.label || variant.sku}`,
    })))
  ), [products]);

  const load = () => Promise.all([adminApi.inventory.movements(), adminApi.inventory.lowStock(), adminApi.products.list()]).then(([movementsRes, lowStockRes, productsRes]) => {
    setMovements(movementsRes.data || []);
    setLowStock(lowStockRes.data || []);
    setProducts(productsRes.data || []);
    setLoading(false);
  });

  useEffect(() => { load(); }, []);

  const columns = useMemo(() => [
    { key: 'variant', header: 'المتغير', cell: (movement: any) => movement.variant?.sku || '—' },
    { key: 'type', header: 'النوع', cell: (movement: any) => movement.type },
    { key: 'qty', header: 'الكمية', cell: (movement: any) => movement.quantity },
    { key: 'reason', header: 'السبب', cell: (movement: any) => movement.reason },
  ], []);

  return (
    <AdminPageShell eyebrow="Inventory" title="المخزون والحركات" description="تنبيهات مخزون منخفض، وتعديل سريع مباشر، وسجل حركات واضح وقابل للمراجعة.">
      <div className="grid-auto">
        {(lowStock || []).map((variant) => (
          <Card key={variant.id} tone="strong" className="stack">
            <Badge tone={variant.stock_quantity <= 3 ? 'danger' : 'gold'}>{variant.stock_quantity <= 3 ? 'Critical' : 'Low stock'}</Badge>
            <strong>{variant.product?.name_ar || variant.product?.name_en}</strong>
            <div className="copy-muted">{variant.sku}</div>
            <div className="display text-gradient" style={{ fontSize: '1.8rem' }}>{variant.stock_quantity}</div>
            <Button variant="secondary" onClick={() => setForm({ ...form, product_variant_id: String(variant.id) })}>تجهيز تعديل</Button>
          </Card>
        ))}
      </div>

      <Card tone="strong">
        <form className="stack" onSubmit={(event) => {
          event.preventDefault();
          const quantity = Number(form.quantity_change || 0);
          const type = quantity >= 0 ? 'addition' : 'deduction';
          adminApi.inventory.adjust({
            product_variant_id: Number(form.product_variant_id),
            quantity: Math.abs(quantity),
            reason: form.reason,
            type,
          }).then(() => {
            setLoading(true);
            load();
          });
        }}>
          <div className="grid-auto">
            <Field label="المتغير">
              <Select value={form.product_variant_id} onChange={(event) => setForm({ ...form, product_variant_id: event.target.value })}>
                <option value="">اختر المتغير</option>
                {variants.map((variant: any) => <option key={variant.id} value={variant.id}>{variant.label}</option>)}
              </Select>
            </Field>
            <Field label="التغيير في الكمية">
              <Input type="number" value={form.quantity_change} onChange={(event) => setForm({ ...form, quantity_change: Number(event.target.value) })} />
            </Field>
            <Field label="السبب">
              <Input value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} placeholder="استلام شحنة / تلف / تعديل يدوي" />
            </Field>
          </div>
          <Button type="submit">حفظ التعديل</Button>
        </form>
      </Card>

      {loading ? <LoadingState label="جاري تحميل بيانات المخزون..." /> : !movements.length ? <EmptyState title="لا توجد حركات مخزون" description="ستظهر تعديلات المخزون هنا بمجرد تنفيذها." /> : <Card tone="strong"><DataTable rows={movements} columns={columns} cardTitle={(movement) => movement.variant?.sku || 'movement'} /></Card>}
    </AdminPageShell>
  );
};

export default AdminInventory;
