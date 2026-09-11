const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-container">
    <div className="spinner" role="status" aria-label="Loading"></div>
    <p className="loading-message">{message}</p>
  </div>
);

export default LoadingSpinner;
