import React from 'react';
import './HeroSection.css';

/*
  HeroSection Component
  ---------------------
  This is the left side of the split-screen layout.
  It displays branding, a heading, description, and abstract visuals.
  This component does NOT use state — it is purely presentational.
*/

function HeroSection() {
  return (
    <section className="hero-section" aria-label="InternHub branding">

      {/* Abstract floating shapes for visual interest */}
      <div className="hero-shapes">
        <div className="hero-shape hero-shape--1"></div>
        <div className="hero-shape hero-shape--2"></div>
        <div className="hero-shape hero-shape--3"></div>
        <div className="hero-shape hero-shape--4"></div>
        <div className="hero-shape hero-shape--5"></div>
      </div>

      {/* Glassmorphism decorative card */}
      <div className="hero-glass-card">
        <span className="hero-glass-card__icon">🚀</span>
        <span className="hero-glass-card__text">Career Growth</span>
      </div>

      {/* Logo */}
      <div className="hero-logo">
        <div className="hero-logo__icon">💼</div>
        <span className="hero-logo__text">InternHub</span>
      </div>

      {/* Main content */}
      <div className="hero-content">
        <h1 className="hero-content__heading">
          <span>Launch Your Career</span>
        </h1>
        <p className="hero-content__description">
          Apply for internships, gain real-world experience, and take the next
          step toward your professional future.
        </p>

        {/* Quick stats */}
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat__number">500+</span>
            <span className="hero-stat__label">Internships</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat__number">120+</span>
            <span className="hero-stat__label">Companies</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat__number">95%</span>
            <span className="hero-stat__label">Placement</span>
          </div>
        </div>
      </div>

      {/* Footer text */}
      <div className="hero-footer">
        <p className="hero-footer__text">Your next opportunity could start here.</p>
        <p className="hero-footer__tagline">Start your journey. Build your future.</p>
      </div>
    </section>
  );
}

export default HeroSection;
