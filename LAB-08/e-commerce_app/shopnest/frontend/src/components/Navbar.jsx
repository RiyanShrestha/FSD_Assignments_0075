import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    setMenuOpen(false);
    navigate('/account');
  };

  const closeMenu = () => setMenuOpen(false);

  const cartCount = getCartCount();

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="container nav-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">🛍️</span>
          <span className="brand-text">ShopNest</span>
        </Link>

        <button 
          className="hamburger-btn" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-menu ${menuOpen ? 'is-open' : ''}`}>
          <div className="nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink 
              to="/products" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Products
            </NavLink>

            <NavLink 
              to="/cart" 
              className={({ isActive }) => `nav-link nav-cart ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Cart
              {cartCount > 0 && (
                <span className="cart-badge-pill" aria-label={`${cartCount} items in cart`}>
                  {cartCount}
                </span>
              )}
            </NavLink>

            <NavLink 
              to="/orders" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Orders
            </NavLink>

            <NavLink 
              to="/account" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Account
            </NavLink>
          </div>

          <div className="nav-auth">
            {isLoggedIn ? (
              <div className="user-logged-box">
                <span className="user-welcome">Welcome, {user?.name || 'Shopper'}</span>
                <button 
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/account" 
                className="btn btn-primary btn-small"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
