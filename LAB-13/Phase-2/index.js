// ============================================================
// Campus Lost & Found Management System - Main Server File
// ============================================================
// Tech: Node.js, Express.js, EJS, MongoDB Atlas, Mongoose
// ============================================================

// Load environment variables from .env file
require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');

// Import Mongoose models
const Student = require('./models/Student');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const Claim = require('./models/Claim');

// Create Express app
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'campus-lost-found-secret-2026-phase2';

// ------------------------------------------------------------
// Minimal Secure Session Implementation (Server-Side In-Memory)
// ------------------------------------------------------------
const sessionStore = new Map(); // sessionId -> { studentId, ... }

function parseCookies(req) {
  const cookies = {};
  const header = req.headers.cookie;
  if (header) {
    header.split(';').forEach((cookie) => {
      const idx = cookie.indexOf('=');
      if (idx !== -1) {
        cookies[cookie.substring(0, idx).trim()] = decodeURIComponent(cookie.substring(idx + 1).trim());
      }
    });
  }
  return cookies;
}

function signSessionId(id, secret) {
  const hmac = crypto.createHmac('sha256', secret).update(id).digest('hex');
  return `${id}.${hmac}`;
}

function verifySessionId(signedId, secret) {
  if (!signedId || typeof signedId !== 'string') return null;
  const parts = signedId.split('.');
  if (parts.length !== 2) return null;
  const [id, hmac] = parts;
  const expectedHmac = crypto.createHmac('sha256', secret).update(id).digest('hex');
  try {
    if (crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
      return id;
    }
  } catch (e) {
    return null;
  }
  return null;
}

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------

// Parse JSON request bodies
app.use(express.json());

// Parse form data (URL-encoded bodies)
app.use(express.urlencoded({ extended: true }));

// Lightweight Method-Override support (_method in body/query or X-HTTP-Method-Override header)
app.use((req, res, next) => {
  if (req.method === 'POST') {
    const override = (req.body && req.body._method) || req.query._method || req.headers['x-http-method-override'];
    if (override && ['PATCH', 'PUT', 'DELETE'].includes(override.toUpperCase())) {
      req.method = override.toUpperCase();
    }
  }
  next();
});

