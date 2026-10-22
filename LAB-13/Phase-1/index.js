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

// Import Mongoose models
const Student = require('./models/Student');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');

// Create Express app
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------

// Parse form data (URL-encoded bodies)
app.use(express.urlencoded({ extended: true }));

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

    res.render('home', { studentCount, lostCount, foundCount });
  } catch (err) {
    console.error('Home page error:', err.message);
    res.status(500).render('error', { message: 'Failed to load the home page.' });
  }
});

// ============================================================
// STUDENT ROUTES
// ============================================================

// GET /students/new - Show student registration form
// (Static route MUST come before /:id)
app.get('/students/new', (req, res) => {
  res.render('student-form', {});
});

// GET /students - List all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    const success = req.query.success || null;
    res.render('students', { students, success });
  } catch (err) {
    console.error('List students error:', err.message);
    res.status(500).render('error', { message: 'Failed to load students.' });
  }
});

// POST /students - Create a new student
app.post('/students', async (req, res) => {
  try {
    const { fullName, email, department, contactNumber } = req.body;

    // Create and save student (Mongoose validates required fields & email format)
    const student = new Student({ fullName, email, department, contactNumber });
    await student.save();

    // Redirect with success message
    res.redirect('/students?success=Student registered successfully!');
  } catch (err) {
    console.error('Create student error:', err.message);

    let errorMessage = 'Failed to register student.';

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      // Get the first validation error message
      const messages = Object.values(err.errors).map(e => e.message);
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

    res.render('student-details', { student, lostItems, foundItems });
  } catch (err) {
    console.error('Student details error:', err.message);
    res.status(500).render('error', { message: 'Failed to load student details.' });
  }
});

// ============================================================
// LOST ITEM ROUTES
// ============================================================

// GET /lost-items/new - Show lost item report form
// (Static route MUST come before /:id)
app.get('/lost-items/new', async (req, res) => {
  try {
    const students = await Student.find().sort({ fullName: 1 });
    res.render('lost-item-form', { students });
  } catch (err) {
    console.error('Lost item form error:', err.message);
    res.status(500).render('error', { message: 'Failed to load the form.' });
  }
});

// GET /lost-items - List all lost items (with search/filter)
app.get('/lost-items', async (req, res) => {
  try {
    const { search, category, location } = req.query;
    const success = req.query.success || null;

    // Build a dynamic filter object
    const filter = {};

    if (search && search.trim()) {
      // Case-insensitive search on item name with special characters safely escaped
      filter.itemName = { $regex: escapeRegex(search.trim()), $options: 'i' };
    }

    if (category && category.trim()) {
      filter.category = category.trim();
    }

    if (location && location.trim()) {
      // Case-insensitive search on location with special characters safely escaped
      filter.lastSeenLocation = { $regex: escapeRegex(location.trim()), $options: 'i' };
    }

    const lostItems = await LostItem.find(filter).sort({ createdAt: -1 });

    res.render('lost-items', {
      lostItems,
      search: search || '',
      category: category || '',
      location: location || '',
      success
    });
  } catch (err) {
    console.error('List lost items error:', err.message);
    res.status(500).render('error', { message: 'Failed to load lost items.' });
  }
});

// POST /lost-items - Create a new lost item report
app.post('/lost-items', async (req, res) => {
  try {
    const { itemName, category, description, lastSeenLocation, dateLost, reportedBy } = req.body;

    // Validate the student ID
    if (!reportedBy || !isValidObjectId(reportedBy)) {
      throw new Error('Please select a valid registered student.');
    }

    // Check that the student exists
    const studentExists = await Student.findById(reportedBy);
    if (!studentExists) {
      throw new Error('Selected student does not exist. Please register them first.');
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
      const messages = Object.values(err.errors).map(e => e.message);
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
      dateLost: req.body.dateLost,
      reportedBy: req.body.reportedBy
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
// (Static route MUST come before /:id)
app.get('/found-items/new', async (req, res) => {
  try {
    const students = await Student.find().sort({ fullName: 1 });
    res.render('found-item-form', { students });
  } catch (err) {
    console.error('Found item form error:', err.message);
    res.status(500).render('error', { message: 'Failed to load the form.' });
  }
});

// GET /found-items - List all found items
app.get('/found-items', async (req, res) => {
  try {
    const success = req.query.success || null;
    const foundItems = await FoundItem.find().sort({ createdAt: -1 });
    res.render('found-items', { foundItems, success });
  } catch (err) {
    console.error('List found items error:', err.message);
    res.status(500).render('error', { message: 'Failed to load found items.' });
  }
});

// POST /found-items - Create a new found item report
app.post('/found-items', async (req, res) => {
  try {
    const { itemName, category, description, foundLocation, dateFound, reportedBy } = req.body;

    // Validate the student ID
    if (!reportedBy || !isValidObjectId(reportedBy)) {
      throw new Error('Please select a valid registered student.');
    }

    // Check that the student exists
    const studentExists = await Student.findById(reportedBy);
    if (!studentExists) {
      throw new Error('Selected student does not exist. Please register them first.');
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
      const messages = Object.values(err.errors).map(e => e.message);
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
      dateFound: req.body.dateFound,
      reportedBy: req.body.reportedBy
    });
  }
});

// GET /found-items/:id - View a single found item
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

    res.render('found-item-details', { item });
  } catch (err) {
    console.error('Found item details error:', err.message);
    res.status(500).render('error', { message: 'Failed to load found item details.' });
  }
});

// ============================================================
// 404 - Page Not Found (catch-all route)
// ============================================================
app.use((req, res) => {
  res.status(404).render('404');
});

// ============================================================
// Global Error Handler
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).render('error', { message: 'An unexpected error occurred.' });
});

// ============================================================
// Connect to MongoDB and Start Server
// ============================================================
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error('ERROR: MONGODB_URL is not defined in your .env file.');
  console.error('Create a .env file with: MONGODB_URL=your_mongodb_atlas_connection_string');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Redact connection credentials if present in the error message for safety
    const safeMsg = (err.message || '').replace(/mongodb(\+srv)?:\/\/[^@]+@/g, 'mongodb+srv://<credentials-hidden>@');
    console.error('Failed to connect to MongoDB Atlas:', safeMsg);
    console.error('Please check your MONGODB_URL in the .env file.');
    process.exit(1);
  });
