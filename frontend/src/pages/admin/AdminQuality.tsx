import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, Field, Input, LoadingState, Select, Textarea } from '../../components/ui';

const blank = { production_batch_id: '', clarity_test: '', sprayer_test: '', leak_test: '', scent_test: '', projection_notes: '', longevity_notes: '', approval_status: 'pending', notes: '' };

const AdminQuality: React.FC = () => {
  const [qualityChecks, setQualityChecks] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [form, setForm] = useState<any>(blank);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.quality.list(), adminApi.batches.list()]).then(([qualityRes, batchRes]) => {
      setQualityChecks(qualityRes.data || []);
      setBatches(batchRes.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) await adminApi.quality.update(editingId, form);
    else await adminApi.quality.create(form);
    setEditingId(null);
    setForm(blank);
    load();
  };

  const columns = useMemo(() => [
    { key: 'batch', header: 'الدفعة', cell: (quality: any) => quality.batch?.batch_code || '—' },
    { key: 'approval', header: 'النتيجة', cell: (quality: any) => <Badge tone={quality.approval_status === 'approved' ? 'success' : quality.approval_status === 'rejected' ? 'danger' : 'gold'}>{quality.approval_status}</Badge> },
    { key: 'clarity', header: 'الشفافية', cell: (quality: any) => quality.clarity_test || '—' },
    { key: 'sprayer', header: 'البخاخ', cell: (quality: any) => quality.sprayer_test || '—' },
    { key: 'actions', header: 'إجراءات', cell: (quality: any) => <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><Button size="sm" variant="secondary" onClick={() => { setEditingId(quality.id); setForm({ ...quality, production_batch_id: quality.production_batch_id || quality.batch?.id || '' }); }}>تعديل</Button><Button size="sm" variant="danger" onClick={() => adminApi.quality.delete(quality.id).then(load)}>حذف</Button></div> },
  ], []);

  return (
    <AdminPageShell eyebrow="Quality" title="فحوص الجودة" description="مراجعة واضحة لاختبارات الشفافية والبخاخ والتسريب والرائحة مع ربط مباشر بالدفعات.">
      <Card tone="strong">
        <form className="stack" onSubmit={submit}>
          <div className="grid-auto">
            <Field label="الدفعة"><Select value={form.production_batch_id} onChange={(event) => setForm({ ...form, production_batch_id: event.target.value })}><option value="">اختر دفعة</option>{batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.batch_code}</option>)}</Select></Field>
            <Field label="Clarity"><Input value={form.clarity_test} onChange={(event) => setForm({ ...form, clarity_test: event.target.value })} /></Field>
            <Field label="Sprayer"><Input value={form.sprayer_test} onChange={(event) => setForm({ ...form, sprayer_test: event.target.value })} /></Field>
            <Field label="Leak"><Input value={form.leak_test} onChange={(event) => setForm({ ...form, leak_test: event.target.value })} /></Field>
            <Field label="Scent"><Input value={form.scent_test} onChange={(event) => setForm({ ...form, scent_test: event.target.value })} /></Field>
            <Field label="النتيجة"><Select value={form.approval_status} onChange={(event) => setForm({ ...form, approval_status: event.target.value })}><option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option></Select></Field>
          </div>
          <div className="grid-auto">
            <Field label="ملاحظات الفوحان"><Textarea value={form.projection_notes} onChange={(event) => setForm({ ...form, projection_notes: event.target.value })} /></Field>
            <Field label="ملاحظات الثبات"><Textarea value={form.longevity_notes} onChange={(event) => setForm({ ...form, longevity_notes: event.target.value })} /></Field>
          </div>
          <Field label="ملاحظات عامة"><Textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></Field>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button type="submit">{editingId ? 'حفظ الفحص' : 'إضافة فحص'}</Button>
            {editingId ? <Button variant="ghost" type="button" onClick={() => { setEditingId(null); setForm(blank); }}>إلغاء</Button> : null}
          </div>
        </form>
      </Card>
      {loading ? <LoadingState label="جاري تحميل فحوص الجودة..." /> : !qualityChecks.length ? <EmptyState title="لا توجد فحوص جودة" description="أضف أول فحص مرتبط بدفعة إنتاج." /> : <Card tone="strong"><DataTable rows={qualityChecks} columns={columns} cardTitle={(quality) => quality.batch?.batch_code || 'Quality check'} /></Card>}
    </AdminPageShell>
  );
};

export default AdminQuality;
