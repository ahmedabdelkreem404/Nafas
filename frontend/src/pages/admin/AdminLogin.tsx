import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Button, Card, Field, Input } from '../../components/ui';
import BrandLogo from '../../components/BrandLogo';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const res = await authApi.login({ email, password });
      const adminRoles = ['admin', 'super_admin', 'content_manager', 'inventory_manager', 'order_manager'];
      if (!adminRoles.includes(String(res.data.user.role || ''))) {
        setError('هذه الصفحة مخصصة لفريق التشغيل فقط.');
        return;
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'تعذّر تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Card className="auth-card stack" tone="strong">
        <BrandLogo variant="logo" className="auth-card__brand" alt="Nafas logo" />
        <span className="heading-eyebrow">Operator access</span>
        <div className="stack">
          <h1 className="title">دخول فريق نفَس</h1>
          <p className="copy">لوحة تشغيل أنيقة وعملية لإدارة المنتجات، الطلبات، والجودة.</p>
        </div>
        <form onSubmit={handleLogin} className="stack">
          {error ? <div className="ui-field-message ui-field-message--error">{error}</div> : null}
          <Field label="البريد الإلكتروني"><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@nafas.com" /></Field>
          <Field label="كلمة المرور"><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" /></Field>
          <Button type="submit" fullWidth size="lg" disabled={loading}>{loading ? 'جارِ الدخول...' : 'دخول لوحة التحكم'}</Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
