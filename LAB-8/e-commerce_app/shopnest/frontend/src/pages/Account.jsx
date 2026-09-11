import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Account = () => {
  const { isLoggedIn, user, login, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // When Logged In: Show Account Dashboard
  if (isLoggedIn) {
    return (
      <div className="container account-page mt-2 mb-2">
        <div className="account-dashboard-card card mx-auto">
          <div className="account-avatar">👤</div>
          <h2 className="dashboard-title">Welcome back, {user?.name || 'Shopper'}!</h2>
          <p className="dashboard-subtitle">Account Information</p>
          
          <div className="user-profile-details">
            <div className="profile-row">
              <span className="profile-label">Name</span>
              <span className="profile-val bold">{user?.name}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-val">{user?.email}</span>
            </div>
          </div>

          <div className="dashboard-actions-group mt-2">
            <button 
              type="button" 
              className="btn btn-primary btn-block" 
              onClick={() => navigate('/orders')}
            >
              View My Orders
            </button>

            <button 
              type="button" 
              className="btn btn-secondary btn-block mt-1" 
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>

            <button 
              type="button" 
              className="btn btn-danger btn-block mt-1" 
              onClick={() => {
                logout();
                addToast('Logged out successfully', 'info');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // When Logged Out: Show Login Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Valid email is required (e.g. user@example.com)';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (validate()) {
      setLoading(true);
      try {
        await login(formData.name, formData.email, formData.password);
        addToast(`Welcome back, ${formData.name}!`, 'success');
        navigate('/');
      } catch (err) {
        setAuthError(err.message || 'Login failed. Please check your credentials.');
        addToast('Login failed', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container account-page mt-2 mb-2">
      <div className="login-form-card card mx-auto">
        <div className="auth-header text-center">
          <span className="auth-icon">🔐</span>
          <h2>Account Login</h2>
          <p className="auth-sub">Enter your details to sign in or register instantly</p>
        </div>

        {authError && (
          <div className="auth-error-banner">
            <span>⚠</span> {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              id="name"
              type="text" 
              name="name" 
              className={errors.name ? 'input-error' : ''}
              placeholder="e.g. Riyan"
              value={formData.name} 
              onChange={handleChange} 
            />
            {errors.name && <span className="error-text small">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              name="email" 
              className={errors.email ? 'input-error' : ''}
              placeholder="e.g. user@example.com"
              value={formData.email} 
              onChange={handleChange} 
            />
            {errors.email && <span className="error-text small">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              name="password" 
              className={errors.password ? 'input-error' : ''}
              placeholder="At least 6 characters"
              value={formData.password} 
              onChange={handleChange} 
            />
            {errors.password && <span className="error-text small">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block mt-2" 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In / Register'}
          </button>
        </form>

        <div className="auth-footer-hint mt-2 text-center">
          <small>Demo authentication: Any name and 6+ character password works!</small>
        </div>
      </div>
    </div>
  );
};

export default Account;
