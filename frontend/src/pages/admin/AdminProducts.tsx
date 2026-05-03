import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, ErrorState, LoadingState } from '../../components/ui';
import { adminGenderLabel, adminStatusLabel } from '../../utils/adminLabels';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasLoadedRef = useRef(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    adminApi.products.list()
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message || 'تعذر تحميل المنتجات'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    load();
  }, [load]);

  const retry = useCallback(() => {
    hasLoadedRef.current = false;
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
        <Card tone="strong">
          <DataTable rows={products} columns={columns} cardTitle={(product) => product.name_ar} />
        </Card>
      )}
    </AdminPageShell>
  );
};

export default AdminProducts;
