import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      showError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      // Frontend-only login accepts any non-empty credentials
      login(email.trim(), password);
      showSuccess('Login successful');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>StudyFlow</h2>
          <p>Welcome back! Sign in to your workspace</p>
        </div>

        <div className="auth-demo-hint">
          💡 <strong>Demo Mode:</strong> Enter any email and password to log in.
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }));
              }} 
              placeholder="e.g. riyan@example.com"
              className={validationErrors.email ? 'input-error' : ''}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
            {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: '' }));
              }} 
              placeholder="Enter any password"
              className={validationErrors.password ? 'input-error' : ''}
              disabled={loading}
              autoComplete="current-password"
            />
            {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
