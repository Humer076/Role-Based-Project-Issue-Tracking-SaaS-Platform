const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', authorizeRoles('admin', 'project_manager'), projectController.createProject);
router.put('/:id', authorizeRoles('admin', 'project_manager'), projectController.updateProject);
router.delete('/:id', authorizeRoles('admin'), projectController.deleteProject);

// Team members
router.get('/:projectId/members', projectController.getProjectMembers);
router.post('/:projectId/members', authorizeRoles('admin', 'project_manager'), projectController.addTeamMember);
router.delete('/:projectId/members/:userId', authorizeRoles('admin', 'project_manager'), projectController.removeTeamMember);

module.exports = router;
