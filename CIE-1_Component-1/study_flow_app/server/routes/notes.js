const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pool = require('../config/db');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const { course_id, search } = req.query;
  try {
    let query = `
      SELECT n.*, c.name as course_name 
      FROM notes n 
      LEFT JOIN courses c ON n.course_id = c.id 
      WHERE n.user_id = ?
    `;
    const queryParams = [req.user.id];

    if (course_id) { query += ' AND n.course_id = ?'; queryParams.push(course_id); }
    if (search) { query += ' AND n.title LIKE ?'; queryParams.push(`%${search}%`); }

    query += ' ORDER BY n.updated_at DESC';

    const [notes] = await pool.query(query, queryParams);
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.post('/', [
  body('title', 'Title is required').not().isEmpty()
], validate, async (req, res) => {
  const { title, content, course_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO notes (user_id, course_id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [req.user.id, course_id, title, content]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, ...req.body, user_id: req.user.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [notes] = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (notes.length === 0) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, data: notes[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, content, course_id } = req.body;
  try {
    const [notes] = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (notes.length === 0) return res.status(404).json({ success: false, message: 'Note not found' });

    await pool.query(
      'UPDATE notes SET title=?, content=?, course_id=?, updated_at=NOW() WHERE id=?',
      [title, content, course_id, req.params.id]
    );
    res.json({ success: true, message: 'Note updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [notes] = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (notes.length === 0) return res.status(404).json({ success: false, message: 'Note not found' });

    await pool.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
