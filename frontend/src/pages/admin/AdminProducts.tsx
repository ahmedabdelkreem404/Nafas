import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Button, Card, DataTable, EmptyState, ErrorState, LoadingState } from '../../components/ui';

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
      .catch((err) => setError(err.message || '????? ????? ????????'))
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
      .catch((err) => setError(err.message || '????? ??? ??????'));
  }, [load]);

  const columns = useMemo(() => [
    {
      key: 'name',
      header: '??????',
      cell: (product: any) => (
        <div className="stack" style={{ gap: '0.2rem' }}>
          <strong>{product.name_ar}</strong>
          <span className="copy-muted">{product.name_en}</span>
        </div>
      ),
    },
    { key: 'code', header: '?????', cell: (product: any) => product.code },
    { key: 'status', header: '??????', cell: (product: any) => <Badge tone={product.status === 'active' ? 'success' : 'muted'}>{product.status}</Badge> },
    { key: 'gender', header: '?????', cell: (product: any) => product.gender },
    {
      key: 'actions',
      header: '???????',
      cell: (product: any) => (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to={`/admin/products/${product.id}/edit`}><Button size="sm" variant="secondary">?????</Button></Link>
          <Link to={`/admin/products/${product.id}/variants`}><Button size="sm" variant="ghost">???????</Button></Link>
          <Link to={`/admin/products/${product.id}/media`}><Button size="sm" variant="ghost">???????</Button></Link>
          <Button size="sm" variant="danger" onClick={() => removeProduct(product.id)}>???</Button>
        </div>
      ),
    },
  ], [removeProduct]);

  return (
    <AdminPageShell
      eyebrow="Catalog"
      title="????? ????????"
      description="????? ????? ????? ????? ??? ???????? ???? ??????? ?? ?????? ????? ??? ??????? ???????? ????????."
      actions={<Link to="/admin/products/create"><Button>????? ????</Button></Link>}
    >
      {loading ? (
        <LoadingState label="???? ????? ????????..." />
      ) : error ? (
        <ErrorState
          title="????? ????? ????????"
          message={error}
          action={<Button variant="secondary" onClick={retry}>????? ????????</Button>}
        />
      ) : !products.length ? (
        <EmptyState
          title="?? ???? ??????"
          description="???? ?????? ??? ???? ?? ????????."
          action={<Link to="/admin/products/create"><Button>????? ????</Button></Link>}
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
