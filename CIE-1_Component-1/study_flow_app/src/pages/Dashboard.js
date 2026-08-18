import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBook, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiPlus, 
  FiCalendar, 
  FiTrendingUp, 
  FiClock, 
  FiRefreshCw,
  FiFileText,
  FiEdit3,
  FiList
} from 'react-icons/fi';
import { dashboardService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await dashboardService.getStats();
      setData(stats);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Unable to load dashboard data.');
      showError('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
    if (diffDays === -1) return 'Yesterday (Overdue)';
    if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    
    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading dashboard metrics..." />;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <FiAlertCircle className="error-icon" />
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-btn">
          <FiRefreshCw /> Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Academic Dashboard</h1>
          <p className="welcome-text">Overview of your courses, active deadlines, and learning progress.</p>
        </div>
        <button onClick={fetchDashboardData} className="refresh-btn" title="Refresh data">
          <FiRefreshCw /> Refresh
        </button>
      </header>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon-wrapper">
            <FiBook className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{data.totalCourses || 0}</span>
            <span className="stat-label">Total Courses</span>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon-wrapper">
            <FiList className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{data.activeTasks || 0}</span>
            <span className="stat-label">Active Tasks</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon-wrapper">
            <FiCheckCircle className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{data.completedTasks || 0}</span>
            <span className="stat-label">Completed Tasks</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon-wrapper">
            <FiFileText className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{data.totalAssignments || 0}</span>
            <span className="stat-label">Assignments</span>
          </div>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Left Column */}
        <div className="dashboard-main">
          {/* Upcoming Deadlines */}
          <section className="dashboard-card upcoming-deadlines">
            <div className="card-header">
              <h2>Upcoming Deadlines</h2>
              <Link to="/tasks" className="view-all-link">View Tasks</Link>
            </div>
            
            {(!data.upcomingDeadlines || data.upcomingDeadlines.length === 0) ? (
              <div className="empty-state-small">
                <FiCheckCircle className="empty-icon" />
                <p>No upcoming deadlines this week. You're all caught up!</p>
              </div>
            ) : (
              <ul className="deadline-list">
                {data.upcomingDeadlines.map((item) => (
                  <li key={`${item.type}-${item.id}`} className="deadline-item">
                    <div className="deadline-info">
                      <h3>{item.title}</h3>
                      <span className="deadline-type-tag">{item.type}</span>
                    </div>
                    <div className="deadline-meta">
                      <span className={`badge badge-priority-${(item.priority || 'medium').toLowerCase()}`}>
                        {item.priority || 'Medium'}
                      </span>
                      <span className={`due-date ${new Date(item.dueDate) < new Date() ? 'overdue' : ''}`}>
                        <FiClock className="meta-icon" />
                        {formatDate(item.dueDate)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent Activity */}
          <section className="dashboard-card recent-activity">
            <div className="card-header">
              <h2>Recent Activity</h2>
            </div>
            
            {(!data.recentActivity || data.recentActivity.length === 0) ? (
              <div className="empty-state-small">
                <p>No recent activity yet. Add courses or complete tasks to see logs here.</p>
              </div>
            ) : (
              <ul className="activity-list">
                {data.recentActivity.map((activity) => (
                  <li key={`${activity.type}-${activity.id}`} className="activity-item">
                    <div className="activity-indicator"></div>
                    <div className="activity-content">
                      <p className="activity-text">
                        <span className="activity-badge">{activity.type}</span>
                        {' '}
                        <span className="activity-title">{activity.title || activity.name}</span>
                        {activity.completed && <span className="activity-status-done"> (completed)</span>}
                      </p>
                      <span className="activity-time">{formatRelativeTime(activity.date)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="dashboard-sidebar">
          {/* Quick Actions */}
          <section className="dashboard-card quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <Link to="/tasks" className="action-btn">
                <FiPlus className="action-icon" />
                <span>Manage Tasks</span>
              </Link>
              <Link to="/courses" className="action-btn">
                <FiBook className="action-icon" />
                <span>View Courses</span>
              </Link>
              <Link to="/assignments" className="action-btn">
                <FiFileText className="action-icon" />
                <span>Assignments</span>
              </Link>
              <Link to="/notes" className="action-btn">
                <FiEdit3 className="action-icon" />
                <span>Study Notes</span>
              </Link>
              <Link to="/calendar" className="action-btn">
                <FiCalendar className="action-icon" />
                <span>Academic Calendar</span>
              </Link>
              <Link to="/progress" className="action-btn">
                <FiTrendingUp className="action-icon" />
                <span>Analytics & Progress</span>
              </Link>
            </div>
          </section>

          {/* Course Progress */}
          <section className="dashboard-card course-progress">
            <div className="card-header">
              <h2>Course Completion</h2>
              <Link to="/courses" className="view-all-link">All</Link>
            </div>
            
            {(!data.courseProgress || data.courseProgress.length === 0) ? (
              <div className="empty-state-small">
                <p>No courses added yet.</p>
              </div>
            ) : (
              <div className="progress-list">
                {data.courseProgress.map((course) => (
                  <div key={`course-${course.id}`} className="progress-item">
                    <div className="progress-header">
                      <span className="progress-name">{course.name}</span>
                      <span className="progress-percentage">{course.progress || 0}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${Math.min(100, Math.max(0, course.progress || 0))}%`,
                          backgroundColor: course.color || '#3b82f6'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
