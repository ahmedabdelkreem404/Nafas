import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Boxes,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  TicketPercent,
  Users,
  Warehouse,
  FileText,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { adminRoleLabel, adminUserNameLabel } from '../../utils/adminLabels';
import { Badge, Button, cx } from '../ui';

type AdminNavLink = {
  icon: LucideIcon;
  label: string;
  to: string;
};

type AdminNavGroup = {
  id: string;
  label: string;
  links: AdminNavLink[];
};

const navGroups: AdminNavGroup[] = [
  {
    id: 'overview',
    label: 'نظرة عامة',
    links: [
      { to: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
      { to: '/admin/analytics', label: 'التحليلات', icon: BarChart3 },
    ],
  },
  {
    id: 'catalog',
    label: 'الكتالوج',
    links: [
      { to: '/admin/products', label: 'المنتجات', icon: Package },
      { to: '/admin/formulas', label: 'التركيبات', icon: FlaskConical },
      { to: '/admin/inventory', label: 'المخزون', icon: Warehouse },
    ],
  },
  {
    id: 'orders',
    label: 'الطلبات والعملاء',
    links: [
      { to: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
      { to: '/admin/customers', label: 'العملاء', icon: Users },
    ],
  },
  {
    id: 'operations',
    label: 'التشغيل والجودة',
    links: [
      { to: '/admin/quality', label: 'الجودة', icon: ShieldCheck },
      { to: '/admin/batches', label: 'الدفعات', icon: Boxes },
    ],
  },
  {
    id: 'marketing',
    label: 'التسويق والمحتوى',
    links: [
      { to: '/admin/coupons', label: 'الكوبونات', icon: TicketPercent },
      { to: '/admin/content', label: 'المحتوى', icon: FileText },
    ],
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    links: [
      { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
    ],
  },
];

const allLinks = navGroups.flatMap((group) => group.links);
const drawerId = 'nafas-admin-drawer';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFirst = window.setTimeout(() => {
      drawerRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusFirst);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
  }, [drawerOpen]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      console.debug('تعذّر تسجيل الخروج');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/admin/login');
    }
  };

  const currentLink = allLinks.find((link) => location.pathname.startsWith(link.to));

  const navContent = (
    <div className="admin-sidebar__nav">
      {navGroups.map((group) => (
        <section key={group.id} className="admin-nav-group" aria-label={group.label}>
          <p className="admin-nav-group__label">{group.label}</p>
          <div className="admin-nav-group__links">
            {group.links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => cx('admin-nav-link', isActive && 'is-active')}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  return (
    <div className="admin-layout" dir="rtl">
      <aside className="admin-sidebar" aria-label="تنقل لوحة التحكم">
        <div className="admin-sidebar__inner">
          <div className="admin-sidebar__brand">
            <strong>نفَس</strong>
            <span>لوحة التشغيل الداخلية</span>
            <Badge tone="muted">{adminRoleLabel(user.role)}</Badge>
          </div>
          {navContent}
          <Button variant="ghost" className="admin-sidebar__logout" onClick={handleLogout}>
            <LogOut size={16} aria-hidden="true" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__title">
            <strong>{currentLink?.label || 'الإدارة'}</strong>
            <span>واجهة تشغيل نفس الداخلية</span>
          </div>
          <div className="admin-topbar__actions">
            <Badge>{adminUserNameLabel(user.name)}</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="hide-desktop admin-topbar__menu"
              onClick={() => setDrawerOpen(true)}
              aria-controls={drawerId}
              aria-expanded={drawerOpen}
            >
              <Menu size={18} aria-hidden="true" />
              <span>القائمة</span>
            </Button>
          </div>
        </header>
        {children}
      </div>

      <div className={`admin-mobile-drawer ${drawerOpen ? 'is-open' : ''}`} aria-hidden={!drawerOpen}>
        <button type="button" className="admin-mobile-drawer__backdrop" onClick={() => setDrawerOpen(false)} aria-label="إغلاق القائمة" />
        <div id={drawerId} ref={drawerRef} className="admin-mobile-drawer__panel">
          <div className="admin-mobile-drawer__head">
            <div className="admin-sidebar__brand">
              <strong>نفَس</strong>
              <span>لوحة التشغيل الداخلية</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)} aria-label="إغلاق القائمة">
              <X size={18} aria-hidden="true" />
            </Button>
          </div>
          {navContent}
          <Button variant="ghost" className="admin-sidebar__logout" onClick={handleLogout}>
            <LogOut size={16} aria-hidden="true" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
