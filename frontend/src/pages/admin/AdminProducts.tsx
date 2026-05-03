import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, ErrorState, Field, Input, LoadingState, Select } from '../../components/ui';
import { adminGenderLabel, adminStatusLabel } from '../../utils/adminLabels';

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
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message || 'تعذر تحميل المنتجات'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    adminApi.catalogs.listSafe().then((res) => setCatalogs(res.data?.data || [])).catch(() => setCatalogs([]));
  }, []);

  const retry = useCallback(() => {
    load();
  }, [load]);

  const removeProduct = useCallback((productId: number | string) => {
    adminApi.products.delete(productId)
      .then(load)
      .catch((err) => setError(err.message || 'تعذر حذف المنتج'));
  }, [load]);

  const columns = useMemo(() => [
    {
      key: 'name',
      header: 'المنتج',
      cell: (product: any) => (
        <div className="stack" style={{ gap: '0.2rem' }}>
          <strong>{product.name_ar}</strong>
          <span className="copy-muted">{product.code}</span>
        </div>
      ),
    },
    { key: 'type', header: 'نوع المنتج', cell: (product: any) => product.public_label_ar || product.product_type || 'منتج' },
    { key: 'code', header: 'الكود', cell: (product: any) => product.code },
    { key: 'status', header: 'الحالة', cell: (product: any) => <Badge tone={product.status === 'active' ? 'success' : 'muted'}>{adminStatusLabel(product.status)}</Badge> },
    { key: 'gender', header: 'الفئة', cell: (product: any) => adminGenderLabel(product.gender) },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (product: any) => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to={`/admin/products/${product.id}/edit`}><Button size="sm" variant="secondary">تعديل</Button></Link>
          <Link to={`/admin/products/${product.id}/variants`}><Button size="sm" variant="ghost">الأحجام</Button></Link>
          <Link to={`/admin/products/${product.id}/media`}><Button size="sm" variant="ghost">الصور</Button></Link>
          <Button size="sm" variant="danger" onClick={() => removeProduct(product.id)}>حذف</Button>
        </div>
      ),
    },
  ], [removeProduct]);

  return (
    <AdminPageShell
      eyebrow="الكتالوج"
      title="إدارة المنتجات"
      description="راجع أسماء المنتجات وحالاتها وأكوادها قبل نشرها في المتجر."
      actions={<Link to="/admin/products/create"><Button>إضافة منتج</Button></Link>}
    >
      {loading ? (
        <LoadingState label="جاري تحميل المنتجات..." />
      ) : error ? (
        <ErrorState
          title="تعذر تحميل المنتجات"
          message={error}
          action={<Button variant="secondary" onClick={retry}>إعادة المحاولة</Button>}
        />
      ) : !products.length ? (
        <EmptyState
          title="لا توجد منتجات"
          description="أضف أول منتج إلى الكتالوج."
          action={<Link to="/admin/products/create"><Button>إضافة منتج</Button></Link>}
        />
      ) : (
        <div className="stack">
          <Card tone="strong">
            <div className="grid-auto">
              <Field label="بحث"><Input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></Field>
              <Field label="الحالة"><Select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">الكل</option><option value="active">نشط</option><option value="hidden">مخفي</option><option value="draft">مسودة</option></Select></Field>
              <Field label="نوع المنتج"><Select value={filters.product_type} onChange={(event) => setFilters({ ...filters, product_type: event.target.value })}><option value="">كل الأنواع</option><option value="nafas_signature">كولكشن نفس</option><option value="special_blend">تركيبة خاصة</option><option value="tester">عينات</option><option value="gift_box">هدايا</option><option value="discovery_set">مجموعة تجربة</option></Select></Field>
              <Field label="الكتالوج"><Select value={filters.catalog} onChange={(event) => setFilters({ ...filters, catalog: event.target.value })}><option value="">كل الكتالوجات</option>{catalogs.map((catalog) => <option key={catalog.slug} value={catalog.slug}>{catalog.name_ar}</option>)}</Select></Field>
            </div>
          </Card>
          <Card tone="strong">
            <DataTable rows={products} columns={columns} cardTitle={(product) => product.name_ar} />
          </Card>
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminProducts;
