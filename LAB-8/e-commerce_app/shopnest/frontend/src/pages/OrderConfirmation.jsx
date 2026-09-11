import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ShopNest | Order Confirmed';
  }, []);

  // Retrieve order passed via navigate state, or fallback to sessionStorage
  let order = location.state?.order;
  if (!order) {
    try {
      const saved = sessionStorage.getItem('shopnest_last_order');
      if (saved) order = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }

  if (!order) {
    return (
      <div className="container mt-2 mb-2 text-center">
        <div className="card mx-auto" style={{ maxWidth: '500px', padding: '40px 20px' }}>
          <h2>No Recent Order Found</h2>
          <p className="text-muted mt-1">You can review your past purchases on the Orders page.</p>
          <Link to="/orders" className="btn btn-primary mt-2">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  // Calculate estimated delivery: Order date + 5 days
  const orderDate = new Date(order.date || Date.now());
  const estimatedDeliveryDate = new Date(orderDate);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

  const formattedDelivery = estimatedDeliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedOrderDate = orderDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container confirmation-page mt-2 mb-2">
      <div className="confirmation-card card mx-auto">
        <div className="confirmation-header text-center">
          <div className="confirmation-check-icon">✓</div>
          <h1 className="confirmation-title">ORDER CONFIRMED!</h1>
          <p className="confirmation-subtitle">
            Thank you for your purchase, <strong>{order.customer?.name || 'Customer'}</strong>.
          </p>
          <span className="confirmation-order-id">Order #{order.id}</span>
        </div>

        <div className="invoice-summary-grid mt-2">
          <div className="invoice-meta-row">
            <span className="invoice-label">Order Date</span>
            <span className="invoice-val">{formattedOrderDate}</span>
          </div>

          <div className="invoice-meta-row">
            <span className="invoice-label">Estimated Delivery</span>
            <span className="invoice-val text-success bold">{formattedDelivery}</span>
          </div>

          <div className="invoice-meta-row">
            <span className="invoice-label">Payment Method</span>
            <span className="invoice-val">{order.paymentMethod || 'Cash on Delivery'}</span>
          </div>

          <div className="invoice-meta-row">
            <span className="invoice-label">Delivery Address</span>
            <span className="invoice-val">
              {order.shippingAddress?.address ? (
                <>{order.shippingAddress.address}, {order.shippingAddress.city} <br />
                <small className="text-muted">📞 {order.shippingAddress.phone}</small></>
              ) : (
                'Standard Delivery'
              )}
            </span>
          </div>
        </div>

        {/* Itemized List for Invoice */}
        <div className="invoice-items-section mt-2">
          <h4>Items Ordered</h4>
          <div className="invoice-items-table">
            {order.items && order.items.map((item, idx) => (
              <div key={idx} className="invoice-item-row">
                <span className="item-name">{item.name} × {item.quantity}</span>
                <span className="item-price">₹{(item.subtotal || item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="invoice-totals mt-1">
            <div className="invoice-total-row">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>

            {order.discount > 0 && (
              <div className="invoice-total-row text-success">
                <span>Discount ({order.promoCode || 'Promo'})</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="invoice-total-row">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
            </div>

            <hr className="summary-divider" />

            <div className="invoice-total-row grand-total">
              <span className="bold">Total Paid</span>
              <span className="total-highlight">₹{order.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="confirmation-actions no-print mt-2">
          <button type="button" className="btn btn-secondary" onClick={handlePrint}>
            🖨️ Print Invoice
          </button>
          
          <button type="button" className="btn btn-primary" onClick={() => navigate('/orders')}>
            View My Orders
          </button>

          <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
