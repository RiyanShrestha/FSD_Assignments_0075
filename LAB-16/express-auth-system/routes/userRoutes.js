const express = require('express');
const { getProfile, getAdminDashboard } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.get('/admin', protect, authorize(['admin']), getAdminDashboard);

module.exports = router;