// Secure Session Middleware
app.use(async (req, res, next) => {
  const cookies = parseCookies(req);
  const rawSid = cookies['clf_session'];
  let sessionId = rawSid ? verifySessionId(rawSid, SESSION_SECRET) : null;
  let isNew = false;

  if (!sessionId || !sessionStore.has(sessionId)) {
    sessionId = crypto.randomBytes(24).toString('hex');
    sessionStore.set(sessionId, {});
    isNew = true;
  }

  const sessionData = sessionStore.get(sessionId);
  sessionData.lastAccess = Date.now();
  req.session = sessionData;
  req.sessionId = sessionId;

  // Session destroy helper
  req.session.destroy = function (cb) {
    sessionStore.delete(sessionId);
    res.setHeader('Set-Cookie', 'clf_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax');
    if (typeof cb === 'function') cb();
  };

  // Set signed cookie if new session
  if (isNew) {
    const signed = signSessionId(sessionId, SESSION_SECRET);
    res.setHeader('Set-Cookie', `clf_session=${signed}; Path=/; HttpOnly; SameSite=Lax`);
  }

  // Load student profile for session
  if (req.session.studentId && isValidObjectId(req.session.studentId)) {
    try {
      const student = await Student.findById(req.session.studentId).lean();
      if (student) {
        req.currentStudent = student;
        res.locals.currentStudent = student;
      } else {
        req.session.studentId = null;
        req.currentStudent = null;
        res.locals.currentStudent = null;
      }
    } catch (e) {
      req.currentStudent = null;
      res.locals.currentStudent = null;
    }
  } else {
    req.currentStudent = null;
    res.locals.currentStudent = null;
  }

  next();
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ------------------------------------------------------------
// Helper: Validate MongoDB ObjectId
// ------------------------------------------------------------
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper: Escape special regex characters to prevent regex search injection / syntax errors
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Helper: Determine if request expects JSON
function wantsJson(req) {
  return req.xhr || (req.headers.accept && req.headers.accept.includes('application/json')) || req.is('json');
}

// ============================================================
// ROUTES
// ============================================================

// ------------------------------------------------------------
// HOME PAGE
// ------------------------------------------------------------
app.get('/', async (req, res) => {
  try {
    // Count documents for dashboard stats
    const studentCount = await Student.countDocuments();
    const lostCount = await LostItem.countDocuments();
    const foundCount = await FoundItem.countDocuments();
    const claimCount = await Claim.countDocuments();
    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render('home', { studentCount, lostCount, foundCount, claimCount, success, error });
  } catch (err) {
    console.error('Home page error:', err.message);
    res.status(500).render('error', { message: 'Failed to load the home page.' });
  }
});

// ============================================================
// AUTHENTICATION / SESSION ROUTES
// ============================================================

// GET /login - Show student login page
app.get('/login', async (req, res) => {
  // If already authenticated, redirect home
  if (req.currentStudent) {
    return res.redirect('/');
  }
  const redirect = req.query.redirect || '';
  const error = req.query.error || null;
  const success = req.query.success || null;
  res.render('login', { redirect, error, success });
});

// POST /login - Authenticate student session using email + password
app.post('/login', async (req, res) => {
  const isJson = wantsJson(req);

  try {
    const { email, password, redirect } = req.body;

    // Reject any attempt to log in without both fields
    if (!email || !email.trim()) {
      const msg = 'Email address is required.';
      if (isJson) return res.status(400).json({ error: msg });
      return res.status(400).render('login', { redirect: redirect || '', error: msg, success: null });
    }
    if (!password) {
      const msg = 'Password is required.';
      if (isJson) return res.status(400).json({ error: msg });
      return res.status(400).render('login', { redirect: redirect || '', error: msg, success: null });
    }

    // Look up by email only (never by a browser-supplied ID)
    const student = await Student.findOne({ email: email.trim().toLowerCase() });

    // Use a constant-time "false" verification when no student found to
    // prevent timing-based email enumeration attacks.
    const passwordOk = student
      ? Student.verifyPassword(password, student.passwordHash)
      : (Student.verifyPassword(password, 'dummy:' + 'a'.repeat(128)), false);

    if (!student || !passwordOk) {
      const msg = 'Invalid email or password.';
      if (isJson) return res.status(401).json({ error: msg });
      return res.status(401).render('login', { redirect: redirect || '', error: msg, success: null });
    }

    // Set verified identity into session
    req.session.studentId = student._id.toString();

    // Refresh signed cookie on login
    const signed = signSessionId(req.sessionId, SESSION_SECRET);
    res.setHeader('Set-Cookie', `clf_session=${signed}; Path=/; HttpOnly; SameSite=Lax`);

    const msg = `Logged in as ${student.fullName}`;
    if (isJson) {
      // Never return passwordHash in JSON responses
      const safe = { _id: student._id, fullName: student.fullName, email: student.email, department: student.department, contactNumber: student.contactNumber };
      return res.status(200).json({ success: true, message: msg, student: safe });
    }

    const destination = redirect && redirect.startsWith('/') ? redirect : `/?success=${encodeURIComponent(msg)}`;
    res.redirect(destination);
  } catch (err) {
    console.error('Login error:', err.message);
    if (isJson) return res.status(500).json({ error: 'Login failed.' });
    res.status(500).render('error', { message: 'Login failed due to a server error.' });
  }
});

// GET /logout & POST /logout - End student session
const handleLogout = (req, res) => {
  req.session.destroy(() => {
    if (wantsJson(req)) {
      return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    }
    res.redirect('/?success=' + encodeURIComponent('Logged out successfully.'));
  });
};

app.get('/logout', handleLogout);
app.post('/logout', handleLogout);

// ============================================================
// STUDENT ROUTES
// ============================================================

// GET /students/new - Show student registration form
app.get('/students/new', (req, res) => {
  res.render('student-form', {});
});

// GET /students - List all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    const success = req.query.success || null;
    const error = req.query.error || null;
    res.render('students', { students, success, error });
  } catch (err) {
    console.error('List students error:', err.message);
    res.status(500).render('error', { message: 'Failed to load students.' });
  }
});

