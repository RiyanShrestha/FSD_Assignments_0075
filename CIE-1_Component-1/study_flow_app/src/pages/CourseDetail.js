import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesService, tasksService, assignmentsService, notesService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { 
  FiArrowLeft, FiEdit2, FiUser, FiCalendar, FiClock, 
  FiFileText, FiList, FiBookOpen, FiPlus, FiCheckSquare, FiSquare
} from 'react-icons/fi';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [course, setCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notes, setNotes] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourseData = useCallback(async () => {
    setIsLoading(true);
    try {
      const courseData = await coursesService.getById(id);
      if (!courseData) {
        setCourse(null);
        return;
      }
      setCourse(courseData);
      
      const [allTasks, allAssignments, allNotes] = await Promise.all([
        tasksService.getAll(),
        assignmentsService.getAll(),
        notesService.getAll()
      ]);
      
      setTasks(allTasks.filter(t => t.courseId === Number(id)));
      setAssignments(allAssignments.filter(a => a.courseId === Number(id)));
      setNotes(allNotes.filter(n => n.courseId === Number(id)));
    } catch (err) {
      showError('Failed to load course details');
    } finally {
      setIsLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleOpenEdit = () => {
    if (!course) return;
    setFormData({
      name: course.name || '',
      code: course.code || '',
      description: course.description || '',
      instructor: course.instructor || '',
      semester: course.semester || '',
      credits: course.credits || 3,
      color: course.color || '#3b82f6',
      status: course.status || 'active',
      progress: course.progress || 0
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'progress' || name === 'credits' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showError('Course name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await coursesService.update(id, formData);
      showSuccess('Course updated successfully');
      setIsModalOpen(false);
      fetchCourseData();
    } catch (err) {
      showError('Failed to update course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await tasksService.toggleComplete(taskId);
      showSuccess('Task updated');
      fetchCourseData();
    } catch (err) {
      showError('Failed to update task');
    }
  };

  if (isLoading) return <LoadingSpinner fullPage text="Loading course details..." />;
  
  if (!course) {
    return (
      <div className="course-detail-page">
        <button className="btn-text back-btn" onClick={() => navigate('/courses')}>
          <FiArrowLeft /> Back to Courses
        </button>
        <div style={{ marginTop: '2rem' }}>
          <EmptyState
            icon={<FiBookOpen />}
            title="Course Not Found"
            message="The requested course does not exist or has been removed."
            actionText="Return to Courses"
            onAction={() => navigate('/courses')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="detail-actions">
        <button className="btn-text back-btn" onClick={() => navigate('/courses')}>
          <FiArrowLeft /> Back to Courses
        </button>
        <button className="btn-secondary" onClick={handleOpenEdit}>
          <FiEdit2 /> Edit Course
        </button>
      </div>

      <div className="course-header-card" style={{ borderTop: `4px solid ${course.color || '#3b82f6'}` }}>
        <div className="course-header-top">
          <div>
            <span className="course-code-badge">{course.code || 'COURSE'}</span>
            <h2>{course.name}</h2>
          </div>
          <span className={`status-badge status-${course.status}`}>
            {course.status}
          </span>
        </div>
        
        {course.description && (
          <p className="course-description">{course.description}</p>
        )}
        
        <div className="course-meta-grid">
          <div className="meta-item">
            <FiUser className="meta-icon" />
            <div className="meta-content">
              <span className="meta-label">Instructor</span>
              <span className="meta-value">{course.instructor || '-'}</span>
            </div>
          </div>
          <div className="meta-item">
            <FiCalendar className="meta-icon" />
            <div className="meta-content">
              <span className="meta-label">Semester</span>
              <span className="meta-value">{course.semester || '-'}</span>
            </div>
          </div>
          <div className="meta-item">
            <FiClock className="meta-icon" />
            <div className="meta-content">
              <span className="meta-label">Credits</span>
              <span className="meta-value">{course.credits || 3} Credits</span>
            </div>
          </div>
        </div>

        <div className="course-progress-section">
          <div className="course-progress-header">
            <span className="progress-label">Course Progress</span>
            <span className="progress-percentage">{course.progress || 0}%</span>
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
      </div>

      <div className="course-content-tabs">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <FiList /> Tasks ({tasks.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <FiBookOpen /> Assignments ({assignments.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <FiFileText /> Notes ({notes.length})
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'tasks' && (
            tasks.length === 0 ? (
              <div className="empty-tab">
                <p>No tasks linked to this course.</p>
                <Link to="/tasks" className="btn-primary" style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <FiPlus /> Add Task
                </Link>
              </div>
            ) : (
              <ul className="item-list">
                {tasks.map(task => (
                  <li key={task.id} className="item-row">
                    <div className="item-main">
                      <button 
                        className="btn-icon" 
                        onClick={() => handleToggleTask(task.id)}
                        style={{ color: task.completed ? '#10b981' : '#9ca3af' }}
                      >
                        {task.completed ? <FiCheckSquare /> : <FiSquare />}
                      </button>
                      <span className={`item-title ${task.completed ? 'strikethrough' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="item-meta-group">
                      <span className={`badge badge-priority-${task.priority || 'medium'}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <div className="item-meta">
                          <FiClock /> {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}

          {activeTab === 'assignments' && (
            assignments.length === 0 ? (
              <div className="empty-tab">
                <p>No assignments linked to this course.</p>
                <Link to="/assignments" className="btn-primary" style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <FiPlus /> Add Assignment
                </Link>
              </div>
            ) : (
              <ul className="item-list">
                {assignments.map(assignment => (
                  <li key={assignment.id} className="item-row">
                    <div className="item-main">
                      <span className={`status-dot status-${assignment.status || 'pending'}`}></span>
                      <span className="item-title">{assignment.title}</span>
                    </div>
                    <div className="item-meta-group">
                      {assignment.dueDate && (
                        <span className="item-meta">
                          <FiClock /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {assignment.grade !== null && assignment.grade !== undefined && (
                        <span className="item-badge">Grade: {assignment.grade}/100</span>
                      )}
                      <span className={`badge badge-priority-${assignment.priority || 'medium'}`}>
                        {assignment.priority}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}

          {activeTab === 'notes' && (
            notes.length === 0 ? (
              <div className="empty-tab">
                <p>No study notes saved for this course.</p>
                <Link to="/notes" className="btn-primary" style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <FiPlus /> Create Note
                </Link>
              </div>
            ) : (
              <ul className="item-list">
                {notes.map(note => (
                  <li key={note.id} className="item-row">
                    <div className="item-main">
                      <FiFileText className="item-icon" />
                      <span className="item-title">{note.title}</span>
                    </div>
                    <div className="item-meta">
                      {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Edit Course"
      >
        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-group">
            <label htmlFor="edit_name">Course Title *</label>
            <input
              type="text"
              id="edit_name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit_code">Course Code</label>
              <input
                type="text"
                id="edit_code"
                name="code"
                value={formData.code || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit_credits">Credits</label>
              <input
                type="number"
                id="edit_credits"
                name="credits"
                value={formData.credits || 3}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit_instructor">Instructor</label>
              <input
                type="text"
                id="edit_instructor"
                name="instructor"
                value={formData.instructor || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit_semester">Semester</label>
              <input
                type="text"
                id="edit_semester"
                name="semester"
                value={formData.semester || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit_description">Description</label>
            <textarea
              id="edit_description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit_status">Status</label>
              <select
                id="edit_status"
                name="status"
                value={formData.status || 'active'}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit_color">Badge Color</label>
              <input
                type="color"
                id="edit_color"
                name="color"
                value={formData.color || '#3b82f6'}
                onChange={handleChange}
                style={{ height: 42, padding: 4 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit_progress">Progress: {formData.progress || 0}%</label>
            <input
              type="range"
              id="edit_progress"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={formData.progress || 0}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Update Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseDetail;
