const ErrorMessage = ({ title = 'Something went wrong.', message = 'An unexpected error occurred.', onRetry }) => (
  <div className="error-card card text-center">
    <div className="error-icon">✕</div>
    <h3>{title}</h3>
    <p className="error-description">{message}</p>
    {onRetry && (
      <button className="btn btn-secondary mt-1" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;
