const express = require('express');
const router = express.Router();

const { createProject, getAllProjects } = require('../controllers/projectController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

// ✅ Admin only - Create Project
router.post(
  '/',
  verifyToken,
  authorizeRoles('admin'),
  createProject
);

// ✅ All logged-in users - Get all projects
router.get(
  '/',
  verifyToken,
  getAllProjects
);

module.exports = router;