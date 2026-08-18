import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon, title, description, message, action, actionText, onAction }) => {
  const desc = description || message;
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      {title && <h3 className="empty-state-title">{title}</h3>}
      {desc && <p className="empty-state-description">{desc}</p>}
      {action ? (
        <div className="empty-state-action">{action}</div>
      ) : actionText && onAction ? (
        <div className="empty-state-action">
          <button className="btn-primary empty-btn" onClick={onAction}>
            {actionText}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default EmptyState;
