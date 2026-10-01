import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home';
import ShopPage from './components/ShopPage';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Navigate to="/shop/all" replace />} />
      <Route path="/shop/:category" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />

      {/* Convenience redirects for top-level navbar routes */}
      <Route path="/men" element={<Navigate to="/shop/men" replace />} />
      <Route path="/women" element={<Navigate to="/shop/women" replace />} />
      <Route path="/kids" element={<Navigate to="/shop/all" replace />} />
      <Route path="/sale" element={<Navigate to="/shop/all" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;