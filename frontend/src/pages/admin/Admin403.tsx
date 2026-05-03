import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/ui';

const Admin403: React.FC = () => (
  <div className="auth-shell">
    <Card className="auth-card stack" tone="strong">
      <span className="heading-eyebrow">غير مسموح بالدخول</span>
      <h1 className="display text-gradient" style={{ fontSize: '3rem', margin: 0 }}>403</h1>
      <p className="copy">ليس لديك صلاحية للوصول إلى هذه الصفحة. إذا كنت تعتقد أن هذا خطأ، ارجع إلى لوحة التحكم أو سجّل بحساب مختلف.</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/admin/dashboard"><Button>العودة للوحة التحكم</Button></Link>
        <Link to="/admin/login"><Button variant="secondary">تسجيل دخول مختلف</Button></Link>
      </div>
    </Card>
  </div>
);

export default Admin403;
