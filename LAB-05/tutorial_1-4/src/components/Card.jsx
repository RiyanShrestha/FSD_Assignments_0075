import React from 'react';

const Card = ({ children, className = '', title, subtitle, hoverable = false }) => {
  const cardStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-md)',
    transition: 'var(--transition)',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div className={`card-base ${className}`} style={cardStyle}>
      {title && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
          {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
