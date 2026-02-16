const pool = require('../config/db');

// ✅ CREATE PROJECT (Admin Only)
const createProject = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ USER:", req.user);
    
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ 
        message: "Name and description are required" 
      });
    }

    const orgId = req.user.organization_id;

    const result = await pool.query(
      `INSERT INTO projects (name, description, created_by, organization_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, req.user.id, orgId]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("PROJECT CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL PROJECTS (Admin + Developer)
const getAllProjects = async (req, res) => {
  try {
    const orgId = req.user.organization_id;

    const result = await pool.query(
      `SELECT * FROM projects
       WHERE organization_id = $1
       ORDER BY created_at DESC`,
      [orgId]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects
};