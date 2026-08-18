import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, 
  FiClock, FiCheckCircle, FiFileText, FiAward
} from 'react-icons/fi';
import { assignmentsService, coursesService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import './Assignments.css';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Data
  const initialFormData = {
    title: '',
    description: '',
    courseId: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    grade: '',
    maxGrade: 100
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  const { showSuccess, showError } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentsService.getAll(),
        coursesService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      showError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getAssignmentCategory = (assignment) => {
    if (assignment.completed || assignment.status === 'completed') return 'completed';
    if (!assignment.dueDate) return 'upcoming';
    
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'due-soon';
    return 'upcoming';
  };

  const categorizedStats = useMemo(() => {
    const stats = { total: assignments.length, upcoming: 0, dueSoon: 0, overdue: 0, completed: 0 };
    assignments.forEach(a => {
      const cat = getAssignmentCategory(a);
      if (cat === 'completed') stats.completed++;
      else if (cat === 'overdue') stats.overdue++;
      else if (cat === 'due-soon') stats.dueSoon++;
      else stats.upcoming++;
    });
    return stats;
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const category = getAssignmentCategory(item);
      let matchesCategory = true;
      if (categoryFilter !== 'all') {
        matchesCategory = category === categoryFilter;
      }

      const matchesCourse = courseFilter === 'all' || 
        (item.courseId && item.courseId.toString() === courseFilter.toString());

      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

      return matchesSearch && matchesCategory && matchesCourse && matchesPriority;
    }).sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [assignments, searchQuery, categoryFilter, courseFilter, priorityFilter]);

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        courseId: assignment.courseId ? assignment.courseId.toString() : '',
        priority: assignment.priority || 'medium',
        status: assignment.status || 'pending',
        dueDate: assignment.dueDate ? assignment.dueDate.split('T')[0] : '',
        grade: assignment.grade !== null && assignment.grade !== undefined ? assignment.grade : '',
        maxGrade: assignment.maxGrade || 100
      });
    } else {
      setEditingAssignment(null);
      setFormData(initialFormData);
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Assignment title is required';
    if (!formData.courseId) errors.courseId = 'Please select a course';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError('Please check required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        courseId: Number(formData.courseId),
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        grade: formData.grade !== '' ? Number(formData.grade) : null,
        maxGrade: Number(formData.maxGrade) || 100,
        completed: formData.status === 'completed'
      };

      if (editingAssignment) {
        await assignmentsService.update(editingAssignment.id, payload);
        showSuccess('Assignment updated successfully');
      } else {
        await assignmentsService.create(payload);
        showSuccess('Assignment added successfully');
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      showError('Failed to save assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (assignment) => {
    try {
      const isCompleted = assignment.completed || assignment.status === 'completed';
      const updates = {
        completed: !isCompleted,
        status: !isCompleted ? 'completed' : 'pending',
        completedAt: !isCompleted ? new Date().toISOString() : null
      };
      await assignmentsService.update(assignment.id, updates);
      showSuccess(!isCompleted ? 'Assignment completed' : 'Assignment reopened');
      fetchData();
    } catch (err) {
      showError('Failed to update assignment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentsService.delete(id);
        showSuccess('Assignment deleted');
        fetchData();
      } catch (err) {
        showError('Failed to delete assignment');
      }
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'General';
  };

  if (loading) return <LoadingSpinner fullPage text="Loading assignments..." />;

  return (
    <div className="assignments-page">
      <header className="assignments-header">
        <div>
          <h1>Assignments</h1>
          <p className="page-subtitle">Track project deliverables, papers, homework, and grades</p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Assignment
        </button>
      </header>

      {/* Stats Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Total Assignments</span>
          <span className="stat-value">{categorizedStats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title" style={{ color: '#d97706' }}>Due Soon (3 days)</span>
          <span className="stat-value" style={{ color: '#d97706' }}>{categorizedStats.dueSoon}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title" style={{ color: '#dc2626' }}>Overdue</span>
          <span className="stat-value" style={{ color: '#dc2626' }}>{categorizedStats.overdue}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title" style={{ color: '#059669' }}>Completed</span>
          <span className="stat-value" style={{ color: '#059669' }}>{categorizedStats.completed}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Deadlines</option>
            <option value="due-soon">Due Soon</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {assignments.length === 0 ? (
        <EmptyState
          icon={<FiFileText />}
          title="No assignments yet"
          message="You haven't recorded any assignments or project deliverables yet."
          actionText="Add First Assignment"
          onAction={() => handleOpenModal()}
        />
      ) : filteredAssignments.length === 0 ? (
        <EmptyState
          icon={<FiSearch />}
          title="No matching assignments"
          message="No assignments matched your search filter criteria."
        />
      ) : (
        <div className="assignments-grid">
          {filteredAssignments.map(assignment => {
            const category = getAssignmentCategory(assignment);
            const isDone = assignment.completed || assignment.status === 'completed';

            return (
              <div key={assignment.id} className={`assignment-card ${isDone ? 'completed-card' : ''}`}>
                <div className="assignment-header">
                  <h3 className="assignment-title">{assignment.title}</h3>
                  <div className="assignment-actions">
                    <button
                      className="action-btn complete"
                      onClick={() => handleToggleComplete(assignment)}
                      title={isDone ? "Reopen assignment" : "Mark as completed"}
                      aria-label="Toggle completed"
                    >
                      <FiCheckCircle style={{ color: isDone ? '#059669' : '#9ca3af' }} />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleOpenModal(assignment)}
                      title="Edit assignment"
                      aria-label="Edit assignment"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(assignment.id)}
                      title="Delete assignment"
                      aria-label="Delete assignment"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="assignment-course">
                  {getCourseName(assignment.courseId)}
                </div>

                {assignment.description && (
                  <p className="assignment-desc">{assignment.description}</p>
                )}

                <div className="assignment-badges">
                  <span className={`badge priority-${assignment.priority || 'medium'}`}>
                    {assignment.priority || 'Medium'}
                  </span>
                  <span className={`badge category-${category}`}>
                    {category === 'due-soon' ? 'Due Soon' : category}
                  </span>
                  {assignment.grade !== null && assignment.grade !== undefined && (
                    <span className="grade-display">
                      <FiAward style={{ marginRight: 4 }} />
                      Grade: {assignment.grade}/{assignment.maxGrade || 100}
                    </span>
                  )}
                </div>

                <div className="assignment-footer">
                  {assignment.dueDate ? (
                    <span className={`due-date ${category === 'overdue' ? 'overdue' : category === 'due-soon' ? 'due-soon' : ''}`}>
                      <FiClock />
                      {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  ) : (
                    <span className="due-date">No due date</span>
                  )}
                  <span className="status-label" style={{ textTransform: 'capitalize', color: '#6b7280', fontSize: '0.85rem' }}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="assignment-title">Assignment Title *</label>
            <input
              type="text"
              id="assignment-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Usability Evaluation Report"
              className="form-input"
              autoFocus
            />
            {formErrors.title && <span className="error-text">{formErrors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignment-course">Course *</label>
              <select
                id="assignment-course"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              {formErrors.courseId && <span className="error-text">{formErrors.courseId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="assignment-priority">Priority</label>
              <select
                id="assignment-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assignment-desc">Description</label>
            <textarea
              id="assignment-desc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Assignment criteria, submission links, instructions..."
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignment-due">Due Date</label>
              <input
                type="date"
                id="assignment-due"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="assignment-status">Status</label>
              <select
                id="assignment-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignment-grade">Grade Score (Optional)</label>
              <input
                type="number"
                id="assignment-grade"
                name="grade"
                min="0"
                max="100"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g. 95"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="assignment-maxgrade">Max Score</label>
              <input
                type="number"
                id="assignment-maxgrade"
                name="maxGrade"
                value={formData.maxGrade}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingAssignment ? 'Update Assignment' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Assignments;
