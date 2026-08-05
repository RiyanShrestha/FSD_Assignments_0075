import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <section id="about" className="about-section section-padding">
      <div className="about-container">
        <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
        <div className="about-grid">
          <div className="about-card main-summary">
            <h3>Professional Summary</h3>
            <p className="summary-text">
              Riyan Shrestha is a dedicated student pursuing BCA(Hons.) at RV University in Bangalore, India. Passionate about frontend engineering, user experience, and building modern, responsive web applications.
            </p>
            <div className="placeholder-alert">
              <span className="placeholder-tag">Placeholder</span>
              <p className="placeholder-text">Add professional summary / detail custom industry experience.</p>
            </div>
          </div>
          <div className="about-card fast-facts">
            <h3>Quick Facts</h3>
            <ul className="facts-list">
              <li>
                <span className="fact-label">Location:</span>
                <span className="fact-value">Bangalore, India</span>
              </li>
              <li>
                <span className="fact-label">University:</span>
                <span className="fact-value">RV University</span>
              </li>
              <li>
                <span className="fact-label">Honors:</span>
                <span className="fact-value">BCA(Hons.)</span>
              </li>
              <li>
                <span className="fact-label">Role:</span>
                <span className="fact-value">Student</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
