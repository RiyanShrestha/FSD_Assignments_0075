import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../services/api';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const Cart = () => {
  const { cartItems, getSubtotal, getShipping, getCartCount, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Dynamic document title
  const itemCount = getCartCount();
  useEffect(() => {
    document.title = itemCount > 0 ? `ShopNest | Cart (${itemCount})` : 'ShopNest | Cart';
  }, [itemCount]);

  // Delivery Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [deliveryErrors, setDeliveryErrors] = useState({});

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

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

  // Dynamic discount calculation (10% on subtotal if NEST10 applied)
  const discount = appliedPromo === 'NEST10' ? Math.round(subtotal * 0.10) : 0;
  const finalTotal = subtotal - discount + shipping;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a promo code.');
      return;
    }

    if (code === appliedPromo) {
      setPromoError('Promo code already applied.');
      return;
    }

    if (code === 'NEST10') {
      setAppliedPromo('NEST10');
      setPromoSuccess('NEST10 applied — 10% discount');
      addToast('NEST10 applied — 10% discount', 'success');
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
    setPromoSuccess('');
    setPromoError('');
    addToast('Promo code removed', 'info');
  };

  const validateDelivery = () => {
    const errors = {};
    if (!address.trim()) errors.address = 'Full address is required.';
    if (!city.trim()) errors.city = 'City is required.';
    if (!phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (phone.trim().length < 7 || !/^[0-9+\s-]{7,15}$/.test(phone.trim())) {
      errors.phone = 'Please enter a valid phone number.';
    }
    setDeliveryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      navigate('/account');
      return;
    }

    if (!validateDelivery()) {
      addToast('Please fill in all delivery details.', 'warning');
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    setOrderError('');

    const orderPayload = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      shippingAddress: {
        address: address.trim(),
        city: city.trim(),
        phone: phone.trim()
      },
      paymentMethod,
      promoCode: appliedPromo || undefined
    };

    try {
      const response = await createOrder(orderPayload);
      clearCart();
      addToast('Order placed successfully', 'success');
      
      // Store created order in sessionStorage and navigate to confirmation
      sessionStorage.setItem('shopnest_last_order', JSON.stringify(response.order));
      navigate('/order-confirmation', { state: { order: response.order } });
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
        <p className="page-subtitle">Review your items and enter delivery details</p>
      </div>

      <div className="cart-layout-grid">
        {/* Left Column: Cart Items & Delivery Details */}
        <div className="cart-items-container">
          {/* Cart Items Card */}
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

          {/* Delivery Details Card */}
          <div className="delivery-card card mt-2">
            <h3 className="delivery-title">DELIVERY DETAILS</h3>
            <p className="delivery-subtitle">Where should we deliver your order?</p>

            <div className="delivery-form mt-1">
              <div className="form-group">
                <label htmlFor="address">Full Address *</label>
                <input
                  id="address"
                  type="text"
                  placeholder="e.g. 123 Main Street, Apartment 4B"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (deliveryErrors.address) setDeliveryErrors({ ...deliveryErrors, address: '' });
                  }}
                  className={deliveryErrors.address ? 'input-error' : ''}
                />
                {deliveryErrors.address && <span className="error-text small">{deliveryErrors.address}</span>}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city"
                    type="text"
                    placeholder="e.g. Chennai"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (deliveryErrors.city) setDeliveryErrors({ ...deliveryErrors, city: '' });
                    }}
                    className={deliveryErrors.city ? 'input-error' : ''}
                  />
                  {deliveryErrors.city && <span className="error-text small">{deliveryErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (deliveryErrors.phone) setDeliveryErrors({ ...deliveryErrors, phone: '' });
                    }}
                    className={deliveryErrors.phone ? 'input-error' : ''}
                  />
                  {deliveryErrors.phone && <span className="error-text small">{deliveryErrors.phone}</span>}
                </div>
              </div>

              <div className="form-group mt-1">
                <label className="bold mb-1">Payment Method</label>
                <div className="payment-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💵 Cash on Delivery</span>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI (Demo)"
                      checked={paymentMethod === 'UPI (Demo)'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>📱 UPI (Demo)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary with Promo Code */}
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

              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span className="summary-label text-success">Discount (10% NEST10)</span>
                  <span className="summary-value text-success">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

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

            {/* Promo Code Section */}
            <div className="promo-box mt-2">
              <label htmlFor="promo" className="promo-label">Promo Code</label>
              {!appliedPromo ? (
                <form onSubmit={handleApplyPromo} className="promo-form">
                  <input
                    id="promo"
                    type="text"
                    className="promo-input"
                    placeholder="Try NEST10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary btn-small">
                    Apply
                  </button>
                </form>
              ) : (
                <div className="promo-applied-tag">
                  <span className="promo-text">✓ {appliedPromo} applied (10% off)</span>
                  <button type="button" className="btn-remove-promo" onClick={handleRemovePromo}>
                    ✕ Remove
                  </button>
                </div>
              )}
              {promoError && <p className="promo-error">{promoError}</p>}
              {promoSuccess && !promoError && <p className="promo-success">{promoSuccess}</p>}
            </div>

            {orderError && (
              <div className="mt-1">
                <ErrorMessage 
                  title="Order Failed"
                  message={orderError}
                />
              </div>
            )}

            {/* Place Order Button Area */}
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
