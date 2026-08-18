import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FiPlus, FiSearch, FiEdit2, 
  FiTrash2, FiCalendar, FiSquare, FiCheckSquare,
  FiArrowUp, FiArrowDown, FiCheckCircle
} from 'react-icons/fi';
import { tasksService, coursesService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [sortField, setSortField] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form Data
  const initialFormData = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    courseId: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  const { showSuccess, showError } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, coursesData] = await Promise.all([
        tasksService.getAll(),
        coursesService.getAll()
      ]);
      setTasks(tasksData);
      setCourses(coursesData);
    } catch (err) {
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isOverdue = (task) => {
    if (task.completed || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  // Filter and Sort Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchesStatus = true;
      if (statusFilter === 'overdue') {
        matchesStatus = isOverdue(task);
      } else if (statusFilter === 'completed') {
        matchesStatus = task.completed === true;
      } else if (statusFilter === 'active') {
        matchesStatus = !task.completed;
      } else if (statusFilter !== 'all') {
        matchesStatus = task.status === statusFilter;
      }

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesCourse = courseFilter === 'all' || 
        (task.courseId && task.courseId.toString() === courseFilter.toString());

      return matchesSearch && matchesStatus && matchesPriority && matchesCourse;
    }).sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'dueDate':
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : (sortOrder === 'asc' ? Infinity : -Infinity);
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : (sortOrder === 'asc' ? Infinity : -Infinity);
          comparison = dateA - dateB;
          break;
        case 'priority':
          const priorityWeights = { high: 3, medium: 2, low: 1 };
          comparison = (priorityWeights[a.priority] || 0) - (priorityWeights[b.priority] || 0);
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'createdAt':
        default:
          const createA = new Date(a.createdAt || 0).getTime();
          const createB = new Date(b.createdAt || 0).getTime();
          comparison = createA - createB;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, courseFilter, sortField, sortOrder]);

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        courseId: task.courseId ? task.courseId.toString() : ''
      });
    } else {
      setEditingTask(null);
      setFormData(initialFormData);
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
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
    if (!formData.title.trim()) errors.title = 'Task title is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError('Please provide a task title');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        courseId: formData.courseId ? Number(formData.courseId) : null
      };

      if (editingTask) {
        await tasksService.update(editingTask.id, payload);
        showSuccess('Task updated successfully');
      } else {
        await tasksService.create(payload);
        showSuccess('Task added successfully');
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      showError('Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updated = await tasksService.toggleComplete(task.id);
      showSuccess(updated.completed ? 'Task completed' : 'Task marked incomplete');
      fetchData();
    } catch (err) {
      showError('Failed to update task status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksService.delete(id);
        showSuccess('Task deleted');
        fetchData();
      } catch (err) {
        showError('Failed to delete task');
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : null;
  };

  if (loading) return <LoadingSpinner fullPage text="Loading tasks..." />;

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="tasks-page">
      <header className="page-header">
        <div className="header-title">
          <h1>Tasks</h1>
          <span className="task-counter">
            {completedCount} of {tasks.length} completed
          </span>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Task
        </button>
      </header>

      {/* Filters Toolbar */}
      <div className="filters-toolbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <div className="filter-item">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="filter-item">
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="filter-item">
            <select 
              value={courseFilter} 
              onChange={(e) => setCourseFilter(e.target.value)}
              aria-label="Filter by course"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div className="sort-item">
            <select 
              value={sortField} 
              onChange={(e) => setSortField(e.target.value)}
              aria-label="Sort tasks by"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
              <option value="createdAt">Sort by Date Created</option>
            </select>
            <button 
              className="btn btn-icon sort-toggle" 
              onClick={toggleSortOrder}
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              aria-label="Toggle sort order"
            >
              {sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
            </button>
          </div>
        </div>
      </div>

      {/* Task List / Empty States */}
      {tasks.length === 0 ? (
        <EmptyState 
          icon={<FiCheckCircle />}
          title="No tasks yet"
          message="You don't have any tasks in your list. Create your first task to stay organized!"
          actionText="Add First Task"
          onAction={() => handleOpenModal()}
        />
      ) : filteredTasks.length === 0 ? (
        <EmptyState 
          icon={<FiSearch />}
          title="No matching tasks"
          message="No tasks match your current filters. Try changing your search query or filter options."
        />
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => {
            const courseName = getCourseName(task.courseId);
            const overdue = isOverdue(task);

            return (
              <div 
                key={task.id} 
                className={`task-card ${task.completed ? 'task-completed' : ''} ${overdue ? 'task-overdue' : ''}`}
              >
                <div 
                  className="task-checkbox" 
                  onClick={() => handleToggleComplete(task)}
                  role="button"
                  tabIndex={0}
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {task.completed ? (
                    <FiCheckSquare className="checkbox-icon checked" />
                  ) : (
                    <FiSquare className="checkbox-icon unchecked" />
                  )}
                </div>

                <div className="task-content">
                  <div className="task-header-row">
                    <h3 className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="task-actions">
                      <button 
                        className="btn-icon" 
                        onClick={() => handleOpenModal(task)}
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDelete(task.id)}
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}

                  <div className="task-meta">
                    <span className={`badge badge-priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    
                    <span className={`badge badge-status-${task.status === 'in-progress' ? 'progress' : task.status}`}>
                      {task.status}
                    </span>

                    {courseName && (
                      <span className="badge badge-course" title={courseName}>
                        {courseName}
                      </span>
                    )}

                    {task.dueDate && (
                      <span className={`task-due-date ${overdue ? 'text-overdue' : ''}`}>
                        <FiCalendar />
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {overdue && ' (Overdue)'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <form onSubmit={handleSubmit} className="task-form" noValidate>
          <div className="form-group">
            <label htmlFor="task-title">Task Title *</label>
            <input 
              type="text" 
              id="task-title" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Complete React Router lab"
              className={formErrors.title ? 'input-error' : ''}
              autoFocus
            />
            {formErrors.title && <span className="error-text">{formErrors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea 
              id="task-description" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add details, instructions, or notes..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="task-course">Course</label>
              <select 
                id="task-course" 
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
              >
                <option value="">No Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="task-priority">Priority</label>
              <select 
                id="task-priority" 
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="task-status">Status</label>
              <select 
                id="task-status" 
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="task-due-date">Due Date</label>
              <input 
                type="date" 
                id="task-due-date" 
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
