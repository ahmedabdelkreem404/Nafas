import React, { useEffect, useState } from 'react';
import client from '../../api/client';
import { AdminPageShell, Card, ErrorState, LoadingState } from '../../components/ui';
import { formatCurrency } from '../../utils/format';

const AdminAnalytics: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([client.get('/admin/analytics/sales'), client.get('/admin/analytics/products')])
      .then(([salesRes, productsRes]) => {
        setSales(salesRes.data || []);
        setTopProducts(productsRes.data || []);
      })
      .catch((err) => setError(err.message || 'تعذّر تحميل التحليلات'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminPageShell eyebrow="Analytics" title="تحليلات المبيعات" description="عرض عملي سريع للمبيعات والمنتجات الأعلى حركة." >
      {loading ? <LoadingState label="جاري تحميل التحليلات..." /> : error ? <ErrorState message={error} /> : (
        <div className="grid-auto">
          <Card tone="strong" className="stack">
            <strong>المبيعات عبر الزمن</strong>
            {(sales || []).map((entry) => <div key={entry.date} className="data-card__row"><span>{entry.date}</span><strong>{formatCurrency(entry.total)}</strong></div>)}
          </Card>
          <Card tone="strong" className="stack">
            <strong>أفضل المنتجات</strong>
            {(topProducts || []).map((entry) => <div key={entry.name_en} className="data-card__row"><span>{entry.name_en}</span><strong>{entry.total_sold}</strong></div>)}
          </Card>
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminAnalytics;
