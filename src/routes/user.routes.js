const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const { verifyToken } = require('../middlewares/auth.middleware');
const { getOrgUsers } = require('../controllers/user.controller');


/* =====================================
   ✅ Get all users of same organization
===================================== */
router.get(
  '/',
  verifyToken,
  getOrgUsers
);


/* =====================================
   ✅ Admin creates developer
===================================== */
router.post(
  '/',
  verifyToken,
  async (req, res) => {
    try {

      // 🔥 Ensure role is admin (case insensitive)
      if (!req.user || req.user.role.toLowerCase() !== 'admin') {
        return res.status(403).json({
          message: "Only admin can create developer"
        });
      }

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email and password are required"
        });
      }

      const orgId = req.user.organization_id;

      // 🔹 Check if email already exists
      const existingUser = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          message: "User with this email already exists"
        });
      }

      // 🔹 Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 🔹 Insert developer
      const result = await pool.query(
        `INSERT INTO users (name, email, password, role, organization_id)
         VALUES ($1, $2, $3, 'developer', $4)
         RETURNING id, name, email, role`,
        [name, email, hashedPassword, orgId]
      );

      res.status(201).json({
        message: "Developer created successfully",
        user: result.rows[0]
      });

    } catch (error) {
      console.error("CREATE DEVELOPER ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;