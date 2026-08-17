import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Checkout.css';

function Checkout({ cartItems, onPlaceOrder }) {
  const navigate = useNavigate();
  
  // Checkout Form States
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nepal',
    phone: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [activeStep, setActiveStep] = useState(1); // Step 1: Shipping, Step 2: Payment, Step 3: Review

  // Calculate pricing
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = 0; // Free Prime shipping
  const estimatedTax = subtotal * 0.05; // 5% tax
  const orderTotal = subtotal + shippingCost + estimatedTax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.addressLine1 || !shippingInfo.city || !shippingInfo.zipCode) {
      alert("Please fill out all required fields.");
      return;
    }
    setActiveStep(2); // Move to Payment
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentInfo.cardName || !paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv) {
      alert("Please fill out your card details.");
      return;
    }
    setActiveStep(3); // Move to Review
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    
    // Create order object
    const orderId = 'AMZ-' + Math.floor(100000000 + Math.random() * 900000000);
    const orderData = {
      orderId,
      items: cartItems,
      shippingAddress: shippingInfo,
      paymentMethod: `Card ending in ${paymentInfo.cardNumber.slice(-4) || '1111'}`,
      pricing: {
        subtotal,
        shipping: shippingCost,
        tax: estimatedTax,
        total: orderTotal
      },
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    };

    onPlaceOrder(orderData);
    navigate('/orders', { state: { latestOrderId: orderId } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty-state">
        <span className="checkout-lock-large">🔒</span>
        <h2>Your Cart is Empty</h2>
        <p>You cannot check out without items in your shopping cart.</p>
        <Link to="/" className="shop-now-btn">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      {/* Checkout Header (Minimalist) */}
      <header className="checkout-header-bar">
        <Link to="/" className="checkout-logo">
          <span className="logo-text">amazon</span>
          <span className="logo-dot-com">.clone</span>
        </Link>
        <h1 className="checkout-header-title">
          Checkout (<span className="checkout-item-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>)
        </h1>
        <div className="secure-badge">
          <span className="lock-icon">🔒</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="checkout-layout">
        
        {/* Left Column: Form Steps */}
        <div className="checkout-steps-column">
          
          {/* STEP 1: SHIPPING ADDRESS */}
          <div className={`checkout-step-card ${activeStep === 1 ? 'active' : 'collapsed'}`}>
            <div className="step-header" onClick={() => setActiveStep(1)}>
              <span className="step-number">1</span>
              <h3>Shipping Address</h3>
              {activeStep > 1 && (
                <span className="step-summary-text">
                  {shippingInfo.fullName}, {shippingInfo.city} (Change)
                </span>
              )}
            </div>

            {activeStep === 1 && (
              <form onSubmit={handleShippingSubmit} className="step-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full name (First and Last name)</label>
                    <input 
                      type="text" 
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Address Line 1</label>
                    <input 
                      type="text" 
                      placeholder="Street address, P.O. box, company name, c/o"
                      value={shippingInfo.addressLine1}
                      onChange={(e) => setShippingInfo({...shippingInfo, addressLine1: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State / Province / Region</label>
                    <input 
                      type="text" 
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP / Postal Code</label>
                    <input 
                      type="text" 
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Country/Region</label>
                    <input 
                      type="text" 
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      disabled
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Phone number</label>
                    <input 
                      type="tel" 
                      placeholder="May be used to assist delivery"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" className="step-submit-btn">
                  Use this address
                </button>
              </form>
            )}
          </div>

          {/* STEP 2: PAYMENT METHOD */}
          <div className={`checkout-step-card ${activeStep === 2 ? 'active' : activeStep < 2 ? 'disabled' : 'collapsed'}`}>
            <div className="step-header" onClick={() => activeStep > 1 && setActiveStep(2)}>
              <span className="step-number">2</span>
              <h3>Payment Method</h3>
              {activeStep > 2 && (
                <span className="step-summary-text">
                  Card ending in {paymentInfo.cardNumber.slice(-4)} (Change)
                </span>
              )}
            </div>

            {activeStep === 2 && (
              <form onSubmit={handlePaymentSubmit} className="step-body">
                <div className="payment-options">
                  <label className="radio-label active-radio">
                    <input type="radio" name="payment" defaultChecked />
                    <span className="radio-custom-text">Credit or Debit Card</span>
                  </label>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Name on Card</label>
                    <input 
                      type="text" 
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      maxLength="16"
                      placeholder="16 digits card number"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value.replace(/\D/g, '')})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Expiration Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      maxLength="5"
                      value={paymentInfo.expiry}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV (Security Code)</label>
                    <input 
                      type="password" 
                      maxLength="3"
                      placeholder="3 digits"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="step-submit-btn">
                  Use this payment method
                </button>
              </form>
            )}
          </div>

          {/* STEP 3: REVIEW ITEMS AND SHIPPING */}
          <div className={`checkout-step-card ${activeStep === 3 ? 'active' : 'disabled'}`}>
            <div className="step-header">
              <span className="step-number">3</span>
              <h3>Review Items and Shipping</h3>
            </div>

            {activeStep === 3 && (
              <div className="step-body">
                <div className="delivery-summary-box">
                  <h4>Guaranteed Delivery Date: {orderDataDeliveryDate()}</h4>
                  <p>Your order qualifies for FREE Prime Delivery.</p>
                </div>

                <div className="review-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="review-item-row">
                      <img src={item.image} alt={item.name} className="review-item-img" />
                      <div className="review-item-details">
                        <h5>{item.name}</h5>
                        <div className="review-item-price-qty">
                          <span className="review-price">${item.price.toFixed(2)}</span>
                          <span className="review-qty">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="place-order-banner">
                  <button className="place-order-final-btn" onClick={handlePlaceOrder}>
                    Place your order
                  </button>
                  <span className="agreement-text">
                    By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary Widget */}
        <div className="checkout-summary-column">
          <div className="checkout-summary-card">
            {activeStep === 3 ? (
              <button className="summary-place-btn" onClick={handlePlaceOrder}>
                Place your order
              </button>
            ) : (
              <button 
                className="summary-place-btn disabled-btn" 
                onClick={() => {
                  if (activeStep === 1) alert("Please submit your shipping address first.");
                  else if (activeStep === 2) alert("Please submit your payment info first.");
                }}
              >
                Continue to Next Step
              </button>
            )}

            <p className="summary-agreement-short">
              By placing your order, you agree to Amazon Clone's terms of service.
            </p>

            <hr className="summary-divider" />

            <h4 className="summary-card-title">Order Summary</h4>
            
            <div className="summary-item-row">
              <span>Items ({totalItems}):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-item-row">
              <span>Shipping & handling:</span>
              <span className="shipping-free">FREE</span>
            </div>

            <hr className="summary-divider-thin" />

            <div className="summary-item-row">
              <span>Total before tax:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-item-row">
              <span>Estimated tax to be collected:</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-total-row">
              <span>Order Total:</span>
              <span className="grand-total">${orderTotal.toFixed(2)}</span>
            </div>

            <hr className="summary-divider-thin" />
            
            <div className="summary-how-paid">
              <h5>How are you paying?</h5>
              {paymentInfo.cardNumber ? (
                <p>💳 Credit Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
              ) : (
                <p className="no-pm-selected">No payment method selected yet</p>
              )}
            </div>

            <div className="summary-where-ship">
              <h5>Shipping to:</h5>
              {shippingInfo.fullName ? (
                <p>📍 {shippingInfo.fullName}<br />{shippingInfo.addressLine1}, {shippingInfo.city}</p>
              ) : (
                <p className="no-address-selected">No shipping address selected yet</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  // Small helper for delivery date display
  function orderDataDeliveryDate() {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 3);
    return delivery.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  }
}

export default Checkout;
