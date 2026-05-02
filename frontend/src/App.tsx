import { lazy, Suspense } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import OffcanvasCart from './components/OffcanvasCart';
import { ProtectedRoute } from './components/RouteGuards';
import WhatsAppFloatButton from './components/WhatsAppFloatButton';
import AdminLayout from './components/admin/AdminLayout';
import { CartProvider } from './context/CartContext';
import { EngagementProvider } from './context/EngagementContext';
import { LocaleProvider } from './context/LocaleContext';

const Account = lazy(() => import('./pages/Account'));
const AccountOrderDetail = lazy(() => import('./pages/AccountOrderDetail'));
const AccountOrders = lazy(() => import('./pages/AccountOrders'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ContentPage = lazy(() => import('./pages/ContentPage'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Register = lazy(() => import('./pages/Register'));
const Shop = lazy(() => import('./pages/Shop'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminBatches = lazy(() => import('./pages/admin/AdminBatches'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminFormulas = lazy(() => import('./pages/admin/AdminFormulas'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminProductMedia = lazy(() => import('./pages/admin/AdminProductMedia'));
const AdminProductVariants = lazy(() => import('./pages/admin/AdminProductVariants'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminQuality = lazy(() => import('./pages/admin/AdminQuality'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function RouteFallback() {
  return <div className="n-container n-section"><div className="empty-panel">Nafas...</div></div>;
}

function PublicLayout() {
  return (
    <>
      <div className="app-shell">
        <Navbar />
        <main className="page-shell">
          <Outlet />
        </main>
        <Footer />
        <OffcanvasCart />
        <WhatsAppFloatButton />
      </div>
    </>
  );
}

function AdminShell() {
  return (
    <ProtectedRoute isAdmin>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <EngagementProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="products/:slug" element={<ProductDetail />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                  <Route path="account/orders" element={<ProtectedRoute><AccountOrders /></ProtectedRoute>} />
                  <Route path="account/orders/:id" element={<ProtectedRoute><AccountOrderDetail /></ProtectedRoute>} />
                  <Route path="about" element={<ContentPage />} />
                  <Route path="faq" element={<ContentPage />} />
                  <Route path="quality" element={<ContentPage />} />
                  <Route path="privacy-policy" element={<ContentPage />} />
                  <Route path="return-policy" element={<ContentPage />} />
                  <Route path="terms" element={<ContentPage />} />
                </Route>

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminShell />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/create" element={<AdminProductForm />} />
                  <Route path="products/:id/edit" element={<AdminProductForm />} />
                  <Route path="products/:id/media" element={<AdminProductMedia />} />
                  <Route path="products/:id/variants" element={<AdminProductVariants />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="quality" element={<AdminQuality />} />
                  <Route path="formulas" element={<AdminFormulas />} />
                  <Route path="batches" element={<AdminBatches />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </EngagementProvider>
    </LocaleProvider>
  );
}
