const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pool = require('../config/db');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const { status, priority, course_id } = req.query;
  try {
    let query = `
      SELECT a.*, c.name as course_name 
      FROM assignments a 
      LEFT JOIN courses c ON a.course_id = c.id 
      WHERE a.user_id = ?
    `;
    const queryParams = [req.user.id];

    if (status) { query += ' AND a.status = ?'; queryParams.push(status); }
    if (priority) { query += ' AND a.priority = ?'; queryParams.push(priority); }
    if (course_id) { query += ' AND a.course_id = ?'; queryParams.push(course_id); }

    query += ' ORDER BY a.due_date ASC';

    const [assignments] = await pool.query(query, queryParams);
    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.post('/', [
  body('title', 'Title is required').not().isEmpty()
], validate, async (req, res) => {
  const { title, description, priority = 'medium', due_date, status = 'pending', course_id, grade } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO assignments (user_id, course_id, title, description, priority, due_date, status, grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, course_id, title, description, priority, due_date, status, grade]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, ...req.body, user_id: req.user.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [assignments] = await pool.query('SELECT * FROM assignments WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (assignments.length === 0) return res.status(404).json({ success: false, message: 'Assignment not found' });
    res.json({ success: true, data: assignments[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, description, priority, due_date, status, course_id, grade } = req.body;
  try {
    const [assignments] = await pool.query('SELECT * FROM assignments WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (assignments.length === 0) return res.status(404).json({ success: false, message: 'Assignment not found' });

    await pool.query(
      'UPDATE assignments SET title=?, description=?, priority=?, due_date=?, status=?, course_id=?, grade=? WHERE id=?',
      [title, description, priority, due_date, status, course_id, grade, req.params.id]
    );
    res.json({ success: true, message: 'Assignment updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [assignments] = await pool.query('SELECT * FROM assignments WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (assignments.length === 0) return res.status(404).json({ success: false, message: 'Assignment not found' });

    await pool.query('DELETE FROM assignments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
