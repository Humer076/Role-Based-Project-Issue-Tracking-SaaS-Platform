const pool = require('../config/db');

/* ================================
   ✅ CREATE TASK (Admin Only)
================================ */
const createTask = async (req, res) => {
  try {
    const { title, description, project_id, assigned_to } = req.body;

    if (!title || !project_id || !assigned_to) {
      return res.status(400).json({
        message: "Title, project_id and assigned_to are required"
      });
    }

    const orgId = req.user.organization_id;

    const result = await pool.query(
      `INSERT INTO tasks 
       (title, description, project_id, assigned_to, organization_id, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [title, description, project_id, assigned_to, orgId]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================================
   ✅ GET TASKS
   - Admin → All org tasks
   - Developer → Only assigned tasks
   - Optional project_id filter
================================ */
const getAllTasks = async (req, res) => {
  try {
    const orgId = req.user.organization_id;
    const projectId = req.query.project_id;

    let result;

    // 🔹 ADMIN
    if (req.user.role === 'admin') {

      if (projectId) {
        result = await pool.query(
          `SELECT * FROM tasks
           WHERE organization_id = $1
           AND project_id = $2
           ORDER BY created_at DESC`,
          [orgId, projectId]
        );
      } else {
        result = await pool.query(
          `SELECT * FROM tasks
           WHERE organization_id = $1
           ORDER BY created_at DESC`,
          [orgId]
        );
      }

    } 
    // 🔹 DEVELOPER
    else {

      if (projectId) {
        result = await pool.query(
          `SELECT * FROM tasks
           WHERE assigned_to = $1
           AND organization_id = $2
           AND project_id = $3
           ORDER BY created_at DESC`,
          [req.user.id, orgId, projectId]
        );
      } else {
        result = await pool.query(
          `SELECT * FROM tasks
           WHERE assigned_to = $1
           AND organization_id = $2
           ORDER BY created_at DESC`,
          [req.user.id, orgId]
        );
      }

    }

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================================
   ✅ UPDATE TASK STATUS
   - Admin → Any task
   - Developer → Only assigned
================================ */
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orgId = req.user.organization_id;

    const allowedStatus = ['pending', 'in-progress', 'completed'];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const taskResult = await pool.query(
      `SELECT * FROM tasks 
       WHERE id = $1 
       AND organization_id = $2`,
      [id, orgId]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const task = taskResult.rows[0];

    // 🔒 Developer cannot update others task
    if (
      req.user.role !== 'admin' &&
      task.assigned_to !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can update only your assigned tasks"
      });
    }

    const updatedTask = await pool.query(
      `UPDATE tasks 
       SET status = $1
       WHERE id = $2
       AND organization_id = $3
       RETURNING *`,
      [status, id, orgId]
    );

    res.status(200).json(updatedTask.rows[0]);

  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================================
   ✅ DELETE TASK (Admin Only)
================================ */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.organization_id;

    const result = await pool.query(
      `DELETE FROM tasks 
       WHERE id = $1 
       AND organization_id = $2 
       RETURNING *`,
      [id, orgId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createTask,
  getAllTasks,
  updateTaskStatus,
  deleteTask
};