import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, EmptyState, Field, Input, Select, Textarea } from '../../components/ui';

type HomeItem = {
  id: number;
  product_id?: number | null;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  body_ar?: string;
  body_en?: string;
  image_url?: string;
  mobile_image_url?: string;
  link_url?: string;
  cta_label_ar?: string;
  cta_label_en?: string;
  accent_color?: string;
  sort_order?: number;
  is_active?: boolean;
  product?: { id: number; name_ar: string; name_en: string; slug: string; code: string };
};

type HomeSection = {
  id: number;
  section_key: string;
  type: string;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  body_ar?: string;
  body_en?: string;
  eyebrow_ar?: string;
  eyebrow_en?: string;
  cta_label_ar?: string;
  cta_label_en?: string;
  cta_url?: string;
  secondary_cta_label_ar?: string;
  secondary_cta_label_en?: string;
  secondary_cta_url?: string;
  image_url?: string;
  mobile_image_url?: string;
  video_url?: string;
  accent_color?: string;
  background_color?: string;
  sort_order?: number;
  is_active?: boolean;
  items?: HomeItem[];
};

type ProductOption = { id: number; name_ar: string; name_en: string; slug: string; code: string };

const blankSection: Partial<HomeSection> = {
  section_key: '',
  type: 'content',
  title_ar: '',
  title_en: '',
  sort_order: 0,
  is_active: true,
};

const blankItem: Partial<HomeItem> = {
  title_ar: '',
  title_en: '',
  product_id: null,
  sort_order: 0,
  is_active: true,
};

function sectionPayload(section: Partial<HomeSection>) {
  return {
    section_key: section.section_key || '',
    type: section.type || 'content',
    title_ar: section.title_ar || null,
    title_en: section.title_en || null,
    subtitle_ar: section.subtitle_ar || null,
    subtitle_en: section.subtitle_en || null,
    body_ar: section.body_ar || null,
    body_en: section.body_en || null,
    eyebrow_ar: section.eyebrow_ar || null,
    eyebrow_en: section.eyebrow_en || null,
    cta_label_ar: section.cta_label_ar || null,
    cta_label_en: section.cta_label_en || null,
    cta_url: section.cta_url || null,
    secondary_cta_label_ar: section.secondary_cta_label_ar || null,
    secondary_cta_label_en: section.secondary_cta_label_en || null,
    secondary_cta_url: section.secondary_cta_url || null,
    image_url: section.image_url || null,
    mobile_image_url: section.mobile_image_url || null,
    video_url: section.video_url || null,
    accent_color: section.accent_color || null,
    background_color: section.background_color || null,
    sort_order: Number(section.sort_order || 0),
    is_active: Boolean(section.is_active),
  };
}

function itemPayload(item: Partial<HomeItem>) {
  return {
    product_id: item.product_id ? Number(item.product_id) : null,
    title_ar: item.title_ar || null,
    title_en: item.title_en || null,
    subtitle_ar: item.subtitle_ar || null,
    subtitle_en: item.subtitle_en || null,
    body_ar: item.body_ar || null,
    body_en: item.body_en || null,
    image_url: item.image_url || null,
    mobile_image_url: item.mobile_image_url || null,
    link_url: item.link_url || null,
    cta_label_ar: item.cta_label_ar || null,
    cta_label_en: item.cta_label_en || null,
    accent_color: item.accent_color || null,
    sort_order: Number(item.sort_order || 0),
    is_active: Boolean(item.is_active),
  };
}

