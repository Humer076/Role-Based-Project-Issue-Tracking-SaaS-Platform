const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProjectsQuery = pool.query("SELECT COUNT(*) FROM projects");
    const totalDevelopersQuery = pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'developer'"
    );
    const totalTasksQuery = pool.query("SELECT COUNT(*) FROM tasks");
    const pendingTasksQuery = pool.query(
      "SELECT COUNT(*) FROM tasks WHERE status = 'pending'"
    );
    const completedTasksQuery = pool.query(
      "SELECT COUNT(*) FROM tasks WHERE status = 'completed'"
    );

    const [
      totalProjects,
      totalDevelopers,
      totalTasks,
      pendingTasks,
      completedTasks,
    ] = await Promise.all([
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