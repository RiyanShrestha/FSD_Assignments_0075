import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { addToast } = useToast();
  const [errorMsg, setErrorMsg] = useState('');

  const { product, quantity } = item;

  const handleQtyChange = (e) => {
    const val = e.target.value;
    if (val === '') return;
    const res = updateQuantity(product.id, val);
    if (!res.success) {
      setErrorMsg(res.message);
      addToast(res.message, 'warning');
    } else {
      setErrorMsg('');
    }
  };

  const handleMinus = () => {
    if (quantity > 1) {
      const res = updateQuantity(product.id, quantity - 1);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setErrorMsg('');
      }
    }
  };

  const handlePlus = () => {
    if (quantity < product.stock) {
      const res = updateQuantity(product.id, quantity + 1);
      if (!res.success) {
        setErrorMsg(res.message);
        addToast(res.message, 'warning');
      } else {
        setErrorMsg('');
      }
    } else {
      const msg = `Only ${product.stock} items are available in stock.`;
      setErrorMsg(msg);
      addToast(msg, 'warning');
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
    addToast(`Removed ${product.name} from cart`, 'info');
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image-wrap">
        <img 
          src={product.image} 
          alt={product.name} 
          className="cart-item-img"
          onError={handleImageError}
        />
      </div>

      <div className="cart-item-info">
        <span className="category-badge-small">{product.category}</span>
        <h4 className="cart-item-name">{product.name}</h4>
        <p className="cart-item-price">₹{product.price.toLocaleString('en-IN')} each</p>
        <span className="cart-item-stock-info">Available: {product.stock} in stock</span>
      </div>

      <div className="cart-item-controls">
        <div className="qty-controls">
          <button 
            type="button"
            className="qty-btn"
            onClick={handleMinus} 
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input 
            type="number" 
            className="qty-input"
            value={quantity} 
            onChange={handleQtyChange}
            min="1"
            max={product.stock}
            aria-label="Quantity"
          />
          <button 
            type="button"
            className="qty-btn"
            onClick={handlePlus} 
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {errorMsg && <p className="cart-item-error">{errorMsg}</p>}
      </div>

      <div className="cart-item-subtotal">
        <span className="subtotal-label">Subtotal</span>
        <span className="subtotal-amount">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
      </div>

      <div className="cart-item-remove">
        <button 
          type="button"
          className="btn-icon-danger" 
          onClick={handleRemove}
          title="Remove item"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
