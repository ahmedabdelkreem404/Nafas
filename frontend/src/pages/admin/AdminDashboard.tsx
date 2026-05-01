import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminPageShell, Badge, Card, ErrorState, LoadingState } from '../../components/ui';
import { formatCurrency, formatNumber } from '../../utils/format';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getDashboard()
      .then((response) => setStats(response.data))
      .catch((err) => setError(err.message || 'تعذّر تحميل لوحة التحكم'));
  }, []);

  if (error) {
    return (
      <AdminPageShell eyebrow="Dashboard" title="لوحة التحكم" description="">
        <ErrorState message={error} />
      </AdminPageShell>
    );
  }

  if (!stats) {
    return (
      <AdminPageShell eyebrow="Dashboard" title="لوحة التحكم" description="">
        <LoadingState label="جاري تحميل لوحة التحكم..." />
      </AdminPageShell>
    );
  }

  const alerts = [
    ...(stats.critical_stock || []).map((variant: any) => ({ ...variant, tone: 'danger', label: 'تحذير: مخزون حرج' })),
    ...(stats.low_stock || []).map((variant: any) => ({ ...variant, tone: 'gold', label: 'تنبيه: مخزون منخفض' })),
  ];

  return (
    <AdminPageShell eyebrow="Dashboard" title="نظرة تشغيلية سريعة" description="لوحة أوضح للإيراد، الطلبات، المخزون، وأهم المنتجات مبيعًا هذا الشهر.">
      <div className="kpi-grid">
        {[
          { label: 'إيرادات اليوم', value: formatCurrency(stats.today_revenue || 0) },
          { label: 'إيرادات الشهر', value: formatCurrency(stats.month_revenue || 0) },
          { label: 'متوسط قيمة الطلب', value: formatCurrency(stats.average_order_value || 0) },
          { label: 'عدد الطلبات الجديدة', value: formatNumber(stats.new_orders_count || 0) },
        ].map((item) => (
          <div key={item.label} className="kpi-card">
            <div className="kpi-card__label">{item.label}</div>
            <div className="kpi-card__value">{item.value}</div>
          </div>
        ))}
      </div>

      {alerts.length ? (
        <Card tone="strong" className="stack">
          <strong>تنبيهات التشغيل</strong>
          <div className="stack">
            {alerts.map((variant: any) => (
              <Link key={`${variant.tone}-${variant.id}`} to="/admin/inventory" className="data-card__row">
                <div>
                  <strong>{variant.label}</strong>
                  <div className="copy-muted">{variant.product?.name_ar || variant.product?.name_en} · {variant.sku}</div>
                </div>
                <Badge tone={variant.tone}>{variant.stock_quantity}</Badge>
              </Link>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="grid-auto">
        <Card tone="strong" className="stack">
          <strong>آخر 5 طلبات</strong>
          {(stats.recent_orders || []).map((order: any) => (
            <div key={order.id} className="data-card__row">
              <div>
                <strong>{order.order_number}</strong>
                <div className="copy-muted">{order.customer_name || order.customer?.name || 'Guest'}</div>
              </div>
              <div style={{ textAlign: 'end' }}>
                <Badge tone={order.status === 'delivered' ? 'success' : 'gold'}>{order.status}</Badge>
                <div className="copy-muted">{formatCurrency(order.total_amount || order.total || 0)}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card tone="strong" className="stack">
          <strong>أفضل 5 منتجات هذا الشهر</strong>
          {(stats.top_products_month || []).map((product: any) => (
            <div key={product.id} className="data-card__row">
              <div>
                <strong>{product.name_ar || product.name_en}</strong>
                <div className="copy-muted">{product.name_en}</div>
              </div>
              <Badge tone="success">{formatNumber(product.sales_count || 0)}</Badge>
            </div>
          ))}
        </Card>
      </div>

      <div className="grid-auto">
        <Link to="/admin/orders" className="ui-button ui-button--secondary ui-button--md">الطلبات</Link>
        <Link to="/admin/products/create" className="ui-button ui-button--secondary ui-button--md">إضافة منتج</Link>
        <Link to="/admin/inventory" className="ui-button ui-button--secondary ui-button--md">المخزون</Link>
        <Link to="/admin/coupons" className="ui-button ui-button--secondary ui-button--md">الكوبونات</Link>
        <Link to="/admin/quality" className="ui-button ui-button--secondary ui-button--md">الجودة</Link>
      </div>
    </AdminPageShell>
  );
};

export default AdminDashboard;
