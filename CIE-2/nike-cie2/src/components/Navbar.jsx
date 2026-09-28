import './Navbar.css';

function Navbar() {
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
        <a href="/" className="nike-logo">
          NIKE
        </a>

        {/* Navigation links */}
        <div className="nav-links">
          <a href="/">New & Featured</a>
          <a href="/men">Men</a>
          <a href="/women">Women</a>
          <a href="/kids">Kids</a>
          <a href="/jordan">Jordan</a>
          <a href="/sale">Sale</a>
        </div>

        {/* Right side actions */}
        <div className="nav-actions">
          <button className="search-box">
            <span className="search-icon">⌕</span>
            <span>Search</span>
          </button>

          <button className="nav-icon" aria-label="Favorites">
            ♡
          </button>

          <button className="nav-icon" aria-label="Shopping bag">
            🛍
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;