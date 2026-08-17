import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSummary.css';

function OrderSummary({ cartItems }) {
  const navigate = useNavigate();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="order-summary-card">
      <h2 className="summary-title">Cart Summary</h2>
      
      <div className="subtotal-info">
        Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}):{' '}
        <strong className="summary-price">${subtotal.toFixed(2)}</strong>
      </div>

      <div className="gift-checkbox-container">
        <label className="gift-label">
          <input type="checkbox" className="gift-checkbox" />
          <span className="gift-text">This order contains a gift</span>
        </label>
      </div>

      <button 
        className="checkout-btn" 
        onClick={handleCheckout}
        disabled={cartItems.length === 0}
      >
        Proceed to checkout
      </button>

      <div className="secure-badge">
        <span className="lock-icon">🔒</span> Secure transaction
      </div>
    </div>
  );
}

export default OrderSummary;

