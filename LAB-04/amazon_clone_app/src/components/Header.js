import React from 'react';
import './Header.css';

function Header({ cartCount }) {
  return (
    <header className="amazon-header">
      <div className="header-top">
        {/* Logo */}
        <div className="header-logo">
          <span className="logo-text">amazon</span>
          <span className="logo-dot-com">.clone</span>
        </div>

        {/* Deliver to */}
        <div className="header-delivery">
          <span className="delivery-icon">📍</span>
          <div className="delivery-text">
            <span className="delivery-to">Deliver to</span>
            <span className="delivery-location">Nepal</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="header-search">
          <select className="search-select">
            <option>All</option>
            <option>Electronics</option>
            <option>Computers</option>
            <option>Smart Home</option>
          </select>
          <input type="text" className="search-input" placeholder="Search Amazon-style Clone" />
          <button className="search-button">
            <span className="search-icon">🔍</span>
          </button>
        </div>

        {/* Right Nav Options */}
        <div className="header-right-nav">
          <div className="nav-option">
            <span className="nav-line-1">Hello, sign in</span>
            <span className="nav-line-2">Account & Lists</span>
          </div>
          <div className="nav-option">
            <span className="nav-line-1">Returns</span>
            <span className="nav-line-2">& Orders</span>
          </div>
          <div className="nav-cart">
            <div className="cart-icon-container">
              <span className="cart-count">{cartCount}</span>
              <span className="cart-icon-img">🛒</span>
            </div>
            <span className="cart-text">Cart</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
