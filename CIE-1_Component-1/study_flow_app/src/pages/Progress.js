import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FiTrendingUp, FiCheckCircle, FiBookOpen, 
  FiAward, FiRefreshCw
} from 'react-icons/fi';
import { coursesService, tasksService, assignmentsService, notesService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Progress.css';

const Progress = () => {
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showError } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [coursesData, tasksData, assignmentsData, notesData] = await Promise.all([
        coursesService.getAll(),
        tasksService.getAll(),
        assignmentsService.getAll(),
        notesService.getAll()
      ]);
      setCourses(coursesData);
      setTasks(tasksData);
      setAssignments(assignmentsData);
      setNotes(notesData);
    } catch (err) {
      showError('Failed to load progress analytics');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real Calculated Metrics
  const analytics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.completed || a.status === 'completed').length;
    const assignmentCompletionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

    const allItems = totalTasks + totalAssignments;
    const allCompleted = completedTasks + completedAssignments;
    const overallCompletionRate = allItems > 0 ? Math.round((allCompleted / allItems) * 100) : 0;

    // Graded Assignments
    const gradedAssignments = assignments.filter(a => a.grade !== null && a.grade !== undefined);
    const avgGrade = gradedAssignments.length > 0
      ? Math.round(gradedAssignments.reduce((acc, a) => acc + (a.grade / (a.maxGrade || 100)) * 100, 0) / gradedAssignments.length)
      : null;

    // Priority Task Distribution
    const highTasks = tasks.filter(t => t.priority === 'high');
    const highDone = highTasks.filter(t => t.completed).length;
    const highRate = highTasks.length > 0 ? Math.round((highDone / highTasks.length) * 100) : 0;

    const medTasks = tasks.filter(t => t.priority === 'medium');
    const medDone = medTasks.filter(t => t.completed).length;
    const medRate = medTasks.length > 0 ? Math.round((medDone / medTasks.length) * 100) : 0;

    const lowTasks = tasks.filter(t => t.priority === 'low');
    const lowDone = lowTasks.filter(t => t.completed).length;
    const lowRate = lowTasks.length > 0 ? Math.round((lowDone / lowTasks.length) * 100) : 0;

    // Total Credits
    const totalCredits = courses.reduce((acc, c) => acc + (Number(c.credits) || 3), 0);

    return {
      overallCompletionRate,
      totalTasks,
      completedTasks,
      taskCompletionRate,
      totalAssignments,
      completedAssignments,
      assignmentCompletionRate,
      avgGrade,
      gradedCount: gradedAssignments.length,
      highRate,
      highDone,
      highTotal: highTasks.length,
      medRate,
      medDone,
      medTotal: medTasks.length,
      lowRate,
      lowDone,
      lowTotal: lowTasks.length,
      totalCourses: courses.length,
      totalNotes: notes.length,
      totalCredits
    };
  }, [courses, tasks, assignments, notes]);

  if (loading) return <LoadingSpinner fullPage text="Calculating study analytics..." />;

  return (
    <div className="progress-page">
      <header className="page-header">
        <div>
          <h1>Progress & Analytics</h1>
          <p className="page-subtitle">Real-time academic performance, completion trends, and study metrics</p>
        </div>
        <button className="btn-secondary" onClick={fetchData}>
          <FiRefreshCw /> Refresh Metrics
        </button>
      </header>

      {/* Main Stats Row */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon-wrapper">
            <FiTrendingUp className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{analytics.overallCompletionRate}%</span>
            <span className="stat-label">Overall Completion</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon-wrapper">
            <FiCheckCircle className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{analytics.completedTasks} / {analytics.totalTasks}</span>
            <span className="stat-label">Tasks Finished</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon-wrapper">
            <FiAward className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{analytics.avgGrade !== null ? `${analytics.avgGrade}%` : 'N/A'}</span>
            <span className="stat-label">Average Score ({analytics.gradedCount} graded)</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon-wrapper">
            <FiBookOpen className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{analytics.totalCredits}</span>
            <span className="stat-label">Total Registered Credits</span>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Course Progress Breakdown */}
        <div className="analytics-card">
          <h2>Course Progression</h2>
          <p className="card-subtext">Syllabus and milestone progress across active courses</p>
          
          <div className="course-progress-breakdown">
            {courses.map(course => (
              <div key={course.id} className="course-progress-row">
                <div className="course-row-info">
                  <span className="course-row-name">{course.name}</span>
                  <span className="course-row-percent">{course.progress || 0}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${course.progress || 0}%`,
                      backgroundColor: course.color || '#3b82f6'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Completion Rate */}
        <div className="analytics-card">
          <h2>Task Priority Completion</h2>
          <p className="card-subtext">How effectively high, medium, and low priority tasks are closed</p>
          
          <div className="priority-bars">
            <div className="priority-bar-item">
              <div className="priority-label-group">
                <span className="priority-title" style={{ color: '#dc2626' }}>High Priority</span>
                <span>{analytics.highDone} of {analytics.highTotal} ({analytics.highRate}%)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${analytics.highRate}%`, backgroundColor: '#ef4444' }}></div>
              </div>
            </div>

            <div className="priority-bar-item">
              <div className="priority-label-group">
                <span className="priority-title" style={{ color: '#d97706' }}>Medium Priority</span>
                <span>{analytics.medDone} of {analytics.medTotal} ({analytics.medRate}%)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${analytics.medRate}%`, backgroundColor: '#f59e0b' }}></div>
              </div>
            </div>

            <div className="priority-bar-item">
              <div className="priority-label-group">
                <span className="priority-title" style={{ color: '#059669' }}>Low Priority</span>
                <span>{analytics.lowDone} of {analytics.lowTotal} ({analytics.lowRate}%)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${analytics.lowRate}%`, backgroundColor: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="analytics-card" style={{ marginTop: 24 }}>
        <h2>Workspace Summary</h2>
        <div className="summary-highlights-grid">
          <div className="highlight-box">
            <span className="highlight-num">{analytics.totalCourses}</span>
            <span className="highlight-desc">Enrolled Courses</span>
          </div>
          <div className="highlight-box">
            <span className="highlight-num">{analytics.totalTasks}</span>
            <span className="highlight-desc">Total Scheduled Tasks</span>
          </div>
          <div className="highlight-box">
            <span className="highlight-num">{analytics.totalAssignments}</span>
            <span className="highlight-desc">Course Assignments</span>
          </div>
          <div className="highlight-box">
            <span className="highlight-num">{analytics.totalNotes}</span>
            <span className="highlight-desc">Study Notes Written</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
