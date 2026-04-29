import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useLocale } from '../context/LocaleContext';
import type { Order } from '../types/store';
import { formatCurrency, formatDate } from '../utils/format';
import { normalizeOrders } from '../utils/orders';

export default function AccountOrders() {
  const { locale } = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    authApi.myOrders()
      .then((response) => setOrders(normalizeOrders(response.data.data || response.data.orders || response.data || [])))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="n-container n-section">
      <div className="page-head page-head--compact">
        <small>{locale === 'ar' ? 'الطلبات' : 'Orders'}</small>
        <h1>{locale === 'ar' ? 'كل الطلبات السابقة' : 'All past orders'}</h1>
      </div>
      <div className="orders-list">
        {orders.length ? orders.map((order) => (
          <article key={order.id || order.order_number} className="order-card">
            <div>
              <strong className="mono">{order.order_number}</strong>
              <p>{formatDate(order.created_at, locale)}</p>
            </div>
            <div>
              <span className="status-pill">{order.status || (locale === 'ar' ? 'قيد المراجعة' : 'Pending')}</span>
              <strong>{formatCurrency(order.total || 0, locale)}</strong>
            </div>
            <Link to={`/account/orders/${order.id || order.order_number}`} className="inline-link">
              {locale === 'ar' ? 'التفاصيل' : 'Details'}
            </Link>
          </article>
        )) : <div className="empty-panel">{locale === 'ar' ? 'لا توجد طلبات بعد.' : 'No orders yet.'}</div>}
      </div>
    </div>
  );
}