// POST /students - Create a new student
app.post('/students', async (req, res) => {
  try {
    const { fullName, email, department, contactNumber, password, confirmPassword } = req.body;

    // Validate password before hitting Mongoose
    if (!password || password.length < 6) {
      const students = await Student.find().sort({ fullName: 1 });
      return res.status(400).render('student-form', {
        error: 'Password must be at least 6 characters.',
        fullName, email, department, contactNumber
      });
    }
    if (password !== confirmPassword) {
      const students = await Student.find().sort({ fullName: 1 });
      return res.status(400).render('student-form', {
        error: 'Passwords do not match.',
        fullName, email, department, contactNumber
      });
    }

    const passwordHash = Student.hashPassword(password);

    // Create and save student (Mongoose validates required fields & email format)
    const student = new Student({ fullName, email, department, contactNumber, passwordHash });
    await student.save();

    // Auto-login newly registered student
    req.session.studentId = student._id.toString();

    // Redirect with success message
    res.redirect('/students?success=Student registered successfully!');
  } catch (err) {
    console.error('Create student error:', err.message);

    let errorMessage = 'Failed to register student.';

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      errorMessage = messages.join('. ');
    }

    // Handle duplicate email error (MongoDB error code 11000)
    if (err.code === 11000) {
      errorMessage = 'A student with this email already exists.';
    }

    // Re-render form with error and previous input
    res.status(400).render('student-form', {
      error: errorMessage,
      fullName: req.body.fullName,
      email: req.body.email,
      department: req.body.department,
      contactNumber: req.body.contactNumber
    });
  }
});

// GET /students/:id - View a single student's profile
app.get('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).render('error', { message: 'Invalid student ID.' });
    }

    // Find the student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).render('404');
    }

    // Find all lost and found items reported by this student
    const lostItems = await LostItem.find({ reportedBy: id }).sort({ createdAt: -1 });
    const foundItems = await FoundItem.find({ reportedBy: id }).sort({ createdAt: -1 });

    // Find all claims submitted by this student
    const claims = await Claim.find({ claimedBy: id }).populate('foundItemId').sort({ createdAt: -1 });

    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render('student-details', { student, lostItems, foundItems, claims, success, error });
  } catch (err) {
    console.error('Student details error:', err.message);
    res.status(500).render('error', { message: 'Failed to load student details.' });
  }
});

// ============================================================
// LOST ITEM ROUTES
// ============================================================

// GET /lost-items/new - Show lost item report form
app.get('/lost-items/new', async (req, res) => {
  try {
    const students = await Student.find().sort({ fullName: 1 });
    res.render('lost-item-form', { students });
  } catch (err) {
    console.error('Lost item form error:', err.message);
    res.status(500).render('error', { message: 'Failed to load the form.' });
  }
});

// GET /lost-items - List all lost items (with search/filter by name, category, location, status)
app.get('/lost-items', async (req, res) => {
  try {
    const { search, category, location, status } = req.query;
    const success = req.query.success || null;
    const error = req.query.error || null;

    // Build a dynamic filter object
    const filter = {};

    if (search && search.trim()) {
      filter.itemName = { $regex: escapeRegex(search.trim()), $options: 'i' };
    }

    if (category && category.trim()) {
      filter.category = category.trim();
    }

    if (location && location.trim()) {
      filter.lastSeenLocation = { $regex: escapeRegex(location.trim()), $options: 'i' };
    }

    if (status && status.trim()) {
      filter.status = status.trim();
    }

    const lostItems = await LostItem.find(filter).sort({ createdAt: -1 });

    res.render('lost-items', {
      lostItems,
      search: search || '',
      category: category || '',
      location: location || '',
      status: status || '',
      success,
      error
    });
  } catch (err) {
    console.error('List lost items error:', err.message);
    res.status(500).render('error', { message: 'Failed to load lost items.' });
  }
});

// POST /lost-items - Create a new lost item report
app.post('/lost-items', async (req, res) => {
  try {
    const { itemName, category, description, lastSeenLocation, dateLost } = req.body;

    // reportedBy MUST come from the verified session – never from the browser body
    const reportedBy = req.session && req.session.studentId;
    if (!reportedBy) {
      const students = await Student.find().sort({ fullName: 1 });
      return res.status(401).render('lost-item-form', {
        error: 'You must be logged in to report a lost item.',
        students, itemName, categoryVal: category, description, lastSeenLocation, dateLost
      });
    }

    // Check that the session student still exists
    const studentExists = await Student.findById(reportedBy);
    if (!studentExists) {
      req.session.studentId = null;
      const students = await Student.find().sort({ fullName: 1 });
      return res.status(401).render('lost-item-form', {
        error: 'Your session is invalid. Please log in again.',
        students, itemName, categoryVal: category, description, lastSeenLocation, dateLost
      });
    }

    // Create and save the lost item
    const lostItem = new LostItem({
      itemName,
      category,
      description,
      lastSeenLocation,
      dateLost,
      reportedBy
    });
    await lostItem.save();

    res.redirect('/lost-items?success=Lost item reported successfully!');
  } catch (err) {
    console.error('Create lost item error:', err.message);

    let errorMessage = 'Failed to report lost item.';

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      errorMessage = messages.join('. ');
    } else if (err.message) {
      errorMessage = err.message;
    }

    // Re-fetch students for the form dropdown
    const students = await Student.find().sort({ fullName: 1 });

    res.status(400).render('lost-item-form', {
      error: errorMessage,
      students,
      itemName: req.body.itemName,
      categoryVal: req.body.category,
      description: req.body.description,
      lastSeenLocation: req.body.lastSeenLocation,
      dateLost: req.body.dateLost
    });
  }
});

