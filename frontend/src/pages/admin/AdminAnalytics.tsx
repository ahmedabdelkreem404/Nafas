import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Card, ErrorState } from '../../components/ui';
import { formatCurrency } from '../../utils/format';

function AnalyticsSkeleton() {
  return (
    <div className="admin-analytics-skeleton" aria-label="جاري تحميل التحليلات">
      <div className="kpi-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="kpi-card admin-skeleton-card">
            <div className="loading-bar" />
            <div className="loading-bar loading-bar--lg" />
          </div>
        ))}
      </div>
      <div className="grid-auto">
        <Card tone="strong" className="stack admin-skeleton-card">
          <strong>المبيعات عبر الزمن</strong>
          <div className="loading-bar loading-bar--lg" />
          <div className="loading-bar" />
          <div className="loading-bar" />
        </Card>
        <Card tone="strong" className="stack admin-skeleton-card">
          <strong>أفضل المنتجات</strong>
          <div className="loading-bar loading-bar--lg" />
          <div className="loading-bar" />
          <div className="loading-bar" />
        </Card>
      </div>
    </div>
  );
}

const AdminAnalytics: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminApi.analytics.sales(), adminApi.analytics.products()])
      .then(([salesRes, productsRes]) => {
        setSales(salesRes.data || []);
        setTopProducts(productsRes.data || []);
      })
      .catch((err) => setError(err.message || 'تعذّر تحميل التحليلات'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminPageShell eyebrow="التحليلات" title="تحليلات المبيعات" description="عرض عملي سريع للمبيعات والمنتجات الأعلى حركة." >
      {loading ? <AnalyticsSkeleton /> : error ? <ErrorState message={error} /> : (
        <div className="grid-auto">
          <Card tone="strong" className="stack">
            <strong>المبيعات عبر الزمن</strong>
            {(sales || []).map((entry) => <div key={entry.date} className="data-card__row"><span>{entry.date}</span><strong>{formatCurrency(entry.total)}</strong></div>)}
          </Card>
          <Card tone="strong" className="stack">
            <strong>أفضل المنتجات</strong>
            {(topProducts || []).map((entry) => <div key={entry.name_en} className="data-card__row"><span>{entry.name_ar || entry.name_en || 'منتج من نفس'}</span><strong>{entry.total_sold}</strong></div>)}
          </Card>
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminAnalytics;
