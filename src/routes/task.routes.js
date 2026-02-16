const express = require('express');
const router = express.Router();

const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const { 
  createTask, 
  getAllTasks, 
  updateTaskStatus,
  deleteTask
} = require('../controllers/task.controller');

// ✅ Admin only → create task
router.post(
  '/',
  verifyToken,
  authorizeRoles('admin'),
  createTask
);

// ✅ All logged-in users → view tasks (with pagination)
router.get(
  '/',
  verifyToken,
  getAllTasks
);

// ✅ Update task status (Admin or Assigned Developer)
router.put(
  '/:id',
  verifyToken,
  updateTaskStatus
);

// ✅ Delete task (Admin only)
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('admin'),
  deleteTask
);

module.exports = router;