// GET /lost-items/:id - View a single lost item
app.get('/lost-items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).render('error', { message: 'Invalid lost item ID.' });
    }

    // Find item and populate the student reference
    const item = await LostItem.findById(id).populate('reportedBy');
    if (!item) {
      return res.status(404).render('404');
    }

    res.render('lost-item-details', { item });
  } catch (err) {
    console.error('Lost item details error:', err.message);
    res.status(500).render('error', { message: 'Failed to load lost item details.' });
  }
});

// ============================================================
// FOUND ITEM ROUTES
// ============================================================

// GET /found-items/new - Show found item report form
app.get('/found-items/new', async (req, res) => {
  try {
    const students = await Student.find().sort({ fullName: 1 });
    res.render('found-item-form', { students });
  } catch (err) {
    console.error('Found item form error:', err.message);
    res.status(500).render('error', { message: 'Failed to load the form.' });
  }
});

// GET /found-items - List all found items (with search/filter by name, category, location, status)
app.get('/found-items', async (req, res) => {
  try {
    const { search, category, location, status } = req.query;
    const success = req.query.success || null;
    const error = req.query.error || null;

    const filter = {};

    if (search && search.trim()) {
      filter.itemName = { $regex: escapeRegex(search.trim()), $options: 'i' };
    }

    if (category && category.trim()) {
      filter.category = category.trim();
    }

    if (location && location.trim()) {
      filter.foundLocation = { $regex: escapeRegex(location.trim()), $options: 'i' };
    }

    if (status && status.trim()) {
      filter.status = status.trim();
    }

    const foundItems = await FoundItem.find(filter).sort({ createdAt: -1 });

    res.render('found-items', {
      foundItems,
      search: search || '',
      category: category || '',
      location: location || '',
      status: status || '',
      success,
      error
    });
  } catch (err) {
    console.error('List found items error:', err.message);
    res.status(500).render('error', { message: 'Failed to load found items.' });
  }
});

// POST /found-items - Create a new found item report
app.post('/found-items', async (req, res) => {
  try {
    const { itemName, category, description, foundLocation, dateFound } = req.body;

    // reportedBy MUST come from the verified session – never from the browser body
    const reportedBy = req.session && req.session.studentId;
    if (!reportedBy) {
      const students = await Student.find().sort({ fullName: 1 });
      return res.status(401).render('found-item-form', {
        error: 'You must be logged in to report a found item.',
        students, itemName, categoryVal: category, description, foundLocation, dateFound
      });
    }

    // Check that the session student still exists
    const studentExists = await Student.findById(reportedBy);
    if (!studentExists) {
      req.session.studentId = null;
      const students = await Student.find().sort({ fullName: 1 });
      return res.status(401).render('found-item-form', {
        error: 'Your session is invalid. Please log in again.',
        students, itemName, categoryVal: category, description, foundLocation, dateFound
      });
    }

    // Create and save the found item
    const foundItem = new FoundItem({
      itemName,
      category,
      description,
      foundLocation,
      dateFound,
      reportedBy
    });
    await foundItem.save();

    res.redirect('/found-items?success=Found item reported successfully!');
  } catch (err) {
    console.error('Create found item error:', err.message);

    let errorMessage = 'Failed to report found item.';

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      errorMessage = messages.join('. ');
    } else if (err.message) {
      errorMessage = err.message;
    }

    // Re-fetch students for the form dropdown
    const students = await Student.find().sort({ fullName: 1 });

    res.status(400).render('found-item-form', {
      error: errorMessage,
      students,
      itemName: req.body.itemName,
      categoryVal: req.body.category,
      description: req.body.description,
      foundLocation: req.body.foundLocation,
      dateFound: req.body.dateFound
    });
  }
});

