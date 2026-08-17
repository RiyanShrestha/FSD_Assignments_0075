import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import Cart from './components/Cart';
import OrderSummary from './components/OrderSummary';
import RecommendedProducts from './components/RecommendedProducts';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import './App.css';

const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    rating: 4.5,
    inStock: true,
    price: 39.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    id: 2,
    name: "Smart Watch with Heart Rate Monitor",
    rating: 4.7,
    inStock: true,
    price: 59.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    id: 3,
    name: "Mechanical Gaming Keyboard",
    rating: 4.4,
    inStock: true,
    price: 49.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"
  }
];

function AppContent() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [ordersList, setOrdersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const location = useLocation();
  const isCheckoutPage = location.pathname === '/checkout';

  // Update item quantity
  const handleUpdateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Delete item from cart
  const handleDelete = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Add item from recommended list or product details
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            rating: product.rating,
            inStock: true,
            price: product.price,
            quantity: 1,
            image: product.image
          }
        ];
      }
    });
  };

  // Place order
  const handlePlaceOrder = (orderData) => {
    setOrdersList(prevOrders => [orderData, ...prevOrders]);
    setCartItems([]); // Clear cart upon placing order
  };

  // Calculate total number of items
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Header and Sub Nav are hidden on Checkout page */}
      {!isCheckoutPage && (
        <>
          <Header 
            cartCount={cartCount} 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <NavigationBar />
        </>
      )}

      {/* Route Content Switcher */}
      <Routes>
        <Route path="/" element={
          <main className="main-layout">
            <ProductList 
              onAddToCart={handleAddToCart} 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </main>
        } />

        <Route path="/product/:id" element={
          <main className="main-layout">
            <ProductDetails onAddToCart={handleAddToCart} />
          </main>
        } />

        <Route path="/cart" element={
          <main className="main-layout">
            <div className="cart-content-wrapper">
              <Cart 
                cartItems={cartItems} 
                onUpdateQty={handleUpdateQty} 
                onDelete={handleDelete} 
              />
              <OrderSummary cartItems={cartItems} />
            </div>
            <RecommendedProducts onAddToCart={handleAddToCart} />
          </main>
        } />

        <Route path="/checkout" element={
          <Checkout cartItems={cartItems} onPlaceOrder={handlePlaceOrder} />
        } />

        <Route path="/orders" element={
          <main className="main-layout">
            <Orders ordersList={ordersList} />
          </main>
        } />
      </Routes>

      {/* Footer is hidden on Checkout page */}
      {!isCheckoutPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

