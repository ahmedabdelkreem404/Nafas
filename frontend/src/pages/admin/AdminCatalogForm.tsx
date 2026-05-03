import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, Field, Input, Select, Textarea } from '../../components/ui';

type CatalogForm = {
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  image_url?: string;
  banner_image_url?: string;
  sort_order?: number;
  is_active?: boolean;
  products?: any[];
};

const blankCatalog: CatalogForm = {
  slug: '',
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  image_url: '',
  banner_image_url: '',
  sort_order: 0,
  is_active: true,
  products: [],
};

const AdminCatalogForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<CatalogForm>(blankCatalog);
  const [products, setProducts] = useState<any[]>([]);
  const [attachProductId, setAttachProductId] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(() => Promise.all([
    id ? adminApi.catalogs.get(id).then((response) => setForm(response.data?.data || blankCatalog)) : Promise.resolve(),
    adminApi.products.list().then((response) => setProducts(response.data || [])),
  ]).catch(() => setMessage('تعذر تحميل بيانات الكتالوج.')), [id]);

  useEffect(() => { load(); }, [load]);

  const productOptions = useMemo(() => products.map((product) => ({
    value: String(product.id),
    label: `${product.name_ar || product.name_en} - ${product.code}`,
  })), [products]);

  const save = () => {
    const payload = {
      slug: form.slug,
      name_ar: form.name_ar,
      name_en: form.name_en,
      description_ar: form.description_ar || null,
      description_en: form.description_en || null,
      image_url: form.image_url || null,
      banner_image_url: form.banner_image_url || null,
      sort_order: Number(form.sort_order || 0),
      is_active: Boolean(form.is_active),
    };

    const request = id ? adminApi.catalogs.update(id, payload) : adminApi.catalogs.create(payload);
    request.then((response) => {
      const next = response.data?.data;
      if (!id && next?.id) navigate(`/admin/catalogs/${next.id}/edit`);
      else load();
    }).catch(() => setMessage('راجع الحقول المطلوبة: الرابط، الاسم العربي، الاسم الإنجليزي.'));
  };

  return (
    <AdminPageShell eyebrow="الكتالوجات" title={id ? 'تعديل كتالوج' : 'إضافة كتالوج'} description="تحكم في اسم الكتالوج، وصفه، الصور، المنتجات، والترتيب.">
      {message && <Card tone="strong"><strong>{message}</strong></Card>}
      <Card tone="strong" className="stack">
        <div className="grid-auto">
          <Field label="الرابط المختصر"><Input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></Field>
          <Field label="الاسم العربي"><Input value={form.name_ar} onChange={(event) => setForm({ ...form, name_ar: event.target.value })} /></Field>
          <Field label="الاسم الإنجليزي"><Input value={form.name_en} onChange={(event) => setForm({ ...form, name_en: event.target.value })} /></Field>
          <Field label="الترتيب"><Input type="number" value={form.sort_order || 0} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} /></Field>
        </div>
        <div className="grid-auto">
          <Field label="الوصف العربي"><Textarea value={form.description_ar || ''} onChange={(event) => setForm({ ...form, description_ar: event.target.value })} /></Field>
          <Field label="الوصف الإنجليزي"><Textarea value={form.description_en || ''} onChange={(event) => setForm({ ...form, description_en: event.target.value })} /></Field>
        </div>
        <div className="grid-auto">
          <Field label="صورة الكارت"><Input value={form.image_url || ''} onChange={(event) => setForm({ ...form, image_url: event.target.value })} /></Field>
          <Field label="صورة البانر"><Input value={form.banner_image_url || ''} onChange={(event) => setForm({ ...form, banner_image_url: event.target.value })} /></Field>
        </div>
        <label className="checkbox-row">
          <input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
          ظاهر في المتجر
        </label>
        <Button onClick={save}>حفظ الكتالوج</Button>
      </Card>

      {id && (
        <Card tone="strong" className="stack">
          <div className="data-card__row">
            <strong>منتجات الكتالوج</strong>
            <Badge>{form.products?.length || 0} منتج</Badge>
          </div>
          <div className="grid-auto">
            <Field label="اختيار منتج">
              <Select value={attachProductId} onChange={(event) => setAttachProductId(event.target.value)}>
                <option value="">اختر منتج</option>
                {productOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>
            </Field>
            <Button variant="secondary" disabled={!attachProductId} onClick={() => adminApi.catalogs.attachProduct(id, { product_id: Number(attachProductId), sort_order: (form.products?.length || 0) * 10 }).then(() => { setAttachProductId(''); load(); })}>إضافة للكتالوج</Button>
          </div>
          {(form.products || []).map((product) => (
            <div key={product.id} className="data-card">
              <div className="data-card__row">
                <strong>{product.name_ar || product.name_en}</strong>
                <span className="copy-muted">/{product.slug}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button size="sm" variant="danger" onClick={() => adminApi.catalogs.detachProduct(product.pivot?.id).then(load)}>إزالة</Button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </AdminPageShell>
  );
};

export default AdminCatalogForm;
