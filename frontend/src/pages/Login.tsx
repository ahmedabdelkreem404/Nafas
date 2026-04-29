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

export default function Login() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={async (event) => {
          event.preventDefault();
          setError('');

          try {
            const response = await authApi.login({ email, password });
            const token = response.data.token || response.data.data?.token;
            const user = response.data.user || response.data.data?.user;

            storeAuthSession(token, user);

            const guestItems = getGuestItems();
            if (guestItems.length) {
              await publicApi.mergeCart(guestItems);
            }

            navigate('/account');
          } catch (err: any) {
            setError(err.message || (locale === 'ar' ? 'تعذّر تسجيل الدخول.' : 'Unable to sign in.'));
          }
        }}
      >
        <img src={BRAND_LOGO} alt="نفَس" className="auth-card__brand" />
        <h1>{locale === 'ar' ? 'تسجيل الدخول' : 'Sign in'}</h1>

        <label>
          <span>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>

        <label>
          <span>{locale === 'ar' ? 'كلمة المرور' : 'Password'}</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        <button type="submit" className="n-btn n-btn--primary">
          {locale === 'ar' ? 'دخول' : 'Sign in'}
        </button>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="auth-divider" aria-hidden="true">
          <span />
          <b>{locale === 'ar' ? 'أو' : 'or'}</b>
          <span />
        </div>

        <GoogleAuthButton />

        <p>
          {locale === 'ar' ? 'ليس لديك حساب؟' : 'No account yet?'}{' '}
          <Link to="/register">{locale === 'ar' ? 'أنشئ حسابًا' : 'Create one'}</Link>
        </p>
      </form>
    </div>
  );
}
