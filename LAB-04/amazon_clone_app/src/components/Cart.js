import React from 'react';
import CartItem from './CartItem';
import './Cart.css';

function Cart({ cartItems, onUpdateQty, onDelete }) {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-left-section">
      <div className="cart-container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        {cartItems.length > 0 && (
          <div className="cart-header-row">
            <span className="price-label">Price</span>
          </div>
        )}

        <hr className="cart-divider" />

        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <h2>Your Amazon-style cart is empty.</h2>
            <p>Please add some items to your shopping cart to proceed.</p>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onUpdateQty={onUpdateQty} 
                onDelete={onDelete} 
              />
            ))}
            
            <div className="cart-subtotal-row">
              Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}):{' '}
              <span className="subtotal-bold">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
