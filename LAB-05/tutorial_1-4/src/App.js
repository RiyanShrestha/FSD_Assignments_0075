import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import HTTPExplorer from './pages/HTTPExplorer';
import LayoutLab from './pages/LayoutLab';
import JavaScriptLab from './pages/JavaScriptLab';
import ReactComponentLab from './pages/ReactComponentLab';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  // Page Switcher
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'http-explorer':
        return <HTTPExplorer />;
      case 'layout-lab':
        return <LayoutLab />;
      case 'javascript-lab':
        return <JavaScriptLab />;
      case 'react-components':
        return <ReactComponentLab />;
      case 'home':
      default:
        return <Dashboard onNavigate={(section) => setActiveSection(section)} />;
    }
  };

  // Header Nav Link helper
  const renderNavLink = (id, label) => {
    const isActive = activeSection === id;
    return (
      <button
        onClick={() => setActiveSection(id)}
        style={{
          background: 'none',
          border: 'none',
          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: isActive ? '600' : '500',
          cursor: 'pointer',
          padding: '0.5rem 0.75rem',
          backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
          borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
          borderRadius: '0px',
          transition: 'var(--transition)'
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="app-container">
      {/* HEADER / NAVIGATION */}
      <header style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Logo / Brand Name */}
          <div 
            onClick={() => setActiveSection('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              cursor: 'pointer' 
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>🧪</span>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.2' }}>
                Web Dev Lab
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em' }}>
                BCA PRACTICALS
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexWrap: 'wrap'
          }}>
            {renderNavLink('home', 'Home')}
            {renderNavLink('http-explorer', 'HTTP Explorer')}
            {renderNavLink('layout-lab', 'Layout Lab')}
            {renderNavLink('javascript-lab', 'JavaScript Lab')}
            {renderNavLink('react-components', 'React Components')}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {renderActiveSection()}
      </main>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem 1.5rem',
        marginTop: 'auto',
        fontSize: '0.8rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>Web Development Tutorial Lab</strong> — BCA Practical Project
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Built using React • JavaScript • HTML • CSS
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
