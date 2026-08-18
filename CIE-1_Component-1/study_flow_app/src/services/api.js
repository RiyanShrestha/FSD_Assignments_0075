/**
 * StudyFlow Frontend API Service
 * Centralized service layer that provides CRUD operations for all entities.
 * Uses localStorage via the storage service. Simulates async API behavior
 * so the architecture mirrors a real client-server application.
 * 
 * On first load, fetches seed data from /data/seed.json (visible in DevTools Network tab)
 * and persists it into localStorage.
 */

import storage from './storage';
import { networkFetch } from './network';

const isDev = process.env.NODE_ENV !== 'production';

// Simulate minimal async delay for realistic UX (short enough to not feel slow)
const simulateDelay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Dev logging helper for form/action events
function logFormEvent(action, details = {}) {
  if (isDev) {
    const detailStr = Object.entries(details)
      .map(([k, v]) => `  ${k}: ${v}`)
      .join('\n');
    console.log(
      `%c[StudyFlow Form]\n  ${action}${detailStr ? '\n' + detailStr : ''}`,
      'color: #9B59B6; font-weight: bold;'
    );
  }
}

// ============================================================
// SEED DATA INITIALIZATION
// ============================================================

/**
 * Load seed data from public/data/seed.json via fetch.
 * This creates a real network request visible in DevTools Network tab.
 * After first load, data is persisted to localStorage.
 */
export async function initializeSeedData() {
  if (storage.isSeedLoaded()) {
    if (isDev) {
      console.log('%c[StudyFlow] Seed data already loaded from localStorage', 'color: #888;');
    }
    return false;
  }

  try {
    const data = await networkFetch('/data/seed.json');

    // Persist seed data to localStorage
    if (data.courses) storage.setCourses(data.courses);
    if (data.tasks) storage.setTasks(data.tasks);
    if (data.assignments) storage.setAssignments(data.assignments);
    if (data.notes) storage.setNotes(data.notes);
    if (data.preferences) storage.setPreferences(data.preferences);

    // Initialize auto-increment IDs
    storage.initializeIds(data);
    storage.markSeedLoaded();

    if (isDev) {
      console.log(
        '%c[StudyFlow] Seed data loaded and persisted',
        'color: #50C878; font-weight: bold;',
        {
          courses: data.courses?.length || 0,
          tasks: data.tasks?.length || 0,
          assignments: data.assignments?.length || 0,
          notes: data.notes?.length || 0,
        }
      );
    }

    return true;
  } catch (err) {
    console.error('[StudyFlow] Failed to load seed data:', err);
    throw err;
  }
}

// ============================================================
// AUTH SERVICE (Frontend-only, any credentials accepted)
// ============================================================

export const authService = {
  login(email, password) {
    logFormEvent('Login submitted', { Email: email });

    // Derive display name from email
    const namePart = email.split('@')[0];
    const name = namePart
      .split(/[._-]/)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');

    const user = {
      name: name || 'Riyan Shrestha',
      email: email,
      avatar: null,
      joinDate: new Date().toISOString(),
    };

    storage.setUser(user);
    return user;
  },

  register(name, email, password) {
    logFormEvent('Register submitted', { Name: name, Email: email });

    const user = {
      name: name,
      email: email,
      avatar: null,
      joinDate: new Date().toISOString(),
    };

    storage.setUser(user);
    return user;
  },

  logout() {
    logFormEvent('Logout');
    storage.removeUser();
  },

  getCurrentUser() {
    return storage.getUser();
  },
};

// ============================================================
// COURSES SERVICE
// ============================================================

