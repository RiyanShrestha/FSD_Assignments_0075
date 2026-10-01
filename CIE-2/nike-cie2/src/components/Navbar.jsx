import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, getCartCount } from '../utils/cart';
import { getWishlistCount } from '../utils/wishlist';
import './Navbar.css';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateCounts = () => {
      setCartCount(getCartCount(getCart()));
      setWishlistCount(getWishlistCount());
    };

    updateCounts();

    window.addEventListener('cartChange', updateCounts);
    window.addEventListener('wishlistChange', updateCounts);
    window.addEventListener('storage', updateCounts);

    return () => {
      window.removeEventListener('cartChange', updateCounts);
      window.removeEventListener('wishlistChange', updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop/all?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/shop/all');
    }
  };

  return (
    <header className="navbar-wrapper">
      {/* Top utility bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span>Find a Store</span>
        </div>

        <div className="top-bar-right">
          <span>Help</span>
          <span>Join Us</span>
          <span>Sign In</span>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="main-navbar">
        {/* Nike logo */}
        <Link to="/" className="nike-logo">
          NIKE
        </Link>

        {/* Navigation links */}
        <div className="nav-links">
          <Link to="/">New & Featured</Link>
          <Link to="/shop/men">Men</Link>
          <Link to="/shop/women">Women</Link>
          <Link to="/shop/all">All Shoes</Link>
          <Link to="/shop/sale">Sale</Link>
        </div>

        {/* Right side actions */}
        <div className="nav-actions">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <button type="submit" className="search-icon" aria-label="Search">
              ⌕
            </button>
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <Link
            to="/wishlist"
            className="nav-icon-link"
            aria-label={`Favorites, ${wishlistCount} items`}
          >
            <span>♡</span>
            {wishlistCount > 0 && (
              <span className="nav-badge">{wishlistCount}</span>
            )}
          </Link>

          <Link
            to="/cart"
            className="nav-icon-link"
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <span>🛍</span>
            {cartCount > 0 && (
              <span className="nav-badge">{cartCount}</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;