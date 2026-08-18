import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { coursesService, tasksService, assignmentsService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiCalendar, FiBook, FiSearch } from 'react-icons/fi';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    instructor: '',
    semester: '',
    credits: 3,
    color: '#3b82f6',
    status: 'active',
    progress: 0
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const [coursesData, tasksData, assignmentsData] = await Promise.all([
        coursesService.getAll(),
        tasksService.getAll(),
        assignmentsService.getAll()
      ]);
      setCourses(coursesData);
      setTasks(tasksData);
      setAssignments(assignmentsData);
    } catch (err) {
      showError('Unable to load courses');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleOpenModal = (course = null) => {
    if (course) {
      setCurrentCourse(course);
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
    } else {
      setCurrentCourse(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        instructor: '',
        semester: 'Fall 2026',
        credits: 3,
        color: '#3b82f6',
        status: 'active',
        progress: 0
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCourse(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'progress' || name === 'credits' ? Number(value) : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Course name is required';
    if (!formData.instructor.trim()) errors.instructor = 'Instructor is required';
    if (!formData.semester.trim()) errors.semester = 'Semester is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentCourse) {
        await coursesService.update(currentCourse.id, formData);
        showSuccess('Course updated successfully');
      } else {
        await coursesService.create(formData);
        showSuccess('Course added successfully');
      }
      handleCloseModal();
      fetchCourses();
    } catch (err) {
      showError('Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await coursesService.delete(id);
        showSuccess('Course deleted');
        fetchCourses();
      } catch (err) {
        showError('Failed to delete course');
      }
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.instructor && c.instructor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.code && c.code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCourseTaskCount = (courseId) => tasks.filter(t => t.courseId === courseId).length;
  const getCourseAssignmentCount = (courseId) => assignments.filter(a => a.courseId === courseId).length;

  if (isLoading) return <LoadingSpinner fullPage text="Loading courses..." />;

  return (
    <div className="courses-page">
      <header className="page-header">
        <div>
          <h1>Courses</h1>
          <p className="page-subtitle">Manage your semester schedule, credits, and course progress</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Course
        </button>
      </header>

      {/* Search & Filter Bar */}
      <div className="courses-filter-bar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search courses by title, code, instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      {courses.length === 0 ? (
        <EmptyState 
          icon={<FiBook />}
          title="No courses yet"
          message="You haven't added any courses yet. Add your first course to organize your academic semester!"
          actionText="Add First Course"
          onAction={() => handleOpenModal()}
        />
      ) : filteredCourses.length === 0 ? (
        <EmptyState 
          icon={<FiSearch />}
          title="No matching courses"
          message="No courses matched your search criteria. Try a different search term or filter."
        />
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-card-top-stripe" style={{ backgroundColor: course.color || '#3b82f6' }}></div>
              <div className="course-card-header">
                <div>
                  <span className="course-code-badge">{course.code || 'COURSE'}</span>
                  <h3 className="course-title">{course.name}</h3>
                </div>
                <span className={`status-badge status-${course.status}`}>
                  {course.status}
                </span>
              </div>
              
              <div className="course-card-body">
                <div className="course-info-item">
                  <FiUser className="course-info-icon" />
                  <span>{course.instructor || 'Instructor not set'}</span>
                </div>
                <div className="course-info-item">
                  <FiCalendar className="course-info-icon" />
                  <span>{course.semester || 'Semester not set'} {course.credits ? `• ${course.credits} Credits` : ''}</span>
                </div>

                {course.description && (
                  <p className="course-card-desc">{course.description}</p>
                )}
                
                <div className="course-progress-container">
                  <div className="course-progress-header">
                    <span>Course Progress</span>
                    <span>{course.progress || 0}%</span>
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

                <div className="course-stats">
                  <div className="stat-item">
                    <span className="stat-value">{getCourseTaskCount(course.id)}</span>
                    <span className="stat-label">Tasks</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{getCourseAssignmentCount(course.id)}</span>
                    <span className="stat-label">Assignments</span>
                  </div>
                </div>
              </div>

              <div className="course-card-footer">
                <Link to={`/courses/${course.id}`} className="btn-text">
                  View Details &rarr;
                </Link>
                <div className="card-actions">
                  <button 
                    className="btn-icon" 
                    onClick={() => handleOpenModal(course)} 
                    title="Edit course"
                    aria-label="Edit course"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="btn-icon btn-icon-danger" 
                    onClick={(e) => handleDelete(course.id, e)} 
                    title="Delete course"
                    aria-label="Delete course"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={currentCourse ? 'Edit Course' : 'Add New Course'}
      >
        <form onSubmit={handleSubmit} className="course-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Course Title *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Web Development"
              className={formErrors.name ? 'input-error' : ''}
              autoFocus
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="code">Course Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. CS301"
              />
            </div>
            <div className="form-group">
              <label htmlFor="credits">Credits</label>
              <input
                type="number"
                id="credits"
                name="credits"
                min="1"
                max="10"
                value={formData.credits}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="instructor">Instructor *</label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="e.g. Dr. Sarah Chen"
                className={formErrors.instructor ? 'input-error' : ''}
              />
              {formErrors.instructor && <span className="error-text">{formErrors.instructor}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="semester">Semester *</label>
              <input
                type="text"
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                placeholder="e.g. Fall 2026"
                className={formErrors.semester ? 'input-error' : ''}
              />
              {formErrors.semester && <span className="error-text">{formErrors.semester}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Course overview, syllabus highlights, learning goals..."
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="color">Badge Color</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                style={{ height: 42, padding: 4 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="progress">Completion Progress: {formData.progress}%</label>
            <input
              type="range"
              id="progress"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : currentCourse ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Courses;
