import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu } from 'react-icons/fi';
import './Header.css';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/courses': 'Courses',
  '/tasks': 'Tasks',
  '/assignments': 'Assignments',
  '/notes': 'Notes',
  '/calendar': 'Calendar',
  '/progress': 'Progress & Analytics',
  '/profile': 'Profile & Settings',
};

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.startsWith('/courses/')) return 'Course Details';
    return pageTitles[location.pathname] || 'StudyFlow';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = user?.name || 'Student';
  const firstName = displayName.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <header className="app-header" role="banner">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <FiMenu />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{getPageTitle()}</h1>
          {location.pathname === '/dashboard' && (
            <p className="header-subtitle">{getGreeting()}, {firstName}!</p>
          )}
        </div>
      </div>
      <div className="header-right">
        <div className="header-user-info">
          <span className="header-user-name">{displayName}</span>
          <span className="header-user-role">Student</span>
        </div>
        <div className="header-avatar" title={displayName}>
          {initial}
        </div>
      </div>
    </header>
  );
};

export default Header;
