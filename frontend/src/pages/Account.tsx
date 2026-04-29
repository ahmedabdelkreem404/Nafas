import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useLocale } from '../context/LocaleContext';
import type { StoredUser } from '../types/store';
import { getStoredUser, storeAuthSession } from '../utils/auth';
import { formatCurrency, formatDate, formatNumber } from '../utils/format';

export default function Account() {
  const { locale } = useLocale();
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());
  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'N';

  useEffect(() => {
    authApi.me()
      .then((response) => {
        const nextUser = response.data.user || response.data.data?.user || response.data.data || response.data;
        if (!nextUser) {
          return;
        }

        const token = localStorage.getItem('token');
        if (token) {
          storeAuthSession(token, nextUser);
        }

        setUser(nextUser);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="n-container n-section">
      <div className="page-head page-head--compact">
        <small>{locale === 'ar' ? 'الحساب' : 'Account'}</small>
        <div className="account-hero">
          <div className="account-hero__avatar">
            {user?.profile_picture ? <img src={user.profile_picture} alt={user.name} /> : <span>{initials}</span>}
          </div>
          <div className="account-hero__copy">
            <h1>{locale === 'ar' ? `مرحباً ${user?.name || 'بعودتك'}، أهلاً بعودتك` : `Welcome back, ${user?.name || 'friend'}`}</h1>
            <p>{user?.email || (locale === 'ar' ? 'لا يوجد بريد محفوظ' : 'No saved email')}</p>
          </div>
        </div>

        <div className="account-stats">
          <div className="account-stats__item">
            <small>{locale === 'ar' ? 'إجمالي الطلبات' : 'Total orders'}</small>
            <strong>{formatNumber(user?.customer?.total_orders || 0, locale)}</strong>
          </div>
          <div className="account-stats__item">
            <small>{locale === 'ar' ? 'إجمالي الإنفاق' : 'Total spent'}</small>
            <strong>{formatCurrency(user?.customer?.total_spent || 0, locale)}</strong>
          </div>
          <div className="account-stats__item">
            <small>{locale === 'ar' ? 'آخر طلب' : 'Last order'}</small>
            <strong>
              {user?.customer?.last_order_at
                ? formatDate(user.customer.last_order_at, locale)
                : (locale === 'ar' ? 'لا يوجد بعد' : 'No orders yet')}
            </strong>
          </div>
        </div>
      </div>

      <div className="account-grid">
        <article className="summary-card">
          <h2>{locale === 'ar' ? 'بياناتي' : 'My profile'}</h2>
          <p>{user?.email || (locale === 'ar' ? 'لا يوجد بريد محفوظ' : 'No saved email')}</p>
        </article>

        <article className="summary-card">
          <h2>{locale === 'ar' ? 'طلباتي' : 'My orders'}</h2>
          <p>{locale === 'ar' ? 'راجع الحالة وتفاصيل كل طلب من مكان واحد.' : 'Review the status and details of every order in one place.'}</p>
          <Link to="/account/orders" className="n-btn n-btn--ghost">
            {locale === 'ar' ? 'عرض الطلبات' : 'View orders'}
          </Link>
        </article>
      </div>
    </div>
  );
}
