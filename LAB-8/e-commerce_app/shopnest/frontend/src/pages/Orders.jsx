import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    setError('');
    getOrders()
      .then(data => {
        setOrders(data.orders || data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unable to load orders. Please try again.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner message="Loading orders..." />;

  if (error) {
    return (
      <div className="container mt-2">
        <ErrorMessage 
          title="Unable to load orders"
          message={error}
          onRetry={fetchOrders}
        />
      </div>
    );
  }

  return (
    <div className="container orders-page mt-2 mb-2">
      <div className="orders-page-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track and review your past purchases</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders found."
          message="Your completed orders will appear here."
          actionLabel="Start Shopping"
          actionLink="/products"
        />
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div key={order.id} className="order-card card">
                <div className="order-card-header">
                  <div className="order-meta-info">
                    <span className="order-id-badge">ORDER #{order.id}</span>
                    <span className="order-date-text">{formattedDate}</span>
                  </div>
                  <div className="order-status-pill">
                    ✓ {order.status || 'Confirmed'}
                  </div>
                </div>

                {order.customer && (
                  <div className="order-customer-info">
                    <span>Customer: <strong>{order.customer.name}</strong> ({order.customer.email})</span>
                  </div>
                )}

                <div className="order-items-table">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <div className="order-item-title-col">
                        <span className="order-item-bullet">•</span>
                        <span className="order-item-name">{item.name}</span>
                      </div>
                      <div className="order-item-qty-col">
                        × {item.quantity}
                      </div>
                      <div className="order-item-subtotal-col">
                        ₹{(item.subtotal || item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  {order.shipping !== undefined && order.shipping > 0 && (
                    <div className="order-fee-note">
                      <span>Shipping: ₹{order.shipping}</span>
                    </div>
                  )}
                  <div className="order-total-amount">
                    <span>Total: </span>
                    <strong className="total-highlight">₹{order.total.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
