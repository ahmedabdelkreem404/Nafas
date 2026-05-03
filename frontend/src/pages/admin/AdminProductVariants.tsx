import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, ErrorState, Field, Input, LoadingState, Select } from '../../components/ui';
import { useNotifications } from '../../hooks/useNotifications';
import { formatCurrency } from '../../utils/format';

const blankVariant = { sku: '', size_ml: 50, label: '', retail_price: 0, wholesale_price: 0, cost_price: 0, stock_quantity: 0, low_stock_threshold: 5, is_active: true };

const AdminProductVariants: React.FC = () => {
  const { id = '' } = useParams();
  const { notifyError, notifySuccess } = useNotifications();
  const [variants, setVariants] = useState<any[]>([]);
  const [form, setForm] = useState<any>(blankVariant);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    adminApi.products.variants(id).then((res) => setVariants(res.data || [])).catch((err) => {
      setError(err.message || '????? ????? ???????');
      notifyError('???? ????? ???????', '???? ????? ???? ?????? ?? ???? ??? ????.');
    }).finally(() => setLoading(false));
  }, [id, notifyError]);

  useEffect(() => { load(); }, [load]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingId) {
        await adminApi.products.updateVariant(editingId, form);
      } else {
        await adminApi.products.createVariant(id, form);
      }
      notifySuccess(editingId ? '?? ??? ?????' : '??? ????? ?????', '?? ????? ????? ?????? ???????.');
      setEditingId(null);
      setForm(blankVariant);
      load();
    } catch (err: any) {
      setError(err.message || '????? ??? ?????');
      notifyError('???? ??? ?????', '???? ???????? ???????? ??? SKU ?????? ????????.');
    }
  };

  const columns = useMemo(() => [
    { key: 'sku', header: 'SKU', cell: (variant: any) => variant.sku },
    { key: 'label', header: '?????', cell: (variant: any) => variant.label || `${variant.size_ml} ??` },
    { key: 'price', header: '?????', cell: (variant: any) => formatCurrency(variant.retail_price) },
    { key: 'stock', header: '???????', cell: (variant: any) => <Badge tone={variant.stock_quantity > (variant.low_stock_threshold || 0) ? 'success' : 'danger'}>{variant.stock_quantity}</Badge> },
    { key: 'actions', header: '???????', cell: (variant: any) => <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><Button size="sm" variant="secondary" onClick={() => { setEditingId(variant.id); setForm({ ...variant }); }}>?????</Button><Button size="sm" variant="danger" onClick={() => {
      if (!window.confirm('?? ???? ??? ??? ??????')) return;
      adminApi.products.deleteVariant(variant.id).then(() => {
        notifySuccess('?? ??? ?????', '?? ????? ???? ???????.');
        load();
      }).catch(() => notifyError('???? ??? ?????', '?? ???? ??????? ?????? ??? ?? ?????.'));
    }}>???</Button></div> },
  ], [load, notifyError, notifySuccess]);

  return (
    <AdminPageShell eyebrow="????????" title="????? ???????? ??????" description="???? ???? ?? ???????? ???????? ???????? ?? ????? ????? ??? ??? ??????.">
      {error ? <ErrorState message={error} /> : null}
      <Card tone="strong">
        <form className="stack" onSubmit={save}>
          <div className="grid-auto">
            <Field label="SKU"><Input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} /></Field>
            <Field label="????? ?????"><Input type="number" value={form.size_ml} onChange={(event) => setForm({ ...form, size_ml: Number(event.target.value) })} /></Field>
            <Field label="?????"><Input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} /></Field>
            <Field label="??? ?????"><Input type="number" value={form.retail_price} onChange={(event) => setForm({ ...form, retail_price: Number(event.target.value) })} /></Field>
            <Field label="??? ??????"><Input type="number" value={form.wholesale_price} onChange={(event) => setForm({ ...form, wholesale_price: Number(event.target.value) })} /></Field>
            <Field label="???????"><Input type="number" value={form.cost_price} onChange={(event) => setForm({ ...form, cost_price: Number(event.target.value) })} /></Field>
            <Field label="???????"><Input type="number" value={form.stock_quantity} onChange={(event) => setForm({ ...form, stock_quantity: Number(event.target.value) })} /></Field>
            <Field label="?? ???????"><Input type="number" value={form.low_stock_threshold} onChange={(event) => setForm({ ...form, low_stock_threshold: Number(event.target.value) })} /></Field>
            <Field label="??????"><Select value={String(form.is_active)} onChange={(event) => setForm({ ...form, is_active: event.target.value === 'true' })}><option value="true">???</option><option value="false">??? ???</option></Select></Field>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button type="submit">{editingId ? '??? ???????' : '????? ???'}</Button>
            {editingId ? <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(blankVariant); }}>?????</Button> : null}
          </div>
        </form>
      </Card>

      {loading ? <LoadingState label="???? ????? ???????..." /> : !variants.length ? <EmptyState title="?? ???? ??????? ???" description="??? ??? ??? ???? ??????." /> : <Card tone="strong"><DataTable rows={variants} columns={columns} cardTitle={(variant) => variant.label || `${variant.size_ml} ??`} /></Card>}
    </AdminPageShell>
  );
};

export default AdminProductVariants;