// GET /found-items/:id - View a single found item (with claims and claim submission)
app.get('/found-items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).render('error', { message: 'Invalid found item ID.' });
    }

    // Find item and populate the student reference
    const item = await FoundItem.findById(id).populate('reportedBy');
    if (!item) {
      return res.status(404).render('404');
    }

    // Fetch all claims for this item
    const claims = await Claim.find({ foundItemId: id }).populate('claimedBy').sort({ createdAt: -1 });

    // Fetch all registered students (used for claimant dropdown if not logged in)
    const students = await Student.find().sort({ fullName: 1 });

    const success = req.query.success || null;
    const error = req.query.error || null;

    res.render('found-item-details', { item, claims, students, success, error });
  } catch (err) {
    console.error('Found item details error:', err.message);
    res.status(500).render('error', { message: 'Failed to load found item details.' });
  }
});

// ============================================================
// CLAIM ROUTES (PHASE 2)
// ============================================================

// POST /found-items/:id/claims - Submit a claim for a found item
app.post('/found-items/:id/claims', async (req, res) => {
  const isJson = wantsJson(req);

  try {
    const { id } = req.params;

    // 1. Validate FoundItem ObjectId
    if (!isValidObjectId(id)) {
      const msg = 'Invalid found item ID.';
      if (isJson) return res.status(400).json({ error: msg });
      return res.status(400).render('error', { message: msg });
    }

    // 2. Check item existence
    const foundItem = await FoundItem.findById(id);
    if (!foundItem) {
      const msg = 'Found item not found.';
      if (isJson) return res.status(404).json({ error: msg });
      return res.status(404).render('404');
    }

    // 3. Reject claims for returned items
    if (foundItem.status === 'Returned') {
      const msg = 'This item has already been marked as Returned. No new claims can be submitted.';
      if (isJson) return res.status(400).json({ error: msg });
      return res.redirect(`/found-items/${id}?error=${encodeURIComponent(msg)}`);
    }

    // 4. claimedBy MUST come from the verified session — never from browser-submitted IDs
    const claimantId = req.session && req.session.studentId;

    if (!claimantId) {
      const msg = 'You must be logged in to submit a claim.';
      if (isJson) return res.status(401).json({ error: msg });
      return res.redirect(`/login?redirect=${encodeURIComponent('/found-items/' + id)}&error=${encodeURIComponent(msg)}`);
    }

    // 5. Check student existence
    const student = await Student.findById(claimantId);
    if (!student) {
      const msg = 'Selected student does not exist. Please register first.';
      if (isJson) return res.status(404).json({ error: msg });
      return res.redirect(`/found-items/${id}?error=${encodeURIComponent(msg)}`);
    }

    // 6. Prevent reporter from claiming their own found item
    if (foundItem.reportedBy.toString() === claimantId.toString()) {
      const msg = 'You cannot claim an item that you reported as found.';
      if (isJson) return res.status(400).json({ error: msg });
      return res.redirect(`/found-items/${id}?error=${encodeURIComponent(msg)}`);
    }

    // 7. Validate claim reason (required, min 5 chars)
    const reason = (req.body.reason || '').trim();
    if (!reason || reason.length < 5) {
      const msg = 'Claim reason is required and must be at least 5 characters long.';
      if (isJson) return res.status(400).json({ error: msg });
      return res.redirect(`/found-items/${id}?error=${encodeURIComponent(msg)}`);
    }

    // 8. Prevent duplicate claims by the same student for the same found item
    const existingClaim = await Claim.findOne({ foundItemId: id, claimedBy: claimantId });
    if (existingClaim) {
      const msg = 'You have already submitted a claim for this found item.';
      if (isJson) return res.status(400).json({ error: msg });
      return res.redirect(`/found-items/${id}?error=${encodeURIComponent(msg)}`);
    }

    // 9. Create and save the new claim
    const claim = new Claim({
      foundItemId: id,
      claimedBy: claimantId,
      reason,
      status: 'Pending'
    });
    await claim.save();

    const successMsg = 'Claim submitted successfully!';
    if (isJson) {
      return res.status(201).json({ success: true, message: successMsg, claim });
    }
    res.redirect(`/found-items/${id}?success=${encodeURIComponent(successMsg)}`);
  } catch (err) {
    console.error('Submit claim error:', err.message);

    let errorMsg = 'Failed to submit claim.';
    if (err.code === 11000) {
      errorMsg = 'You have already submitted a claim for this found item.';
    } else if (err.name === 'ValidationError') {
      errorMsg = Object.values(err.errors).map((e) => e.message).join('. ');
    } else if (err.message) {
      errorMsg = err.message;
    }

    if (isJson) return res.status(400).json({ error: errorMsg });
    res.redirect(`/found-items/${req.params.id}?error=${encodeURIComponent(errorMsg)}`);
  }
});

