import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authApi } from '../api/authApi';
import ProductMedia from '../components/ProductMedia';
import { useLocale } from '../context/LocaleContext';
import type { Order } from '../types/store';
import { formatCurrency, formatDate } from '../utils/format';
import { normalizeOrder } from '../utils/orders';

export default function AccountOrderDetail() {
  const { id = '' } = useParams();
  const { locale } = useLocale();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    authApi.myOrder(id)
      .then((response) => setOrder(normalizeOrder(response.data.data || response.data.order || response.data)))
      .catch(() => setOrder(null));
  }, [id]);

  if (!order) {
    return (
      <div className="n-container n-section">
        <div className="empty-panel">{locale === 'ar' ? 'تعذر تحميل الطلب.' : 'Unable to load the order.'}</div>
      </div>
    );
  }

  return (
    <div className="n-container n-section">
      <div className="summary-card">
        <h1 className="mono">{order.order_number}</h1>
        <p>{formatDate(order.created_at, locale)}</p>
        <span className="status-pill">{order.status || (locale === 'ar' ? 'قيد المراجعة' : 'Pending')}</span>
        <div className="summary-items">
          {(order.items || []).map((item, index) => (
            <article key={item.id || index} className="summary-item">
              <div className="summary-item__thumb">
                {item.product ? (
                  <ProductMedia
                    product={item.product}
                    alt={item.product_name || item.product.name_ar || item.product.name_en}
                  />
                ) : null}
              </div>
              <div>
                <strong>{item.product_name || item.product?.name_ar || item.product?.name_en}</strong>
                <p>{item.variant_label || item.variant?.label} × {item.quantity}</p>
              </div>
              <strong>{formatCurrency(item.total_price || ((item.unit_price || 0) * item.quantity), locale)}</strong>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
