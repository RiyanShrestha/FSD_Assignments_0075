import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, style = {} }) => {
  const getStyles = () => {
    const base = {
      padding: '0.625rem 1.25rem',
      borderRadius: 'var(--radius-sm)',
      fontWeight: '500',
      fontSize: '0.9rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      border: '1px solid transparent',
      transition: 'var(--transition)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      ...style
    };

    switch (variant) {
      case 'secondary':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-sm)'
        };
      case 'success':
        return {
          ...base,
          backgroundColor: 'var(--success)',
          color: '#ffffff',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)'
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: 'var(--danger)',
          color: '#ffffff',
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)'
        };
      case 'primary':
      default:
        return {
          ...base,
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
        };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={getStyles()}
      className={`btn-action btn-${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;
