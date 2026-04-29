import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { publicApi } from '../api/publicApi';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useLocale } from '../context/LocaleContext';
import { storeAuthSession } from '../utils/auth';
import { BRAND_LOGO } from '../utils/brand';

function getGuestItems() {
  try {
    return JSON.parse(localStorage.getItem('nafas_cart') || '[]').map((item: any) => ({
      quantity: item.quantity,
      variant_id: item.variant?.id || item.product_variant_id,
    })).filter((item: { variant_id?: number }) => Boolean(item.variant_id));
  } catch {
    return [];
  }
}

export default function Register() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={async (event) => {
          event.preventDefault();
          if (password !== confirm) {
            setError(locale === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
            return;
          }

          setError('');

          try {
            const response = await authApi.register({ name, email, password });
            const token = response.data.token || response.data.data?.token;
            const user = response.data.user || response.data.data?.user;

            storeAuthSession(token, user);

            const guestItems = getGuestItems();
            if (guestItems.length) {
              await publicApi.mergeCart(guestItems);
            }

            navigate('/account');
          } catch (err: any) {
            setError(err.message || (locale === 'ar' ? 'تعذّر إنشاء الحساب.' : 'Unable to create the account.'));
          }
        }}
      >
        <img src={BRAND_LOGO} alt="نفَس" className="auth-card__brand" />
        <h1>{locale === 'ar' ? 'إنشاء حساب' : 'Create account'}</h1>

        <label>
          <span>{locale === 'ar' ? 'الاسم' : 'Name'}</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>

        <label>
          <span>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>

        <label>
          <span>{locale === 'ar' ? 'كلمة المرور' : 'Password'}</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        <label>
          <span>{locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm password'}</span>
          <input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
        </label>

        <button type="submit" className="n-btn n-btn--primary">
          {locale === 'ar' ? 'إنشاء الحساب' : 'Create account'}
        </button>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="auth-divider" aria-hidden="true">
          <span />
          <b>{locale === 'ar' ? 'أو' : 'or'}</b>
          <span />
        </div>

        <GoogleAuthButton />

        <p>
          {locale === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link to="/login">{locale === 'ar' ? 'سجّل الدخول' : 'Sign in'}</Link>
        </p>
      </form>
    </div>
  );
}
