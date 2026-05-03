import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, EmptyState, ErrorState, Field, Input, LoadingState, Select } from '../../components/ui';
import { adminGenderLabel, adminStatusLabel } from '../../utils/adminLabels';

const productTypeLabel: Record<string, string> = {
  nafas_signature: 'كولكشن نفس',
  special_blend: 'تركيبة خاصة',
  inspired_blend: 'تركيبة خارجية',
  tester: 'عينة',
  gift_box: 'بوكس هدية',
  discovery_set: 'مجموعة تجربة',
  raw_oil: 'زيت خام',
  other: 'منتج آخر',
};

function normalizeAdminListResponse(responseData: any) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.products)) return responseData.products;
  return [];
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '', product_type: '', catalog: '' });
  const [catalogs, setCatalogs] = useState<any[]>([]);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value)) as Record<string, string>;
    adminApi.products.list(params)
      .then((res) => setProducts(normalizeAdminListResponse(res.data)))
      .catch((err) => setError(err.message || 'تعذر تحميل المنتجات.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    adminApi.catalogs.listSafe().then((res) => setCatalogs(res.data?.data || [])).catch(() => setCatalogs([]));
  }, []);

  const counts = useMemo(() => ({
    active: products.filter((product) => product.status === 'active').length,
    hidden: products.filter((product) => product.status === 'hidden').length,
    featured: products.filter((product) => product.is_featured).length,
  }), [products]);

  const removeProduct = useCallback((productId: number | string) => {
    if (!window.confirm('هل تريد حذف هذا المنتج؟')) return;
    adminApi.products.delete(productId)
      .then(load)
      .catch((err) => setError(err.message || 'تعذر حذف المنتج.'));
  }, [load]);

  return (
    <AdminPageShell
      eyebrow="المنتجات"
      title="إدارة منتجات نفَس"
      description="تحكم في منتجات الكولكشن، التركيبات الخاصة، العينات، الهدايا، الصور، الأحجام، وحالة الظهور."
      actions={<Link to="/admin/products/create"><Button>إضافة منتج</Button></Link>}
    >
      {error ? <ErrorState title="تعذر تحميل المنتجات" message={error} action={<Button variant="secondary" onClick={load}>إعادة المحاولة</Button>} /> : null}

      <div className="grid-auto">
        <Card tone="strong"><div className="data-card__row"><span>إجمالي المنتجات</span><strong>{products.length}</strong></div></Card>
        <Card tone="strong"><div className="data-card__row"><span>منتجات ظاهرة</span><strong>{counts.active}</strong></div></Card>
        <Card tone="strong"><div className="data-card__row"><span>منتجات مخفية</span><strong>{counts.hidden}</strong></div></Card>
        <Card tone="strong"><div className="data-card__row"><span>منتجات مميزة</span><strong>{counts.featured}</strong></div></Card>
      </div>

      <Card tone="strong">
        <div className="grid-auto">
          <Field label="بحث"><Input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="اسم المنتج، الكود، أو الرابط" /></Field>
          <Field label="الحالة">
            <Select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
              <option value="">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="hidden">مخفي</option>
              <option value="draft">مسودة</option>
              <option value="out_of_stock">نفد المخزون</option>
            </Select>
          </Field>
          <Field label="نوع المنتج">
            <Select value={filters.product_type} onChange={(event) => setFilters({ ...filters, product_type: event.target.value })}>
              <option value="">كل الأنواع</option>
              {Object.entries(productTypeLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </Field>
          <Field label="الكتالوج">
            <Select value={filters.catalog} onChange={(event) => setFilters({ ...filters, catalog: event.target.value })}>
              <option value="">كل الكتالوجات</option>
              {catalogs.map((catalog) => <option key={catalog.slug} value={catalog.slug}>{catalog.name_ar}</option>)}
            </Select>
          </Field>
        </div>
      </Card>

      {loading ? (
        <LoadingState label="جاري تحميل المنتجات..." />
      ) : !products.length ? (
        <EmptyState title="لا توجد منتجات" description="أضف أول منتج أو عدل الفلاتر الحالية." action={<Link to="/admin/products/create"><Button>إضافة منتج</Button></Link>} />
      ) : (
        <div className="admin-product-list">
          {products.map((product) => (
            <Card key={product.id} tone="strong" className="admin-product-card">
              <div className="admin-product-card__main">
                <div className="admin-product-card__thumb">
                  {product.card_image_url || product.hero_image_url || product.media?.[0]?.url ? (
                    <img src={product.card_image_url || product.hero_image_url || product.media?.[0]?.url} alt={product.name_ar || product.name_en} />
                  ) : (
                    <span>{(product.name_ar || product.name_en || 'ن')[0]}</span>
                  )}
                </div>
                <div className="admin-product-card__body">
                  <div className="admin-product-card__title-row">
                    <div>
                      <h2>{product.name_ar || product.name_en}</h2>
                      <p>{product.name_en} · {product.code}</p>
                    </div>
                    <Badge tone={product.status === 'active' ? 'success' : 'muted'}>{adminStatusLabel(product.status)}</Badge>
                  </div>
                  <div className="admin-product-card__meta">
                    <span>{product.public_label_ar || productTypeLabel[product.product_type] || 'منتج'}</span>
                    <span>{adminGenderLabel(product.gender)}</span>
                    <span>{product.variants?.length || 0} حجم</span>
                    <span>{product.media?.length || 0} وسيط</span>
                  </div>
                </div>
              </div>
              <div className="admin-product-card__actions">
                <Link to={`/admin/products/${product.id}/edit`}><Button size="sm" variant="secondary">تعديل</Button></Link>
                <Link to={`/admin/products/${product.id}/variants`}><Button size="sm" variant="ghost">الأحجام</Button></Link>
                <Link to={`/admin/products/${product.id}/media`}><Button size="sm" variant="ghost">الصور والفيديو</Button></Link>
                <Button size="sm" variant="danger" onClick={() => removeProduct(product.id)}>حذف</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminProducts;