export const coursesService = {
  async getAll() {
    await simulateDelay(80);
    return storage.getCourses();
  },

  async getById(id) {
    await simulateDelay(50);
    const courses = storage.getCourses();
    return courses.find(c => c.id === Number(id)) || null;
  },

  async create(courseData) {
    await simulateDelay(100);
    const courses = storage.getCourses();
    const newCourse = {
      ...courseData,
      id: storage.incrementId('courses'),
      progress: 0,
      status: courseData.status || 'active',
      createdAt: new Date().toISOString(),
    };
    courses.push(newCourse);
    storage.setCourses(courses);
    logFormEvent('Course created', { Name: newCourse.name, 'Course ID': newCourse.id });
    return newCourse;
  },

  async update(id, updates) {
    await simulateDelay(100);
    const courses = storage.getCourses();
    const index = courses.findIndex(c => c.id === Number(id));
    if (index === -1) throw new Error('Course not found');
    courses[index] = { ...courses[index], ...updates, updatedAt: new Date().toISOString() };
    storage.setCourses(courses);
    logFormEvent('Course updated', { 'Course ID': id });
    return courses[index];
  },

  async delete(id) {
    await simulateDelay(100);
    const courses = storage.getCourses();
    const filtered = courses.filter(c => c.id !== Number(id));
    storage.setCourses(filtered);
    logFormEvent('Course deleted', { 'Course ID': id });
    return true;
  },
};

// ============================================================
// TASKS SERVICE
// ============================================================

