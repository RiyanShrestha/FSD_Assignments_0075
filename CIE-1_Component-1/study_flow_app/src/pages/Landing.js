import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBookOpen, FiCheckCircle, FiEdit3, FiCalendar, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { id: 1, icon: <FiBookOpen />, title: "Course Management", description: "Organize semesters, track credits, progress, and course details in one place." },
    { id: 2, icon: <FiCheckCircle />, title: "Task Tracking", description: "Stay on top of daily tasks with priority tags, due dates, and instant completion toggles." },
    { id: 3, icon: <FiFileTextIcon />, title: "Assignment Planner", description: "Monitor assignment milestones, categorize by urgency, and track received grades." },
    { id: 4, icon: <FiEdit3 />, title: "Smart Study Notes", description: "Capture structured lecture notes, revision cheat-sheets, and searchable topic summaries." },
    { id: 5, icon: <FiCalendar />, title: "Interactive Calendar", description: "Visualize deadlines, exams, and daily academic schedules with interactive day views." },
    { id: 6, icon: <FiTrendingUp />, title: "Progress Analytics", description: "Real-time analytics calculate your task completion rates and academic productivity." }
  ];

  return (
    <div className="landing-container">
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🎓 IBM SkillsBuild Academic Showcase</div>
          <h1 className="hero-title">StudyFlow</h1>
          <h2 className="hero-tagline">Your Personal Academic Workspace</h2>
          <p className="hero-subtitle">
            A student productivity platform designed to help you organize courses, track assignments, manage study notes, and master your academic workflow.
          </p>
          <div className="cta-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard <FiArrowRight style={{ marginLeft: 6 }} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started Free <FiArrowRight style={{ marginLeft: 6 }} />
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Login Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="features-section">
        <h2 className="section-title">Built for Modern Student Success</h2>
        <p className="section-subtitle">Everything you need to stay organized, focused, and ahead in your studies</p>
        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="demo-banner">
        <div className="demo-banner-content">
          <h3>Ready to boost your study productivity?</h3>
          <p>Login accepts any non-empty credentials so you can explore immediately.</p>
          <Link to="/login" className="btn btn-primary">
            Try Live Demo
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Built as a demonstration of IBM SkillsBuild Web Development Fundamentals</p>
        <p>&copy; {new Date().getFullYear()} StudyFlow. Pure Client-Side React SPA Architecture.</p>
      </footer>
    </div>
  );
};

// Simple icon wrapper
function FiFileTextIcon() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}

export default Landing;
