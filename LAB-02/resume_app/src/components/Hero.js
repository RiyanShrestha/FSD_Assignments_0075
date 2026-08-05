import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-glow"></div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Available for Opportunities
          </div>
          <h1 className="hero-title">
            Crafting Premium Digital <span className="gradient-text">Experiences</span>
          </h1>
          <p className="hero-subtitle">
            Frontend developer and UI/UX designer specialized in building sleek, high-performance, and visually stunning web applications.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
              View My Work
            </button>
            <button className="btn btn-secondary" onClick={() => scrollToSection('contact')}>
              Let's Connect
            </button>
          </div>
        </div>
      </div>
      <div className="hero-scroll-indicator" onClick={() => scrollToSection('profile')}>
        <span className="mouse">
          <span className="wheel"></span>
        </span>
        <span className="scroll-text">Scroll Down</span>
      </div>
    </section>
  );
};

export default Hero;
