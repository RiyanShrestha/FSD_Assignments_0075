import { useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { formatPrice } from '../data/products';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const location = useLocation();

  // Retrieve order from state or localStorage
  let order = location.state?.order;
  if (!order) {
    try {
      const stored = localStorage.getItem('lastOrder');
      if (stored) {
        order = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="confirmation-page">
          <div className="confirmation-card">
            <h1>No Order Found</h1>
            <p className="confirmation-subtitle">
              We couldn't find any recent order details.
            </p>
            <Link to="/" className="continue-shopping-btn">
              Go to Home
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

      <main className="confirmation-page">
        <div className="confirmation-card">
          <div className="success-icon-badge">✓</div>

          <h1>Thank you for your order!</h1>
          <p className="confirmation-subtitle">
            Your order has been placed successfully. A confirmation message has
            been sent to <strong>{order.customer.email}</strong>.
          </p>

          <div className="order-meta-box">
            <div>
              <p>Order Number</p>
              <p>#{order.orderId}</p>
            </div>
            <div>
              <p>Date</p>
              <p>{order.date}</p>
            </div>
            <div>
              <p>Payment Method</p>
              <p>{order.paymentMethod}</p>
            </div>
          </div>

          <div className="confirmation-details">
            <h2>Shipping & Customer Information</h2>
            <div className="shipping-info-grid">
              <div>
                <strong>Customer:</strong>
                <p>{order.customer.name}</p>
                <p>{order.customer.phone}</p>
                <p>{order.customer.email}</p>
              </div>
              <div>
                <strong>Shipping Address:</strong>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} -{' '}
                  {order.address.postalCode}
                </p>
              </div>
            </div>

            <h2>Items Ordered</h2>
            <div className="confirmed-items-list">
              {order.items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="confirmed-item"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="confirmed-item-img"
                  />
                  <div className="confirmed-item-info">
                    <p className="confirmed-item-name">{item.name}</p>
                    <p className="confirmed-item-meta">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="confirmed-item-price">
                    {formatPrice(
                      (item.priceNumber || 0) * (item.quantity || 1)
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-total-row">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <Link to="/shop/men" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default OrderConfirmation;
