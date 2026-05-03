import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, Field, Input, LoadingState, Select } from '../../components/ui';

const blankMedia = { url: '', type: 'image', alt_text: '', is_primary: false };

const AdminProductMedia: React.FC = () => {
  const { id = '' } = useParams();
  const [media, setMedia] = useState<any[]>([]);
  const [form, setForm] = useState<any>(blankMedia);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.products.media(id).then((res) => setMedia(res.data || [])).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) await adminApi.products.updateMedia(editingId, form);
    else await adminApi.products.createMedia(id, form);
    setEditingId(null);
    setForm(blankMedia);
    load();
  };

  const columns = useMemo(() => [
    { key: 'preview', header: 'المعاينة', cell: (item: any) => item.url ? <img src={item.url} alt={item.alt_text || 'media'} style={{ width: 60, height: 60, borderRadius: 14, objectFit: 'cover' }} /> : '—' },
    { key: 'type', header: 'النوع', cell: (item: any) => <Badge tone={item.is_primary ? 'gold' : 'muted'}>{item.type}</Badge> },
    { key: 'alt', header: 'الوصف', cell: (item: any) => item.alt_text || '—' },
    { key: 'url', header: 'الرابط', cell: (item: any) => <span className="copy-muted">{item.url}</span> },
    { key: 'actions', header: 'إجراءات', cell: (item: any) => <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><Button size="sm" variant="secondary" onClick={() => { setEditingId(item.id); setForm({ ...item }); }}>تعديل</Button><Button size="sm" variant="danger" onClick={() => adminApi.products.deleteMedia(item.id).then(load)}>حذف</Button></div> },
  ], [load]);

  return (
    <AdminPageShell eyebrow="الكتالوج" title="وسائط المنتج" description="صور وروابط المنتج داخل واجهة مرتبة وقابلة للاستخدام على الشاشات الصغيرة.">
      <Card tone="strong">
        <form className="stack" onSubmit={submit}>
          <div className="grid-auto">
            <Field label="الرابط"><Input value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} /></Field>
            <Field label="النوع"><Select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="image">image</option><option value="video">video</option></Select></Field>
            <Field label="النص البديل"><Input value={form.alt_text} onChange={(event) => setForm({ ...form, alt_text: event.target.value })} /></Field>
            <Field label="الصورة الرئيسية"><Select value={String(form.is_primary)} onChange={(event) => setForm({ ...form, is_primary: event.target.value === 'true' })}><option value="false">لا</option><option value="true">نعم</option></Select></Field>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button type="submit">{editingId ? 'حفظ الوسائط' : 'إضافة وسيط'}</Button>
            {editingId ? <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm(blankMedia); }}>إلغاء</Button> : null}
          </div>
        </form>
      </Card>

      {loading ? <LoadingState label="جاري تحميل الوسائط..." /> : !media.length ? <EmptyState title="لا توجد وسائط" description="أضف أول صورة أو فيديو لهذا المنتج." /> : <Card tone="strong"><DataTable rows={media} columns={columns} cardTitle={(item) => item.alt_text || item.type} /></Card>}
    </AdminPageShell>
  );
};

export default AdminProductMedia;
