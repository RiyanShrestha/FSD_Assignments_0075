import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getCart, getCartSubtotal, clearCart } from '../utils/cart';
import { formatPrice } from '../data/products';
import './Checkout.css';

function Checkout() {
  const [cart, setCart] = useState(() => getCart());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'cod',
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required.';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number.';
    }
    if (!formData.address.trim()) {
      errors.address = 'Street address is required.';
    }
    if (!formData.city.trim()) {
      errors.city = 'City is required.';
    }
    if (!formData.state.trim()) {
      errors.state = 'State is required.';
    }
    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal code is required.';
    } else if (!/^[1-9][0-9]{5}$/.test(formData.postalCode.trim())) {
      errors.postalCode = 'Please enter a valid 6-digit PIN code.';
    }
    if (!formData.paymentMethod) {
      errors.paymentMethod = 'Please choose a payment method.';
    }

    return errors;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError('Your bag is empty. Please add items before checking out.');
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please correct the highlighted fields before placing your order.');
      return;
    }

    const subtotal = getCartSubtotal(cart);
    const orderId = `NK-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderData = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      },
      address: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      },
      paymentMethod:
        formData.paymentMethod === 'cod'
          ? 'Cash on Delivery'
          : formData.paymentMethod === 'upi'
          ? 'UPI / QR Code'
          : 'Credit / Debit Card (Demo)',
      items: cart,
      subtotal,
      total: subtotal,
    };

    // Save order and clear cart
    try {
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
    } catch (err) {
      console.error('Failed to save order to localStorage', err);
    }

    clearCart();
    navigate('/order-confirmation', { state: { order: orderData } });
  };

  useEffect(() => {
    const handleCartChange = () => {
      setCart(getCart());
    };

    window.addEventListener('cartChange', handleCartChange);
    window.addEventListener('storage', handleCartChange);

    return () => {
      window.removeEventListener('cartChange', handleCartChange);
      window.removeEventListener('storage', handleCartChange);
    };
  }, []);

  const subtotal = getCartSubtotal(cart);

  useEffect(() => {
    document.title = 'Checkout | Nike Store';
  }, []);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className="checkout-page">
          <h1 className="checkout-title">Checkout</h1>
          <div className="cart-empty">
            <h2>Your Bag is empty</h2>
            <p>You need at least one product in your bag to proceed with checkout.</p>
            <Link to="/shop/all" className="shop-now-btn">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          {/* Checkout Form */}
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            {/* Customer Details */}
            <section className="checkout-section">
              <h2>1. Contact Information</h2>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. John"
                  />
                  {validationErrors.firstName && (
                    <span className="field-error">{validationErrors.firstName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Doe"
                  />
                  {validationErrors.lastName && (
                    <span className="field-error">{validationErrors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                  {validationErrors.email && (
                    <span className="field-error">{validationErrors.email}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                  />
                  {validationErrors.phone && (
                    <span className="field-error">{validationErrors.phone}</span>
                  )}
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section className="checkout-section">
              <h2>2. Delivery Address</h2>
              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Apartment, suite, street"
                />
                {validationErrors.address && (
                  <span className="field-error">{validationErrors.address}</span>
                )}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                  />
                  {validationErrors.city && (
                    <span className="field-error">{validationErrors.city}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Maharashtra"
                  />
                  {validationErrors.state && (
                    <span className="field-error">{validationErrors.state}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">Postal / PIN Code *</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 400001"
                />
                {validationErrors.postalCode && (
                  <span className="field-error">{validationErrors.postalCode}</span>
                )}
              </div>
            </section>

            {/* Payment Options */}
            <section className="checkout-section">
              <h2>3. Payment Method</h2>
              <div className="payment-options">
                <label
                  className={`payment-option ${
                    formData.paymentMethod === 'cod' ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <span>Cash on Delivery (Pay upon delivery)</span>
                </label>

                <label
                  className={`payment-option ${
                    formData.paymentMethod === 'upi' ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleChange}
                  />
                  <span>UPI / QR Code (Instant simulation)</span>
                </label>

                <label
                  className={`payment-option ${
                    formData.paymentMethod === 'card' ? 'active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <span>Credit / Debit Card (Demo)</span>
                </label>
              </div>
            </section>

            {error && <div className="form-error">{error}</div>}
            {validationErrors.paymentMethod && (
              <div className="form-error">{validationErrors.paymentMethod}</div>
            )}

            <button type="submit" className="place-order-btn">
              Place Order • {formatPrice(subtotal)}
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="summary-items-list">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="summary-item"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="summary-item-img"
                  />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-meta">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="summary-item-price">
                    {formatPrice((item.priceNumber || 0) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;
