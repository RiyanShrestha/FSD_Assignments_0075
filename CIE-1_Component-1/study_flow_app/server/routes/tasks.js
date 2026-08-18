const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pool = require('../config/db');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const { status, priority, course_id, search, sort = 'created_at', order = 'DESC' } = req.query;
  try {
    let query = `
      SELECT t.*, c.name as course_name 
      FROM tasks t 
      LEFT JOIN courses c ON t.course_id = c.id 
      WHERE t.user_id = ?
    `;
    const queryParams = [req.user.id];

    if (status) { query += ' AND t.status = ?'; queryParams.push(status); }
    if (priority) { query += ' AND t.priority = ?'; queryParams.push(priority); }
    if (course_id) { query += ' AND t.course_id = ?'; queryParams.push(course_id); }
    if (search) { query += ' AND t.title LIKE ?'; queryParams.push(`%${search}%`); }

    const validSorts = ['due_date', 'priority', 'created_at'];
    const sortField = validSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY t.${sortField} ${sortOrder}`;

    const [tasks] = await pool.query(query, queryParams);
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.post('/', [
  body('title', 'Title is required').not().isEmpty()
], validate, async (req, res) => {
  const { title, description, priority = 'medium', due_date, status = 'pending', course_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, course_id, title, description, priority, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, course_id, title, description, priority, due_date, status]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, ...req.body, user_id: req.user.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [tasks] = await pool.query(`
      SELECT t.*, c.name as course_name 
      FROM tasks t 
      LEFT JOIN courses c ON t.course_id = c.id 
      WHERE t.id = ? AND t.user_id = ?
    `, [req.params.id, req.user.id]);
    if (tasks.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: tasks[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, description, priority, due_date, status, course_id } = req.body;
  try {
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (tasks.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });

    await pool.query(
      'UPDATE tasks SET title=?, description=?, priority=?, due_date=?, status=?, course_id=? WHERE id=?',
      [title, description, priority, due_date, status, course_id, req.params.id]
    );
    res.json({ success: true, message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (tasks.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });

    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
