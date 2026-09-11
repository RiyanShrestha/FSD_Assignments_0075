import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = '📦',
  title = 'No items found',
  message = 'Try checking back later or adjusting your filters.',
  actionLabel,
  actionLink,
  onActionClick
}) => {
  return (
    <div className="empty-state-card card text-center">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      
      {actionLink && (
        <Link to={actionLink} className="btn btn-primary mt-1">
          {actionLabel}
        </Link>
      )}

      {onActionClick && (
        <button type="button" className="btn btn-primary mt-1" onClick={onActionClick}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
