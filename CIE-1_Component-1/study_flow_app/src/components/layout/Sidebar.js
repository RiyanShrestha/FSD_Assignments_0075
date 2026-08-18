import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  FiGrid, FiBook, FiCheckSquare, FiFileText,
  FiEdit3, FiCalendar, FiTrendingUp, FiUser, FiLogOut
} from 'react-icons/fi';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/courses', icon: <FiBook />, label: 'Courses' },
  { to: '/tasks', icon: <FiCheckSquare />, label: 'Tasks' },
  { to: '/assignments', icon: <FiFileText />, label: 'Assignments' },
  { to: '/notes', icon: <FiEdit3 />, label: 'Notes' },
  { to: '/calendar', icon: <FiCalendar />, label: 'Calendar' },
  { to: '/progress', icon: <FiTrendingUp />, label: 'Progress' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">StudyFlow</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-link user-nav ${isActive ? 'nav-link-active' : ''}`}
          onClick={onClose}
        >
          <span className="nav-icon"><FiUser /></span>
          <span className="nav-label">{user?.name || 'Profile'}</span>
        </NavLink>
        <button className="nav-link logout-btn" onClick={handleLogout} aria-label="Log out">
          <span className="nav-icon"><FiLogOut /></span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
