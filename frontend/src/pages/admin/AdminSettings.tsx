import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Button, Card, EmptyState, Field, Input, LoadingState, Select, Textarea } from '../../components/ui';
import { useNotifications } from '../../hooks/useNotifications';

const settingGroups = [
  {
    fields: [
      ['brand_name_ar', 'اسم البراند عربي'],
      ['brand_name_en', 'اسم البراند إنجليزي'],
      ['brand_subtitle_ar', 'وصف قصير عربي'],
      ['brand_subtitle_en', 'وصف قصير إنجليزي'],
      ['logo_url', 'رابط اللوجو'],
      ['icon_url', 'رابط الأيقونة'],
    ],
    title: 'هوية البراند',
  },
  {
    fields: [
      ['whatsapp_url', 'رابط واتساب'],
      ['instagram_url', 'رابط إنستجرام'],
      ['vodafone_cash_number', 'رقم فودافون كاش'],
      ['instapay_handle', 'حساب إنستاباي'],
    ],
    title: 'التواصل والدفع',
  },
  {
    fields: [
      ['footer_title_ar', 'عنوان الفوتر عربي'],
      ['footer_title_en', 'عنوان الفوتر إنجليزي'],
      ['footer_brand_ar', 'نص الفوتر عربي'],
      ['footer_brand_en', 'نص الفوتر إنجليزي'],
      ['footer_note_ar', 'ملاحظة الثقة عربي'],
      ['footer_note_en', 'ملاحظة الثقة إنجليزي'],
    ],
    title: 'الفوتر والثقة',
  },
];

const AdminSettings: React.FC = () => {
  const { notifyError, notifySuccess } = useNotifications();
  const [settings, setSettings] = useState<any[]>([]);
  const [newSetting, setNewSetting] = useState({ key: '', value: '', type: 'string' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [savingKey, setSavingKey] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.settings.list().then((res) => setSettings(res.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const findSetting = (key: string) => settings.find((setting) => setting.key === key);

  const setSettingValue = (key: string, value: string) => {
    setSettings((current) => {
      const existing = current.find((setting) => setting.key === key);
      if (existing) {
        return current.map((setting) => setting.key === key ? { ...setting, value } : setting);
      }

      return [...current, { id: `new-${key}`, key, type: 'string', value }];
    });
  };

  const saveSettingKey = (key: string) => {
    const setting = findSetting(key);
    if (!setting) return;

    setSavingKey(key);
    setMessage('');

    const request = String(setting.id).startsWith('new-')
      ? adminApi.settings.create({ key, type: setting.type || 'string', value: setting.value || '' })
      : adminApi.settings.update(setting.id, { value: setting.value || '' });

    request
      .then(() => {
        setMessage('تم حفظ الإعداد.');
        notifySuccess('تم حفظ الإعداد', 'التغيير أصبح جاهزًا للاستخدام في الواجهة.');
        load();
      })
      .catch(() => {
        setMessage('تعذر حفظ الإعداد. تأكد من أن المفتاح غير مكرر.');
        notifyError('تعذر حفظ الإعداد', 'راجع القيمة أو المفتاح ثم حاول مرة أخرى.');
      })
      .finally(() => setSavingKey(''));
  };

  return (
    <AdminPageShell eyebrow="الإعدادات" title="إعدادات الموقع" description="تحكم في هوية البراند، بيانات التواصل، الدفع، والفوتر بدون تعديل الكود.">
      {message ? <Card tone="strong"><strong>{message}</strong></Card> : null}

      {loading ? (
        <LoadingState label="جاري تحميل الإعدادات..." />
      ) : (
        <div className="stack">
          {settingGroups.map((group) => (
            <Card key={group.title} tone="strong" className="stack">
              <div className="data-card__title">{group.title}</div>
              <div className="grid-auto">
                {group.fields.map(([key, label]) => {
                  const setting = findSetting(key);
                  const value = setting?.value || '';
                  const isLong = key.includes('footer_') && !key.includes('title');

                  return (
                    <Field key={key} label={label}>
                      {isLong ? (
                        <Textarea value={value} onChange={(event) => setSettingValue(key, event.target.value)} />
                      ) : (
                        <Input value={value} onChange={(event) => setSettingValue(key, event.target.value)} />
                      )}
                      <Button size="sm" variant="secondary" type="button" disabled={savingKey === key} onClick={() => saveSettingKey(key)}>
                        {savingKey === key ? 'جاري الحفظ...' : 'حفظ'}
                      </Button>
                    </Field>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card tone="strong">
        <form className="stack" onSubmit={(event) => {
          event.preventDefault();
          adminApi.settings.create(newSetting).then(() => {
            setNewSetting({ key: '', value: '', type: 'string' });
            notifySuccess('تمت إضافة الإعداد', 'يمكنك استخدامه الآن في الموقع أو الداشبورد.');
            load();
          }).catch(() => notifyError('تعذر إضافة الإعداد', 'تأكد من كتابة المفتاح والقيمة بشكل صحيح.'));
        }}>
          <div className="data-card__title">إعداد مخصص</div>
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

      {!loading && !settings.length ? (
        <EmptyState title="لا توجد إعدادات" description="أنشئ أول إعداد عام من هنا." />
      ) : null}
    </AdminPageShell>
  );
};

export default AdminSettings;
