import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../services/api';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const Cart = () => {
  const { cartItems, getSubtotal, getShipping, getFinalTotal, getCartCount, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // 16. Empty Cart state
  if (cartItems.length === 0) {
    return (
      <div className="container cart-page mt-2 mb-2">
        <EmptyState
          icon="🛒"
          title="Your cart is empty."
          message="Add some products to get started."
          actionLabel="Continue Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const finalTotal = getFinalTotal();
  const itemCount = getCartCount();

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      navigate('/account');
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    setOrderError('');

    const orderPayload = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    try {
      await createOrder(orderPayload);
      clearCart();
      addToast('Order placed successfully', 'success');
      navigate('/orders');
    } catch (err) {
      const msg = err.message || 'Failed to place order. Please check item stock.';
      setOrderError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container cart-page mt-2 mb-2">
      <div className="cart-page-header">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">Review your items before proceeding to checkout</p>
      </div>

      <div className="cart-layout-grid">
        {/* Cart Items List */}
        <div className="cart-items-container">
          <div className="cart-items-card card">
            <div className="cart-card-header">
              <h3>Items in Cart ({itemCount})</h3>
              <button 
                type="button" 
                className="btn-text-danger" 
                onClick={clearCart}
                title="Clear all items from cart"
              >
                Clear Cart
              </button>
            </div>

            <div className="cart-items-list">
              {cartItems.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            <div className="cart-card-footer">
              <Link to="/products" className="continue-shopping-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* 8. Order Summary Section */}
        <div className="cart-summary-container">
          <div className="order-summary-card card">
            <h3 className="summary-title">ORDER SUMMARY</h3>
            
            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Items</span>
                <span className="summary-value">{itemCount}</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">
                  {shipping === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    `₹${shipping.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>

              {shipping > 0 && (
                <p className="shipping-hint">
                  Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more for <strong>FREE Shipping</strong>!
                </p>
              )}

              <hr className="summary-divider" />

              <div className="summary-row total-row">
                <span className="summary-total-label">Total</span>
                <span className="summary-total-value">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {orderError && (
              <div className="mt-1">
                <ErrorMessage 
                  title="Order Failed"
                  message={orderError}
                />
              </div>
            )}

            {/* 9. Checkout / Place Order */}
            <div className="checkout-action-area mt-2">
              {!isLoggedIn ? (
                <div className="auth-required-box text-center">
                  <p className="auth-warning-text">Please log in before placing an order.</p>
                  <Link to="/account" className="btn btn-primary btn-block mt-1">
                    Login to Continue
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-large"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              )}
            </div>

            <div className="summary-guarantee mt-2">
              <div className="guarantee-item">
                <span>🔒</span> Safe &amp; Secure Verification
              </div>
              <div className="guarantee-item">
                <span>📦</span> Real-Time Stock Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
