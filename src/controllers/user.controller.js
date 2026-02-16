const pool = require('../config/db');

const getOrgUsers = async (req, res) => {
  try {
    const orgId = req.user.organization_id;

    const result = await pool.query(
      `SELECT id, name, email, role
       FROM users
       WHERE organization_id = $1`,
      [orgId]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrgUsers
};