import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <a href="#home" className="footer-logo" onClick={handleBackToTop}>
            Riyan<span className="gradient-text">.S</span>
          </a>
          <p className="footer-text">
            © {currentYear} Riyan Shrestha. All rights reserved. Designed & built with React.
          </p>
        </div>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/riyan-shrestha-11b962316" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <span className="separator">|</span>
          <a href="#home" onClick={handleBackToTop}>
            Back to Top
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
