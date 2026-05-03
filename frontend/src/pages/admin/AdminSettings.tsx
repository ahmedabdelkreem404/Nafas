import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Button, Card, EmptyState, Field, Input, LoadingState, Select, Textarea } from '../../components/ui';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [newSetting, setNewSetting] = useState({ key: '', value: '', type: 'string' });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.settings.list().then((res) => setSettings(res.data || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <AdminPageShell eyebrow="الإعدادات" title="إعدادات الموقع" description="مفاتيح المحتوى والإعدادات العامة داخل واجهة مرتبة وقابلة للتعديل السريع.">
      <Card tone="strong">
        <form className="stack" onSubmit={(event) => {
          event.preventDefault();
          adminApi.settings.create(newSetting).then(() => { setNewSetting({ key: '', value: '', type: 'string' }); load(); });
        }}>
          <div className="grid-auto">
            <Field label="المفتاح"><Input value={newSetting.key} onChange={(event) => setNewSetting({ ...newSetting, key: event.target.value })} /></Field>
            <Field label="القيمة"><Input value={newSetting.value} onChange={(event) => setNewSetting({ ...newSetting, value: event.target.value })} /></Field>
            <Field label="النوع">
              <Select value={newSetting.type} onChange={(event) => setNewSetting({ ...newSetting, type: event.target.value })}>
                <option value="string">نص</option>
                <option value="number">رقم</option>
                <option value="boolean">تشغيل / إيقاف</option>
                <option value="json">بيانات منظمة</option>
              </Select>
            </Field>
          </div>
          <Button type="submit">إضافة إعداد</Button>
        </form>
      </Card>

      {loading ? <LoadingState label="جاري تحميل الإعدادات..." /> : !settings.length ? <EmptyState title="لا توجد إعدادات" description="أنشئ أول إعداد عام من هنا." /> : (
        <div className="stack">
          {settings.map((setting) => (
            <Card key={setting.id} tone="strong" className="stack">
              <div className="data-card__title">{setting.key}</div>
              <Field label="القيمة">
                {String(setting.value || '').length > 120 ? <Textarea value={setting.value || ''} onChange={(event) => setSettings((current) => current.map((entry) => entry.id === setting.id ? { ...entry, value: event.target.value } : entry))} /> : <Input value={setting.value || ''} onChange={(event) => setSettings((current) => current.map((entry) => entry.id === setting.id ? { ...entry, value: event.target.value } : entry))} />}
              </Field>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button onClick={() => adminApi.settings.update(setting.id, { value: setting.value }).then(load)}>حفظ</Button>
                <Button variant="danger" onClick={() => adminApi.settings.delete(setting.id).then(load)}>حذف</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminSettings;
