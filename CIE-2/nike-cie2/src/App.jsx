import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Home from './components/Home';
import ShopPage from './components/ShopPage';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import NotFound from './components/NotFound';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Navigate to="/shop/all" replace />} />
        <Route path="/shop/:category" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetails key={location.pathname} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Convenience redirects for top-level navbar routes */}
        <Route path="/men" element={<Navigate to="/shop/men" replace />} />
        <Route path="/women" element={<Navigate to="/shop/women" replace />} />
        <Route path="/kids" element={<Navigate to="/shop/all" replace />} />
        <Route path="/sale" element={<Navigate to="/shop/all" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;