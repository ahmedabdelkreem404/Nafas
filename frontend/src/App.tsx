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
import Account from './pages/Account';
import AccountOrderDetail from './pages/AccountOrderDetail';
import AccountOrders from './pages/AccountOrders';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ContentPage from './pages/ContentPage';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Login from './pages/Login';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import Shop from './pages/Shop';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminBatches from './pages/admin/AdminBatches';
import AdminContent from './pages/admin/AdminContent';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFormulas from './pages/admin/AdminFormulas';
import AdminInventory from './pages/admin/AdminInventory';
import AdminLogin from './pages/admin/AdminLogin';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminProductMedia from './pages/admin/AdminProductMedia';
import AdminProductVariants from './pages/admin/AdminProductVariants';
import AdminProducts from './pages/admin/AdminProducts';
import AdminQuality from './pages/admin/AdminQuality';
import AdminSettings from './pages/admin/AdminSettings';

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
          </BrowserRouter>
        </CartProvider>
      </EngagementProvider>
    </LocaleProvider>
  );
}
