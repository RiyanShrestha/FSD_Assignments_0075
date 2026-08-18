import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService, initializeSeedData } from '../services/api';
import storage from '../services/storage';
import { useToast } from '../context/ToastContext';
import { 
  FiMail, FiLock, FiBell, FiMoon, 
  FiSave, FiRefreshCw
} from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Riyan Shrestha',
    email: user?.email || 'riyan@example.com',
    major: 'Computer Science & Software Engineering',
    university: 'Stanford University / Academic Partner',
    semester: 'Fall 2026',
    bio: 'Junior Software Engineering student passionate about full-stack web development, UX evaluation, and data systems.'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    emailNotifications: false,
    taskReminders: true
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const prefs = profileService.getPreferences();
    setPreferences(prefs);
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      setProfileErrors({ name: 'Name is required' });
      showError('Name is required');
      return;
    }

    setSavingProfile(true);
    try {
      await profileService.update(profileForm);
      updateUser({ name: profileForm.name, email: profileForm.email });
      showSuccess('Profile updated');
    } catch (err) {
      showError('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      showError('Please check password fields');
      return;
    }

    setChangingPassword(true);
    try {
      await profileService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      showSuccess('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showError('Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleTogglePref = (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    profileService.updatePreferences(updated);
    showSuccess('Preferences saved');
  };

  const handleThemeChange = (newTheme) => {
    const updated = { ...preferences, theme: newTheme };
    setPreferences(updated);
    profileService.updatePreferences(updated);
    document.documentElement.setAttribute('data-theme', newTheme);
    showSuccess(`Theme changed to ${newTheme}`);
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all demo data back to default initial seed?')) {
      storage.clearAll();
      await initializeSeedData();
      showInfo('Demo data reset successfully. Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="profile-page">
      <header className="page-header">
        <div>
          <h1>Profile & Preferences</h1>
          <p className="page-subtitle">Manage your student details, theme settings, and application defaults</p>
        </div>
      </header>

      <div className="profile-layout">
        {/* Left Column: Profile Info Form */}
        <div className="profile-column">
          <section className="profile-card">
            <h2>Personal Information</h2>
            <form onSubmit={handleSaveProfile} noValidate>
              <div className="form-group">
                <label htmlFor="prof-name">Full Name</label>
                <input
                  type="text"
                  id="prof-name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className={profileErrors.name ? 'input-error' : ''}
                />
                {profileErrors.name && <span className="error-text">{profileErrors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="prof-email">Email Address</label>
                <input
                  type="email"
                  id="prof-email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="prof-major">Major / Field</label>
                  <input
                    type="text"
                    id="prof-major"
                    name="major"
                    value={profileForm.major}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prof-sem">Academic Term</label>
                  <input
                    type="text"
                    id="prof-sem"
                    name="semester"
                    value={profileForm.semester}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prof-uni">University / Institution</label>
                <input
                  type="text"
                  id="prof-uni"
                  name="university"
                  value={profileForm.university}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="prof-bio">Bio</label>
                <textarea
                  id="prof-bio"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows={3}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={savingProfile}>
                <FiSave /> {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </section>

          {/* Change Password */}
          <section className="profile-card" style={{ marginTop: 24 }}>
            <h2>Security & Password</h2>
            <form onSubmit={handleSavePassword} noValidate>
              <div className="form-group">
                <label htmlFor="curr-pass">Current Password</label>
                <input
                  type="password"
                  id="curr-pass"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="new-pass">New Password</label>
                  <input
                    type="password"
                    id="new-pass"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Min. 6 characters"
                    className={passwordErrors.newPassword ? 'input-error' : ''}
                  />
                  {passwordErrors.newPassword && <span className="error-text">{passwordErrors.newPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="conf-pass">Confirm Password</label>
                  <input
                    type="password"
                    id="conf-pass"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Re-enter new password"
                    className={passwordErrors.confirmPassword ? 'input-error' : ''}
                  />
                  {passwordErrors.confirmPassword && <span className="error-text">{passwordErrors.confirmPassword}</span>}
                </div>
              </div>

              <button type="submit" className="btn-secondary" disabled={changingPassword}>
                <FiLock /> {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: Preferences & Settings */}
        <div className="profile-column">
          <section className="profile-card">
            <h2>Preferences & Theme</h2>
            
            <div className="pref-item">
              <div className="pref-info">
                <FiMoon className="pref-icon" />
                <div>
                  <span className="pref-title">Theme Mode</span>
                  <p className="pref-desc">Select visual display theme</p>
                </div>
              </div>
              <select
                value={preferences.theme || 'light'}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="pref-select"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
              </select>
            </div>

            <div className="pref-item">
              <div className="pref-info">
                <FiBell className="pref-icon" />
                <div>
                  <span className="pref-title">Task Reminders</span>
                  <p className="pref-desc">Show deadline banners and alerts</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.taskReminders}
                onChange={() => handleTogglePref('taskReminders')}
                className="pref-toggle"
              />
            </div>

            <div className="pref-item">
              <div className="pref-info">
                <FiMail className="pref-icon" />
                <div>
                  <span className="pref-title">Email Digests</span>
                  <p className="pref-desc">Weekly academic progress digests</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={() => handleTogglePref('emailNotifications')}
                className="pref-toggle"
              />
            </div>
          </section>

          {/* Reset Demo Data Card */}
          <section className="profile-card demo-card" style={{ marginTop: 24 }}>
            <h2>Developer & Demo Controls</h2>
            <p className="pref-desc" style={{ marginBottom: 16 }}>
              Reset local student data back to initial academic seed state (Web Dev, UX Evaluation, Database Systems, Data Structures, OS).
            </p>
            <button className="btn-danger" onClick={handleResetData}>
              <FiRefreshCw /> Reset Demo Dataset
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