export const tasksService = {
  async getAll() {
    await simulateDelay(80);
    return storage.getTasks();
  },

  async getById(id) {
    await simulateDelay(50);
    const tasks = storage.getTasks();
    return tasks.find(t => t.id === Number(id)) || null;
  },

  async create(taskData) {
    await simulateDelay(100);
    const tasks = storage.getTasks();
    const newTask = {
      ...taskData,
      id: storage.incrementId('tasks'),
      completed: false,
      status: taskData.status || 'pending',
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    storage.setTasks(tasks);
    logFormEvent('Task created', { Title: newTask.title });
    return newTask;
  },

  async update(id, updates) {
    await simulateDelay(100);
    const tasks = storage.getTasks();
    const index = tasks.findIndex(t => t.id === Number(id));
    if (index === -1) throw new Error('Task not found');
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
    storage.setTasks(tasks);
    logFormEvent('Task updated', { 'Task ID': id });
    return tasks[index];
  },

  async toggleComplete(id) {
    const tasks = storage.getTasks();
    const index = tasks.findIndex(t => t.id === Number(id));
    if (index === -1) throw new Error('Task not found');
    const wasCompleted = tasks[index].completed;
    tasks[index] = {
      ...tasks[index],
      completed: !wasCompleted,
      status: !wasCompleted ? 'completed' : 'pending',
      completedAt: !wasCompleted ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };
    storage.setTasks(tasks);
    logFormEvent(wasCompleted ? 'Task marked incomplete' : 'Task completed', { 'Task ID': id });
    return tasks[index];
  },

  async delete(id) {
    await simulateDelay(100);
    const tasks = storage.getTasks();
    const filtered = tasks.filter(t => t.id !== Number(id));
    storage.setTasks(filtered);
    logFormEvent('Task deleted', { 'Task ID': id });
    return true;
  },
};

// ============================================================
// ASSIGNMENTS SERVICE
// ============================================================

export const assignmentsService = {
  async getAll() {
    await simulateDelay(80);
    return storage.getAssignments();
  },

  async getById(id) {
    await simulateDelay(50);
    const assignments = storage.getAssignments();
    return assignments.find(a => a.id === Number(id)) || null;
  },

  async create(data) {
    await simulateDelay(100);
    const assignments = storage.getAssignments();
    const newAssignment = {
      ...data,
      id: storage.incrementId('assignments'),
      completed: false,
      status: data.status || 'pending',
      grade: null,
      createdAt: new Date().toISOString(),
    };
    assignments.push(newAssignment);
    storage.setAssignments(assignments);
    logFormEvent('Assignment created', { Title: newAssignment.title });
    return newAssignment;
  },

  async update(id, updates) {
    await simulateDelay(100);
    const assignments = storage.getAssignments();
    const index = assignments.findIndex(a => a.id === Number(id));
    if (index === -1) throw new Error('Assignment not found');
    assignments[index] = { ...assignments[index], ...updates, updatedAt: new Date().toISOString() };
    storage.setAssignments(assignments);
    logFormEvent('Assignment updated', { 'Assignment ID': id });
    return assignments[index];
  },

  async delete(id) {
    await simulateDelay(100);
    const assignments = storage.getAssignments();
    const filtered = assignments.filter(a => a.id !== Number(id));
    storage.setAssignments(filtered);
    logFormEvent('Assignment deleted', { 'Assignment ID': id });
    return true;
  },
};

// ============================================================
// NOTES SERVICE
// ============================================================

export const notesService = {
  async getAll() {
    await simulateDelay(80);
    return storage.getNotes();
  },

  async getById(id) {
    await simulateDelay(50);
    const notes = storage.getNotes();
    return notes.find(n => n.id === Number(id)) || null;
  },

  async create(data) {
    await simulateDelay(100);
    const notes = storage.getNotes();
    const newNote = {
      ...data,
      id: storage.incrementId('notes'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.push(newNote);
    storage.setNotes(notes);
    logFormEvent('Note created', { Title: newNote.title });
    return newNote;
  },

  async update(id, updates) {
    await simulateDelay(100);
    const notes = storage.getNotes();
    const index = notes.findIndex(n => n.id === Number(id));
    if (index === -1) throw new Error('Note not found');
    notes[index] = { ...notes[index], ...updates, updatedAt: new Date().toISOString() };
    storage.setNotes(notes);
    logFormEvent('Note updated', { 'Note ID': id });
    return notes[index];
  },

  async delete(id) {
    await simulateDelay(100);
    const notes = storage.getNotes();
    const filtered = notes.filter(n => n.id !== Number(id));
    storage.setNotes(filtered);
    logFormEvent('Note deleted', { 'Note ID': id });
    return true;
  },
};

// ============================================================
// DASHBOARD SERVICE
// ============================================================

export const dashboardService = {
  async getStats() {
    await simulateDelay(80);
    const courses = storage.getCourses();
    const tasks = storage.getTasks();
    const assignments = storage.getAssignments();
    const notes = storage.getNotes();

    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const activeTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    const activeAssignments = assignments.filter(a => !a.completed);
    const completedAssignments = assignments.filter(a => a.completed);

    const upcomingDeadlines = [
      ...activeTasks.map(t => ({ ...t, type: 'task' })),
      ...activeAssignments.map(a => ({ ...a, type: 'assignment' })),
    ]
      .filter(item => {
        const due = new Date(item.dueDate);
        return due >= now && due <= weekFromNow;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    const totalItems = tasks.length + assignments.length;
    const completedItems = completedTasks.length + completedAssignments.length;
    const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const avgCourseProgress = courses.length > 0
      ? Math.round(courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length)
      : 0;

    // Recent activity
    const allItems = [
      ...tasks.map(t => ({ ...t, type: 'task', date: t.updatedAt || t.completedAt || t.createdAt })),
      ...assignments.map(a => ({ ...a, type: 'assignment', date: a.updatedAt || a.completedAt || a.createdAt })),
      ...notes.map(n => ({ ...n, type: 'note', date: n.updatedAt || n.createdAt })),
      ...courses.map(c => ({ ...c, type: 'course', date: c.updatedAt || c.createdAt })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

    return {
      totalCourses: courses.length,
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      totalAssignments: assignments.length,
      completedAssignments: completedAssignments.length,
      totalNotes: notes.length,
      upcomingDeadlines,
      overallProgress,
      avgCourseProgress,
      recentActivity: allItems,
      courseProgress: courses.map(c => ({
        id: c.id,
        name: c.name,
        color: c.color,
        progress: c.progress || 0,
      })),
    };
  },
};

// ============================================================
// PROFILE SERVICE
// ============================================================

export const profileService = {
  async get() {
    await simulateDelay(50);
    return storage.getUser();
  },

  async update(updates) {
    await simulateDelay(100);
    const user = storage.getUser();
    if (!user) throw new Error('No user session');
    const updated = { ...user, ...updates };
    storage.setUser(updated);
    logFormEvent('Profile updated', { Name: updated.name });
    return updated;
  },

  async changePassword(currentPassword, newPassword) {
    await simulateDelay(200);
    logFormEvent('Password change requested');
    // Frontend-only: just simulate success
    return { success: true, message: 'Password updated successfully' };
  },

  getPreferences() {
    return storage.getPreferences();
  },

  updatePreferences(prefs) {
    const current = storage.getPreferences();
    const updated = { ...current, ...prefs };
    storage.setPreferences(updated);
    return updated;
  },
};

const apiService = {
  auth: authService,
  courses: coursesService,
  tasks: tasksService,
  assignments: assignmentsService,
  notes: notesService,
  dashboard: dashboardService,
  profile: profileService,
  initializeSeedData,
};

export default apiService;
