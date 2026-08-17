import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ cartCount, selectedCategory, onSelectCategory, searchQuery, onSearchChange }) {
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Redirect to home if not already there, so search filters catalog
    navigate('/');
  };

  const handleCategoryChange = (e) => {
    onSelectCategory(e.target.value);
    navigate('/');
  };

  return (
    <header className="amazon-header">
      <div className="header-top">
        {/* Logo */}
        <Link to="/" className="header-logo-link">
          <div className="header-logo">
            <span className="logo-text">amazon</span>
            <span className="logo-dot-com">.clone</span>
          </div>
        </Link>

        {/* Deliver to */}
        <div className="header-delivery">
          <span className="delivery-icon">📍</span>
          <div className="delivery-text">
            <span className="delivery-to">Deliver to</span>
            <span className="delivery-location">Nepal</span>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="header-search">
          <select 
            className="search-select" 
            value={selectedCategory} 
            onChange={handleCategoryChange}
          >
            <option value="All">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Computers">Computers</option>
            <option value="Smart Home">Smart Home</option>
          </select>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search Amazon-style Clone" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button type="submit" className="search-button">
            <span className="search-icon">🔍</span>
          </button>
        </form>

        {/* Right Nav Options */}
        <div className="header-right-nav">
          <div className="nav-option">
            <span className="nav-line-1">Hello, sign in</span>
            <span className="nav-line-2">Account & Lists</span>
          </div>
          
          <Link to="/orders" className="nav-option-link">
            <div className="nav-option">
              <span className="nav-line-1">Returns</span>
              <span className="nav-line-2">& Orders</span>
            </div>
          </Link>
          
          <Link to="/cart" className="nav-cart-link">
            <div className="nav-cart">
              <div className="cart-icon-container">
                <span className="cart-count">{cartCount}</span>
                <span className="cart-icon-img">🛒</span>
              </div>
              <span className="cart-text">Cart</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
