import React, { useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, FlaskConical, Boxes, ShieldCheck, Warehouse, Users, Settings, FileText, TicketPercent, Menu, LogOut, BarChart3 } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { Badge, Button, cx } from '../ui';

const links = [
  { to: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/admin/products', label: 'المنتجات', icon: Package },
  { to: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
  { to: '/admin/coupons', label: 'الكوبونات', icon: TicketPercent },
  { to: '/admin/content', label: 'المحتوى', icon: FileText },
  { to: '/admin/quality', label: 'الجودة', icon: ShieldCheck },
  { to: '/admin/formulas', label: 'التركيبات', icon: FlaskConical },
  { to: '/admin/batches', label: 'الدفعات', icon: Boxes },
  { to: '/admin/inventory', label: 'المخزون', icon: Warehouse },
  { to: '/admin/customers', label: 'العملاء', icon: Users },
  { to: '/admin/analytics', label: 'التحليلات', icon: BarChart3 },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      console.debug('logout failed');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login');
    }
  };

  const NavItems = (
    <div className="admin-sidebar__nav">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => cx('admin-nav-link', isActive && 'is-active')} onClick={() => setDrawerOpen(false)}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}><Icon size={18} /> {label}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className="admin-layout" dir="rtl">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__inner">
          <div className="stack" style={{ gap: '0.5rem' }}>
            <strong className="display text-gradient" style={{ fontSize: '1.8rem' }}>نفَس</strong>
            <p className="copy-muted" style={{ margin: 0 }}>Operator console</p>
            <Badge tone="muted">{user.role || 'admin'}</Badge>
          </div>
          {NavItems}
          <Button variant="ghost" onClick={handleLogout}><LogOut size={16} /> تسجيل الخروج</Button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="stack" style={{ gap: '0.1rem' }}>
            <strong>{links.find((link) => location.pathname.startsWith(link.to))?.label || 'الإدارة'}</strong>
            <span className="copy-muted" style={{ fontSize: '0.85rem' }}>واجهة تشغيل Nafas الداخلية</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Badge>{user.name || 'Admin'}</Badge>
            <Button variant="ghost" size="sm" className="hide-desktop" onClick={() => setDrawerOpen(true)}>
              <Menu size={18} />
            </Button>
          </div>
        </div>
        {children}
      </div>

      {drawerOpen ? (
        <div className="admin-mobile-drawer">
          <div className="admin-mobile-drawer__panel stack">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong className="display" style={{ fontSize: '1.4rem' }}>نفَس</strong>
              <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>إغلاق</Button>
            </div>
            {NavItems}
            <Button variant="ghost" onClick={handleLogout}><LogOut size={16} /> تسجيل الخروج</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminLayout;
