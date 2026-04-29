import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { publicApi } from '../api/publicApi';
import { useLocale } from '../context/LocaleContext';
import { storeAuthSession } from '../utils/auth';

type GoogleCredentialResponse = {
  credential?: string;
};

type GooglePromptNotification = {
  isDisplayed?: () => boolean;
  isNotDisplayed?: () => boolean;
  getNotDisplayedReason?: () => string;
};

type GoogleAccounts = {
  id: {
    initialize: (config: {
      callback: (response: GoogleCredentialResponse) => void;
      client_id: string;
    }) => void;
    cancel?: () => void;
    prompt: (listener?: (notification: GooglePromptNotification) => void) => void;
  };
};

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}

function getGuestCartItems() {
  try {
    return JSON.parse(localStorage.getItem('nafas_cart') || '[]').map((item: any) => ({
      quantity: item.quantity,
      variant_id: item.variant?.id || item.product_variant_id,
    })).filter((item: { variant_id?: number }) => Boolean(item.variant_id));
  } catch {
    return [];
  }
}

export default function GoogleAuthButton() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const initializedRef = useRef(false);

  const labels = useMemo(() => ({
    button: locale === 'ar' ? 'تسجيل الدخول بـ Google' : 'Continue with Google',
    loading: locale === 'ar' ? 'جارٍ الربط مع Google...' : 'Connecting to Google...',
    missingClient: locale === 'ar' ? 'يرجى ضبط Google Client ID أولًا.' : 'Please configure the Google client ID first.',
    failed: locale === 'ar' ? 'تعذّر تسجيل الدخول عبر Google.' : 'Google sign-in failed.',
    unavailable: locale === 'ar' ? 'تعذّر فتح نافذة Google الآن. جرّب مرة أخرى.' : 'Unable to open Google sign-in right now. Please try again.',
  }), [locale]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError(labels.missingClient);
      return;
    }

    const initialize = () => {
      if (!window.google || initializedRef.current) {
        setReady(Boolean(window.google));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) {
            setError(labels.failed);
            return;
          }

          setLoading(true);
          setError('');

          try {
            const result = await authApi.googleAuth(response.credential);
            const token = result.data.token || result.data.data?.token;
            const user = result.data.user || result.data.data?.user;

            if (!token || !user) {
              throw new Error(labels.failed);
            }

            storeAuthSession(token, user);

            const guestItems = getGuestCartItems();
            if (guestItems.length) {
              await publicApi.mergeCart(guestItems);
            }

            navigate('/account');
          } catch (err: any) {
            setError(err.message || labels.failed);
          } finally {
            setLoading(false);
          }
        },
      });

      initializedRef.current = true;
      setReady(true);
    };

    if (window.google) {
      initialize();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-google-gsi="1"]');
    if (existing) {
      existing.addEventListener('load', initialize, { once: true });
      return () => existing.removeEventListener('load', initialize);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = '1';
    script.addEventListener('load', initialize, { once: true });
    document.head.appendChild(script);

    return () => script.removeEventListener('load', initialize);
  }, [labels.failed, labels.missingClient, navigate]);

  useEffect(() => () => {
    window.google?.accounts.id.cancel?.();
  }, []);

  const handleClick = () => {
    setError('');
    if (!ready || !window.google) {
      setError(labels.unavailable);
      return;
    }

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed?.()) {
        setError(labels.unavailable);
      }
    });
  };

  return (
    <div className="google-auth">
      <button
        type="button"
        className={`google-auth__button ${loading ? 'is-loading' : ''}`}
        onClick={handleClick}
        disabled={loading}
      >
        <span className="google-auth__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.9 1.5l2.6-2.6C16.9 2.9 14.7 2 12 2 6.9 2 2.8 6.3 2.8 11.6S6.9 21.2 12 21.2c6.9 0 9.1-4.9 9.1-7.4 0-.5-.1-.9-.1-1.2H12Z" />
            <path fill="#FBBC05" d="M4.8 7.3l3.2 2.3c.9-1.8 2.3-3 4-3 1.9 0 3.1.8 3.9 1.5l2.6-2.6C16.9 2.9 14.7 2 12 2 8 2 4.6 4.3 2.8 7.6l2 1.5Z" />
            <path fill="#34A853" d="M12 21.2c2.6 0 4.8-.9 6.4-2.5l-3-2.4c-.8.6-1.9 1.1-3.4 1.1-3.9 0-5.1-2.6-5.4-3.8l-3.2 2.5c1.8 3.4 5.3 5.1 8.6 5.1Z" />
            <path fill="#4285F4" d="M21.1 12.6c0-.5-.1-.9-.1-1.2H12v3.9h5.5c-.3 1-.9 1.9-2 2.7l3 2.4c1.7-1.6 2.6-4 2.6-7.8Z" />
          </svg>
        </span>
        <span>{loading ? labels.loading : labels.button}</span>
        {loading ? <span className="google-auth__spinner" aria-hidden="true" /> : null}
      </button>
      {error ? <p className="google-auth__error">{error}</p> : null}
    </div>
  );
}
