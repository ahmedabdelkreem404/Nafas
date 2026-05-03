import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Button, Card, ErrorState, Field, Input, LoadingState, Select, Textarea } from '../../components/ui';
import { formatCurrency, formatNumber } from '../../utils/format';

const emptyState = {
  code: '',
  name_ar: '',
  name_en: '',
  slug: '',
  gender: 'men',
  status: 'active',
  story: '',
  personality: '',
  marketing_line_ar: '',
  scent_notes: '',
  season: '',
  time_of_day: '',
  projection_label: '',
  longevity_label: '',
  strength_label: '',
  cost_material_per_bottle: 0,
  cost_packaging_per_bottle: 0,
  cost_filling_per_bottle: 0,
  variants: [],
};

const AdminProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(emptyState);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    adminApi.products.get(id)
      .then((res) => setForm({ ...emptyState, ...res.data }))
      .catch((err) => setError(err.message || 'تعذّر تحميل المنتج'))
      .finally(() => setLoading(false));
  }, [id]);

  const sellingPrice = useMemo(() => {
    const prices = (form.variants || []).map((variant: any) => Number(variant.retail_price || 0)).filter(Boolean);
    return prices.length ? Math.max(...prices) : 0;
  }, [form.variants]);

  const profitability = useMemo(() => {
    const material = Number(form.cost_material_per_bottle || 0);
    const packaging = Number(form.cost_packaging_per_bottle || 0);
    const filling = Number(form.cost_filling_per_bottle || 0);
    const total = material + packaging + filling;
    const gross = sellingPrice - total;
    const margin = sellingPrice ? (gross / sellingPrice) * 100 : 0;

    return {
      gross,
      margin,
      total,
      tone: margin >= 60 ? 'success' : margin >= 40 ? 'gold' : 'danger',
    };
  }, [form.cost_filling_per_bottle, form.cost_material_per_bottle, form.cost_packaging_per_bottle, sellingPrice]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (id) {
        await adminApi.products.update(id, form);
      } else {
        await adminApi.products.create(form);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message || 'تعذّر حفظ المنتج');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminPageShell eyebrow="الكتالوج" title="تحميل المنتج" description="">
        <LoadingState label="جاري تحميل المنتج..." />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell eyebrow="الكتالوج" title={id ? 'تعديل المنتج' : 'إضافة منتج'} description="نموذج واضح ومنظّم لبيانات المنتج التسويقية والعطرية والربحية.">
      {error ? <ErrorState message={error} /> : null}
      <Card tone="strong">
        <form onSubmit={submit} className="stack">
          <div className="grid-auto">
            <Field label="الاسم العربي"><Input value={form.name_ar} onChange={(event) => setForm({ ...form, name_ar: event.target.value })} /></Field>
            <Field label="الاسم الإنجليزي"><Input value={form.name_en} onChange={(event) => setForm({ ...form, name_en: event.target.value })} /></Field>
            <Field label="الكود"><Input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} /></Field>
            <Field label="الرابط المختصر"><Input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></Field>
            <Field label="الجنس"><Select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}><option value="men">رجالي</option><option value="women">حريمي</option><option value="unisex">يونيسكس</option></Select></Field>
            <Field label="الحالة"><Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="active">نشط</option><option value="hidden">مخفي</option><option value="draft">مسودة</option></Select></Field>
            <Field label="الشخصية"><Input value={form.personality} onChange={(event) => setForm({ ...form, personality: event.target.value })} /></Field>
            <Field label="النوتات"><Input value={form.scent_notes} onChange={(event) => setForm({ ...form, scent_notes: event.target.value })} /></Field>
            <Field label="الموسم"><Input value={form.season} onChange={(event) => setForm({ ...form, season: event.target.value })} /></Field>
            <Field label="وقت الاستخدام"><Input value={form.time_of_day} onChange={(event) => setForm({ ...form, time_of_day: event.target.value })} /></Field>
            <Field label="الفوحان"><Input value={form.projection_label} onChange={(event) => setForm({ ...form, projection_label: event.target.value })} /></Field>
            <Field label="الثبات"><Input value={form.longevity_label} onChange={(event) => setForm({ ...form, longevity_label: event.target.value })} /></Field>
            <Field label="الانطباع"><Input value={form.strength_label} onChange={(event) => setForm({ ...form, strength_label: event.target.value })} /></Field>
            <Field label="الجملة التسويقية"><Input value={form.marketing_line_ar} onChange={(event) => setForm({ ...form, marketing_line_ar: event.target.value })} /></Field>
          </div>

          <Field label="القصة العطرية"><Textarea value={form.story} onChange={(event) => setForm({ ...form, story: event.target.value })} /></Field>

          <Card tone="soft" className="stack">
            <strong>💰 تحليل الربحية</strong>
            <div className="grid-auto">
              <Field label="تكلفة الخامة"><Input type="number" min={0} value={form.cost_material_per_bottle} onChange={(event) => setForm({ ...form, cost_material_per_bottle: Number(event.target.value) })} /></Field>
              <Field label="تكلفة التعبئة"><Input type="number" min={0} value={form.cost_packaging_per_bottle} onChange={(event) => setForm({ ...form, cost_packaging_per_bottle: Number(event.target.value) })} /></Field>
              <Field label="تكلفة التشغيل"><Input type="number" min={0} value={form.cost_filling_per_bottle} onChange={(event) => setForm({ ...form, cost_filling_per_bottle: Number(event.target.value) })} /></Field>
              <Field label="سعر البيع"><Input value={sellingPrice ? formatCurrency(sellingPrice) : '—'} readOnly /></Field>
            </div>
            <div className="stack">
              <div className="data-card__row"><span>إجمالي التكلفة</span><strong>{formatCurrency(profitability.total)}</strong></div>
              <div className="data-card__row"><span>الربح الصافي</span><strong>{formatCurrency(profitability.gross)}</strong></div>
              <div className="data-card__row"><span>هامش الربح</span><strong className={`text-${profitability.tone}`}>{formatNumber(Math.round(profitability.margin || 0))}%</strong></div>
            </div>
          </Card>

          <Button type="submit" disabled={saving}>{saving ? 'جارِ الحفظ...' : 'حفظ المنتج'}</Button>
        </form>
      </Card>
    </AdminPageShell>
  );
};

export default AdminProductForm;
