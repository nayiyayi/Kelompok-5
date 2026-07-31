import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import MenuCoffee from './pages/MenuCoffee';
import MenuNonCoffee from './pages/MenuNonCoffee';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Reservasi from './pages/Reservasi';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import CustomerService from './pages/CustomerService';
import Promo from './pages/Promo';
import RekomProduk from './pages/RekomProduk';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Admin layout: no Navbar/Footer
function AdminLayout() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                {/* Admin route — layout sendiri */}
                <Route path="/admin" element={<AdminLayout />} />

                {/* Auth routes — tanpa footer */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Main routes — dengan Navbar & Footer */}
                <Route path="/*" element={
                  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <div style={{ flex: 1 }}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        {/* Redirect legacy /menu to /menu-coffee */}
                        <Route path="/menu" element={<Navigate to="/menu-coffee" replace />} />
                        <Route path="/menu-coffee" element={<MenuCoffee />} />
                        <Route path="/menu-non-coffee" element={<MenuNonCoffee />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={
                          <ProtectedRoute>
                            <OrderHistory />
                          </ProtectedRoute>
                        } />
                        <Route path="/reservasi" element={<Reservasi />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cs" element={<CustomerService />} />
                        <Route path="/customer-service" element={<CustomerService />} />
                        <Route path="/promo" element={<Promo />} />
                        <Route path="/rekomendasi" element={<RekomProduk />} />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                    <Footer />

                    {/* Float WA button */}
                    <a
                      href="https://wa.me/6282322115127"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="float-wa"
                      title="Hubungi WhatsApp Kami"
                    >
                      <i className="fab fa-whatsapp" />
                    </a>
                  </div>
                } />
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
