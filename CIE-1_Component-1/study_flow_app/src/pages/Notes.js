import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, 
  FiFileText, FiTag, FiBook
} from 'react-icons/fi';
import { notesService, coursesService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import './Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  // Modal & View
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const initialFormData = {
    title: '',
    content: '',
    courseId: '',
    tags: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  const { showSuccess, showError } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [notesData, coursesData] = await Promise.all([
        notesService.getAll(),
        coursesService.getAll()
      ]);
      setNotes(notesData);
      setCourses(coursesData);
    } catch (err) {
      showError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        (note.tags && note.tags.some(t => t.toLowerCase().includes(query)));
      
      const matchesCourse = courseFilter === 'all' || 
        (note.courseId && note.courseId.toString() === courseFilter.toString());

      return matchesSearch && matchesCourse;
    }).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }, [notes, searchQuery, courseFilter]);

  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note, e) => {
    if (e) e.stopPropagation();
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      content: note.content || '',
      courseId: note.courseId ? note.courseId.toString() : '',
      tags: note.tags ? note.tags.join(', ') : ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleViewNote = (note) => {
    setViewingNote(note);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
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
    if (!formData.title.trim()) errors.title = 'Note title is required';
    if (!formData.content.trim()) errors.content = 'Note content is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError('Please fill in required note fields');
      return;
    }

    setSubmitting(true);
    try {
      const tagArray = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        courseId: formData.courseId ? Number(formData.courseId) : null,
        tags: tagArray
      };

      if (editingNote) {
        await notesService.update(editingNote.id, payload);
        showSuccess('Note updated successfully');
      } else {
        await notesService.create(payload);
        showSuccess('Note created successfully');
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      showError('Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this study note?')) {
      try {
        await notesService.delete(id);
        showSuccess('Note deleted');
        if (viewingNote && viewingNote.id === id) {
          setIsViewModalOpen(false);
        }
        fetchData();
      } catch (err) {
        showError('Failed to delete note');
      }
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : 'General Note';
  };

  if (loading) return <LoadingSpinner fullPage text="Loading study notes..." />;

  return (
    <div className="notes-page">
      <header className="notes-header">
        <div>
          <h1>Study Notes</h1>
          <p className="page-subtitle">Organize cheat-sheets, lecture notes, and revision summaries</p>
        </div>
        <button className="btn-primary" onClick={handleOpenAdd}>
          <FiPlus /> New Note
        </button>
      </header>

      {/* Controls */}
      <div className="notes-controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search notes by keyword, tags, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      {/* Grid or Empty */}
      {notes.length === 0 ? (
        <EmptyState
          icon={<FiFileText />}
          title="No notes created yet"
          message="Keep track of key concepts, formulas, and lecture takeaways here."
          actionText="Create First Note"
          onAction={handleOpenAdd}
        />
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          icon={<FiSearch />}
          title="No matching notes"
          message="No study notes match your search or course filter."
        />
      ) : (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="note-card"
              onClick={() => handleViewNote(note)}
            >
              <div className="note-card-header">
                <h3>{note.title}</h3>
                <div className="note-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className="btn-icon"
                    onClick={(e) => handleOpenEdit(note, e)}
                    title="Edit note"
                    aria-label="Edit note"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(note.id, e)}
                    title="Delete note"
                    aria-label="Delete note"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <p className="note-preview">{note.content}</p>

              {note.tags && note.tags.length > 0 && (
                <div className="note-tags">
                  {note.tags.map((tag, idx) => (
                    <span key={idx} className="note-tag-badge">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="note-meta">
                <span className="note-course">
                  <FiBook style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  {getCourseName(note.courseId)}
                </span>
                <span>
                  {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Note Modal */}
      {viewingNote && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={viewingNote.title}
          size="large"
        >
          <div className="view-note-content">
            <div className="view-note-meta">
              <span className="note-course-pill">{getCourseName(viewingNote.courseId)}</span>
              <span className="view-note-date">
                Last updated: {new Date(viewingNote.updatedAt || viewingNote.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="view-note-body">
              <pre className="view-note-text">{viewingNote.content}</pre>
            </div>

            {viewingNote.tags && viewingNote.tags.length > 0 && (
              <div className="view-note-tags">
                <FiTag style={{ marginRight: 6 }} />
                {viewingNote.tags.map((t, idx) => (
                  <span key={idx} className="note-tag-badge">#{t}</span>
                ))}
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: 24 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(viewingNote);
                }}
              >
                <FiEdit2 style={{ marginRight: 4 }} /> Edit Note
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNote ? 'Edit Study Note' : 'Create Study Note'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="note-title">Title *</label>
            <input
              type="text"
              id="note-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. React Hooks Lifecycle Summary"
              className={formErrors.title ? 'input-error' : ''}
              autoFocus
            />
            {formErrors.title && <span className="error-text">{formErrors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="note-course">Course</label>
            <select
              id="note-course"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
            >
              <option value="">No Course (General)</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="note-content">Note Content *</label>
            <textarea
              id="note-content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              placeholder="Write your study notes, code examples, markdown points, or revision tips here..."
              className={formErrors.content ? 'input-error' : ''}
            />
            {formErrors.content && <span className="error-text">{formErrors.content}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="note-tags">Tags (comma separated)</label>
            <input
              type="text"
              id="note-tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. react, hooks, javascript"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notes;