const AdminHomepageBuilder: React.FC = () => {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [newSection, setNewSection] = useState<Partial<HomeSection>>(blankSection);
  const [itemForms, setItemForms] = useState<Record<number, Partial<HomeItem>>>({});
  const [editingItems, setEditingItems] = useState<Record<number, Partial<HomeItem>>>({});
  const [message, setMessage] = useState('');

  const load = () => {
    setMessage('');
    return Promise.all([
      adminApi.homeSections.list().then((response) => setSections(response.data?.data || [])),
      adminApi.products.list().then((response) => setProducts(Array.isArray(response.data) ? response.data : response.data?.data || [])),
    ]);
  };

  useEffect(() => {
    load().catch(() => setMessage('تعذر تحميل بيانات الرئيسية. تأكد من تشغيل Laravel API.'));
  }, []);

  const productOptions = useMemo(() => products.map((product) => ({
    value: String(product.id),
    label: `${product.name_ar || product.name_en} - ${product.code}`,
  })), [products]);

  return (
    <AdminPageShell eyebrow="الرئيسية" title="محرر الصفحة الرئيسية" description="تحكم منظم في سكاشن الهوم، النصوص، الصور، الروابط، والمنتجات المختارة بدون تعديل الكود.">
      {message && <Card tone="strong"><strong>{message}</strong></Card>}

      <Card tone="strong">
        <form className="stack" onSubmit={(event) => {
          event.preventDefault();
          adminApi.homeSections.create(sectionPayload(newSection)).then(() => {
            setNewSection(blankSection);
            load();
          }).catch(() => setMessage('راجع مفتاح السكشن والحقول المطلوبة.'));
        }}>
          <div className="grid-auto">
            <Field label="مفتاح السكشن"><Input value={newSection.section_key || ''} onChange={(event) => setNewSection({ ...newSection, section_key: event.target.value })} /></Field>
            <Field label="نوع السكشن"><Input value={newSection.type || ''} onChange={(event) => setNewSection({ ...newSection, type: event.target.value })} /></Field>
            <Field label="الترتيب"><Input type="number" value={newSection.sort_order || 0} onChange={(event) => setNewSection({ ...newSection, sort_order: Number(event.target.value) })} /></Field>
          </div>
          <div className="grid-auto">
            <Field label="عنوان عربي"><Input value={newSection.title_ar || ''} onChange={(event) => setNewSection({ ...newSection, title_ar: event.target.value })} /></Field>
            <Field label="عنوان إنجليزي"><Input value={newSection.title_en || ''} onChange={(event) => setNewSection({ ...newSection, title_en: event.target.value })} /></Field>
          </div>
          <Button type="submit">إضافة سكشن</Button>
        </form>
      </Card>

      {!sections.length ? <EmptyState title="لا توجد سكاشن" description="ابدأ بإضافة سكشن رئيسي أو شغل seeder." /> : (
        <div className="stack">
          {sections.map((section) => (
            <Card key={section.id} tone="strong" className="stack">
              <div className="data-card__row">
                <div>
                  <strong>{section.title_ar || section.section_key}</strong>
                  <div className="copy-muted">{section.section_key} / {section.type}</div>
                </div>
                <Badge tone={section.is_active ? 'success' : 'muted'}>{section.is_active ? 'ظاهر' : 'مخفي'}</Badge>
              </div>

              <div className="grid-auto">
                <Field label="عنوان عربي"><Input value={section.title_ar || ''} onChange={(event) => setSections((current) => current.map((entry) => entry.id === section.id ? { ...entry, title_ar: event.target.value } : entry))} /></Field>
                <Field label="عنوان إنجليزي"><Input value={section.title_en || ''} onChange={(event) => setSections((current) => current.map((entry) => entry.id === section.id ? { ...entry, title_en: event.target.value } : entry))} /></Field>
                <Field label="الترتيب"><Input type="number" value={section.sort_order || 0} onChange={(event) => setSections((current) => current.map((entry) => entry.id === section.id ? { ...entry, sort_order: Number(event.target.value) } : entry))} /></Field>
              </div>
              <div className="grid-auto">
                <Field label="وصف عربي"><Textarea value={section.subtitle_ar || ''} onChange={(event) => setSections((current) => current.map((entry) => entry.id === section.id ? { ...entry, subtitle_ar: event.target.value } : entry))} /></Field>
                <Field label="وصف إنجليزي"><Textarea value={section.subtitle_en || ''} onChange={(event) => setSections((current) => current.map((entry) => entry.id === section.id ? { ...entry, subtitle_en: event.target.value } : entry))} /></Field>
              </div>
              <div className="grid-auto">
                <Field label="رابط الصورة"><Input value={section.image_url || ''} onChange={(event) => setSections((current) => current.map((entry) => entry.id === section.id ? { ...entry, image_url: event.target.value } : entry))} /></Field>
                <Field label="رابط صورة الموبايل"><Input value={section.mobile_image_url || ''} onChange={(event) => setSections((current) => current.map((entry) => entry.id === section.id ? { ...entry, mobile_image_url: event.target.value } : entry))} /></Field>
                <Field label="CTA"><Input value={section.cta_url || ''} onChange={(event) => setSections((current) => current.map((entry) => entry.id === section.id ? { ...entry, cta_url: event.target.value } : entry))} /></Field>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button onClick={() => adminApi.homeSections.update(section.id, sectionPayload(section)).then(load)}>حفظ السكشن</Button>
                <Button variant="secondary" onClick={() => adminApi.homeSections.update(section.id, sectionPayload({ ...section, is_active: !section.is_active })).then(load)}>{section.is_active ? 'إخفاء' : 'إظهار'}</Button>
                <Button variant="danger" onClick={() => adminApi.homeSections.delete(section.id).then(load)}>حذف</Button>
              </div>

              <div className="soft-divider" />
              <strong>عناصر السكشن</strong>
              {(section.items || []).map((item) => (
                <div key={item.id} className="data-card">
                  <div className="data-card__row">
                    <strong>{item.product?.name_ar || item.title_ar || 'عنصر بدون عنوان'}</strong>
                    <span className="copy-muted">{item.product?.slug || item.link_url}</span>
                  </div>
                  <div className="copy-muted">{item.subtitle_ar || item.subtitle_en}</div>
                  {editingItems[item.id] ? (
                    <div className="admin-home-item-editor">
                      <div className="grid-auto">
                        <Field label="منتج مرتبط">
                          <Select
                            value={String(editingItems[item.id]?.product_id || '')}
                            onChange={(event) => setEditingItems((current) => ({
                              ...current,
                              [item.id]: {
                                ...(current[item.id] || item),
                                product_id: event.target.value ? Number(event.target.value) : null,
                              },
                            }))}
                          >
                            <option value="">بدون منتج</option>
                            {productOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </Select>
                        </Field>
                        <Field label="ترتيب العنصر">
                          <Input
                            type="number"
                            value={editingItems[item.id]?.sort_order || 0}
                            onChange={(event) => setEditingItems((current) => ({
                              ...current,
                              [item.id]: { ...(current[item.id] || item), sort_order: Number(event.target.value) },
                            }))}
                          />
                        </Field>
                      </div>
                      <div className="grid-auto">
                        <Field label="عنوان عربي"><Input value={editingItems[item.id]?.title_ar || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), title_ar: event.target.value } }))} /></Field>
                        <Field label="عنوان إنجليزي"><Input value={editingItems[item.id]?.title_en || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), title_en: event.target.value } }))} /></Field>
                      </div>
                      <div className="grid-auto">
                        <Field label="وصف عربي"><Textarea value={editingItems[item.id]?.subtitle_ar || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), subtitle_ar: event.target.value } }))} /></Field>
                        <Field label="وصف إنجليزي"><Textarea value={editingItems[item.id]?.subtitle_en || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), subtitle_en: event.target.value } }))} /></Field>
                      </div>
                      <div className="grid-auto">
                        <Field label="نص تفصيلي عربي"><Textarea value={editingItems[item.id]?.body_ar || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), body_ar: event.target.value } }))} /></Field>
                        <Field label="نص تفصيلي إنجليزي"><Textarea value={editingItems[item.id]?.body_en || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), body_en: event.target.value } }))} /></Field>
                      </div>
                      <div className="grid-auto">
                        <Field label="صورة العنصر"><Input value={editingItems[item.id]?.image_url || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), image_url: event.target.value } }))} /></Field>
                        <Field label="صورة الموبايل"><Input value={editingItems[item.id]?.mobile_image_url || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), mobile_image_url: event.target.value } }))} /></Field>
                        <Field label="رابط الضغط"><Input value={editingItems[item.id]?.link_url || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), link_url: event.target.value } }))} /></Field>
                      </div>
                      <div className="grid-auto">
                        <Field label="CTA عربي"><Input value={editingItems[item.id]?.cta_label_ar || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), cta_label_ar: event.target.value } }))} /></Field>
                        <Field label="CTA إنجليزي"><Input value={editingItems[item.id]?.cta_label_en || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), cta_label_en: event.target.value } }))} /></Field>
                        <Field label="لون مميز"><Input value={editingItems[item.id]?.accent_color || ''} onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), accent_color: event.target.value } }))} /></Field>
                      </div>
                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={Boolean(editingItems[item.id]?.is_active)}
                          onChange={(event) => setEditingItems((current) => ({ ...current, [item.id]: { ...(current[item.id] || item), is_active: event.target.checked } }))}
                        />
                        ظاهر في الرئيسية
                      </label>
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {editingItems[item.id] ? (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => adminApi.homeSections.updateItem(item.id, itemPayload(editingItems[item.id])).then(() => {
                          setEditingItems((current) => {
                            const next = { ...current };
                            delete next[item.id];
                            return next;
                          });
                          load();
                        })}>حفظ العنصر</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingItems((current) => {
                          const next = { ...current };
                          delete next[item.id];
                          return next;
                        })}>إلغاء</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => setEditingItems((current) => ({ ...current, [item.id]: { ...item } }))}>تعديل العنصر</Button>
                    )}
                    <Button size="sm" variant="secondary" onClick={() => adminApi.homeSections.updateItem(item.id, itemPayload({ ...item, is_active: !item.is_active })).then(load)}>{item.is_active ? 'إخفاء' : 'إظهار'}</Button>
                    <Button size="sm" variant="danger" onClick={() => adminApi.homeSections.deleteItem(item.id).then(load)}>حذف</Button>
                  </div>
                </div>
              ))}

              <form className="stack" onSubmit={(event) => {
                event.preventDefault();
                const form = itemForms[section.id] || blankItem;
                adminApi.homeSections.createItem(section.id, itemPayload(form)).then(() => {
                  setItemForms((current) => ({ ...current, [section.id]: blankItem }));
                  load();
                });
              }}>
                <div className="grid-auto">
                  <Field label="منتج مرتبط">
                    <Select value={String(itemForms[section.id]?.product_id || '')} onChange={(event) => setItemForms((current) => ({ ...current, [section.id]: { ...(current[section.id] || blankItem), product_id: event.target.value ? Number(event.target.value) : null } }))}>
                      <option value="">بدون منتج</option>
                      {productOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </Select>
                  </Field>
                  <Field label="عنوان عربي"><Input value={itemForms[section.id]?.title_ar || ''} onChange={(event) => setItemForms((current) => ({ ...current, [section.id]: { ...(current[section.id] || blankItem), title_ar: event.target.value } }))} /></Field>
                  <Field label="عنوان إنجليزي"><Input value={itemForms[section.id]?.title_en || ''} onChange={(event) => setItemForms((current) => ({ ...current, [section.id]: { ...(current[section.id] || blankItem), title_en: event.target.value } }))} /></Field>
                  <Field label="الترتيب"><Input type="number" value={itemForms[section.id]?.sort_order || 0} onChange={(event) => setItemForms((current) => ({ ...current, [section.id]: { ...(current[section.id] || blankItem), sort_order: Number(event.target.value) } }))} /></Field>
                </div>
                <div className="grid-auto">
                  <Field label="صورة العنصر"><Input value={itemForms[section.id]?.image_url || ''} onChange={(event) => setItemForms((current) => ({ ...current, [section.id]: { ...(current[section.id] || blankItem), image_url: event.target.value } }))} /></Field>
                  <Field label="صورة الموبايل"><Input value={itemForms[section.id]?.mobile_image_url || ''} onChange={(event) => setItemForms((current) => ({ ...current, [section.id]: { ...(current[section.id] || blankItem), mobile_image_url: event.target.value } }))} /></Field>
                  <Field label="رابط الضغط"><Input value={itemForms[section.id]?.link_url || ''} onChange={(event) => setItemForms((current) => ({ ...current, [section.id]: { ...(current[section.id] || blankItem), link_url: event.target.value } }))} /></Field>
                </div>
                <Button type="submit" variant="secondary">إضافة عنصر</Button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminHomepageBuilder;
