import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, ErrorState, Field, Input, LoadingState, Select } from '../../components/ui';

const blankMedia = {
  url: '',
  type: 'image',
  alt_text: '',
  is_primary: false,
};

const typeLabel: Record<string, string> = {
  image: 'صورة',
  video: 'فيديو',
};

const AdminProductMedia: React.FC = () => {
  const { id = '' } = useParams();
  const [media, setMedia] = useState<any[]>([]);
  const [form, setForm] = useState<any>(blankMedia);
  const [files, setFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    adminApi.products.media(id)
      .then((res) => setMedia(res.data || []))
      .catch((err) => setError(err.message || 'تعذر تحميل وسائط المنتج.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setForm(blankMedia);
    setFiles([]);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await adminApi.products.updateMedia(editingId, form);
      } else {
        const payload = new FormData();
        payload.append('type', form.type);
        payload.append('alt_text', form.alt_text || '');
        payload.append('is_primary', form.is_primary ? '1' : '0');
        if (form.url) payload.append('url', form.url);
        files.forEach((file) => payload.append('files[]', file));
        await adminApi.products.createMedia(id, payload);
      }
      resetForm();
      load();
    } catch (err: any) {
      setError(err.message || 'تعذر حفظ الوسائط. تأكد من الرابط أو نوع الملف.');
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(() => [
    {
      key: 'preview',
      header: 'المعاينة',
      cell: (item: any) => (
        item.type === 'video'
          ? <video src={item.url} style={{ width: 86, height: 86, borderRadius: 18, objectFit: 'cover' }} muted playsInline />
          : <img src={item.url} alt={item.alt_text || 'وسيط المنتج'} style={{ width: 86, height: 86, borderRadius: 18, objectFit: 'cover' }} />
      ),
    },
    { key: 'type', header: 'النوع', cell: (item: any) => <Badge tone={item.is_primary ? 'gold' : 'muted'}>{typeLabel[item.type] || item.type}</Badge> },
    { key: 'primary', header: 'الرئيسية', cell: (item: any) => item.is_primary ? 'نعم' : 'لا' },
    { key: 'alt', header: 'النص البديل', cell: (item: any) => item.alt_text || 'غير محدد' },
    { key: 'url', header: 'الرابط', cell: (item: any) => <span className="copy-muted" style={{ wordBreak: 'break-all' }}>{item.url}</span> },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (item: any) => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button size="sm" variant="secondary" onClick={() => { setEditingId(item.id); setForm({ ...blankMedia, ...item }); setFiles([]); }}>تعديل</Button>
          {!item.is_primary ? <Button size="sm" variant="ghost" onClick={() => adminApi.products.updateMedia(item.id, { ...item, is_primary: true }).then(load)}>تعيين رئيسية</Button> : null}
          <Button size="sm" variant="danger" onClick={() => adminApi.products.deleteMedia(item.id).then(load)}>حذف</Button>
        </div>
      ),
    },
  ], [load]);

  return (
    <AdminPageShell
      eyebrow="وسائط المنتج"
      title="إدارة صور وفيديوهات المنتج"
      description="ارفع صور أو فيديوهات من جهازك، أو أضف رابط خارجي، مع معاينة وتحديد الصورة الرئيسية."
      actions={<Link to={`/admin/products/${id}/edit`}><Button variant="secondary">رجوع للمنتج</Button></Link>}
    >
      {error ? <ErrorState message={error} /> : null}

      <Card tone="strong">
        <form className="stack" onSubmit={submit}>
          <div className="grid-auto">
            <Field label="رفع من الجهاز" hint="يمكن اختيار أكثر من صورة أو فيديو مرة واحدة.">
              <Input
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm,video/quicktime"
                disabled={Boolean(editingId)}
                onChange={(event) => setFiles(Array.from(event.target.files || []))}
              />
            </Field>
            <Field label="أو رابط خارجي">
              <Input value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="https://..." />
            </Field>
            <Field label="النوع">
              <Select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="image">صورة</option>
                <option value="video">فيديو</option>
              </Select>
            </Field>
            <Field label="النص البديل">
              <Input value={form.alt_text} onChange={(event) => setForm({ ...form, alt_text: event.target.value })} />
            </Field>
            <Field label="وسيط رئيسي">
              <Select value={String(form.is_primary)} onChange={(event) => setForm({ ...form, is_primary: event.target.value === 'true' })}>
                <option value="false">لا</option>
                <option value="true">نعم</option>
              </Select>
            </Field>
          </div>

          {files.length ? (
            <div className="data-card">
              <strong>ملفات جاهزة للرفع</strong>
              <div className="copy-muted">{files.map((file) => file.name).join('، ')}</div>
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button type="submit" disabled={saving || (!editingId && !form.url && !files.length)}>
              {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديل' : 'إضافة الوسائط'}
            </Button>
            {editingId ? <Button type="button" variant="ghost" onClick={resetForm}>إلغاء التعديل</Button> : null}
          </div>
        </form>
      </Card>

      {loading ? (
        <LoadingState label="جاري تحميل الوسائط..." />
      ) : !media.length ? (
        <EmptyState title="لا توجد وسائط" description="أضف أول صورة أو فيديو لهذا المنتج." />
      ) : (
        <Card tone="strong">
          <DataTable rows={media} columns={columns} cardTitle={(item) => item.alt_text || typeLabel[item.type] || 'وسيط'} />
        </Card>
      )}
    </AdminPageShell>
  );
};

export default AdminProductMedia;
