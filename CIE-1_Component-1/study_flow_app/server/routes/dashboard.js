const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const userId = req.user.id;
  try {
    const [[{ totalCourses }]] = await pool.query('SELECT COUNT(*) as totalCourses FROM courses WHERE user_id = ?', [userId]);
    const [[{ activeTasks }]] = await pool.query("SELECT COUNT(*) as activeTasks FROM tasks WHERE user_id = ? AND status != 'completed'", [userId]);
    const [[{ completedTasks }]] = await pool.query("SELECT COUNT(*) as completedTasks FROM tasks WHERE user_id = ? AND status = 'completed'", [userId]);
    const [[{ totalAssignments }]] = await pool.query('SELECT COUNT(*) as totalAssignments FROM assignments WHERE user_id = ?', [userId]);
    const [[{ completedAssignments }]] = await pool.query("SELECT COUNT(*) as completedAssignments FROM assignments WHERE user_id = ? AND status = 'completed'", [userId]);
    const [[{ overdueTasks }]] = await pool.query("SELECT COUNT(*) as overdueTasks FROM tasks WHERE user_id = ? AND due_date < NOW() AND status != 'completed'", [userId]);
    const [[{ overdueAssignments }]] = await pool.query("SELECT COUNT(*) as overdueAssignments FROM assignments WHERE user_id = ? AND due_date < NOW() AND status != 'completed'", [userId]);

    const [upcomingTasks] = await pool.query(`
      SELECT id, title, due_date, 'task' as type 
      FROM tasks 
      WHERE user_id = ? AND due_date >= NOW() AND due_date <= DATE_ADD(NOW(), INTERVAL 7 DAY) AND status != 'completed'
    `, [userId]);

    const [upcomingAssignments] = await pool.query(`
      SELECT id, title, due_date, 'assignment' as type 
      FROM assignments 
      WHERE user_id = ? AND due_date >= NOW() AND due_date <= DATE_ADD(NOW(), INTERVAL 7 DAY) AND status != 'completed'
    `, [userId]);

    const upcomingDeadlines = [...upcomingTasks, ...upcomingAssignments].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    const [recentTasks] = await pool.query(`SELECT id, title, created_at, 'task' as type FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`, [userId]);
    const [recentAssignments] = await pool.query(`SELECT id, title, created_at, 'assignment' as type FROM assignments WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`, [userId]);
    const [recentNotes] = await pool.query(`SELECT id, title, created_at, 'note' as type FROM notes WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`, [userId]);
    
    const recentActivity = [...recentTasks, ...recentAssignments, ...recentNotes]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    const [courseProgress] = await pool.query(`SELECT id, name, progress FROM courses WHERE user_id = ?`, [userId]);

    const [tasksLast7Days] = await pool.query(`
      SELECT DATE(updated_at) as date, COUNT(*) as count 
      FROM tasks 
      WHERE user_id = ? AND status = 'completed' AND updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(updated_at)
    `, [userId]);

    const [assignmentsLast7Days] = await pool.query(`
      SELECT DATE(updated_at) as date, COUNT(*) as count 
      FROM assignments 
      WHERE user_id = ? AND status = 'completed' AND updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(updated_at)
    `, [userId]);

    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const tCount = tasksLast7Days.find(t => t.date && t.date.toISOString().split('T')[0] === dateStr)?.count || 0;
      const aCount = assignmentsLast7Days.find(a => a.date && a.date.toISOString().split('T')[0] === dateStr)?.count || 0;
      
      weeklyActivity.push({
        date: dateStr,
        tasks: tCount,
        assignments: aCount
      });
    }

    res.json({
      success: true,
      data: {
        totalCourses,
        activeTasks,
        completedTasks,
        totalAssignments,
        completedAssignments,
        overdueTasks,
        overdueAssignments,
        upcomingDeadlines,
        recentActivity,
        courseProgress,
        weeklyActivity
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
