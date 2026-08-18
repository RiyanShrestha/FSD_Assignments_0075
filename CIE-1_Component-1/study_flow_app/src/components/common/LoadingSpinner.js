import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullPage, size = 'medium', text = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div className="spinner-fullpage" role="status" aria-label="Loading">
        <div className={`spinner spinner-${size}`}></div>
        <p className="spinner-text">{text}</p>
      </div>
    );
  }

  return (
    <div className="spinner-container" role="status" aria-label="Loading">
      <div className={`spinner spinner-${size}`}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
