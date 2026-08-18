const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const pool = require('../config/db');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, program, semester, profile_image, theme_preference, notification_preference, created_at, updated_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: users[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.put('/', async (req, res) => {
  const { name, program, semester, profile_image, theme_preference, notification_preference } = req.body;
  try {
    await pool.query(
      'UPDATE users SET name=?, program=?, semester=?, profile_image=?, theme_preference=?, notification_preference=? WHERE id=?',
      [name, program, semester, profile_image, theme_preference, notification_preference, req.user.id]
    );
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.put('/password', [
  body('oldPassword', 'Old password is required').exists(),
  body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
], validate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    const user = users[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE users SET password=? WHERE id=?', [hashedPassword, req.user.id]);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
