import React from 'react';
import './CartItem.css';

function CartItem({ item, onUpdateQty, onDelete }) {
  // Render stars helper
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += '★';
      } else if (i === fullStars && hasHalf) {
        stars += '★'; // Simplified stars representation for simple CSS render
      } else {
        stars += '☆';
      }
    }
    return stars;
  };

  return (
    <div className="cart-item">
      {/* Product Image */}
      <div className="cart-item-image-container">
        <img src={item.image} alt={item.name} className="cart-item-image" />
      </div>

      {/* Product Info */}
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        
        <div className="cart-item-rating">
          <span className="stars-label">{renderStars(item.rating)}</span>
          <span className="rating-val">{item.rating}</span>
        </div>

        <div className="cart-item-status">In Stock</div>

        <div className="cart-item-actions">
          {/* Quantity Selector */}
          <div className="quantity-selector">
            <button 
              className="qty-btn" 
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button 
              className="qty-btn" 
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>

          <span className="action-divider">|</span>
          
          <button className="action-btn delete-btn" onClick={() => onDelete(item.id)}>
            Delete
          </button>
          
          <span className="action-divider">|</span>
          
          <button className="action-btn save-btn">
            Save for later
          </button>
        </div>
      </div>

      {/* Product Price */}
      <div className="cart-item-price">
        ${(item.price).toFixed(2)}
      </div>
    </div>
  );
}

export default CartItem;
