const pool = require('../config/db');

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const orgId = req.user.organization_id;
    const result = await pool.query(
      `INSERT INTO projects (name, description, created_by, organization_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, req.user.id, orgId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Get all projects (for current org)
exports.getAllProjects = async (req, res) => {
  try {
    const orgId = req.user.organization_id;
    const result = await pool.query(
      `SELECT * FROM projects WHERE organization_id = $1 ORDER BY created_at DESC`, [orgId]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Get single project
exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM projects WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Update project (admin/PM)
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE projects SET name = $1, description = $2, status = $3 WHERE id = $4 RETURNING *`,
      [name, description, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Delete project (admin only)
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Add user to project (admin/PM)
exports.addTeamMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId, role } = req.body;
  try {
    await pool.query(
      `INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [projectId, userId, role || 'member']
    );
    res.json({ message: 'User added to project' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Remove user from project
exports.removeTeamMember = async (req, res) => {
  const { projectId, userId } = req.params;
  try {
    await pool.query(`DELETE FROM project_members WHERE project_id = $1 AND user_id = $2`, [projectId, userId]);
    res.json({ message: 'User removed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Get all members of a project
exports.getProjectMembers = async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, pm.role AS member_role
       FROM project_members pm
       JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = $1`, [projectId]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
