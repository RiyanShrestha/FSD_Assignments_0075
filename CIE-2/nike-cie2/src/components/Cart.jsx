import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  getCartSubtotal,
} from '../utils/cart';
import { formatPrice } from '../data/products';
import './Cart.css';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial load
    setCart(getCart());

    // Listen to changes
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

  const handleUpdateQty = (id, size, delta) => {
    const updated = updateCartQuantity(id, size, delta);
    setCart(updated);
  };

  const handleRemove = (id, size) => {
    const updated = removeFromCart(id, size);
    setCart(updated);
  };

  const subtotal = getCartSubtotal(cart);
  const total = subtotal;

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <h1 className="cart-title">Bag</h1>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <h2>Your Bag is empty</h2>
            <p>Once you add items to your bag, they will appear here.</p>
            <Link to="/shop/men" className="shop-now-btn">
              Explore Shoes
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item) => {
                const itemTotal = (item.priceNumber || 0) * (item.quantity || 1);

                return (
                  <article
                    key={`${item.id}-${item.size}`}
                    className="cart-item"
                  >
                    <div className="cart-item-image">
                      <Link to={`/product/${item.id}`}>
                        <img src={item.image} alt={item.name} />
                      </Link>
                    </div>

                    <div className="cart-item-details">
                      <div>
                        <div className="cart-item-header">
                          <Link
                            to={`/product/${item.id}`}
                            className="cart-item-name"
                          >
                            {item.name}
                          </Link>
                          <span className="cart-item-price">
                            {formatPrice(itemTotal)}
                          </span>
                        </div>

                        <p className="cart-item-meta">Size: {item.size}</p>
                        <p className="cart-item-meta">Price: {item.price}</p>
                      </div>

                      <div className="cart-item-actions">
                        <div className="quantity-control">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleUpdateQty(item.id, item.size, -1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="qty-display">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleUpdateQty(item.id, item.size, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleRemove(item.id, item.size)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="cart-summary">
              <h2 className="summary-title">Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Estimated Delivery & Handling</span>
                <span>Free</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Cart;
