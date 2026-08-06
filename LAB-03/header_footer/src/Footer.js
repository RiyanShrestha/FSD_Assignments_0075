import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="netflix-footer">
      <div className="footer-container">
        <div className="social-links">
          {/* Social media placeholder icons */}
          <a href="#facebook" className="social-icon" aria-label="Facebook">
            <svg viewBox="0 0 24 24" className="footer-icon"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" fill="currentColor"/></svg>
          </a>
          <a href="#instagram" className="social-icon" aria-label="Instagram">
            <svg viewBox="0 0 24 24" className="footer-icon"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor"/></svg>
          </a>
          <a href="#twitter" className="social-icon" aria-label="Twitter">
            <svg viewBox="0 0 24 24" className="footer-icon"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="currentColor"/></svg>
          </a>
          <a href="#youtube" className="social-icon" aria-label="YouTube">
            <svg viewBox="0 0 24 24" className="footer-icon"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/></svg>
          </a>
        </div>

        <div className="footer-links-grid">
          <ul className="footer-links-col">
            <li><a href="#audio-subtitles">Audio and Subtitles</a></li>
            <li><a href="#media-center">Media Center</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#contact-us">Contact Us</a></li>
          </ul>
          <ul className="footer-links-col">
            <li><a href="#audio-description">Audio Description</a></li>
            <li><a href="#investor-relations">Investor Relations</a></li>
            <li><a href="#legal-notices">Legal Notices</a></li>
          </ul>
          <ul className="footer-links-col">
            <li><a href="#help-center">Help Center</a></li>
            <li><a href="#jobs">Jobs</a></li>
            <li><a href="#cookie-preferences">Cookie Preferences</a></li>
          </ul>
          <ul className="footer-links-col">
            <li><a href="#gift-cards">Gift Cards</a></li>
            <li><a href="#terms-of-use">Terms of Use</a></li>
            <li><a href="#corporate-information">Corporate Information</a></li>
          </ul>
        </div>

        <div className="language-selector-container">
          <button className="language-selector-btn">
            <svg viewBox="0 0 24 24" className="lang-icon">
              <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.13C11.4 8.53 10.4 10.51 9 12.28c-.83-.93-1.49-1.92-2-3H5c.55 1.48 1.4 2.9 2.52 4.14L3.8 17.07l1.42 1.42L9 14.84l3.14 3.12 1.43-1.41zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="currentColor"/>
            </svg>
            <span>English</span>
            <span className="caret"></span>
          </button>
        </div>

        <p className="footer-country">Netflix India</p>
      </div>
    </footer>
  );
}

export default Footer;
