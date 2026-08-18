import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
      textAlign: 'center',
      padding: '2rem',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      <FiAlertTriangle style={{ fontSize: '4rem', color: '#f59e0b', marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '6rem', fontWeight: 800, color: '#1e3a8a', margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: '#374151', marginTop: '0.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', maxWidth: '400px', marginBottom: '2rem', lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={e => e.target.style.backgroundColor = '#1d4ed8'}
        onMouseOut={e => e.target.style.backgroundColor = '#2563eb'}
      >
        <FiHome /> Go Home
      </Link>
    </div>
  );
};

export default NotFound;
