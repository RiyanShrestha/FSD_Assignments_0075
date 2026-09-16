import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-grid">
      <div className="footer-brand-col">
        <div className="footer-logo">
          <span>🛍️</span>
          <h3>ShopNest</h3>
        </div>
        <p className="footer-desc">
          Your modern tech & lifestyle companion. Delivering premium quality gear with seamless ordering and guaranteed satisfaction.
        </p>
      </div>

      <div className="footer-links-col">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">All Products</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/orders">My Orders</Link></li>
          <li><Link to="/account">Account / Login</Link></li>
        </ul>
      </div>

      <div className="footer-info-col">
        <h4>About Project</h4>
        <p>College Full-Stack Development Assignment demonstrating React.js, Express.js REST API, and responsive UI design.</p>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="container footer-bottom-inner">
        <p>&copy; {new Date().getFullYear()} ShopNest. All rights reserved.</p>
        <p className="footer-badge">React 18 + Node.js + Express</p>
      </div>
    </div>
  </footer>
);

export default Footer;
