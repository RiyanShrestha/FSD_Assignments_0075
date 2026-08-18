const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pool = require('../config/db');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM tasks t WHERE t.course_id = c.id) as task_count,
        (SELECT COUNT(*) FROM assignments a WHERE a.course_id = c.id) as assignment_count
      FROM courses c
      WHERE c.user_id = ?
    `, [req.user.id]);
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.post('/', [
  body('name', 'Name is required').not().isEmpty()
], validate, async (req, res) => {
  const { name, description, instructor, semester, start_date, end_date, status = 'active', progress = 0 } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO courses (user_id, name, description, instructor, semester, start_date, end_date, status, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, name, description, instructor, semester, start_date, end_date, status, progress]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, ...req.body, user_id: req.user.id, status, progress } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM tasks t WHERE t.course_id = c.id) as task_count,
        (SELECT COUNT(*) FROM assignments a WHERE a.course_id = c.id) as assignment_count
      FROM courses c
      WHERE c.id = ? AND c.user_id = ?
    `, [req.params.id, req.user.id]);
    if (courses.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: courses[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, description, instructor, semester, start_date, end_date, status, progress } = req.body;
  try {
    const [courses] = await pool.query('SELECT * FROM courses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (courses.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });

    await pool.query(
      'UPDATE courses SET name=?, description=?, instructor=?, semester=?, start_date=?, end_date=?, status=?, progress=? WHERE id=?',
      [name, description, instructor, semester, start_date, end_date, status, progress, req.params.id]
    );
    res.json({ success: true, message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [courses] = await pool.query('SELECT * FROM courses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (courses.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });

    await pool.query('DELETE FROM notes WHERE course_id = ?', [req.params.id]);
    await pool.query('DELETE FROM tasks WHERE course_id = ?', [req.params.id]);
    await pool.query('DELETE FROM assignments WHERE course_id = ?', [req.params.id]);
    await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
