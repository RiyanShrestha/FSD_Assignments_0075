import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <h2>NIKE</h2>
          <p>Move your way.</p>
        </div>

        <div className="footer-column">
          <h3>Get Help</h3>
          <p>Order Status</p>
          <p>Shipping & Delivery</p>
          <p>Returns</p>
          <p>Contact Us</p>
        </div>

        <div className="footer-column">
          <h3>About Nike</h3>
          <p>News</p>
          <p>Careers</p>
          <p>Investors</p>
          <p>Sustainability</p>
        </div>

        <div className="footer-column">
          <h3>Follow Us</h3>
          <p>Instagram</p>
          <p>Facebook</p>
          <p>YouTube</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Nike. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;