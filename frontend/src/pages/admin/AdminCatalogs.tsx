import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, EmptyState } from '../../components/ui';

type Catalog = {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  is_active: boolean;
  sort_order: number;
  products?: Array<{ id: number; name_ar: string; name_en: string; slug: string }>;
};

const AdminCatalogs: React.FC = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const load = () => adminApi.catalogs.list()
    .then((response) => setCatalogs(response.data?.data || []))
    .catch(() => setMessage('تعذر تحميل الكتالوجات.'));

  useEffect(() => { load(); }, []);

  return (
    <AdminPageShell eyebrow="الكتالوجات" title="إدارة الكتالوجات والمجموعات" description="أنشئ مجموعات مستقبلية واربط بها منتجات نفس بدون تعديل الكود.">
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button onClick={() => navigate('/admin/catalogs/create')}>إضافة كتالوج</Button>
      </div>
      {message && <Card tone="strong"><strong>{message}</strong></Card>}
      {!catalogs.length ? <EmptyState title="لا توجد كتالوجات" description="أضف أول كتالوج أو شغل seeder." /> : (
        <div className="grid-auto">
          {catalogs.map((catalog) => (
            <Card key={catalog.id} tone="strong" className="stack">
              <div className="data-card__row">
                <div>
                  <strong>{catalog.name_ar}</strong>
                  <div className="copy-muted">/{catalog.slug}</div>
                </div>
                <Badge tone={catalog.is_active ? 'success' : 'muted'}>{catalog.is_active ? 'ظاهر' : 'مخفي'}</Badge>
              </div>
              <p className="copy-muted">{catalog.products?.length || 0} منتج داخل الكتالوج</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button onClick={() => navigate(`/admin/catalogs/${catalog.id}/edit`)} variant="secondary">تعديل</Button>
                <Button variant="danger" onClick={() => adminApi.catalogs.delete(catalog.id).then(load)}>حذف</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminCatalogs;