// Handler for Claim Status update (Approval / Rejection)
// PATCH /claims/:id/status and POST /claims/:id/status
async function handleClaimStatus(req, res) {
  const isJson = wantsJson(req);

  try {
    const { id } = req.params;

    // 1. Validate Claim ObjectId
    if (!isValidObjectId(id)) {
      const msg = 'Invalid claim ID.';
      if (isJson) return res.status(400).json({ error: msg });
      return res.status(400).render('error', { message: msg });
    }

    // 2. Requirement 3: Enforce authorization server-side via session.
    // Do NOT trust IDs submitted by the browser. Never treat a form-supplied student ID as verified identity.
    const currentStudentId = req.session && req.session.studentId;
    if (!currentStudentId) {
      const msg = 'Authentication required. Please log in as the student who reported this item.';
      if (isJson) return res.status(401).json({ error: msg });
      return res.status(401).render('error', { message: msg });
    }

    // 3. Find the claim
    const claim = await Claim.findById(id);
    if (!claim) {
      const msg = 'Claim not found.';
      if (isJson) return res.status(404).json({ error: msg });
      return res.status(404).render('404');
    }

    // 4. Find the associated found item
    const foundItem = await FoundItem.findById(claim.foundItemId);
    if (!foundItem) {
      const msg = 'Associated found item not found.';
      if (isJson) return res.status(404).json({ error: msg });
      return res.status(404).render('error', { message: msg });
    }

    // 5. Enforce authorization: Only the student who reported the found item may review claims
    if (foundItem.reportedBy.toString() !== currentStudentId.toString()) {
      const msg = 'Unauthorized: Only the student who reported this found item may approve or reject claims.';
      if (isJson) return res.status(403).json({ error: msg });
      return res.status(403).render('error', { message: msg });
    }

    // 6. Validate submitted status (only 'Approved' or 'Rejected' allowed)
    const { status } = req.body;
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      const msg = 'Invalid status. Status must be either "Approved" or "Rejected".';
      if (isJson) return res.status(400).json({ error: msg });
      return res.redirect(`/found-items/${foundItem._id}?error=${encodeURIComponent(msg)}`);
    }

    // 7. Reject repeated actions: claim must be currently 'Pending'
    if (claim.status !== 'Pending') {
      const msg = `This claim has already been ${claim.status.toLowerCase()} and cannot be modified again.`;
      if (isJson) return res.status(400).json({ error: msg });
      return res.redirect(`/found-items/${foundItem._id}?error=${encodeURIComponent(msg)}`);
    }

    // 8. Execute workflow based on decision
    if (status === 'Approved') {
      // Prevent conflicting approvals if item is already Returned
      if (foundItem.status === 'Returned') {
        const msg = 'This found item has already been marked as Returned. Conflicting approvals are not allowed.';
        if (isJson) return res.status(400).json({ error: msg });
        return res.redirect(`/found-items/${foundItem._id}?error=${encodeURIComponent(msg)}`);
      }

      // Requirement 4: On approval, mark item Returned, approve this claim,
      // and reject all other pending claims on this item.
      foundItem.status = 'Returned';
      await foundItem.save();

      claim.status = 'Approved';
      await claim.save();

      // Reject all other pending claims for this item
      await Claim.updateMany(
        { foundItemId: foundItem._id, _id: { $ne: claim._id }, status: 'Pending' },
        { $set: { status: 'Rejected' } }
      );

      const successMsg = 'Claim approved successfully! The item has been marked as Returned.';
      if (isJson) {
        return res.status(200).json({ success: true, message: successMsg, claim, foundItem });
      }
      return res.redirect(`/found-items/${foundItem._id}?success=${encodeURIComponent(successMsg)}`);
    } else {
      // Rejection
      claim.status = 'Rejected';
      await claim.save();

      const successMsg = 'Claim has been rejected.';
      if (isJson) {
        return res.status(200).json({ success: true, message: successMsg, claim });
      }
      return res.redirect(`/found-items/${foundItem._id}?success=${encodeURIComponent(successMsg)}`);
    }
  } catch (err) {
    console.error('Review claim error:', err.message);
    const msg = 'Failed to process claim review.';
    if (isJson) return res.status(500).json({ error: msg });
    res.status(500).render('error', { message: msg });
  }
}

