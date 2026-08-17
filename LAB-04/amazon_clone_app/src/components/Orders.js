import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Orders.css';

function Orders({ ordersList }) {
  const location = useLocation();
  const latestOrderId = location.state?.latestOrderId;

  // Find the latest order details if we just checked out
  const latestOrder = latestOrderId 
    ? ordersList.find(o => o.orderId === latestOrderId)
    : null;

  return (
    <div className="orders-page-container">
      {/* Thank You Banner (only shown if navigated here after checkout) */}
      {latestOrder && (
        <div className="order-success-banner">
          <div className="banner-left">
            <span className="success-check-icon">✓</span>
          </div>
          <div className="banner-right">
            <h2 className="success-title">Order placed, thank you!</h2>
            <p className="success-subtitle">
              Confirmation will be sent to your email. We'll send you updates as your order ships.
            </p>
            <div className="success-delivery-info">
              <span><b>Delivery date: </b>{latestOrder.estimatedDelivery}</span>
            </div>
            
            {/* Visual Delivery Tracker */}
            <div className="delivery-tracker">
              <div className="tracker-step completed">
                <div className="tracker-bullet"></div>
                <span>Ordered</span>
              </div>
              <div className="tracker-line completed"></div>
              <div className="tracker-step active">
                <div className="tracker-bullet"></div>
                <span>Shipped</span>
              </div>
              <div className="tracker-line"></div>
              <div className="tracker-step">
                <div className="tracker-bullet"></div>
                <span>Out for delivery</span>
              </div>
              <div className="tracker-line"></div>
              <div className="tracker-step">
                <div className="tracker-bullet"></div>
                <span>Delivered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List Header */}
      <h1 className="orders-page-title">Your Orders</h1>

      {ordersList.length === 0 ? (
        <div className="orders-empty-state">
          <h3>No Orders Found</h3>
          <p>Looks like you haven't placed any orders yet.</p>
          <Link to="/" className="shop-now-orders-btn">Go to Shop</Link>
        </div>
      ) : (
        <div className="orders-list">
          {ordersList.map((order) => (
            <div key={order.orderId} className="order-history-card">
              
              {/* Order Header Panel */}
              <div className="order-card-header">
                <div className="header-col">
                  <span className="header-label">ORDER PLACED</span>
                  <span className="header-value">{order.date}</span>
                </div>
                <div className="header-col">
                  <span className="header-label">TOTAL</span>
                  <span className="header-value font-bold">${order.pricing.total.toFixed(2)}</span>
                </div>
                <div className="header-col">
                  <span className="header-label">SHIP TO</span>
                  <span className="header-value ship-to-name">
                    {order.shippingAddress.fullName}
                    <div className="ship-to-dropdown">
                      <p><b>{order.shippingAddress.fullName}</b></p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p>Phone: {order.shippingAddress.phone || 'N/A'}</p>
                    </div>
                  </span>
                </div>
                <div className="header-col-right">
                  <span className="header-label">ORDER # {order.orderId}</span>
                  <span className="header-actions">
                    <span className="header-link">View order details</span>
                    <span className="divider-bar">|</span>
                    <span className="header-link">Invoice</span>
                  </span>
                </div>
              </div>

              {/* Order Body Panel */}
              <div className="order-card-body">
                <div className="order-status-row">
                  <h4>Arriving by {order.estimatedDelivery}</h4>
                  <span className="badge-prime">✓ prime</span>
                </div>

                <div className="order-items-grid">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item-card">
                      <div className="order-item-inner">
                        <img src={item.image} alt={item.name} className="order-item-thumbnail" />
                        <div className="order-item-details">
                          <Link to={`/product/${item.id}`} className="order-item-title-link">
                            {item.name}
                          </Link>
                          <span className="order-item-qty">Qty: {item.quantity}</span>
                          <span className="order-item-price-span">${item.price.toFixed(2)}</span>
                          <button className="buy-again-btn">
                            <span className="buy-again-icon">♻️</span> Buy it again
                          </button>
                        </div>
                      </div>
                      <div className="order-item-actions-col">
                        <button className="action-button primary-action">Track package</button>
                        <button className="action-button">Return items</button>
                        <button className="action-button">Write a product review</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
