import React from 'react';
import './Toast.css';

/*
  Toast Component
  ---------------
  Displays a success notification after form submission.
  
  Props:
    - showToast (boolean) : controls whether the toast is visible
    - toastMessage (string) : the message to display

  This component demonstrates CONDITIONAL RENDERING:
    If showToast is false, the component returns null (renders nothing).
    If showToast is true, the toast UI is rendered.
*/

function Toast({ showToast, toastMessage }) {
  // Conditional Rendering — only render if showToast is true
  if (!showToast) {
    return null;
  }

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      <div className="toast">
        {/* Success icon */}
        <div className="toast__icon">✓</div>

        {/* Toast content */}
        <div className="toast__body">
          <span className="toast__title">{toastMessage}</span>
          <span className="toast__message">
            We'll review your application and get back to you soon.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Toast;
