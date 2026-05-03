import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Button, Card, EmptyState, Field, Input, Textarea } from '../../components/ui';

const blankPage = { slug: '', title: '', content: '', is_active: true };
const blankSection = { title: '', section_key: '', content: '', sort_order: 0, is_active: true };

const AdminContent: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [pageForm, setPageForm] = useState<any>(blankPage);
  const [sectionForms, setSectionForms] = useState<Record<number, any>>({});

  const load = () => adminApi.pages.list().then((res) => setPages(res.data || []));
  useEffect(() => { load(); }, []);

  return (
    <AdminPageShell eyebrow="المحتوى" title="إدارة الصفحات والمحتوى" description="تجربة تحرير محتوى أكثر ترتيبًا للصفحات القانونية والتعريفية وأقسامها.">
      <Card tone="strong">
        <form className="stack" onSubmit={(event) => {
          event.preventDefault();
          adminApi.pages.create(pageForm).then(() => { setPageForm(blankPage); load(); });
        }}>
          <div className="grid-auto">
            <Field label="الرابط المختصر"><Input value={pageForm.slug} onChange={(event) => setPageForm({ ...pageForm, slug: event.target.value })} /></Field>
            <Field label="العنوان"><Input value={pageForm.title} onChange={(event) => setPageForm({ ...pageForm, title: event.target.value })} /></Field>
          </div>
          <Field label="المحتوى"><Textarea value={pageForm.content} onChange={(event) => setPageForm({ ...pageForm, content: event.target.value })} /></Field>
          <Button type="submit">إضافة صفحة</Button>
        </form>
      </Card>

      {!pages.length ? <EmptyState title="لا توجد صفحات" description="أنشئ أول صفحة محتوى من هنا." /> : (
        <div className="stack">
          {pages.map((page) => (
            <Card key={page.id} tone="strong" className="stack">
              <div className="data-card__row"><strong>{page.title}</strong><span className="copy-muted">/{page.slug}</span></div>
              <Input value={page.title} onChange={(event) => setPages((current) => current.map((entry) => entry.id === page.id ? { ...entry, title: event.target.value } : entry))} />
              <Textarea value={page.content || ''} onChange={(event) => setPages((current) => current.map((entry) => entry.id === page.id ? { ...entry, content: event.target.value } : entry))} />
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button onClick={() => adminApi.pages.update(page.id, { title: page.title, content: page.content, slug: page.slug, is_active: page.is_active }).then(load)}>حفظ الصفحة</Button>
                <Button variant="danger" onClick={() => adminApi.pages.delete(page.id).then(load)}>حذف الصفحة</Button>
              </div>
              <div className="soft-divider" />
              <strong>الأقسام</strong>
              {(page.sections || []).map((section: any) => (
                <div key={section.id} className="data-card">
                  <div className="data-card__title">{section.title}</div>
                  <div className="copy-muted">{section.content}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button size="sm" variant="secondary" onClick={() => adminApi.pages.updateSection(section.id, { ...section, is_active: section.is_active }).then(load)}>تحديث</Button>
                    <Button size="sm" variant="danger" onClick={() => adminApi.pages.deleteSection(section.id).then(load)}>حذف</Button>
                  </div>
                </div>
              ))}
              <form className="stack" onSubmit={(event) => {
                event.preventDefault();
                const data = sectionForms[page.id] || blankSection;
                adminApi.pages.createSection(page.id, data).then(() => { setSectionForms({ ...sectionForms, [page.id]: blankSection }); load(); });
              }}>
                <div className="grid-auto">
                  <Field label="عنوان القسم"><Input value={sectionForms[page.id]?.title || ''} onChange={(event) => setSectionForms({ ...sectionForms, [page.id]: { ...(sectionForms[page.id] || blankSection), title: event.target.value } })} /></Field>
                  <Field label="مفتاح القسم"><Input value={sectionForms[page.id]?.section_key || ''} onChange={(event) => setSectionForms({ ...sectionForms, [page.id]: { ...(sectionForms[page.id] || blankSection), section_key: event.target.value } })} /></Field>
                </div>
                <Field label="المحتوى"><Textarea value={sectionForms[page.id]?.content || ''} onChange={(event) => setSectionForms({ ...sectionForms, [page.id]: { ...(sectionForms[page.id] || blankSection), content: event.target.value } })} /></Field>
                <Button type="submit" variant="secondary">إضافة قسم</Button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminContent;
