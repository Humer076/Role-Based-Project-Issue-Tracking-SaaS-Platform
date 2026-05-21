const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const orgId = req.user.organization_id;
    const totalProjectsQuery = pool.query("SELECT COUNT(*) FROM projects WHERE organization_id = $1", [orgId]);
    const totalDevelopersQuery = pool.query("SELECT COUNT(*) FROM users WHERE role = 'developer' AND organization_id = $1", [orgId]);
    const totalTasksQuery = pool.query("SELECT COUNT(*) FROM tasks WHERE organization_id = $1", [orgId]);
    const pendingTasksQuery = pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'pending' AND organization_id = $1", [orgId]);
    const completedTasksQuery = pool.query("SELECT COUNT(*) FROM tasks WHERE status = 'completed' AND organization_id = $1", [orgId]);

    const [totalProjects, totalDevelopers, totalTasks, pendingTasks, completedTasks] = await Promise.all([
      totalProjectsQuery,
      totalDevelopersQuery,
      totalTasksQuery,
      pendingTasksQuery,
      completedTasksQuery,
    ]);

    res.json({
      totalProjects: Number(totalProjects.rows[0].count),
      totalDevelopers: Number(totalDevelopers.rows[0].count),
      totalTasks: Number(totalTasks.rows[0].count),
      pendingTasks: Number(pendingTasks.rows[0].count),
      completedTasks: Number(completedTasks.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Recent tasks (used as "recent issues" in frontend)
exports.getRecentTasks = async (req, res) => {
  try {
    const orgId = req.user.organization_id;
    const result = await pool.query(
      `SELECT t.*, p.name as project_name 
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       WHERE p.organization_id = $1
       ORDER BY t.created_at DESC
       LIMIT 5`,
      [orgId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
