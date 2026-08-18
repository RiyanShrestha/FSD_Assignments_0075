/**
 * StudyFlow Local Storage Service
 * Centralized localStorage abstraction for persistent application data.
 * All data operations go through this service rather than accessing localStorage directly.
 */

const STORAGE_PREFIX = 'studyflow_';

const KEYS = {
  USER: `${STORAGE_PREFIX}user`,
  COURSES: `${STORAGE_PREFIX}courses`,
  TASKS: `${STORAGE_PREFIX}tasks`,
  ASSIGNMENTS: `${STORAGE_PREFIX}assignments`,
  NOTES: `${STORAGE_PREFIX}notes`,
  PREFERENCES: `${STORAGE_PREFIX}preferences`,
  SEED_LOADED: `${STORAGE_PREFIX}seed_loaded`,
  NEXT_IDS: `${STORAGE_PREFIX}next_ids`,
};

const storage = {
  // Generic get/set
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`[StudyFlow Storage] Error reading ${key}:`, e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[StudyFlow Storage] Error writing ${key}:`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`[StudyFlow Storage] Error removing ${key}:`, e);
      return false;
    }
  },

  // User session
  getUser() {
    return this.get(KEYS.USER);
  },

  setUser(user) {
    return this.set(KEYS.USER, user);
  },

  removeUser() {
    return this.remove(KEYS.USER);
  },

  // Courses
  getCourses() {
    return this.get(KEYS.COURSES) || [];
  },

  setCourses(courses) {
    return this.set(KEYS.COURSES, courses);
  },

  // Tasks
  getTasks() {
    return this.get(KEYS.TASKS) || [];
  },

  setTasks(tasks) {
    return this.set(KEYS.TASKS, tasks);
  },

  // Assignments
  getAssignments() {
    return this.get(KEYS.ASSIGNMENTS) || [];
  },

  setAssignments(assignments) {
    return this.set(KEYS.ASSIGNMENTS, assignments);
  },

  // Notes
  getNotes() {
    return this.get(KEYS.NOTES) || [];
  },

  setNotes(notes) {
    return this.set(KEYS.NOTES, notes);
  },

  // Preferences
  getPreferences() {
    return this.get(KEYS.PREFERENCES) || {
      theme: 'light',
      notifications: true,
      emailNotifications: false,
      taskReminders: true,
      language: 'en',
    };
  },

  setPreferences(prefs) {
    return this.set(KEYS.PREFERENCES, prefs);
  },

  // Seed tracking
  isSeedLoaded() {
    return this.get(KEYS.SEED_LOADED) === true;
  },

  markSeedLoaded() {
    return this.set(KEYS.SEED_LOADED, true);
  },

  // Auto-increment ID management
  getNextId(entity) {
    const ids = this.get(KEYS.NEXT_IDS) || {};
    return ids[entity] || 1;
  },

  incrementId(entity) {
    const ids = this.get(KEYS.NEXT_IDS) || {};
    const current = ids[entity] || 1;
    ids[entity] = current + 1;
    this.set(KEYS.NEXT_IDS, ids);
    return current;
  },

  initializeIds(data) {
    const ids = {};
    if (data.courses && data.courses.length) {
      ids.courses = Math.max(...data.courses.map(c => c.id)) + 1;
    }
    if (data.tasks && data.tasks.length) {
      ids.tasks = Math.max(...data.tasks.map(t => t.id)) + 1;
    }
    if (data.assignments && data.assignments.length) {
      ids.assignments = Math.max(...data.assignments.map(a => a.id)) + 1;
    }
    if (data.notes && data.notes.length) {
      ids.notes = Math.max(...data.notes.map(n => n.id)) + 1;
    }
    this.set(KEYS.NEXT_IDS, ids);
  },

  // Clear all StudyFlow data
  clearAll() {
    Object.values(KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

export default storage;
export { KEYS };
