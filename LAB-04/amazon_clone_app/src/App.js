import React, { useState } from 'react';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import Cart from './components/Cart';
import OrderSummary from './components/OrderSummary';
import RecommendedProducts from './components/RecommendedProducts';
import Footer from './components/Footer';
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
    name: "Smart Watch",
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

function App() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

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

  // Add item from recommended list
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

  // Calculate total number of items
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Header section */}
      <Header cartCount={cartCount} />

      {/* Sub Navigation Bar */}
      <NavigationBar />

      {/* Main content grid */}
      <main className="main-layout">
        <div className="cart-content-wrapper">
          {/* Left section: Shopping Cart */}
          <Cart 
            cartItems={cartItems} 
            onUpdateQty={handleUpdateQty} 
            onDelete={handleDelete} 
          />

          {/* Right section: Order Summary */}
          <OrderSummary cartItems={cartItems} />
        </div>

        {/* Recommendations block */}
        <RecommendedProducts onAddToCart={handleAddToCart} />
      </main>

      {/* Footer section */}
      <Footer />
    </div>
  );
}

export default App;
