import React from 'react';
import '../styles/Profile.css';
import avatarImg from '../assets/riyan_avatar.jpg';

const Profile = () => {
  return (
    <section id="profile" className="profile-section section-padding">
      <div className="profile-container">
        <div className="profile-grid">
          <div className="profile-image-container">
            <div className="profile-image-glow"></div>
            <img src={avatarImg} alt="Riyan Shrestha" className="profile-avatar" />
          </div>
          <div className="profile-details">
            <h2 className="profile-name">Riyan Shrestha</h2>
            <h3 className="profile-headline">Frontend Developer & UI/UX Designer</h3>
            <p className="profile-tagline">
              Dedicated to designing and developing fluid, user-centric web applications. Specializing in high-fidelity React interfaces, modern design systems, and responsive architectures.
            </p>
            <div className="profile-actions">
              <a
                href="https://www.linkedin.com/in/riyan-shrestha-11b962316"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                LinkedIn Profile
              </a>
              <a
                href="/resume.pdf"
                download="Riyan_Shrestha_Resume.pdf"
                className="btn btn-secondary"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
