import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="netflix-header">
      <div className="header-left">
        <div className="netflix-logo">
          RIYAN
        </div>
        <nav className="header-nav">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#tv-shows" className="nav-link">TV Shows</a>
          <a href="#movies" className="nav-link">Movies</a>
          <a href="#new-popular" className="nav-link">New & Popular</a>
          <a href="#my-list" className="nav-link">My List</a>
          <a href="#browse-languages" className="nav-link">Browse by Languages</a>
        </nav>
      </div>

      <div className="header-right">
        <button className="icon-btn search-btn" aria-label="Search">
          <svg viewBox="0 0 24 24" className="icon-svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor" />
          </svg>
        </button>
        
        <button className="icon-btn notification-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" className="icon-svg">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor" />
          </svg>
        </button>

        <div className="profile-menu">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
            alt="User Avatar" 
            className="avatar-img" 
          />
          <span className="caret"></span>
        </div>
      </div>
    </header>
  );
}

export default Header;