app.patch('/claims/:id/status', handleClaimStatus);
app.post('/claims/:id/status', handleClaimStatus);

// Handler for Found Item Status update
// PATCH /found-items/:id/status and POST /found-items/:id/status
async function handleFoundItemStatus(req, res) {
  const isJson = wantsJson(req);

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      const msg = 'Invalid found item ID.';
      if (isJson) return res.status(400).json({ error: msg });
      return res.status(400).render('error', { message: msg });
    }

    const foundItem = await FoundItem.findById(id);
    if (!foundItem) {
      const msg = 'Found item not found.';
      if (isJson) return res.status(404).json({ error: msg });
      return res.status(404).render('404');
    }

    // If an active session exists, enforce that only the reporter may change item status
    const currentStudentId = req.session && req.session.studentId;
    if (currentStudentId && foundItem.reportedBy.toString() !== currentStudentId.toString()) {
      const msg = 'Unauthorized: Only the student who reported this found item may update its status.';
      if (isJson) return res.status(403).json({ error: msg });
      return res.status(403).render('error', { message: msg });
    }

    const { status } = req.body;
    if (!status || !['Unclaimed', 'Claimed', 'Returned'].includes(status)) {
      const msg = 'Invalid status. Status must be "Unclaimed", "Claimed", or "Returned".';
      if (isJson) return res.status(400).json({ error: msg });
      return res.redirect(`/found-items/${id}?error=${encodeURIComponent(msg)}`);
    }

    foundItem.status = status;
    await foundItem.save();

    // If marked as Returned, reject any remaining pending claims
    if (status === 'Returned') {
      await Claim.updateMany(
        { foundItemId: foundItem._id, status: 'Pending' },
        { $set: { status: 'Rejected' } }
      );
    }

    const successMsg = `Found item status updated to ${status}.`;
    if (isJson) {
      return res.status(200).json({ success: true, message: successMsg, foundItem });
    }
    res.redirect(`/found-items/${id}?success=${encodeURIComponent(successMsg)}`);
  } catch (err) {
    console.error('Update found item status error:', err.message);
    const msg = 'Failed to update found item status.';
    if (isJson) return res.status(500).json({ error: msg });
    res.status(500).render('error', { message: msg });
  }
}

app.patch('/found-items/:id/status', handleFoundItemStatus);
app.post('/found-items/:id/status', handleFoundItemStatus);

// ============================================================
// 404 - Page Not Found (catch-all route)
// ============================================================
app.use((req, res) => {
  if (wantsJson(req)) {
    return res.status(404).json({ error: 'Endpoint or resource not found.' });
  }
  res.status(404).render('404');
});

// ============================================================
// Global Error Handler
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  if (wantsJson(req)) {
    return res.status(500).json({ error: 'An unexpected internal error occurred.' });
  }
  res.status(500).render('error', { message: 'An unexpected error occurred.' });
});

// ============================================================
// Connect to MongoDB and Start Server
// ============================================================

const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB = process.env.MONGODB_DB || 'campus_admin';

if (!MONGODB_URL) {
  console.error('ERROR: MONGODB_URL is missing from your .env file.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URL, {
    dbName: MONGODB_DB
  })
  .then(async () => {
    console.log(`Connected to MongoDB Atlas successfully!`);
    console.log(`Database: ${mongoose.connection.name}`);

    try {
      await Claim.init();
    } catch (indexErr) {
      console.warn('Notice while ensuring Claim index:', indexErr.message);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    const safeMsg = (err.message || '').replace(
      /mongodb(\+srv)?:\/\/[^@]+@/g,
      'mongodb+srv://<credentials-hidden>@'
    );

    console.error('Failed to connect to MongoDB Atlas:', safeMsg);
    process.exit(1);
  });
